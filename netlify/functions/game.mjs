// DỜI NÀY ONLINE API — server authoritative: no score is ever accepted from the browser.
import {randomBytes,randomUUID,createHash,createHmac} from 'node:crypto';
import {createPlayer} from '../../js/player.js';
import {performAction,advanceYear,chooseEvent,setName} from '../../js/engine.js';
import {CONFIG} from '../../js/config.js';

export const config={path:'/api/game'};
const COOKIE='doi_guest';
const OUT_HEADERS={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'};
const emptyBoards=()=>({rich:[],old:[],absurd:[],iq:[]});
function json(data,status=200,headers={}){return new Response(JSON.stringify(data),{status,headers:{...OUT_HEADERS,...headers}});}
function fail(message,status=400){return json({ok:false,message},status);}
function secretHash(token){return createHash('sha256').update(token).digest('hex');}
function cookieToken(req){return (req.headers.get('cookie')||'').split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='))?.slice(COOKIE.length+1)||'';}
function guestCookie(token){return `${COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`;}
const safeNick=name=>String(name||'').replace(/[\u0000-\u001f\u007f]/g,'').trim().replace(/\s+/g,' ').slice(0,24);
function getConfig(){
  const url=process.env.SUPABASE_URL?.replace(/\/$/,'');
  const key=process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)throw Object.assign(new Error('Chưa cấu hình đủ SUPABASE_URL và SUPABASE_SECRET_KEY trong Netlify Environment Variables.'),{status:503});
  if(key.startsWith('sb_publishable_'))throw Object.assign(new Error('Đang dùng nhầm Publishable Key. Máy chủ cần Supabase Secret Key.'),{status:503});
  if(!/^https:\/\//.test(url))throw Object.assign(new Error('SUPABASE_URL phải bắt đầu bằng https://'),{status:503});
  return {url,key};
}
async function db(path,options={}){
  const {url,key}=getConfig();
  let response;
  try{response=await fetch(url+'/rest/v1/'+path,{
    method:options.method||'GET',
    headers:{apikey:key,...(key.startsWith('sb_secret_')?{}:{Authorization:`Bearer ${key}`}), 'Content-Type':'application/json',Accept:'application/json',...options.headers},
    body:options.body===undefined?undefined:JSON.stringify(options.body),
    signal:AbortSignal.timeout(12000)
  });}
  catch(error){console.error('Supabase connection failed:',error.message);throw Object.assign(new Error('Không kết nối được Supabase. Kiểm tra Project URL hoặc trạng thái database.'),{status:503});}
  if(!response.ok){
    const message=await response.text();
    console.error('Database error',response.status,message.slice(0,600));
    throw Object.assign(new Error('Lỗi kết nối cơ sở dữ liệu. Kiểm tra SQL và biến môi trường.'),{status:503});
  }
  const raw=await response.text();return raw?JSON.parse(raw):null;
}
const rpc=(name,body)=>db('rpc/'+name,{method:'POST',body});
async function findGuest(token){
  if(!/^[0-9a-f]{64}$/.test(token))return null;
  const rows=await db(`game_guests?token_hash=eq.${secretHash(token)}&select=id,nickname,life_counter&limit=1`);
  return rows[0]||null;
}
async function getGuest(req,allowCreate){
  const oldToken=cookieToken(req);
  const existing=await findGuest(oldToken);
  if(existing)return {guest:existing,cookie:null};
  if(!allowCreate)return null;
  // Stop a single IP from creating unlimited anonymous guests. IP is never stored in plaintext.
  const ip=req.headers.get('x-nf-client-connection-ip');
  if(ip){
    const {key}=getConfig();
    const hash=createHmac('sha256',key).update(ip).digest('hex');
    const allowed=await rpc('game_allow_guest_ip',{p_ip_hash:hash});
    if(!allowed)throw Object.assign(new Error('Quá nhiều khách mới từ mạng này. Thử lại sau một giờ.'),{status:429});
  }
  const token=randomBytes(32).toString('hex');
  const nickname='Khách '+randomBytes(3).toString('hex').toUpperCase();
  const results=await db('game_guests',{method:'POST',headers:{Prefer:'return=representation'},
    body:{token_hash:secretHash(token),nickname}});
  return {guest:results[0],cookie:guestCookie(token)};
}
async function getLastRun(guestId){
  const rows=await db(`game_runs?guest_id=eq.${guestId}&select=id,revision,state,alive&order=created_at.desc,life_number.desc&limit=1`);
  return rows[0]||null;
}
async function startRun(guestId){
  const runId=randomUUID();const p=createPlayer(1);p.id=runId;
  const result=await rpc('game_start_run',{p_guest_id:guestId,p_run_id:runId,p_state:{player:p,activeTab:'study'}});
  return {id:result.runId,revision:result.revision,state:result.state,alive:true};
}
async function boards(){return (await rpc('game_global_boards',{}))||emptyBoards();}
async function ranks(runId){return (await rpc('game_run_ranks',{p_run_id:runId}))||null;}
function canonicalRun(run){return {runId:run.id,revision:run.revision,state:run.state};}
async function onBootstrap(req){
  const session=await getGuest(req,true);
  let run=await getLastRun(session.guest.id);
  if(!run)run=await startRun(session.guest.id);
  const scoreRanks=!run.state.player.alive?await ranks(run.id):null;
  return json({ok:true,...canonicalRun(run),nickname:session.guest.nickname,guestId:session.guest.id,
    boards:await boards(),ranks:scoreRanks},200,session.cookie?{'Set-Cookie':session.cookie}:{});
}
async function onBoards(){return json({ok:true,boards:await boards()});}
async function onHealth(){
  const b=await boards();
  return json({ok:true,service:'doi-nay-online',database:'connected',leaderboards:{
    rich:b.rich?.length||0,old:b.old?.length||0,absurd:b.absurd?.length||0,iq:b.iq?.length||0
  }});
}
async function onArchives(req,guest){
  const url=new URL(req.url),id=url.searchParams.get('id');
  const filter=`guest_id=eq.${guest.id}&alive=eq.false`;
  if(id){
    if(!/^[0-9a-f-]{36}$/.test(id))return fail('ID không hợp lệ');
    const rows=await db(`game_runs?${filter}&id=eq.${id}&select=id,state,life_number,died_at&limit=1`);
    return json({ok:true,life:rows[0]||null});
  }
  const rows=await db(`game_runs?${filter}&select=id,life_number,died_at,state&order=life_number.desc&limit=100`);
  return json({ok:true,lives:rows.map(r=>({id:r.id,lifeNumber:r.life_number,age:r.state.player.age,
    name:r.state.player.name,iq:r.state.player.peakIQ,reason:r.state.player.deathReason,
    historyCount:r.state.player.history?.length||0}))});
}
function sameOrigin(req){
  const origin=req.headers.get('origin');
  if(!origin)return true; // non-browser request must still present a valid guest cookie
  try{return new URL(origin).host === new URL(req.url).host && new URL(origin).protocol==='https:';}
  catch{return false;}
}
const ACTIONS=new Set(['year','choice','action','rename','nickname','rebirth','tab']);
async function onCommand(req){
  if(!sameOrigin(req))return fail('Không cho phép yêu cầu từ website khác.',403);
  const length=Number(req.headers.get('content-length')||0);
  if(length>4096)return fail('Yêu cầu quá lớn.',413);
  const text=await req.text();if(text.length>4096)return fail('Yêu cầu quá lớn.',413);
  if(!(req.headers.get('content-type')||'').toLowerCase().startsWith('application/json'))return fail('Chỉ nhận application/json.',415);
  let payload;try{payload=JSON.parse(text);}catch{return fail('Yêu cầu JSON không hợp lệ');}
  if(!ACTIONS.has(payload?.command))return fail('Hành động không hợp lệ');
  const session=await getGuest(req,false);
  if(!session)return fail('Phiên khách đã hết hạn. Tải lại trang để bắt đầu lại.',401);
  const guest=session.guest;
  if(!(await rpc('game_check_rate',{p_guest_id:guest.id})))return fail('Thao tác quá nhanh. Thử lại sau một phút.',429);
  const run=await getLastRun(guest.id);
  if(!run)return fail('Không tìm thấy kiếp hiện tại.',404);
  if(payload.runId!==run.id||payload.revision!==run.revision)return fail('Trạng thái đã đổi ở tab khác. Tải lại để đồng bộ.',409);
  if(payload.command==='rebirth'){
    if(run.alive)return fail('Không được đầu thai khi còn sống.');
    const next=await startRun(guest.id);
    return json({ok:true,...canonicalRun(next),nickname:guest.nickname,guestId:guest.id,ranks:null});
  }
  if(payload.command==='nickname'){
    const nick=safeNick(payload.value);
    if(nick.length<2)return fail('Biệt danh cần ít nhất 2 ký tự.');
    await db(`game_guests?id=eq.${guest.id}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:{nickname:nick}});
    // Do not rewrite the historical names recorded at death.
    return json({ok:true,...canonicalRun(run),nickname:nick,guestId:guest.id});
  }
  if(!run.alive)return fail('Kiếp này đã chết. Hãy đầu thai kiếp mới.');
  // NEVER trust player stats from payload. Only the last server-stored JSON state is used.
  const state=run.state;
  let result={ok:false,message:'Lệnh không hợp lệ'};
  switch(payload.command){
    case 'year': result=advanceYear(state);break;
    case 'choice':
      if(!Number.isInteger(payload.index)||payload.index<0||payload.index>20)return fail('Đáp án không hợp lệ');
      result=chooseEvent(state,payload.index);break;
    case 'action':
      if(!CONFIG.categories.some(c=>c.id===payload.category))return fail('Nhóm hành động không hợp lệ');
      if(typeof payload.actionId!=='string'||payload.actionId.length>48)return fail('Hành động không hợp lệ');
      state.activeTab=payload.category;
      result=performAction(state,payload.actionId);break;
    case 'rename': result=setName(state,String(payload.value||''));break;
    case 'tab':
      if(!CONFIG.categories.some(c=>c.id===payload.category))return fail('Nhóm không hợp lệ');
      state.activeTab=payload.category;result={ok:true};break;
  }
  if(!result.ok)return fail(result.message||'Không thể thực hiện hành động.');
  // Keep monetary amounts within Number.safeInteger and Postgres bigint range.
  const p=state.player;
  for(const field of ['cash','invested','salary']){
    const x=p[field];p[field]=Number.isFinite(x)?Math.max(0,Math.min(9e15,Math.round(x))):0;
  }
  const committed=await rpc('game_commit_run',{p_guest_id:guest.id,p_run_id:run.id,p_revision:run.revision,p_state:state});
  if(!committed?.ok)return fail('Có tab khác vừa thay đổi game. Vui lòng tải lại.',409);
  const dead=!state.player.alive;
  return json({ok:true,runId:run.id,revision:committed.revision,state,nickname:guest.nickname,guestId:guest.id,
    ranks:dead?await ranks(run.id):null,boards:dead?await boards():undefined});
}
export default async (req)=>{
  try{
    if(req.method==='GET'){
      const view=new URL(req.url).searchParams.get('view')||'bootstrap';
      if(view==='health')return await onHealth();
      if(view==='boards')return await onBoards();
      if(view==='bootstrap')return await onBootstrap(req);
      if(view==='archives'){
        const session=await getGuest(req,false);
        return session?await onArchives(req,session.guest):fail('Chưa có phiên khách.',401);
      }
      return fail('Không tìm thấy API.',404);
    }
    if(req.method==='POST')return await onCommand(req);
    return fail('Phương thức không được hỗ trợ.',405);
  }catch(err){
    console.error('Game API:',err.message);
    return fail(err.status===503?err.message:'Server gặp lỗi. Hãy thử lại sau.',err.status||500);
  }
};
