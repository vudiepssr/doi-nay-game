import {CONFIG,rand,clamp,formatMoney} from './config.js';
import {createPlayer,applyEffects,addLog} from './player.js';
import {getActions} from './actions.js';
import {randomLifeEvent,randomAmbientEvents} from './events.js';
import {recordDeath} from './leaderboard.js';
import {archiveLife} from './lifeArchive.js';
export function loadGame(){
  try{
    const saved=JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY));
    if(saved && saved.player && typeof saved.player.age==='number' && Array.isArray(saved.player.history)){
      const p=saved.player;
      p.birthIQ??=p.intellect;p.peakIQ??=p.intellect;
      p.recentAmbient??=[];p.yearlyAmbient??=0;
      p.traits??=[];p.actionUses??={};
      // Khi nâng cấp từ v0.3, lưu lại kiếp đã chết còn nằm trong save.
      if(!p.alive)archiveLife(p);
      return saved;
    }
  }catch{}
  return newGame();
}
export function newGame(){
  let life=Number(localStorage.getItem(CONFIG.COUNT_KEY)||'0');
  life=Number.isFinite(life)?life+1:1;
  localStorage.setItem(CONFIG.COUNT_KEY,String(life));
  const state={player:createPlayer(life),activeTab:'study'};
  saveGame(state);return state;
}
export function saveGame(state){
  try{if(typeof localStorage !== 'undefined')localStorage.setItem(CONFIG.STORAGE_KEY,JSON.stringify(state));}
  catch{ /* private browser mode: game still runs in memory */ }
}
function recalcExpenses(p){
  if(p.age<18)return 0;
  const base=p.age<25?30e6:p.age<60?42e6:30e6;
  const housing=p.house==='Nhà riêng'?0:8e6;
  return base+housing+p.children*5e6+(p.marriage==='Đã kết hôn'?10e6:0);
}
export function performAction(state,actionId){
  const p=state.player;
  if(!p.alive)return {ok:false,message:'Kiếp này đã kết thúc. Không có nút hồi sinh!'};
  if(p.pendingEvent)return {ok:false,message:'Giải quyết biến cố hiện tại trước đã!'};
  if(p.actionsLeft<=0)return {ok:false,message:'Hết lượt rồi! Bấm QUA NĂM MỚI.'};
  const action=getActions(p,state.activeTab).find(a=>a.id===actionId);
  if(!action)return {ok:false,message:'Hành động không tồn tại.'};
  if(p.age<action.minAge)return {ok:false,message:'Chưa đủ tuổi.'};
  if(p.actionUses[action.id])return {ok:false,message:'Hành động này đã thực hiện trong năm nay.'};
  if(action.disabledWhen?.(p))return {ok:false,message:'Chưa đủ điều kiện để thực hiện.'};
  if(p.cash<action.cost)return {ok:false,message:`Không đủ tiền! Cần ${formatMoney(action.cost)} VND.`};
  p.cash-=action.cost;
  const result=action.apply?action.apply(p):{effect:action.effect,log:action.log};
  applyEffects(p,result.effect);
  p.absurdity+=(result.absurdity||0);
  p.actionsLeft--;
  p.actionUses[action.id]=true;
  addLog(p,result.log||'✨ Mày vừa làm một việc không thể giải thích được.',result.absurdity?'event':'normal');
  if(p.health<=0)die(p,'Kiệt sức sau một loạt lựa chọn khó đỡ.');
  saveGame(state);
  return {ok:true,message:'Đã thực hiện hành động!'};
}
function die(p,reason){
  if(!p.alive)return;
  p.alive=false;p.pendingEvent=null;p.deathReason=reason;
  addLog(p,`🪦 Mày qua đời ở tuổi ${p.age}. Nguyên nhân: ${reason} Không được hồi sinh, đúng luật game.`,'death');
  if(typeof localStorage !== 'undefined')recordDeath(p);
  if(typeof localStorage !== 'undefined')archiveLife(p);
}
export function advanceYear(state){
  const p=state.player;
  if(!p.alive)return {ok:false,message:'Chết rồi thì không được qua năm mới!'};
  if(p.pendingEvent)return {ok:false,message:'Phải chọn cách xử lý biến cố trước.'};
  p.age++;p.year++;p.actionsLeft=CONFIG.ACTIONS_PER_YEAR;p.actionUses={};p.yearlyAmbient=0;
  p.yearlyExpenses=recalcExpenses(p);
  if(p.age<18){
    const allowance=rand(1,4)*100000;
    p.cash+=allowance;
    if(p.age===6){p.job='Học sinh tiểu học';addLog(p,'🎒 Ngày đầu đi học. Mày nhận ra bài tập về nhà không phải truyền thuyết.','event');}
    if(p.age===12){p.job='Học sinh trung học';addLog(p,'📓 Mày bước vào tuổi nổi loạn, bắt đầu hỏi "tại sao" mọi thứ.','event');}
    if(p.age===16){p.job='Học sinh cấp ba';addLog(p,'🎓 Tuổi 16, mày bắt đầu nghĩ nghiêm túc về tương lai.','event');}
  }else{
    if(p.age===18){p.job='Thất nghiệp tự do';addLog(p,'🎉 Mày vừa tròn 18 tuổi! Chính thức bước chân vào đời, hóa đơn bắt đầu tìm tới.','event');}
    const delta=p.salary-p.yearlyExpenses;
    p.cash=Math.max(0,p.cash+delta);
    if(delta<0 && p.cash<=0){applyEffects(p,{happiness:-9,health:-3});p.absurdity+=3;addLog(p,'🍜 Đầu năm kiểm tra ví thấy gần như trống rỗng. Mì gói lại lên ngôi.','bad');}
    else if(delta>=0)addLog(p,`💼 Tổng kết năm: thu nhập sau chi phí +${formatMoney(delta)} VND.`,'good');
  }
  if(p.invested>0){
    const rate=(rand(-22,27)+Math.floor((p.luck-50)/12))/100;
    const change=Math.round(p.invested*rate);
    p.invested=Math.max(0,p.invested+change);
    addLog(p,`${change>=0?'📈':'📉'} Danh mục đầu tư ${change>=0?'lãi':'lỗ'} ${formatMoney(Math.abs(change))} VND.` ,change>=0?'good':'bad');
  }
  // Càng già xác suất tử vong tự nhiên càng tăng; sức khỏe kém làm rủi ro cao.
  const deathChance=p.age<35?.00005:p.age<55?.001:p.age<70?.007:p.age<85?.035:p.age<100?.11:.30;
  const healthRisk=p.health<35?(35-p.health)/250:0;
  if(p.health<=0||p.age>=CONFIG.MAX_AGE||Math.random()<deathChance+healthRisk){
    const reason=p.health<=0?'Sức khỏe tụt về 0.':p.age>=CONFIG.MAX_AGE?'Sống đủ lâu để thành truyền thuyết.':p.age<50?'Một tai nạn xui xẻo không báo trước.':'Tuổi tác và sức khỏe không còn cho phép.';
    die(p,reason);saveGame(state);return {ok:true,died:true};
  }
  p.health=clamp(p.health-(p.age>60?rand(1,3):rand(0,2)));
  if(p.age>=18 && p.salary===0)p.happiness=clamp(p.happiness-2);
  // Một biến cố phụ tự diễn biến, không cần chọn đáp án.
  // Chúng chạy cả với +1 tuổi lẫn nút tự động 5 giây/năm.
  for(const event of randomAmbientEvents(p,CONFIG.AMBIENT_EVENTS_PER_YEAR)){
    applyEffects(p,event.effect||{});
    p.absurdity+=event.absurdity||0;
    addLog(p,event.text,event.type||'event');
    p.yearlyAmbient++;
    if(p.health<=0){
      die(p,`Dính cú vận đen khó đỡ: ${event.deathReason||'biến cố cuộc đời'}.`);
      saveGame(state);return {ok:true,died:true};
    }
  }
  const event=randomLifeEvent(p);
  p.pendingEvent={title:event.title,description:event.description,choices:event.choices};
  saveGame(state);
  return {ok:true,died:false};
}
// Auto 5s/năm: giải quyết các lựa chọn NGAY TRONG MỘT LƯỢT xử lý.
// Trình duyệt không bao giờ nhận trạng thái đang chờ lựa chọn giữa hai request.
function autoResolveEvent(state){
  const p=state.player;
  const event=p.pendingEvent;
  if(!event)return {ok:true};
  if(!event.choices?.length)return {ok:false,message:'Biến cố không có đáp án hợp lệ.'};
  // Ghi cả tình huống lẫn hậu quả để người chơi đọc được trong hồi ký.
  addLog(p,`🎲 ${event.title}: ${event.description}`,'event');
  const index=rand(0,event.choices.length-1);
  return chooseEvent(state,index);
}
export function advanceYearAuto(state){
  if(!state.player.alive)return {ok:false,message:'Kiếp này đã kết thúc.'};
  // Xử lý sự kiện dở dang khi người chơi chuyển từ thủ công sang tự chạy.
  if(state.player.pendingEvent){
    const old=autoResolveEvent(state);
    if(!old.ok || !state.player.alive)return old;
  }
  const result=advanceYear(state);
  if(!result.ok || !state.player.alive)return result;
  return autoResolveEvent(state);
}
export function chooseEvent(state,index){
  const p=state.player;
  if(!p.alive||!p.pendingEvent)return {ok:false};
  const event=p.pendingEvent;
  const choice=event.choices[index];
  if(!choice)return {ok:false};
  applyEffects(p,choice.effect);
  p.absurdity+=choice.absurdity||0;
  addLog(p,choice.text,'event');
  p.pendingEvent=null;
  if(p.health<=0)die(p,'Một lựa chọn tai hại khiến sức khỏe chạm đáy.');
  saveGame(state);
  return {ok:true};
}
export function setName(state,name){
  const value=name.trim().replace(/\s+/g,' ').slice(0,30);
  if(value.length<2)return {ok:false,message:'Tên phải có ít nhất 2 ký tự.'};
  state.player.name=value;
  saveGame(state);return {ok:true};
}
