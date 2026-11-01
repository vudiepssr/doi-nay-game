import asyncio
import json
from pathlib import Path
from playwright.async_api import async_playwright

async def main():
  html=(Path(__file__).parent/'play.html').read_text(encoding='utf-8')
  html=html.replace("@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&display=swap');",'')
  async with async_playwright() as p:
    browser=await p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
    page=await browser.new_page(viewport={'width':1280,'height':900},accept_downloads=True)
    page.set_default_timeout(3500)
    errors=[]
    print('STAGE 0: opening',flush=True)
    page.on('pageerror',lambda e: errors.append(str(e)))
    await page.evaluate('''() => {let mem={};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>mem[k]??null,setItem:(k,v)=>mem[k]=String(v),removeItem:k=>delete mem[k],clear:()=>mem={}}})}''')
    await page.set_content(html,wait_until='domcontentloaded')
    await page.wait_for_selector('#btn-archive')
    assert await page.locator('#player-panel').is_visible()
    await page.locator('#btn-archive').click()
    assert 'Chưa có kiếp' in await page.locator('.archive-modal').inner_text()
    await page.locator('.close-button').click()
    # Old archive contains a complete history, including manual events.
    await page.evaluate("""() => {
      addLog(state.player,'TEST: Sự kiện mở màn chưa chết', 'good');
      state.player.age=27;
      addLog(state.player,'TEST: Đi học bị đuổi vì quá đẹp trai', 'bad');
      state.player.health=0;
      advanceYear(state);
    }""")
    await page.evaluate('paint()')
    assert await page.locator('text=GAME OVER').first.is_visible()
    print('STAGE 1: death',flush=True)
    saved=await page.evaluate("""() => getArchivedLife(state.player.id)""")
    assert saved['age']==28 and len(saved['history'])>=4
    assert saved['history'][-1]['type']=='death'
    assert saved['history'][1]['text']=='TEST: Sự kiện mở màn chưa chết'
    await page.locator('[data-command="archive-detail"]').click()
    assert await page.locator('.archive-timeline').is_visible()
    assert 'TEST: Đi học bị đuổi' in await page.locator('.archive-timeline').inner_text()
    assert '28 tuổi' in await page.locator('.archive-metrics').inner_text()
    async with page.expect_download() as download_info:
      await page.locator('[data-command="export-life"]').click()
    download=await download_info.value
    assert download.suggested_filename.endswith('.txt')
    await page.locator('.archive-back').click()
    assert await page.locator('.archive-life-card').count()==1
    print('STAGE 2: export ok',flush=True)
    # rebirth preserves old life journal independently
    await page.locator('.close-button').click()
    await page.locator('[data-command="rebirth"]').click()
    await page.locator('#btn-archive').click()
    await page.locator('.archive-life-card').click()
    assert 'TEST: Đi học bị đuổi' in await page.locator('.archive-timeline').inner_text()
    print('STAGE 3: rebirth ok',flush=True)
    # Simulate new browser page using the persisted storage snapshot.
    data=await page.evaluate("""() => {
      const index=listArchivedLives();const saved={};
      for(const k of [CONFIG.STORAGE_KEY,CONFIG.BOARD_KEY,CONFIG.COUNT_KEY,CONFIG.ARCHIVE_INDEX_KEY,...index.filter(x=>!x.legacy).map(x=>CONFIG.ARCHIVE_LIFE_PREFIX+x.id)])saved[k]=localStorage.getItem(k);
      return saved;
    }""")
    await page.close()
    page=await browser.new_page(viewport={'width':1280,'height':900},accept_downloads=True)
    page.on('pageerror',lambda e: errors.append(str(e)))
    await page.evaluate("""data => {
      const mem={...data};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem:k=>mem[k]??null,setItem:(k,v)=>mem[k]=String(v),removeItem:k=>delete mem[k],clear:()=>{for(const k in mem)delete mem[k]}}});
    }""", data)
    await page.set_content(html,wait_until='domcontentloaded')
    await page.locator('#btn-archive').click()
    assert await page.locator('.archive-life-card').count()==1
    await page.locator('.archive-life-card').click()
    assert 'TEST: Đi học bị đuổi' in await page.locator('.archive-timeline').inner_text()
    print('STAGE 4: fresh page loaded',flush=True)
    await page.screenshot(path='/mnt/data/doi-nay-v0.4-desktop.png',full_page=False)
    # Legacy entries recover summary only.
    await page.evaluate("""() => {
      const boards=loadBoards();
      boards.old.push({id:'legacy-test-99221',name:'Kiếp cũ chưa lưu',age:99,cash:3000000,iq:122,reason:'Chết trước khi update'});
      localStorage.setItem(CONFIG.BOARD_KEY,JSON.stringify(boards));
    }""")
    await page.locator('.archive-back').click()
    assert await page.locator('.archive-life-card').count()==2
    await page.locator('[data-life-id="legacy-test-99221"]').click()
    assert 'phiên bản cũ' in await page.locator('.archive-warning').inner_text()
    assert await page.locator('.archive-event').count()==0
    print('STAGE 5: legacy ok',flush=True)
    # Simulate mobile
    mobile=page
    await mobile.set_viewport_size({'width':390,'height':844})
    await mobile.locator('.close-button').click()
    await mobile.locator('#btn-archive').click()
    await mobile.locator('.archive-life-card').first.click()
    assert await mobile.locator('.archive-modal').is_visible()
    await mobile.screenshot(path='/mnt/data/doi-nay-v0.4-mobile.png',full_page=False)
    if errors: raise AssertionError('\n'.join(errors))
    print('PASS: Archive empty state, full journal on death, summary, TXT export, rebirth persistence, reload persistence, legacy fallback, desktop + mobile; 0 pageerrors')
    await browser.close()

asyncio.run(main())
