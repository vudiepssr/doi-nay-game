import {CONFIG,rand,pick,clamp} from './config.js';
const FIRST_F = ['Bích Phương','Minh Anh','Ngọc Hà','Thảo My','Khánh Linh','Phương Nhi','Thu Trang','Mai Chi'];
const FIRST_M = ['Minh Đức','Đức Anh','Gia Bảo','Quang Huy','Hoàng Nam','Trung Kiên','Hữu Phúc','Anh Tuấn'];
const FAMILY = ['Nguyễn','Trần','Lê','Phạm','Hoàng','Bùi','Đặng','Vũ','Đỗ','Phan'];
// 5% sinh ra IQ > 100; 150+ là 0,05% trên tổng số lần đầu thai.
// Mỗi IQ 150..199 xấp xỉ 0,00099%; IQ 200 là 1% của nhóm 150+.
// Dùng số thực trực tiếp để không làm tròn mất nhóm siêu hiếm.
export function rollBirthIQ(r=Math.random()){
  if(r<.95)return 1+Math.floor(r/.95*100); // 95%: 1..100
  if(r<.9995)return 101+Math.min(48,Math.floor((r-.95)/.0495*49)); // 4,95%: 101..149
  const rare=(r-.9995)/.0005;
  if(rare>=.99)return 200; // 1% trong nhóm siêu hiếm (0,0005% tổng thể)
  return 150+Math.min(49,Math.floor(rare/.99*50)); // 150..199
}
export function rollBirthWealth(r=Math.random()){
  if(r<.05)return 86+Math.floor(r/.05*15); // đúng 5% gia cảnh giàu
  if(r<.23)return 62+Math.floor((r-.05)/.18*24);
  if(r<.74)return 21+Math.floor((r-.23)/.51*41);
  return 1+Math.floor((r-.74)/.26*20);
}
function traitList(p){
  const traits=[];
  if(p.intellect>=150)traits.push('🧠 Não thiên tài hiếm');
  if(p.intellect>=101 && p.intellect<150)traits.push('📚 Não trên 100 IQ');
  if(p.intellect<=20)traits.push('🥔 Não khoai tây');
  if(p.beauty>=88 && p.intellect<=25)traits.push('💅 Bình hoa di động');
  if(p.luck>=90 && p.wealth<=30)traits.push('🍀 Nghèo mà đỏ');
  if(p.wealth>=86)traits.push('🥄 Ngậm thìa vàng');
  if(p.wealth<=13)traits.push('🫠 Sinh ra đã khó');
  if(p.eq>=90)traits.push('🤝 Vua giao tiếp');
  if(p.health<=20)traits.push('🩹 Giòn như bánh tráng');
  if(!traits.length)traits.push('🦆 Người thường hệ khó');
  return traits.slice(0,3);
}
export function createPlayer(lifeNumber=1){
  const gender=pick(['Nam','Nữ']);
  const wealth=rollBirthWealth(), luck=rand(1,100);
  const cash=wealth>=86?rand(150,800)*1e6:wealth>=62?rand(15,55)*1e6:wealth>45?rand(4,12)*1e6:wealth>20?rand(1,5)*1e6:rand(0,8)*100000;
  const p={id:Date.now()+'-'+rand(1,999999),lifeNumber,name:pick(FAMILY)+' '+pick(gender==='Nữ'?FIRST_F:FIRST_M),gender,age:0,
    health:rand(45,100),happiness:rand(45,90),intellect:rollBirthIQ(),eq:rand(1,100),beauty:rand(1,100),skill:rand(5,30),
    wealth,luck,cash,invested:0,job:'Em bé toàn thời gian',salary:0,yearlyExpenses:0,
    marriage:'Độc thân',house:'Ở cùng bố mẹ',vehicle:'Xe nôi',children:0,traits:[],actionsLeft:CONFIG.ACTIONS_PER_YEAR,
    actionUses:{},year:0,alive:true,deathReason:'',absurdity:0,pendingEvent:null,history:[],wonLottery:false};
  p.birthIQ=p.intellect;p.peakIQ=p.intellect;
  p.traits=traitList(p);
  addLog(p,`🍼 Mày vừa đầu thai vào gia đình ${wealth>85?'giàu nứt đố đổ vách':wealth>50?'khá giả':wealth>20?'bình dân':'nghèo vượt khó'}. Chỉ số nhân phẩm đã được random, miễn khiếu nại!`,'event');
  return p;
}
export function addLog(player,text,type='normal'){
  player.history.push({id:Date.now()+'-'+rand(0,99999),age:player.age,text,type});
  // Không xóa log cũ: lịch sử kiếp trước cần đọc lại trọn đời.
}
export function applyEffects(p,effects={}){
  for(const [key,delta] of Object.entries(effects)){
    if(!Number.isFinite(delta)||!Object.prototype.hasOwnProperty.call(p,key))continue;
    if(['cash','invested','salary','absurdity','children'].includes(key)) p[key]=Math.max(0,p[key]+delta);
    else if(['health','happiness','intellect','eq','beauty','skill','luck'].includes(key)){
      const max=key==='intellect'?CONFIG.MAX_IQ:CONFIG.MAX_STAT;
      p[key]=clamp(p[key]+delta,0,max);
    }
  }
  p.peakIQ=Math.max(p.peakIQ??p.intellect,p.intellect);
}
export function isDead(p){return !p.alive}
