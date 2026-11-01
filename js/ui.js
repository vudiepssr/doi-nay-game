import {CONFIG,formatMoney,escapeHTML} from './config.js';
import {getAvatar} from './avatar.js';
import {getActions} from './actions.js';
import {loadBoards,isOnlineBoard} from './leaderboard.js';
import {listArchivedLives,getArchivedLife} from './lifeArchive.js';
const $=id=>document.getElementById(id);
const fmt=v=>formatMoney(v)+' VND';
function bar(name,value,icon,cls,max=100,unit='%'){
  return `<div class="stat"><div class="stat-line"><span class="left">${icon} ${name}</span><span class="val ${cls}">${Math.round(value)}${unit}</span></div><div class="bar"><div class="bar-fill fill-${cls==='pink'?'health':cls==='yellow'?'happiness':cls==='blue'?'intellect':'skill'}" style="width:${Math.max(0,Math.min(100,value/max*100))}%"></div></div></div>`;
}
function renderStats(p){
  $('player-panel').innerHTML=`
    <div class="identity"><div class="avatar" aria-label="Avatar ${escapeHTML(p.name)}">${getAvatar(p)}</div>
      <div class="identity-info"><div class="name-line"><h1 title="${escapeHTML(p.name)}">${escapeHTML(p.name)}</h1><button class="edit-name" data-command="rename" title="Đổi tên" aria-label="Đổi tên">✎</button></div><div class="job-subtitle">${escapeHTML(p.job)}</div></div>
      <div class="age-block"><div class="age-number">${p.age}</div><div class="age-label">Tuổi</div></div>
    </div>
    <div class="money-box">
      <div class="money-row"><span class="label"><span class="green">▣</span> Tiền mặt:</span><strong class="green">${fmt(p.cash)}</strong></div>
      <div class="money-row"><span class="label"><span class="blue">↗</span> Đầu tư / Tiết kiệm:</span><strong class="blue">${fmt(p.invested)}</strong></div>
      <div class="money-row divider"><span class="label"><span class="yellow">◉</span> Lương ròng/Năm:</span><strong class="${p.salary-p.yearlyExpenses<0?'pink':'green'}">${fmt(p.salary-p.yearlyExpenses)}</strong></div>
    </div>
    ${bar('Sức khỏe',p.health,'♡','pink')}
    ${bar('Hạnh phúc',p.happiness,'☻','yellow')}
    ${bar('Trí tuệ / IQ',p.intellect,'🧠','blue',CONFIG.MAX_IQ,' điểm')}<div class="iq-info">IQ bẩm sinh: <b>${p.birthIQ??p.intellect}</b> · Kỷ lục: <b>${p.peakIQ??p.intellect}</b> / 200</div>
    ${bar('Kỹ năng làm việc',p.skill,'ϟ','purple')}
    <div class="tiny-stats"><span class="tiny-stat">🤝 EQ <b>${p.eq}</b></span><span class="tiny-stat">✨ Nhan sắc <b>${p.beauty}</b></span><span class="tiny-stat">🍀 May mắn <b>${p.luck}</b></span><span class="tiny-stat">🏠 Gia cảnh <b>${p.wealth}</b></span></div>
    <div class="trait-strip">${p.traits.map(t=>`<span class="trait">${escapeHTML(t)}</span>`).join('')}</div>`;
}
function renderActions(state){
  const p=state.player, actions=getActions(p,state.activeTab);
  $('actions-panel').innerHTML=`
    <div class="tab-bar" role="tablist" aria-label="Các nhóm hành động">${CONFIG.categories.map(t=>`<button class="tab ${state.activeTab===t.id?'active':''}" type="button" role="tab" aria-selected="${state.activeTab===t.id}" data-tab="${t.id}"><span class="tab-icon">${t.icon}</span>${t.label}</button>`).join('')}</div>
    <div class="tab-progress"><div class="tab-progress-inner" style="width:${p.actionsLeft/CONFIG.ACTIONS_PER_YEAR*100}%"></div></div>
    <div class="action-heading"><span>${p.alive?'Mỗi năm mày có 2 lượt để tự quyết cuộc đời.':'Cuộc đời đã khép lại.'}</span><b>${p.alive?`⚡ ${p.actionsLeft}/${CONFIG.ACTIONS_PER_YEAR} lượt`:'🪦 GAME OVER'}</b></div>
    <div class="action-grid">${actions.map(a=>{
      const used=Boolean(p.actionUses[a.id]);const locked= !p.alive||!!p.pendingEvent||p.actionsLeft<=0||used||p.age<a.minAge||Boolean(a.disabledWhen?.(p))||p.cash<a.cost;
      const label=used?'Đã thực hiện năm nay':p.cash<a.cost?'Không đủ tiền':p.actionsLeft<=0?'Hết lượt':a.button;
      return `<article class="action-card"><h3><span class="action-icon">${a.icon}</span>${escapeHTML(a.title)}</h3><p>${escapeHTML(a.description)}</p><button type="button" class="action-button ${a.featured?'featured':''} ${locked?'locked':''}" data-action="${a.id}" ${locked?'disabled':''}>${escapeHTML(label)}</button></article>`;
    }).join('')}</div>`;
}
function renderProperty(p,autoPlay=false){
  const canAdvance=p.alive&&!p.pendingEvent;
  const autoLabel=autoPlay?'⏸ DỪNG TỰ ĐỘNG':'▶ TỰ ĐỘNG (5s/NĂM)';
  const autoButton=`<button class="auto-year ${autoPlay?'running':''}" type="button" data-command="auto-year" aria-pressed="${autoPlay}" ${p.alive?'':'disabled'}>${autoLabel}</button>`;
  const manualButton=`<button class="next-year" type="button" data-command="year" ${canAdvance?'':'disabled'}>⏩ +1 TUỔI</button>`;
  const body=`<h2 class="section-title"><span class="symbol">⌂</span> Tài sản & Gia đình</h2><dl class="property-list">
    <div class="property-row"><dt>Hôn nhân:</dt><dd>${escapeHTML(p.marriage)}</dd></div>
    <div class="property-row"><dt>Nhà cửa:</dt><dd>${escapeHTML(p.house)}</dd></div>
    <div class="property-row"><dt>Phương tiện:</dt><dd>${escapeHTML(p.vehicle)}</dd></div>
    <div class="property-row"><dt>Con cái:</dt><dd>${p.children}</dd></div></dl>
    <div class="year-controls">${manualButton}${autoButton}</div>
    <p class="year-note">${!p.alive?'Một kiếp đã kết thúc — đầu thai lại để thử vận.':autoPlay?'⏱ Đang chạy: 5 giây / 1 năm · Biến cố được chọn ngẫu nhiên.':'Chế độ tự động sẽ tự chọn biến cố và qua năm sau mỗi 5 giây.'}</p>`;
  $('property-panel').innerHTML=body;
  $('mobile-dock').innerHTML=`${manualButton}${autoButton}`;
}

