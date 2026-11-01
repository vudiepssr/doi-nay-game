import {CONFIG} from './config.js';
const TYPES=['rich','old','absurd','iq'];
let onlineBoards=null;
export function setOnlineBoards(data){
  onlineBoards=data&&typeof data==='object'?Object.fromEntries(TYPES.map(k=>[k,Array.isArray(data[k])?data[k]:[]])):null;
}
export function isOnlineBoard(){return onlineBoards!==null;}
export function loadBoards(){
  if(onlineBoards!==null)return onlineBoards;
  try{
    const x=JSON.parse(localStorage.getItem(CONFIG.BOARD_KEY));
    return Object.fromEntries(TYPES.map(k=>[k,Array.isArray(x?.[k])?x[k]:[]]));
  }catch{return Object.fromEntries(TYPES.map(k=>[k,[]]));}
}
export function recordDeath(player){
  // ONLY offline mode saves scores locally. Online mode records scores on the server.
  if(onlineBoards!==null)return onlineBoards;
  const boards=loadBoards();
  const entry={id:player.id,name:player.name,age:player.age,cash:player.cash+player.invested,
    absurdity:player.absurdity,iq:player.peakIQ??player.intellect,birthIQ:player.birthIQ??player.intellect,
    reason:player.deathReason,job:player.job};
  const compare={rich:(a,b)=>b.cash-a.cash,old:(a,b)=>b.age-a.age,
    absurd:(a,b)=>b.absurdity-a.absurdity,iq:(a,b)=>(b.iq||0)-(a.iq||0)||(b.birthIQ||0)-(a.birthIQ||0)};
  for(const type of TYPES){
    boards[type]=boards[type].filter(e=>e.id!==entry.id).concat(entry).sort(compare[type]).slice(0,10);
  }
  try{localStorage.setItem(CONFIG.BOARD_KEY,JSON.stringify(boards));}catch{}
  return boards;
}
