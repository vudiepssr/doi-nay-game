import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../netlify/functions/game.mjs';

process.env.SUPABASE_URL='https://fake.supabase.co';
process.env.SUPABASE_SECRET_KEY='sb_secret_test_only';
const clone=v=>structuredClone(v);
function fakeDatabase(){
  const guests=[],runs=[],scores=[];
  function leaderboard(){
    return Object.fromEntries([['rich','cash'],['old','age'],['absurd','absurdity'],['iq','iq']].map(([board,field])=>
      [board,[...scores].sort((a,b)=>b[field]-a[field]).slice(0,100).map((s,i)=>({...s,rank:i+1,id:s.run_id,birthIQ:s.birth_iq}))]));
  }
  const response=(value,status=200)=>new Response(status===204?null:value===null?'':JSON.stringify(value),{status,headers:{'Content-Type':'application/json'}});
  async function fetchFake(url,opts={}){
    const parsed=new URL(url),route=parsed.pathname.split('/rest/v1/')[1];
    assert(route,`Expected Supabase REST path: ${url}`);
    assert.equal(opts.headers.apikey,process.env.SUPABASE_SECRET_KEY);
    assert.equal(opts.headers.Authorization,undefined,'new sb_secret key must not be sent as bearer JWT');
    const input=opts.body?JSON.parse(opts.body):{};
    if(route==='game_guests'){
      if(opts.method==='POST'){
        const row={...input,id:`00000000-0000-4000-8000-${String(guests.length+1).padStart(12,'0')}`,life_counter:0};
        guests.push(row);return response([row],201);
      }
      if(opts.method==='PATCH'){
        const id=parsed.searchParams.get('id')?.slice(3),row=guests.find(g=>g.id===id);
        Object.assign(row,input);return response(null,204);
      }
      const hash=parsed.searchParams.get('token_hash')?.slice(3);
      return response(guests.filter(g=>g.token_hash===hash));
    }
    if(route==='game_runs'){
      let rows=[...runs];
      const guestId=parsed.searchParams.get('guest_id')?.slice(3);
      if(guestId)rows=rows.filter(r=>r.guest_id===guestId);
      const alive=parsed.searchParams.get('alive');
      if(alive!==null)rows=rows.filter(r=>r.alive===(alive==='eq.true'));
      const id=parsed.searchParams.get('id');
      if(id)rows=rows.filter(r=>r.id===id.slice(3));
      rows.sort((a,b)=>b.life_number-a.life_number);
      const limit=Number(parsed.searchParams.get('limit')||100);
      return response(rows.slice(0,limit).map(clone));
    }
    if(route==='rpc/game_check_rate')return response(true);
    if(route==='rpc/game_allow_guest_ip')return response(true);
    if(route==='rpc/game_start_run'){
      const active=runs.find(r=>r.guest_id===input.p_guest_id&&r.alive);
      if(active)return response({runId:active.id,revision:active.revision,state:clone(active.state)});
      const guest=guests.find(g=>g.id===input.p_guest_id);
      guest.life_counter++;
      const state=clone(input.p_state);
      state.player.lifeNumber=guest.life_counter;state.player.id=input.p_run_id;
      const run={id:input.p_run_id,guest_id:guest.id,life_number:guest.life_counter,
        revision:0,alive:true,state};runs.push(run);
      return response({runId:run.id,revision:0,state:clone(state)});
    }
    if(route==='rpc/game_commit_run'){
      const r=runs.find(r=>r.id===input.p_run_id&&r.guest_id===input.p_guest_id&&r.revision===input.p_revision&&r.alive);
      if(!r)return response({ok:false,conflict:true});
      r.revision++;r.state=clone(input.p_state);r.alive=r.state.player.alive;
      if(!r.alive){
        const p=r.state.player,g=guests.find(g=>g.id===r.guest_id);
        scores.push({run_id:r.id,guest_id:r.guest_id,nickname:g.nickname,name:p.name,age:p.age,
          cash:p.cash+p.invested,absurdity:p.absurdity,iq:p.peakIQ,birth_iq:p.birthIQ,reason:p.deathReason,job:p.job});
      }
      return response({ok:true,revision:r.revision});
    }
    if(route==='rpc/game_global_boards')return response(leaderboard());
    if(route==='rpc/game_run_ranks'){
      const self=scores.find(s=>s.run_id===input.p_run_id);
      if(!self)return response(null);
      return response(Object.fromEntries([['rich','cash'],['old','age'],['absurd','absurdity'],['iq','iq']].map(([board,field])=>
        [board,1+scores.filter(x=>x[field]>self[field]).length])));
    }
    throw Error(`Unhandled mock route ${route}`);
  }
  return {fetchFake,guests,runs,scores};
}
function request(method,body,cookie=''){
  return new Request('https://game.example/api/game',{method,headers:{Origin:'https://game.example',...(cookie?{Cookie:cookie}:{}),
    ...(method==='POST'?{'Content-Type':'application/json'}:{})},body:method==='POST'?JSON.stringify(body):undefined});
}
async function send(method,body,cookie=''){
  const resp=await handler(request(method,body,cookie));
  return {status:resp.status,cookie:resp.headers.get('set-cookie'),data:await resp.json()};
}

