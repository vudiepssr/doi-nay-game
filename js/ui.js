import {CONFIG,formatMoney,escapeHTML} from './config.js';
import {getAvatar} from './avatar.js';
import {getActions} from './actions.js';
import {loadBoards,isOnlineBoard} from './leaderboard.js';
import {listArchivedLives,getArchivedLife} from './lifeArchive.js';
const $ = id => document.getElementById(id);
const safe = v => escapeHTML(v ?? '');
const money = v => formatMoney(Number(v)||0)+' ₫';
const whole = v => Math.round(Number(v)||0);
const safePct = (v,max=100) => Math.max(0,Math.min(100,(Number(v)||0)/max*100));
const strength = (v,low='BÁO ĐỘNG',mid='CHƯA ỔN',high='TẠM ỔN',great='NGON LÀNH') => v < 25 ? low : v < 50 ? mid : v < 80 ? high : great;
const docLabels = {study:{icon:'🎓',name:'ĐƯỜNG HỌC HÀNH',file:'HỌC BẠ / PHIẾU ĐIỂM',subtitle:'Học giỏi hay không thì tùy não. Học phí không tùy ai.'},work:{icon:'💼',name:'CẦN CÂU CƠM',file:'ĐƠN XIN VIỆC',subtitle:'Chỗ ký tên còn trống. Lương cao hay thấp, trời biết.'},life:{icon:'☕',name:'ĂN CHƠI & GIA ĐẠO',file:'SỔ GHI CHÉP ĐỜI SỐNG',subtitle:'Yêu đương, bạn bè, sức khỏe và những lần tiêu tiền ngu.'},finance:{icon:'💸',name:'TIỀN NONG & MÁU LIỀU',file:'SỔ THU CHI / GIẤY BÁO NỢ',subtitle:'Tiền không tự đẻ ra. Nhưng nợ có thể tự mọc.'}};
function stamp(text,modifier=''){return `<span class="red-stamp ${modifier}">${safe(text)}</span>`;}
function statNote(key,v){
  if(key==='intellect')return v>=150?'HÀNG HIẾM':v>100?'NÃO SÁNG':v<30?'CẦN ĐI HỌC':'ĐỦ SỐNG';
  if(key==='eq')return strength(v,'KHÓ Ở','HƠI CỘC','BIẾT ĐIỀU','KHÉO MIỆNG');
  if(key==='health')return strength(v,'CẦN CỨU','YẾU NHƯ SÊN','TẠM ỔN','TRÂU BÒ');
  return strength(v,'ĐỜI QUÁ ĐEN','HƠI CHÁN','CÒN VUI','PHƠI PHỚI');
}
function statPaper(label,key,value,max=100){
  const v=whole(value), status=statNote(key,v);
  return `<div class="paper-stat paper-stat-${key}"><div class="paper-stat-head"><span>${safe(label)}</span><strong>${v}${key==='intellect'?'<small> / 200</small>':'<small> / 100</small>'}</strong></div><div class="ruler" aria-hidden="true"><span style="width:${safePct(v,max)}%"></span></div><span class="stat-handnote">${status}</span></div>`;
}
function renderStats(p,view){
  $('player-panel').innerHTML=`
    <div class="tape tape-left" aria-hidden="true"></div>
    <div class="dossier-caption"><span>PHÒNG QUẢN LÝ KIẾP SỐ</span><span>SỐ: ${String(whole(p.lifeNumber)).padStart(5,'0')}</span></div>
    <div class="dossier-heading"><h2>HỒ SƠ <em>KIẾP NÀY</em></h2><span class="dossier-code">MẪU DN-01<br/>KHÔNG ĐƯỢC SỬA GIA CẢNH</span></div>
    <div class="person-card"><div class="id-photo"><span aria-label="Ảnh nhân vật">${getAvatar(p)}</span><small>ẢNH 3×4</small></div><div class="person-info"><span class="field-name">HỌ VÀ TÊN <button class="pen-button" data-command="rename" aria-label="Đổi tên nhân vật" title="Đổi tên">✎</button></span><h3>${safe(p.name)}</h3><p>${safe(p.job)}</p><span class="person-life">${p.alive?'● CÒN THỞ':'✝ ĐÃ NGỎM'}</span></div><div class="paper-age"><strong>${whole(p.age)}</strong><span>TUỔI</span></div></div>
    <div class="character-stamp">${stamp(!p.alive?'HẾT KIẾP':p.wealth>=86?'NGẬM THÌA VÀNG':p.intellect>=150?'THẦN ĐỒNG':p.cash<=0?'CHÁY TÚI':'CÒN THỞ','stamp-dossier')}</div>
    <button class="dossier-toggle" type="button" data-command="toggle-dossier" aria-expanded="${Boolean(view.dossierExpanded)}">${view.dossierExpanded?'− THU GỌN HỒ SƠ':'+ MỞ HỒ SƠ CHI TIẾT'}</button>
    <div class="dossier-details ${view.dossierExpanded?'is-expanded':''}">
    <div class="section-rule"><span>01 / TÌNH HÌNH TÚI TIỀN</span></div>
    <div class="financial-slip"><div><span>TIỀN MẶT</span><strong>${money(p.cash)}</strong></div><div><span>ĐẦU TƯ / GỬI GẮM</span><strong>${money(p.invested)}</strong></div><div class="financial-last"><span>THU NHẬP RÒNG / NĂM</span><strong class="${p.salary-p.yearlyExpenses<0?'negative':'positive'}">${money(p.salary-p.yearlyExpenses)}</strong></div></div>
    <div class="section-rule"><span>02 / NÃO TRẠNG & NHÂN PHẨM</span></div>
    <div class="paper-stats">${statPaper('🧠 IQ / ĐỘ KHÔN LỎI','intellect',p.intellect,200)}${statPaper('❤ SỨC KHỎE','health',p.health)}${statPaper('☺ ĐỘ MÃN NGUYỆN','happiness',p.happiness)}${statPaper('🤝 ĐỘ BIẾT ĐIỀU / EQ','eq',p.eq)}</div>
    <div class="extra-metrics"><span>KỸ NĂNG <b>${whole(p.skill)}</b></span><span>NHAN SẮC <b>${whole(p.beauty)}</b></span><span>MAY MẮN <b>${whole(p.luck)}</b></span><span>GIA CẢNH <b>${whole(p.wealth)}</b></span></div>
    <div class="ink-annotation">IQ bẩm sinh ${whole(p.birthIQ??p.intellect)} · Đỉnh từng đạt ${whole(p.peakIQ??p.intellect)}/200</div>
    <div class="trait-paper">${(p.traits||[]).map(t=>`<span>${safe(t)}</span>`).join('')}</div>
    <div class="file-footer"><span>HỒ SƠ GỐC · BẢN 01</span><span>✳ ĐỜI NÀY ✳</span></div></div>`;
}
function renderProperty(p,autoPlay=false){
  const manualAllowed=p.alive&&!p.pendingEvent;
  const manualButton=`<button class="next-year" type="button" data-command="year" ${manualAllowed?'':'disabled'}><span class="control-icon">⏭</span><span>+1 TUỔI<small>QUA NĂM THỦ CÔNG</small></span></button>`;
  const autoButton=`<button class="auto-year ${autoPlay?'running':''}" type="button" data-command="auto-year" aria-pressed="${Boolean(autoPlay)}" ${p.alive?'':'disabled'}><span class="control-icon">${autoPlay?'Ⅱ':'▶'}</span><span>${autoPlay?'DỪNG TỰ ĐỘNG':'TỰ ĐỘNG SỐNG'}<small>${autoPlay?'ĐANG CHẠY · 5 GIÂY/NĂM':'5 GIÂY / 1 NĂM · KHÔNG POPUP'}</small></span>${autoPlay?'<i class="auto-indicator" aria-hidden="true"></i>':''}</button>`;
  $('property-panel').innerHTML=`<div class="tape tape-right" aria-hidden="true"></div><div class="document-topline">PHỤ LỤC 02 / ĐỜI SỐNG</div><h2>CỦA NẢ <em>& GIA ĐẠO</em></h2>
   <dl class="property-list"><div><dt>HÔN NHÂN</dt><dd>${safe(p.marriage)}</dd></div><div><dt>CHỖ CHUI RA CHUI VÀO</dt><dd>${safe(p.house)}</dd></div><div><dt>PHƯƠNG TIỆN</dt><dd>${safe(p.vehicle)}</dd></div><div><dt>CON CÁI</dt><dd>${whole(p.children)} đứa</dd></div></dl>
   <div class="property-action-title">⏱ QUYỀN ĐIỀU KHIỂN THỜI GIAN</div><div class="year-controls">${manualButton}${autoButton}</div>
   <p class="year-note">${!p.alive?'Kiếp đã khép lại. Đọc cáo phó rồi đầu thai kiếp mới.':autoPlay?'Tự chạy: server âm thầm bốc sự kiện và ghi vào bảng tin.':'Tự động không hiện hộp lựa chọn; thủ công mới cho mày quyết.'}</p>`;
  $('mobile-dock').innerHTML=`<div class="dock-label">SỔ ĐỜI · NĂM ${whole(p.age)}</div><div class="dock-buttons">${manualButton}${autoButton}</div>`;
}
function renderActions(state){
 const p=state.player, actions=getActions(p,state.activeTab);
 const doc=docLabels[state.activeTab]||docLabels.study;
 $('actions-panel').innerHTML=`<div class="right-column-heading"><span class="micro-label">PHÒNG GIẢI QUYẾT THỦ TỤC</span><h2>CHỒNG GIẤY <em>CUỘC ĐỜI</em></h2><p>Đơn từ chất đống. Chọn một thứ để làm trong năm.</p></div>
   <div class="paper-tab-list" role="tablist" aria-label="Các giấy tờ hành động">${CONFIG.categories.map(cat=>`<button type="button" class="paper-tab ${state.activeTab===cat.id?'active':''}" role="tab" aria-selected="${state.activeTab===cat.id}" data-tab="${cat.id}"><span>${docLabels[cat.id].icon}</span>${safe(docLabels[cat.id].name)}</button>`).join('')}</div>
   <div class="document-sheet doc-${safe(state.activeTab)}"><span class="paperclip" aria-hidden="true">⌁</span><div class="document-topline"><span>${safe(doc.file)}</span><span>MÃ: ${whole(p.lifeNumber)}-${whole(p.age)}</span></div><h3>${safe(doc.name)}</h3><p class="document-desc">${safe(doc.subtitle)}</p>
   <div class="turn-counter"><span>LƯỢT HÀNH ĐỘNG CÒN LẠI</span><strong>${p.alive?`${whole(p.actionsLeft)} / ${CONFIG.ACTIONS_PER_YEAR}`:'ĐÃ HẾT KIẾP'}</strong></div>
   <div class="document-action-list">${actions.map((a,i)=>{const used=Boolean(p.actionUses[a.id]);const locked=!p.alive||Boolean(p.pendingEvent)||p.actionsLeft<=0||used||p.age<a.minAge||Boolean(a.disabledWhen?.(p))||p.cash<a.cost;
     const label=used?'ĐÃ LÀM NĂM NAY':p.cash<a.cost?'KHÔNG ĐỦ TIỀN':p.actionsLeft<=0?'HẾT LƯỢT':!p.alive?'HẾT KIẾP':a.button;
     return `<article class="document-action ${locked?'is-locked':''}"><div class="action-number">${String(i+1).padStart(2,'0')}</div><div class="action-copy"><h4><span>${a.icon}</span> ${safe(a.title)}</h4><p>${safe(a.description)}</p><button data-action="${safe(a.id)}" type="button" ${locked?'disabled':''}>${safe(label)} <span aria-hidden="true">↗</span></button></div></article>`;}).join('')}</div>
   <div class="document-bottom"><span>NGƯỜI ĐĂNG KÝ</span><span class="signature">${safe(p.name)}</span></div></div>`;
}
function postType(e){if(e.type==='death')return 'death';if(e.type==='bad')return 'bad';if(e.type==='good')return 'good';return 'normal';}
function postInfo(type){return ({death:{label:'CÁO PHÓ',symbol:'✝',reaction:'HẾT CỨU',mark:'ĐÃ KẾT THÚC'},bad:{label:'DRAMA / XUI XẺO',symbol:'💥',reaction:'CAY THẬT',mark:'ĐỜI VẢ'},good:{label:'TIN VUI / HỜN ĐỜI',symbol:'✨',reaction:'VẬN ĐỎ',mark:'ĐÃ XÁC NHẬN'},normal:{label:'TIN VẶT / SỔ ĐỜI',symbol:'✳',reaction:'ĐÃ HÓNG',mark:'LƯU HỒ SƠ'}})[type];}
function reactionScore(e,i){let hash=13;const t=String(e.text||'');for(let j=0;j<t.length;j++)hash=(hash*31+t.charCodeAt(j))%1171;return 3+((hash+i*11)%297);}
function renderJournal(p,view){
 const filter=view.feedFilter||'all';
 const all=(p.history||[]).filter(e=>filter==='all'||postType(e)===filter);
 const groups=new Map();
 for(const entry of all){const key=whole(entry.age);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(entry);}
 const ages=[...groups.keys()].sort((a,b)=>b-a);
 $('journal-panel').innerHTML=`<div class="feed-toolbar"><div><span class="feed-live-dot">●</span><b>BẢNG TIN</b><span class="muted-text">${(p.history||[]).length} tin đã lưu</span></div><span class="feed-year-chip">KIẾP #${String(whole(p.lifeNumber)).padStart(3,'0')}</span></div>
   <div class="feed-filters" role="group" aria-label="Lọc bảng tin"><button class="feed-filter ${filter==='all'?'active':''}" data-feed-filter="all" aria-pressed="${filter==='all'}">TẤT CẢ</button><button class="feed-filter ${filter==='bad'?'active':''}" data-feed-filter="bad" aria-pressed="${filter==='bad'}">💥 DRAMA</button><button class="feed-filter ${filter==='good'?'active':''}" data-feed-filter="good" aria-pressed="${filter==='good'}">✨ VẬN ĐỎ</button><button class="feed-filter ${filter==='normal'?'active':''}" data-feed-filter="normal" aria-pressed="${filter==='normal'}">📌 ĐỜI THƯỜNG</button></div>
   ${ages.length?`<div class="feed-timeline">${ages.map((age,yearIndex)=>`<section class="year-group" aria-label="Sự kiện năm ${age} tuổi"><div class="year-divider"><span class="timeline-dot"></span><span class="year-label">NĂM ${age} TUỔI</span><span class="year-event-count">${groups.get(age).length} MẢNH ĐỜI</span></div><div class="post-stack">${groups.get(age).slice().reverse().map((entry,i)=>{
       const type=postType(entry),meta=postInfo(type);return `<article class="feed-post post-${type}"><div class="post-head"><span class="post-author-avatar">${getAvatar(p)}</span><div class="post-author"><strong>${safe(p.name)}</strong><span>Đã đăng tại kiếp #${whole(p.lifeNumber)} · ${age} tuổi</span></div><span class="post-menu" aria-hidden="true">•••</span></div>
       <div class="post-body"><div class="post-category">${meta.symbol} ${meta.label}</div><p>${safe(entry.text)}</p>${type==='death'?stamp('HẾT KIẾP','stamp-inline'):''}</div>
       <div class="post-reactions"><span>😮 ${reactionScore(entry,i+yearIndex)} người hóng*</span><span>↪ ĐÃ GHI VÀO SỔ ĐỜI</span></div></article>`;}).join('')}</div></section>`).join('')}</div><p class="feed-end">✳ HẾT BẢNG TIN · ĐẦU KIẾP Ở ĐÂY ✳</p>`:`<div class="feed-empty">Chưa có tin nào thuộc mục này. Đời còn dài, drama chưa tới thôi.</div>`}
   <p class="feed-disclaimer">* Phản ứng vui được tạo giả lập, không phải số người xem thật. Mỗi năm tự có 2 biến cố phụ ngoài chuyện chính.</p>`;
}
const rankNames={rich:'💰 ĐẠI GIA',old:'🦕 SỐNG DAI',absurd:'🧂 TRÁI NGANG',iq:'🧠 THẦN ĐỒNG'};
function rankingHTML(view){
 const boards=loadBoards(),items=boards[view.rankTab]||[],national=isOnlineBoard();
 return `<div class="modal-topline"><div class="modal-kicker">${national?'🌏 BẢNG VÀNG TOÀN QUỐC':'🏠 BẢNG VÀNG TRÊN MÁY'}</div><button class="close-button" data-command="close" aria-label="Đóng">×</button></div><h2>BẢNG VÀNG NHÂN PHẨM</h2><p>${national?'Top 100 toàn quốc. Server xác minh thành tích khi chết, không mua slot.':'Bản offline chỉ lưu cục bộ. Muốn tranh Top toàn quốc hãy chơi ở web public.'}</p>
  <div class="ranking-tabs">${Object.entries(rankNames).map(([id,label])=>`<button class="ranking-tab ${view.rankTab===id?'active':''}" data-rank="${id}">${label}</button>`).join('')}</div>
  <div class="ranking-list">${items.length?items.map((r,i)=>`<div class="rank-item"><div class="rank-no">${i<3?['🥇','🥈','🥉'][i]:'#'+(r.rank??i+1)}</div><div class="rank-info"><strong>${safe(r.name)}</strong>${r.nickname?`<small>CHỦ KIẾP: ${safe(r.nickname)}</small>`:''}<small>${whole(r.age)} tuổi · ${safe(r.reason||'Đã khép kiếp')}</small></div><div class="rank-score">${view.rankTab==='rich'?money(r.cash):view.rankTab==='old'?whole(r.age)+' TUỔI':view.rankTab==='absurd'?whole(r.absurdity)+' ĐIỂM':whole(r.iq)+' IQ'}</div></div>`).join(''):'<div class="empty-state">Chưa có nhân vật nào lên bảng này. Chết rồi mới được ghi danh.</div>'}</div>`;
}
function archiveListHTML(){
 const lives=listArchivedLives();
 return `<div class="modal-topline"><div class="modal-kicker">LƯU TRỮ / HỒ SƠ ĐÃ ĐÓNG</div><button class="close-button" data-command="close" aria-label="Đóng">×</button></div><h2>HỒ SƠ KIẾP TRƯỚC</h2><p>Chết rồi vẫn có chuyện để kể. Mở từng tập hồ sơ để lật lại cả đời người.</p><div class="archive-summary">📁 TÌM THẤY <b>${lives.length}</b> HỒ SƠ ĐÃ NIÊM PHONG</div>
 ${lives.length?`<div class="archive-list">${lives.map(l=>`<button class="archive-life-card" type="button" data-life-id="${safe(l.id)}"><span class="archive-life-icon">${l.legacy?'▤':'🪦'}</span><span class="archive-life-main"><strong>${l.lifeNumber!=null?`HỒ SƠ #${String(l.lifeNumber).padStart(3,'0')} · `:''}${safe(l.name)}</strong><small>${whole(l.age)} tuổi · IQ ${whole(l.iq)} · ${money(l.cash)}</small><small>${safe(l.reason||'Chưa rõ nguyên nhân')}</small></span><span class="archive-life-tail">${l.legacy?'BẢN CŨ':`${l.historyCount||0} TIN`} →</span></button>`).join('')}</div>`:'<div class="empty-state">Chưa có kiếp nào được lưu. Kiếp này kết thúc, hồ sơ sẽ nằm ở đây.</div>'}
 <p class="archive-footnote">${isOnlineBoard()?'Dữ liệu gắn với phiên khách trên server. Xóa cookie có thể mất quyền truy cập hồ sơ.':'Bản offline lưu trong trình duyệt, không nên xóa dữ liệu trang.'}</p>`;
}
function archiveDetailHTML(id){
 const life=getArchivedLife(id);
 if(!life)return `<div class="modal-topline"><span class="modal-kicker">HỒ SƠ KHÔNG TÌM THẤY</span><button class="close-button" data-command="archive">×</button></div><p>Chưa tìm được nội dung kiếp này.</p>`;
 const history=life.history||[];let lastAge=null;
 const timeline=history.map(e=>{const age=whole(e.age),heading=age!==lastAge?`<div class="archive-age-heading" id="archive-age-${age}">NĂM ${age} TUỔI</div>`:'';lastAge=age;return `${heading}<div class="archive-event"><span>${postInfo(postType(e)).symbol}</span><span>${safe(e.text)}</span></div>`;}).join('');
 const ages=[...new Set(history.map(e=>whole(e.age)))];
 return `<div class="modal-topline"><button class="archive-back" data-command="archive">← TỦ HỒ SƠ</button><button class="close-button" data-command="close" aria-label="Đóng">×</button></div><div class="modal-kicker">HỒ SƠ NIÊM PHONG / ${life.lifeNumber!=null?'KIẾP #'+String(life.lifeNumber).padStart(3,'0'):'KIẾP CŨ'}</div><h2>${safe(life.name||'Vô danh')}</h2>
 <div class="archive-metrics"><div><span>HƯỞNG DƯƠNG</span><strong>${whole(life.age)} tuổi</strong></div><div><span>IQ CAO NHẤT</span><strong>${whole(life.peakIQ??life.iq)}</strong></div><div><span>TIỀN MẶT</span><strong>${money(life.cash)}</strong></div></div>
 <div class="archive-death"><strong>✝ NGUYÊN NHÂN CHẾT</strong><span>${safe(life.reason||'Không rõ')}</span></div>
 ${life.legacy?'<div class="archive-warning">Hồ sơ cũ không có nhật ký đầy đủ vì phiên bản trước chưa lưu phần này.</div>':`<div class="archive-more">💼 ${safe(life.job||'Không rõ')} · IQ GỐC ${whole(life.birthIQ)} · EQ ${whole(life.eq)} · SỨC KHỎE ${whole(life.health)}<div>🏠 ${safe(life.house||'Không rõ')} · ${safe(life.marriage||'Không rõ')} · ${whole(life.children)} con</div></div>`}
 <div class="archive-timeline-header"><h3>NHẬT KÝ (${history.length} SỰ KIỆN)</h3>${ages.length?`<label class="archive-jump-label">NHẢY ĐẾN TUỔI <select id="archive-age-select" aria-label="Chọn tuổi trong hồi ký">${ages.map(age=>`<option value="${age}">${age}</option>`).join('')}</select></label>`:''}</div>
 <div class="archive-timeline" id="archive-timeline">${timeline||'<div class="empty-state">Hồ sơ này không còn nhật ký.</div>'}</div>
 ${!life.legacy?`<button class="full-button" data-command="export-life" data-life-id="${safe(life.id)}">↓ TẢI TOÀN BỘ HỒI KÝ (.TXT)</button>`:''}`;
}
function renderOverlay(p,view){
 let html='',modal=view.modal,cls='';
 if(modal==='archive'){html=archiveListHTML();cls='archive-modal';}
 else if(modal==='archive-detail'){html=archiveDetailHTML(view.archiveId);cls='archive-modal';}
 else if(modal==='ranking'){html=rankingHTML(view);cls='ranking-modal';}
 else if(modal==='nickname')html=`<div class="modal-topline"><div class="modal-kicker">PHIẾU CẤP BIỆT DANH KHÁCH</div><button class="close-button" data-command="close" aria-label="Đóng">×</button></div><h2>ĐẶT BIỆT DANH</h2><p>Không cần email hay mật khẩu. Biệt danh được ghi kèm các thành tích trên Top. Đổi máy hoặc xóa cookie có thể mất Guest ID.</p><form id="nickname-form"><label for="new-nickname">BIỆT DANH (2–24 KÝ TỰ)</label><input id="new-nickname" class="name-input" maxlength="24" minlength="2" required value="${safe(view.nickname||'Khách')}"/><button type="submit" class="full-button">KÝ TÊN & LƯU</button></form>`;
 else if(modal==='rename')html=`<div class="modal-topline"><div class="modal-kicker">ĐƠN ĐỔI TÊN NHÂN VẬT</div><button class="close-button" data-command="close" aria-label="Đóng">×</button></div><h2>ĐỔI TÊN TRÊN SỔ ĐỜI</h2><p>Được đổi tên, không được đổi số phận.</p><form id="name-form"><label for="new-name">HỌ VÀ TÊN</label><input id="new-name" class="name-input" maxlength="30" minlength="2" required value="${safe(p.name)}"/><button type="submit" class="full-button">XÁC NHẬN TÊN</button></form>`;
 else if(!p.alive){cls='death-modal';html=`<div class="death-border"><div class="modal-kicker">PHÒNG QUẢN LÝ KIẾP SỐ · CÁO PHÓ ${String(whole(p.lifeNumber)).padStart(3,'0')}</div><span class="death-illustration">✝</span><h2>THÔNG BÁO<br/>HẾT KIẾP</h2><p class="death-name">${safe(p.name)}</p><p class="death-age">HƯỞNG DƯƠNG ${whole(p.age)} TUỔI</p>${stamp('ĐÃ NGỎM','stamp-death')}<p class="death-reason">${safe(p.deathReason||'Số đã tận.')}</p>
 <div class="obituary-stats"><div><small>TÀI SẢN</small><strong>${money((p.cash||0)+(p.invested||0))}</strong></div><div><small>ĐỈNH IQ</small><strong>${whole(p.peakIQ??p.intellect)}</strong></div><div><small>ĐỘ TRÁI NGANG</small><strong>${whole(p.absurdity)}</strong></div></div>
 ${view.online&&view.ranks?`<p class="obituary-rank">🌏 THỨ HẠNG TOÀN QUỐC: GIÀU #${view.ranks.rich??'—'} · IQ #${view.ranks.iq??'—'} · TUỔI #${view.ranks.old??'—'} · TRÁI NGANG #${view.ranks.absurd??'—'}</p>`:''}
 <div class="obituary-buttons"><button class="full-button" data-command="archive-detail" data-life-id="${safe(p.id)}">▤ ĐỌC HỒI KÝ KIẾP NÀY</button><button class="full-button" data-command="rebirth">✳ ĐẦU THAI KIẾP MỚI</button><button class="full-button sub-button" data-command="ranking">★ XEM BẢNG VÀNG TOÀN QUỐC</button><button class="full-button sub-button" data-command="share-life">↗ KHOE THÀNH TÍCH KIẾP NÀY</button></div><p class="death-bottom">KHÔNG HỒI SINH · KHÔNG BÁN GIA CẢNH · KHÔNG KHIẾU NẠI</p></div>`;}
 else if(p.pendingEvent&&!view.autoPlay){const e=p.pendingEvent;cls='choice-modal';html=`<div class="modal-kicker">📌 PHIẾU XỬ LÝ BIẾN CỐ — NĂM ${whole(p.age)} TUỔI</div><h2>${safe(e.title)}</h2><p>${safe(e.description)}</p><div class="choice-stack">${(e.choices||[]).map((c,i)=>`<button type="button" class="choice-button" data-choice="${i}"><strong>${safe(c.label)}</strong><span>${safe(c.hint||'Quyết định sẽ để lại hậu quả.')}</span></button>`).join('')}</div><div class="choice-footer">CHỈ CHẾ ĐỘ THỦ CÔNG MỚI HIỆN PHIẾU NÀY.</div>`;}
 $('overlay-root').innerHTML=html?`<div class="modal-shade"><div class="modal ${cls}" role="dialog" aria-modal="true" aria-label="${cls==='choice-modal'?'Lựa chọn biến cố':'Hồ sơ kiếp số'}">${html}</div></div>`:'';
}
export function render(state,view){
 const p=state.player;
 renderStats(p,view);renderProperty(p,view.autoPlay);renderActions(state);renderJournal(p,view);renderOverlay(p,view);
 $('life-count').textContent=`KIẾP #${String(whole(p.lifeNumber)).padStart(3,'0')}`;
 const status=$('online-status'),guest=$('guest-name');
 if(status){status.textContent=view.online?'● TOP TOÀN QUỐC':'● BẢN OFFLINE';status.classList?.toggle('connected',Boolean(view.online));}
 if(guest)guest.textContent=view.online?(view.nickname||'Khách'):'Cục bộ';
}
export function toast(message){
 const target=$('toast-root');if(!target)return;
 target.innerHTML=`<div class="toast">${safe(message)}</div>`;
 clearTimeout(toast.timer);toast.timer=setTimeout(()=>target.innerHTML='',2700);
}
