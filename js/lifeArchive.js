import {CONFIG} from './config.js';
import {loadBoards} from './leaderboard.js';

// Mỗi kiếp lưu riêng: không cắt nhật ký theo giới hạn top 10.
const lifeKey=id=>`${CONFIG.ARCHIVE_LIFE_PREFIX}${id}`;
let serverArchives=[];
const serverDetails=new Map();
export function setServerArchives(list){serverArchives=Array.isArray(list)?list:[];}
export function setServerLife(row){
  if(!row?.state?.player)return;
  const p=row.state.player;
  serverDetails.set(String(row.id),{
    ...metadata(p),id:String(row.id),lifeNumber:row.life_number,
    peakIQ:p.peakIQ,birthIQ:p.birthIQ,health:p.health,eq:p.eq,
    house:p.house,marriage:p.marriage,children:p.children,
    reason:p.deathReason,history:p.history||[],legacy:false
  });
}

function readIndex(){
  try{
    const data=JSON.parse(localStorage.getItem(CONFIG.ARCHIVE_INDEX_KEY)||'[]');
    return Array.isArray(data)?data:[];
  }catch{return [];}
}
function metadata(p){
  return {id:String(p.id),lifeNumber:p.lifeNumber??null,name:p.name,age:p.age,
    job:p.job,reason:p.deathReason,iq:p.peakIQ??p.intellect,
    cash:(p.cash||0)+(p.invested||0),archivedAt:p.archivedAt||Date.now(),
    historyCount:p.history?.length||0,legacy:false};
}
export function archiveLife(player){
  if(!player||player.alive||!player.id)return {ok:false,message:'Kiếp chưa kết thúc.'};
  const id=String(player.id),key=lifeKey(id);
  try{
    if(localStorage.getItem(key))return {ok:true,alreadySaved:true};
    const snapshot={...metadata(player),gender:player.gender,
      cashOnHand:player.cash,invested:player.invested,salary:player.salary,
      health:player.health,happiness:player.happiness,
      intellect:player.intellect,birthIQ:player.birthIQ??player.intellect,
      peakIQ:player.peakIQ??player.intellect,eq:player.eq,
      beauty:player.beauty,skill:player.skill,wealth:player.wealth,luck:player.luck,
      marriage:player.marriage,house:player.house,vehicle:player.vehicle,
      children:player.children,absurdity:player.absurdity,
      traits:[...(player.traits||[])],
      history:(player.history||[]).map(({id,age,text,type})=>({id,age,text,type}))};
    localStorage.setItem(key,JSON.stringify(snapshot));
    const index=readIndex().filter(item=>String(item.id)!==id);
    index.unshift(metadata(player));
    try{localStorage.setItem(CONFIG.ARCHIVE_INDEX_KEY,JSON.stringify(index));}
    catch(error){localStorage.removeItem(key);throw error;}
    return {ok:true};
  }catch(error){return {ok:false,message:'Bộ nhớ trình duyệt đã đầy hoặc bị chặn. Không thể lưu nhật ký kiếp này.',error};}
}
export function listArchivedLives(){
  const index=readIndex();
  const lives=index.filter(item=>{
    try{return !!localStorage.getItem(lifeKey(String(item.id)));}
    catch{return false;}
  });
  const ids=new Set(lives.map(item=>String(item.id)));
  for(const item of serverArchives){
    if(!item?.id||ids.has(String(item.id)))continue;
    ids.add(String(item.id));
    lives.push({id:String(item.id),lifeNumber:item.lifeNumber,name:item.name,
      age:item.age,job:'Đã kết thúc',reason:item.reason,iq:item.iq,
      cash:0,historyCount:item.historyCount,legacy:false,serverOnly:true,archivedAt:0});
  }
  // Bản cũ chưa có kho kiếp: khôi phục được phần tóm tắt từ BXH,
  // nhưng không bịa thêm nhật ký đã mất khỏi save cũ.
  const boards=loadBoards();
  for(const entries of Object.values(boards))for(const entry of entries){
    if(!entry?.id||ids.has(String(entry.id)))continue;
    ids.add(String(entry.id));
    lives.push({id:String(entry.id),lifeNumber:null,name:entry.name||'Vô danh',
      age:entry.age??0,job:entry.job||'Không rõ',reason:entry.reason||'Không rõ',
      iq:entry.iq||0,cash:entry.cash||0,historyCount:0,legacy:true,archivedAt:0});
  }
  return lives.sort((a,b)=>Number(b.lifeNumber??-1)-Number(a.lifeNumber??-1)||b.archivedAt-a.archivedAt);
}
export function getArchivedLife(id){
  const key=String(id);
  if(serverDetails.has(key))return serverDetails.get(key);
  try{
    const snapshot=JSON.parse(localStorage.getItem(lifeKey(key))||'null');
    if(snapshot?.id===key && Array.isArray(snapshot.history))return snapshot;
  }catch{}
  // Chỉ có dữ liệu từ bảng xếp hạng cũ — hiển thị minh bạch.
  const legacy=listArchivedLives().find(life=>String(life.id)===key&&life.legacy);
  return legacy?{...legacy,history:[]}:null;
}