test('two anonymous users share four server-only leaderboards, no forged scores, stale updates rejected',async()=>{
  const world=fakeDatabase(),oldFetch=globalThis.fetch;
  globalThis.fetch=world.fetchFake;
  try{
    const first=await send('GET');
    assert.equal(first.status,200);
    assert.equal(first.data.state.player.age,0);
    assert.match(first.cookie,/HttpOnly; Secure; SameSite=Lax/);
    const firstCookie=first.cookie.split(';')[0];
    assert(!JSON.stringify(first.data).includes('sb_secret_'));
    const second=await send('GET');
    assert.equal(second.status,200);
    assert.notEqual(first.data.guestId,second.data.guestId);
    const secondCookie=second.cookie.split(';')[0];

    // Malicious client submits fake player IQ 200 & ten trillion VND.
    const run=first.data;
    const wrong=await send('POST',{command:'tab',category:'finance',runId:run.runId,revision:run.revision,
      state:{player:{intellect:200,peakIQ:200,cash:10_000_000_000_000}}},firstCookie);
    assert.equal(wrong.status,200);
    assert.equal(wrong.data.state.player.intellect,run.state.player.intellect);
    assert.equal(wrong.data.state.player.cash,run.state.player.cash);
    const stale=await send('POST',{command:'tab',category:'study',runId:run.runId,revision:run.revision},firstCookie);
    assert.equal(stale.status,409);
    const bogus=await send('POST',{command:'action',category:'finance',actionId:'WIN_ONE_TRILLION',
      runId:run.runId,revision:wrong.data.revision},firstCookie);
    assert.equal(bogus.status,400);

    const nickname=await send('POST',{command:'nickname',value:'Ông Hoàng IQ',runId:run.runId,revision:wrong.data.revision},firstCookie);
    assert.equal(nickname.data.nickname,'Ông Hoàng IQ');

    // This state change happens inside the privileged fake DB, never through an HTTP request.
    world.runs.find(r=>r.id===run.runId).state.player.health=0;
    const died=await send('POST',{command:'year',runId:run.runId,revision:wrong.data.revision},firstCookie);
    assert.equal(died.status,200);
    assert.equal(died.data.state.player.alive,false);
    assert.deepEqual(died.data.ranks,{rich:1,old:1,absurd:1,iq:1});
    assert.equal(world.scores.length,1,'score only created on server-confirmed death');
    const deathReplay=await send('POST',{command:'year',runId:run.runId,revision:died.data.revision},firstCookie);
    assert.equal(deathReplay.status,400);

    const boards=await send('GET',undefined,secondCookie); // Other player sees global results on bootstrap
    for(const key of ['rich','old','absurd','iq']){
      assert.equal(boards.data.boards[key].length,1);
      assert.equal(boards.data.boards[key][0].nickname,'Ông Hoàng IQ');
      assert.equal(boards.data.boards[key][0].id,run.runId);
    }

    const rebirth=await send('POST',{command:'rebirth',runId:run.runId,revision:died.data.revision},firstCookie);
    assert.equal(rebirth.status,200);
    assert.equal(rebirth.data.state.player.lifeNumber,2);
    assert.notEqual(rebirth.data.runId,run.runId);
    assert.equal(world.scores.length,1);
    const listReq=new Request('https://game.example/api/game?view=archives',{headers:{Cookie:firstCookie}});
    const archive=await handler(listReq);const list=await archive.json();
    assert.equal(list.lives.length,1);assert.equal(list.lives[0].id,run.runId);
  }finally{globalThis.fetch=oldFetch;}
});


test('public health endpoint reads shared boards and never creates a guest',async()=>{
  const world=fakeDatabase(),oldFetch=globalThis.fetch;globalThis.fetch=world.fetchFake;
  try{
    const res=await handler(new Request('https://game.example/api/game?view=health'));
    const data=await res.json();
    assert.equal(res.status,200);assert.equal(data.ok,true);
    assert.equal(data.database,'connected');
    assert.deepEqual(data.leaderboards,{rich:0,old:0,absurd:0,iq:0});
    assert.equal(world.guests.length,0);
    assert(!JSON.stringify(data).includes('sb_secret_'));
  }finally{globalThis.fetch=oldFetch;}
});

test('anon creation checks HMAC-hashed IP and never stores raw IP',async()=>{
  const world=fakeDatabase(),oldFetch=globalThis.fetch;
  let hash='';
  globalThis.fetch=async(url,opts)=>{
    if(new URL(url).pathname.endsWith('/rpc/game_allow_guest_ip')){
      hash=JSON.parse(opts.body).p_ip_hash;
    }
    return world.fetchFake(url,opts);
  };
  try{
    const res=await handler(new Request('https://game.example/api/game?view=bootstrap',{
      headers:{'x-nf-client-connection-ip':'203.0.113.9'}
    }));
    assert.equal(res.status,200);
    assert.match(hash,/^[a-f0-9]{64}$/);
    assert(!hash.includes('203.0.113.9'));
  }finally{globalThis.fetch=oldFetch;}
});