function renderJournal(p){
  $('journal-panel').innerHTML=`<div class="journal-top"><h2 class="section-title"><span class="symbol" style="color:#8b91ff">◴</span> Nhật Ký Cuộc Đời (Lịch sử sự kiện)</h2><span class="journal-count">${p.history.length} sự kiện · ${p.yearlyAmbient??0}/2 biến cố phụ năm nay</span></div>
    <div id="journal-feed" class="journal-feed" aria-live="polite">${p.history.map(e=>`<div class="journal-entry"><span class="year-tag">[Năm ${e.age} tuổi]</span><span class="event-text type-${e.type}">${escapeHTML(e.text)}</span></div>`).join('')}</div><p class="journal-hint">Mỗi năm có 2 biến cố tự xảy ra, ngoài biến cố có lựa chọn. Cuộn lên để xem lại.</p>`;
  const feed=$('journal-feed');feed.scrollTop=feed.scrollHeight;
}
const rankNames={rich:'💰 Top Giàu Nhất',old:'🦕 Top Tuổi Cao',absurd:'🧂 Top Trái Ngang',iq:'🧠 Top IQ'};
function rankingHTML(view){
  const boards=loadBoards(),items=boards[view.rankTab]||[];
  const national=isOnlineBoard();
  return `<div class="modal-topline"><div class="modal-kicker">${national?'🌏 XẾP HẠNG TOÀN QUỐC':'🏠 XẾP HẠNG CỤC BỘ'}</div><button class="close-button" aria-label="Đóng" data-command="close">×</button></div><h2>🏆 Bảng Xếp Hạng</h2><p>${national?'Top 100 toàn quốc. Điểm do server tính, chỉ ghi khi nhân vật chết.':'Bản offline: bảng này chỉ lưu trên máy, KHÔNG phải Top toàn quốc.'}</p>
    <div class="ranking-tabs">${Object.entries(rankNames).map(([id,label])=>`<button class="ranking-tab ${view.rankTab===id?'active':''}" data-rank="${id}">${label}</button>`).join('')}</div>
    ${items.length?items.map((r,i)=>`<div class="rank-item"><div class="rank-no">#${r.rank??i+1}</div><div class="rank-info"><strong>${escapeHTML(r.name)}</strong>${r.nickname?`<small>👤 ${escapeHTML(r.nickname)}</small>`:''}<small>${view.rankTab==='iq'?escapeHTML(`IQ bẩm sinh: ${r.birthIQ??'—'} · ${r.age} tuổi`):`${r.age} tuổi · ${escapeHTML(r.reason||'Kết thúc kiếp người')}`} </small></div><div class="rank-score">${view.rankTab==='rich'?formatMoney(r.cash)+' ₫':view.rankTab==='old'?r.age+' tuổi':view.rankTab==='absurd'?r.absurdity+' điểm':(r.iq??'—')+' IQ'}</div></div>`).join(''):'<div class="empty-state">🕯️ Chưa ai có tên trên bảng này.<br/>Chơi một kiếp đến lúc qua đời để ghi danh!</div>'}`;
}
function archiveListHTML(){
  const lives=listArchivedLives();
  return `<div class="modal-topline"><div class="modal-kicker">📜 HỒI KÝ ĐA KIẾP</div><button class="close-button" data-command="close" aria-label="Đóng">×</button></div>
    <h2>📜 Lịch sử kiếp trước</h2><p>Chết rồi vẫn còn chuyện để kể. Mỗi kiếp đã qua lưu độc lập với bảng xếp hạng, mở ra đọc lại bất cứ lúc nào.</p>
    <div class="archive-summary">🪦 Đã tìm thấy <b>${lives.length}</b> kiếp đã kết thúc ${isOnlineBoard()?'trong hồ sơ khách':'trên trình duyệt này'}.</div>
    ${lives.length?`<div class="archive-list">${lives.map(l=>`<button class="archive-life-card" data-life-id="${escapeHTML(l.id)}" type="button">
      <span class="archive-life-icon">${l.legacy?'📄':'🪦'}</span><span class="archive-life-main"><strong>${l.lifeNumber!=null?`Kiếp #${String(l.lifeNumber).padStart(3,'0')} · `:''}${escapeHTML(l.name)}</strong>
      <small>${Number(l.age)||0} tuổi · 🧠 ${Number(l.iq)||0} IQ · 💰 ${formatMoney(Number(l.cash)||0)} ₫</small>
      <small>${escapeHTML(l.reason||'Chưa rõ nguyên nhân chết')}</small></span>
      <span class="archive-life-tail">${l.legacy?'Tóm tắt cũ':`${l.historyCount||0} sự kiện`} ❯</span>
    </button>`).join('')}</div>`:'<div class="empty-state">Chưa có kiếp nào chết để lưu. Khi kiếp này kết thúc, toàn bộ nhật ký sẽ xuất hiện ở đây.</div>'}
    <p class="archive-footnote">${isOnlineBoard()?'Kiếp online đã được lưu trên server và gắn với phiên khách của mày. Giữ cookie để mở lại.':'Kiếp offline chỉ nằm trên trình duyệt. Đừng xóa dữ liệu trang web.'}</p>`;
}
function archiveDetailHTML(id){
  const life=getArchivedLife(id);
  if(!life)return `<div class="modal-topline"><div class="modal-kicker">KIẾP KHÔNG TÌM THẤY</div><button class="close-button" data-command="archive" aria-label="Quay lại">×</button></div><p>Không tìm thấy nhật ký này trong bộ nhớ trình duyệt.</p>`;
  const history=life.history||[];
  let lastAge=null;
  const timeline=history.map(entry=>{
    const age=Number(entry.age)||0;
    const heading=age!==lastAge?`<div class="archive-age-heading" id="archive-age-${age}">✦ Năm ${age} tuổi</div>`:'';
    lastAge=age;
    return `${heading}<div class="archive-event"><span class="archive-event-type">${entry.type==='death'?'🪦':entry.type==='bad'?'💥':entry.type==='good'?'✨':'📌'}</span><span>${escapeHTML(entry.text)}</span></div>`;
  }).join('');
  const ages=[...new Set(history.map(e=>Number(e.age)||0))];
  return `<div class="modal-topline"><button class="archive-back" data-command="archive" type="button">← Tất cả kiếp</button><button class="close-button" data-command="close" aria-label="Đóng">×</button></div>
    <div class="modal-kicker">${life.lifeNumber!=null?`KIẾP #${String(life.lifeNumber).padStart(3,'0')}`:'HỒ SƠ KIẾP CŨ'}</div>
    <h2>🪦 ${escapeHTML(life.name||'Vô danh')}</h2>
    <div class="archive-metrics"><div><span>Tuổi thọ</span><strong>${Number(life.age)||0} tuổi</strong></div><div><span>Đỉnh IQ</span><strong>${Number(life.peakIQ??life.iq)||0}</strong></div><div><span>Tài sản</span><strong>${formatMoney(Number(life.cash)||0)} ₫</strong></div></div>
    <div class="archive-death"><strong>☠️ Nguyên nhân chết</strong><span>${escapeHTML(life.reason||'Không rõ')}</span></div>
    ${life.legacy?'<div class="archive-warning">⚠️ Đây là thành tích từ phiên bản cũ. Trước bản cập nhật này game chưa lưu riêng nhật ký sau khi đầu thai, nên chỉ lấy lại được thông tin còn trong bảng xếp hạng.</div>':`<div class="archive-more">💼 ${escapeHTML(life.job||'Không rõ')} · 🧠 IQ gốc ${Number(life.birthIQ)||0} · ❤️ Sức khỏe ${Number(life.health)||0} · 🤝 EQ ${Number(life.eq)||0}<div>🏡 ${escapeHTML(life.house||'Không rõ')} · 💍 ${escapeHTML(life.marriage||'Không rõ')} · 👶 ${Number(life.children)||0} con</div></div>`}
    <div class="archive-timeline-header"><h3>📖 Toàn bộ nhật ký (${history.length} sự kiện)</h3>
    ${ages.length>0?`<label class="archive-jump-label">Tới tuổi <select id="archive-age-select" aria-label="Chuyển đến tuổi">${ages.map(age=>`<option value="${age}">${age}</option>`).join('')}</select></label>`:''}</div>
    <div class="archive-timeline" id="archive-timeline">${timeline||'<div class="empty-state">Không có sự kiện nào được lưu cho kiếp này.</div>'}</div>
    ${!life.legacy?`<button class="full-button" data-command="export-life" data-life-id="${escapeHTML(life.id)}">⬇️ Tải nhật ký kiếp này (.txt)</button>`:''}`;
}
function renderOverlay(p,view){
  let html='';
  const modal=view.modal;
  if(modal==='archive')html=archiveListHTML();
  else if(modal==='archive-detail')html=archiveDetailHTML(view.archiveId);
  else if(p.pendingEvent&&p.alive){
    const e=p.pendingEvent;
    html=`<div class="modal-kicker">🎲 BIẾN CỐ NĂM ${p.age} TUỔI</div><h2>${escapeHTML(e.title)}</h2><p>${escapeHTML(e.description)}</p><div class="choice-stack">${e.choices.map((c,i)=>`<button type="button" class="choice-button" data-choice="${i}">${escapeHTML(c.label)}<span>${escapeHTML(c.hint||'Lựa chọn của mày sẽ tạo hậu quả.')}</span></button>`).join('')}</div>`;
  }else if(modal==='ranking')html=rankingHTML(view);
  else if(modal==='nickname')html=`<div class="modal-topline"><div class="modal-kicker">TÀI KHOẢN KHÁCH</div><button class="close-button" data-command="close" aria-label="Đóng">×</button></div><h2>👤 Biệt danh trên Top toàn quốc</h2><p>Không cần email hay mật khẩu. Biệt danh này được gắn với các thành tích khi mày chết. Đổi máy hoặc xóa cookie có thể mất quyền quản lý hồ sơ khách.</p><form id="nickname-form"><label for="new-nickname">Biệt danh (2–24 ký tự)</label><input id="new-nickname" class="name-input" maxlength="24" minlength="2" required value="${escapeHTML(view.nickname||'Khách')}"/><button type="submit" class="full-button">Lưu biệt danh</button></form>`;
  else if(modal==='rename')html=`<div class="modal-topline"><div class="modal-kicker">ĐỔI TÊN NHÂN VẬT</div><button class="close-button" data-command="close" aria-label="Đóng">×</button></div><h2>Mày muốn được gọi là gì?</h2><p>Đổi tên thoải mái. Còn nhà giàu hay nghèo thì số phận chọn.</p><form id="name-form"><label for="new-name" style="display:block;margin-bottom:8px;font-size:12px;color:#b9c8da">Tên nhân vật</label><input id="new-name" class="name-input" maxlength="30" value="${escapeHTML(p.name)}" required minlength="2" autofocus /><button type="submit" class="full-button">Lưu tên mới</button></form>`;
  else if(!p.alive)html=`<div class="modal-kicker">🪦 KIẾP #${String(p.lifeNumber).padStart(3,'0')} ĐÃ KHÉP LẠI</div><h2>GAME OVER — Hết một đời!</h2><p>${escapeHTML(p.deathReason)} Mày đã được ghi tên vào các bảng xếp hạng. Không hồi sinh, không quảng cáo cứu mạng.</p>
    <div class="rank-item"><div class="rank-info"><strong>${escapeHTML(p.name)}</strong><small>${p.job} · ${p.age} năm trên cõi đời</small></div><div class="rank-score">${formatMoney(p.cash+p.invested)} ₫<br/>🧂 ${p.absurdity} điểm<br/>🧠 ${p.peakIQ??p.intellect} IQ</div></div>
    ${view.online&&view.ranks?`<div class="rank-item"><div class="rank-info"><strong>🌏 THỨ HẠNG TOÀN QUỐC</strong><small>💰 Giàu #${view.ranks.rich} · 🧠 IQ #${view.ranks.iq} · 🦕 Tuổi #${view.ranks.old} · 🧂 Trái ngang #${view.ranks.absurd}</small></div></div>`:''}
    <button class="full-button" data-command="archive-detail" data-life-id="${escapeHTML(p.id)}">📜 ĐỌC LẠI TOÀN BỘ KIẾP NÀY</button><button class="full-button sub-button" data-command="rebirth">👶 ĐẦU THAI KIẾP MỚI (RANDOM 100%)</button><button class="full-button sub-button" data-command="ranking">🏆 Xem bảng xếp hạng</button>`;
  if(html){$('overlay-root').innerHTML=`<div class="modal-shade"><div class="modal ${modal==='archive'||modal==='archive-detail'?'archive-modal':''}" role="dialog" aria-modal="true">${html}</div></div>`;}
  else $('overlay-root').innerHTML='';
}
export function render(state,view){
  renderStats(state.player);renderActions(state);renderProperty(state.player,view.autoPlay);renderJournal(state.player);
  $('life-count').textContent=`KIẾP #${String(state.player.lifeNumber).padStart(3,'0')}`;
  const status=$('online-status'), guest=$('guest-name');
  if(status){status.textContent=view.online?'🌏 Top toàn quốc':'🏠 Chơi offline';status.classList?.toggle('connected',!!view.online);}
  if(guest)guest.textContent=view.online?(view.nickname||'Khách'):'Cục bộ';
  renderOverlay(state.player,view);
}
export function toast(message){
  const target=$('toast-root');target.innerHTML=`<div class="toast">${escapeHTML(message)}</div>`;
  clearTimeout(toast.timer);toast.timer=setTimeout(()=>{target.innerHTML=''},2500);
}
