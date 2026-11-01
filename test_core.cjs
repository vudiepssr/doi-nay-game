const fs=require('fs'),vm=require('vm'),assert=require('assert');
const raw=fs.readFileSync(__dirname+'/play.html','utf8');
const script=raw.split('  <script>\n')[1].split('\n</script>')[0];
const store=new Map();
function open(){
  const elements=new Map();
  const mock={getElementById(id){if(!elements.has(id))elements.set(id,{innerHTML:'',value:'',textContent:'',scrollHeight:100,scrollTop:0});return elements.get(id);},addEventListener(){},createElement(){return {style:{},click(){},remove(){}}},body:{appendChild(){}}};
  const ctx=vm.createContext({document:mock,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},console,Math,Date,setTimeout:()=>0,clearTimeout(){},setInterval:()=>1,clearInterval(){},Blob:class{},URL:{createObjectURL:()=>'',revokeObjectURL(){}}});
  vm.runInContext(script,ctx);return ctx;
}
const ctx=open();
vm.runInContext("addLog(state.player,'Sự kiện không được mất','good');state.player.health=0;advanceYear(state);",ctx);
assert.strictEqual(vm.runInContext('state.player.alive',ctx),false);
const id=vm.runInContext('state.player.id',ctx);
const life=JSON.parse(store.get('doi-nay-life-archive-v1:'+id));
assert(life.history.some(x=>x.text.includes('không được mất')));
assert.strictEqual(life.history.at(-1).type,'death');
vm.runInContext('state=newGame()',ctx);
assert.strictEqual(vm.runInContext('listArchivedLives().length',ctx),1);
assert.strictEqual(vm.runInContext(`getArchivedLife('${id}').history.length`,ctx),life.history.length);
const ctx2=open();
assert.strictEqual(vm.runInContext('listArchivedLives().length',ctx2),1);
assert(vm.runInContext(`archiveDetailHTML('${id}')`,ctx2).includes('Sự kiện không được mất'));
console.log('PASS: death writes archive, full journal, rebirth retains archive, fresh load retains archive, archive list renders');
