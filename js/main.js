import {loadGame,newGame,saveGame,performAction,advanceYear,advanceYearAuto,chooseEvent,setName} from './engine.js';
import {render,toast} from './ui.js';
import {setOnlineBoards} from './leaderboard.js';
import {archiveLife,getArchivedLife,setServerArchives,setServerLife} from './lifeArchive.js';

const ONLINE=typeof location!=='undefined' && /^https?:$/.test(location.protocol);
let state=ONLINE?null:loadGame();
let view={modal:null,rankTab:'rich',archiveId:null,online:false,nickname:'',ranks:null};
let runId=null,revision=0,busy=false,autoTimer=null,autoRunning=false;
const AUTO_YEAR_INTERVAL_MS=5000;

function paint(){if(state)render(state,{...view,autoPlay:autoRunning});}
function stopAutoYear(){if(autoTimer!==null){clearInterval(autoTimer);autoTimer=null;}autoRunning=false;}
function showOfflineError(message){
  document.getElementById('app').innerHTML=`<div id="loading-game"><h1>⚠️ Chưa kết nối được ĐỜI NÀY Online</h1><p>${message.replace(/[<>&]/g,'')}</p><p>Top toàn quốc cần deploy Netlify Functions và cấu hình Supabase. Không tự chuyển sang Top giả trên máy.</p><button type="button" onclick="location.reload()">🔄 Thử kết nối lại</button><p>Nếu chỉ muốn thử máy, mở file <strong>play.html</strong> tải từ bản ZIP.</p></div>`;
}
async function apiPost(command,extra={}){
  const res=await fetch('/api/game',{method:'POST',credentials:'same-origin',cache:'no-store',
    headers:{'Content-Type':'application/json'},body:JSON.stringify({command,runId,revision,...extra})});
  const data=await res.json().catch(()=>({}));
  if(!res.ok||!data.ok)throw Object.assign(new Error(data.message||'Không kết nối được máy chủ'),{status:res.status});
  return data;
}
async function apiGet(query=''){
  const res=await fetch('/api/game'+query,{credentials:'same-origin',cache:'no-store'});
  const data=await res.json().catch(()=>({}));
  if(!res.ok||!data.ok)throw Object.assign(new Error(data.message||'Máy chủ tạm thời không phản hồi'),{status:res.status});
  return data;
}
function acceptServer(data){
  if(data.state){
    state=data.state;runId=data.runId;revision=data.revision;
    if(!state.player.alive)archiveLife(state.player);
  }
  if(data.nickname!==undefined)view.nickname=data.nickname;
  if(data.boards)setOnlineBoards(data.boards);
  if(data.ranks!==undefined)view.ranks=data.ranks;
  view.online=true;
}
async function bootstrap(){
  const root=document.getElementById('actions-panel');
  if(root)root.innerHTML='<div id="loading-game">🌏 Đang kết nối <strong>Top toàn quốc</strong> và xác minh kiếp hiện tại…</div>';
  try{const data=await apiGet('?view=bootstrap');acceptServer(data);paint();}
  catch(error){showOfflineError(error.message);}
}
async function refreshBoards(){
  if(!ONLINE)return;
  const data=await apiGet('?view=boards');setOnlineBoards(data.boards);paint();
}
async function fetchArchiveList(){
  if(!ONLINE)return;
  const data=await apiGet('?view=archives');setServerArchives(data.lives);paint();
}
async function fetchArchiveDetail(id){
  if(!ONLINE||getArchivedLife(id)?.history?.length)return;
  const data=await apiGet('?view=archives&id='+encodeURIComponent(id));
  if(data.life)setServerLife(data.life);
}
async function command(cmd,extra={}){
  if(busy)return {ok:false};
  busy=true;
  try{
    if(ONLINE){
      const data=await apiPost(cmd,extra);acceptServer(data);
    }else{
      let result={ok:false,message:'Hành động không hợp lệ'};
      if(cmd==='year')result=advanceYear(state);
      if(cmd==='auto-year')result=advanceYearAuto(state);
      if(cmd==='action')result=performAction(state,extra.actionId);
      if(cmd==='choice')result=chooseEvent(state,extra.index);
      if(cmd==='rename')result=setName(state,extra.value);
      if(cmd==='rebirth'){state=newGame();result={ok:true};}
      if(cmd==='tab'){state.activeTab=extra.category;saveGame(state);result={ok:true};}
      if(cmd==='nickname')result={ok:false,message:'Chỉ đổi biệt danh khi chơi online.'};
      if(!result.ok)throw new Error(result.message||'Không thể thực hiện thao tác.');
    }
    if(!state.player.alive)stopAutoYear();
    paint();return {ok:true};
  }catch(error){
    toast(error.message);
    if(ONLINE&&error.status===409){stopAutoYear();try{acceptServer(await apiGet('?view=bootstrap'));paint();}catch{}}
    return {ok:false};
  }finally{busy=false;}
}
async function autoNextYear(){
  if(!autoRunning||busy||!state?.player?.alive)return;
  // MỘT request server gồm qua năm + 2 biến cố phụ + bốc đáp án ngẫu nhiên.
  // Không render trạng thái pendingEvent ở giữa, nên không nháy popup.
  const result=await command('auto-year');
  if(!result.ok){stopAutoYear();paint();return;}
  if(!state.player.alive){stopAutoYear();paint();}
}
function startAutoYear(){
  if(!state.player.alive){toast('Kiếp này đã kết thúc!');return;}
  // Nếu có pendingEvent từ phiên bản cũ, lần tick đầu sẽ tự xử lý nó.
  // Chỉ chế độ +1 tuổi thủ công mới mở popup để chọn.
  autoRunning=true;
  view.modal=null;
  autoTimer=setInterval(autoNextYear,AUTO_YEAR_INTERVAL_MS);
  paint();toast('▶ Đang tự qua năm: mỗi 5 giây, không hiện popup biến cố.');
}
function downloadLife(id){
  const life=getArchivedLife(id);
  if(!life||life.legacy){toast('Không tìm được nhật ký đầy đủ của kiếp này.');return;}
  const lines=[`ĐỜI NÀY — HỒI KÝ KIẾP #${life.lifeNumber??'?'}`,
    `Nhân vật: ${life.name} | Sống: ${life.age} tuổi | Nghề: ${life.job}`,
    `IQ bẩm sinh: ${life.birthIQ} | IQ cao nhất: ${life.peakIQ}`,
    `Tài sản: ${life.cash} VND | Lý do chết: ${life.reason}`,'',
    '=== NHẬT KÝ CUỘC ĐỜI ===',...(life.history||[]).map(e=>`[Năm ${e.age} tuổi] ${e.text}`)];
  const blob=new Blob(['\uFEFF'+lines.join('\n')],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=`doi-nay-kiep-${life.lifeNumber??'cu'}-${String(life.id).replace(/[^\w-]/g,'')}.txt`;
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
if(ONLINE)bootstrap();else paint();

document.addEventListener('click',async event=>{
  if(!state||busy)return;
  const lifeCard=event.target.closest('.archive-life-card');
  if(lifeCard){
    stopAutoYear();view.archiveId=lifeCard.dataset.lifeId;
    try{await fetchArchiveDetail(view.archiveId);}catch(error){toast(error.message);}
    view.modal='archive-detail';paint();return;
  }
  const choice=event.target.closest('[data-choice]');
  if(choice){const result=await command('choice',{index:Number(choice.dataset.choice)});if(result.ok)view.modal=null;paint();return;}
  const tab=event.target.closest('[data-tab]');
  if(tab){if(state.player.pendingEvent)return;
    // Switching tabs is only a presentation concern; action POST still specifies its category.
    state.activeTab=tab.dataset.tab; if(!ONLINE)saveGame(state);paint();return;}
  const action=event.target.closest('[data-action]');
  if(action){await command('action',{actionId:action.dataset.action,category:state.activeTab});return;}
  const rank=event.target.closest('[data-rank]');
  if(rank){view.rankTab=rank.dataset.rank;paint();return;}
  const ctl=event.target.closest('[data-command]');
  const id=ctl?.dataset.command||(event.target.closest('#btn-ranking')?'ranking':null);
  if(!id)return;
  if(id==='auto-year'){
    if(autoRunning){stopAutoYear();paint();toast('⏸ Đã dừng tự động.');}
    else await startAutoYear();return;
  }
  if(id==='year'){stopAutoYear();const result=await command('year');if(result.ok)view.modal=null;paint();return;}
  if(id==='archive'){
    stopAutoYear();view.modal='archive';paint();
    try{await fetchArchiveList();}catch(error){toast(error.message);}return;
  }
  if(id==='archive-detail'){
    stopAutoYear();view.archiveId=ctl.dataset.lifeId;
    try{await fetchArchiveDetail(view.archiveId);}catch(error){toast(error.message);}
    view.modal='archive-detail';paint();return;
  }
  if(id==='export-life'){downloadLife(ctl.dataset.lifeId);return;}
  if(id==='rename'||id==='nickname'){
    stopAutoYear();view.modal=id;paint();document.getElementById(id==='rename'?'new-name':'new-nickname')?.focus();return;
  }
  if(id==='ranking'){
    stopAutoYear();view.modal='ranking';paint();
    try{await refreshBoards();}catch(error){toast(error.message);}return;
  }
  if(id==='close'){view.modal=null;paint();return;}
  if(id==='rebirth'){
    stopAutoYear();const result=await command('rebirth');
    if(result.ok){view.modal=null;view.rankTab='rich';view.archiveId=null;paint();toast('🍼 Kiếp mới bắt đầu. Chúc nhân phẩm khá hơn!');}return;
  }
  if(id==='journal'){document.getElementById('journal-panel')?.scrollIntoView({behavior:'smooth',block:'start'});}
});

document.addEventListener('submit',async event=>{
  if(!['name-form','nickname-form'].includes(event.target.id))return;
  event.preventDefault();
  const nick=event.target.id==='nickname-form';
  const val=document.getElementById(nick?'new-nickname':'new-name')?.value;
  const result=await command(nick?'nickname':'rename',{value:val});
  if(result.ok){view.modal=null;paint();toast(nick?'👤 Đã đổi biệt danh khách!':'✏️ Đã đổi tên nhân vật!');}
});
document.addEventListener('change',event=>{
  if(event.target.id==='archive-age-select'){
    const section=document.getElementById(`archive-age-${Number(event.target.value)}`),timeline=document.getElementById('archive-timeline');
    if(section&&timeline)timeline.scrollTop=section.offsetTop;
  }
});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&view.modal){view.modal=null;paint();}});
