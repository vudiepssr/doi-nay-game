export const CONFIG = {
  STORAGE_KEY: 'doi-nay-save-v1',
  BOARD_KEY: 'doi-nay-rankings-v1',
  COUNT_KEY: 'doi-nay-life-count-v1',
  ARCHIVE_INDEX_KEY: 'doi-nay-archive-index-v1',
  ARCHIVE_LIFE_PREFIX: 'doi-nay-life-archive-v1:',
  MAX_AGE: 115,
  MAX_STAT: 100,
  MAX_IQ: 200,
  AMBIENT_EVENTS_PER_YEAR: 1,
  ACTIONS_PER_YEAR: 2,
  categories: [
    { id: 'study', label: 'Học tập & Phát triển', icon: '📖' },
    { id: 'work', label: 'Việc làm & Lương', icon: '💼' },
    { id: 'life', label: 'Giải trí & Đời sống', icon: '☕' },
    { id: 'finance', label: 'Đầu tư & Tài chính', icon: '🏦' }
  ]
};
export const rand = (min,max) => Math.floor(Math.random()*(max-min+1))+min;
export const pick = arr => arr[rand(0,arr.length-1)];
export const clamp = (v,min=0,max=100) => Math.min(max,Math.max(min,v));
export const formatMoney = n => {
  const sign = n < 0 ? '-' : '';
  const value = Math.abs(Math.round(n));
  if(value >= 1e9) return sign+(value/1e9).toLocaleString('vi-VN',{maximumFractionDigits:2})+' Tỷ';
  if(value >= 1e6) return sign+(value/1e6).toLocaleString('vi-VN',{maximumFractionDigits:1})+' Triệu';
  if(value >= 1e3) return sign+(value/1e3).toLocaleString('vi-VN',{maximumFractionDigits:0})+'k';
  return sign+value.toLocaleString('vi-VN');
};
export const escapeHTML = value => String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
