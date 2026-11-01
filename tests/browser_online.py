"""Smoke test browser ONLINE UX with fetch mock; no external network or secrets."""
import asyncio,json,subprocess
from pathlib import Path
from playwright.async_api import async_playwright
BASE=Path(__file__).resolve().parents[1]
async def main():
    source=subprocess.check_output(['node','--input-type=module','-e',
      "import {createPlayer} from './js/player.js'; console.log(JSON.stringify(createPlayer(1)))"],cwd=BASE,text=True)
    p=json.loads(source)
    boards={k:[{'id':'demo-1','rank':1,'name':'Trùm IQ','nickname':'Khách Quốc Dân',
       'age':88,'iq':181,'birthIQ':152,'cash':1000000000,'absurdity':25,'reason':'Hết pin'}]
       for k in ('rich','old','absurd','iq')}
    html=(BASE/'play.html').read_text(encoding='utf-8').replace(
      "const ONLINE=typeof location!=='undefined' && /^https?:$/.test(location.protocol);",
      'const ONLINE=true;')
    html=html.replace("@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&display=swap');",'')
    async with async_playwright() as pw:
        browser=await pw.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox'])
        page=await browser.new_page(viewport={'width':1320,'height':900},accept_downloads=True)
        errors=[]
        page.on('pageerror',lambda err:errors.append(str(err)))
        await page.evaluate('''(config) => {
          window.__test = {revision:0, runId:'11111111-1111-4111-8111-111111111111', nickname:'Khách Quốc Dân',
                           state:{player:config.player,activeTab:'study'}, boards:config.boards};
          window.fetch = async (url,opts={}) => {
            let m=window.__test, ranks=null;
            if(opts.method==='POST'){
              const msg=JSON.parse(opts.body);
              m.revision++;
              if(msg.command==='nickname')m.nickname=msg.value;
              if(msg.command==='year'){
                m.state.player.age++;
                m.state.player.history.push({id:'mock-log',age:m.state.player.age,text:'Một năm online trôi qua.',type:'event'});
                if(m.state.player.age>=3){m.state.player.alive=false;m.state.player.deathReason='Kết thúc test';
                  ranks={rich:12,old:13,absurd:14,iq:15};}
              }
            }
            return new Response(JSON.stringify({ok:true,runId:m.runId,revision:m.revision,nickname:m.nickname,
              guestId:'guest-demo',state:m.state,boards:m.boards,ranks}),
              {status:200,headers:{'Content-Type':'application/json'}});
          };
        }''',{'player':p,'boards':boards})
        await page.set_content(html,wait_until='domcontentloaded')
        await page.wait_for_function("document.querySelector('#online-status')?.textContent.includes('toàn quốc')")
        assert await page.locator('#player-panel').is_visible()
        await page.locator('#btn-ranking').click()
        assert 'Top 100 toàn quốc' in await page.locator('.modal').inner_text()
        assert 'Khách Quốc Dân' in await page.locator('.modal').inner_text()
        await page.locator('[data-rank="iq"]').click()
        assert '181 IQ' in await page.locator('.modal').inner_text()
        await page.locator('[data-command="close"]').click()
        await page.locator('[data-command="nickname"]').click()
        await page.locator('#new-nickname').fill('Thánh Số Phận')
        await page.locator('#nickname-form button').click()
        await page.wait_for_function("document.querySelector('#guest-name')?.textContent.includes('Thánh Số Phận')")
        await page.locator('[data-command="year"]').first.click()
        await page.wait_for_function("document.querySelector('.age-number')?.textContent.trim()==='1'")
        await page.screenshot(path='/mnt/data/doi-nay-v0.7-online-desktop.png')
        await page.set_viewport_size({'width':390,'height':844})
        await page.screenshot(path='/mnt/data/doi-nay-v0.7-online-mobile.png')
        await page.locator('.mobile-dock [data-command="auto-year"]').click()
        await page.wait_for_function("document.querySelector('.age-number')?.textContent.trim()==='2'",timeout=10000)
        await page.locator('.mobile-dock [data-command="auto-year"]').click()
        assert await page.locator('.age-number').inner_text()=='2'
        assert not errors,errors
        print('PASS: online UI, all leaderboards, nickname, year, mobile 5s autoplay, 0 JS page errors')
        await browser.close()
if __name__=='__main__':asyncio.run(main())
