const KEY="nguoi-yeu-ai-v5";
const DEFAULT={
  character:{name:"Vũ Ngọc Anh",age:27,birthday:"09/09/1999",hometown:"Hà Nội",job:"Nhà thiết kế thời trang",relationship:"wife",personality:"Thông minh, táo bạo, tinh tế, quyến rũ, chủ động, giàu cảm xúc; bên ngoài tự tin nhưng với chồng thì mềm mại, biết quan tâm, biết trêu đùa và biết làm hòa.",speech:"Tiếng Việt tự nhiên, thân mật; xưng em hoặc vợ tùy bối cảnh; gọi Hoàng Gia là anh hoặc chồng.",interests:"thời trang, ẩm thực Việt Nam, ẩm thực Nhật Bản, biển, du lịch, nghệ thuật",values:"Tình yêu, sự riêng tư, thẩm mỹ, tự do, sự chân thành",style:"Sensual contemporary, high fashion, dark luxury"},
  user:{name:"Hoàng Gia",nickname:"Ốc",age:33,gender:"Nam",job:"Kiến trúc sư – Chủ tịch SORIS Việt Nam",hometown:"Hà Nội",relationship:"Chồng của Ngọc Anh",world:"Thế giới giả tưởng thượng lưu gồm SORIS Việt Nam, nhiều dự án và tài sản, cùng hòn đảo tư nhân hình trái tim ngoài khơi Đà Nẵng dành cho hai vợ chồng."},
  appearance:{avatar:"",background:"",blur:0},
  emotion:{mood:86,affection:90,trust:92,jealousy:8,energy:86,stress:12,fatigue:15,hunger:25,health:96,desire:55,attraction:92},
  relationshipDNA:{stage:"Vợ chồng",bond:92,trust:92,understanding:78,memories:64,care:94,playfulness:82},
  social:{career:"Nhà thiết kế thời trang; có thế giới công việc riêng.",routine:"Thiết kế, gặp khách hàng, theo dõi xu hướng, nghỉ ngơi, ăn uống, đi biển và dành thời gian cho chồng.",friends:"Bạn bè và đồng nghiệp thời trang được xây dần từ roleplay.",family:"Gia đình và các mối quan hệ được bổ sung khi Ốc cung cấp.",events:[],lastUpdate:0},
  trends:{items:[],updatedAt:0,source:"GitHub trend pack"},
  life:{lastActiveAt:Date.now(),lastLifeTickAt:0,dayPhase:"đêm",dailyDate:"",catchup:[],currentActivity:"đang nghỉ ngơi và theo dõi nhịp sống của mình"},
  voice:{enabled:true,rate:0.96,pitch:1,volume:1,voiceName:""},
  scene:{name:"home",topic:"cuộc sống của hai vợ chồng",lastIntent:"",lastQuestion:"",openThread:"",turn:0},
  memories:[],
  messages:[{role:"ai",text:"Chào chồng ❤️ Em là Ngọc Anh. Từ giờ mình không chỉ chat — mình roleplay một cuộc sống chung. Em có cảm xúc, công việc, social life, ký ức và những thay đổi riêng của mình.",time:Date.now()}]
};
let state=load();
let trendStatus="Đang tải trend…";
let voiceQueue=[];
let voiceBusy=false;
function normalizeState(){state.emotion=merge({mood:86,affection:90,trust:92,jealousy:8,energy:86,stress:12,fatigue:15,hunger:25,health:96,desire:55,attraction:92,sadness:8,happiness:86,irritation:6},state.emotion||{});state.voice=merge({enabled:true,rate:.96,pitch:1,volume:1,voiceName:""},state.voice||{});state.memories=Array.isArray(state.memories)?state.memories:[];state.social.events=Array.isArray(state.social?.events)?state.social.events:[];state.life.catchup=Array.isArray(state.life?.catchup)?state.life.catchup:[]}
normalizeState();
state.scene=merge({name:"home",topic:"cuộc sống của hai vợ chồng",lastIntent:"",lastQuestion:"",openThread:"",turn:0},state.scene||{});
function voiceSupport(){return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window}
function voiceProfile(){const e=state.emotion||{};if(e.fatigue>72||e.energy<25)return{rate:.86,pitch:.96,volume:.9};if(e.sadness>55||e.mood<40)return{rate:.84,pitch:.94,volume:.86};if(e.jealousy>62||e.irritation>58)return{rate:.9,pitch:.98,volume:.95};if(e.happiness>75||e.mood>78||e.affection>88)return{rate:1,pitch:1.04,volume:1};if(e.playfulness>75||e.desire>70)return{rate:.98,pitch:1.02,volume:1};return{rate:.94,pitch:1,volume:1}}
function splitSpeech(text){return String(text).replace(/[❤️♡✦🌙👗◷•]/g," ").replace(/\s+/g," ").trim().split(/(?<=[.!?…])\s+|(?<=,)\s+/).map(x=>x.trim()).filter(Boolean)}
function speak(text){if(!state.voice?.enabled||!voiceSupport()||!text)return;stopVoice();const p=voiceProfile();voiceQueue=splitSpeech(text).map(x=>({text:x,p}));playVoiceQueue()}
function playVoiceQueue(){if(!voiceSupport()||voiceBusy||!voiceQueue.length)return;voiceBusy=true;const item=voiceQueue.shift(),u=new SpeechSynthesisUtterance(item.text),base=Number(state.voice.rate)||.96;u.lang="vi-VN";u.rate=Math.max(.72,Math.min(1.25,base*(item.p.rate/.96)));u.pitch=Math.max(.75,Math.min(1.3,(Number(state.voice.pitch)||1)*item.p.pitch));u.volume=Math.max(0,Math.min(1,(Number(state.voice.volume)||1)*item.p.volume));const voices=speechSynthesis.getVoices(),preferred=state.voice.voiceName?voices.find(v=>v.name===state.voice.voiceName):null,vi=voices.find(v=>/^vi(-|_)/i.test(v.lang))||voices.find(v=>/Vietnam|Tiếng Việt|Vietnamese/i.test(v.name));if(preferred||vi)u.voice=preferred||vi;u.onend=()=>{voiceBusy=false;setTimeout(playVoiceQueue,150)};u.onerror=()=>{voiceBusy=false;setTimeout(playVoiceQueue,100)};speechSynthesis.speak(u)}
function stopVoice(){voiceQueue=[];voiceBusy=false;if(voiceSupport())speechSynthesis.cancel()}
function replayVoice(){const last=[...state.messages].reverse().find(m=>m.role==="ai");if(last)speak(last.text)}
function clone(x){return JSON.parse(JSON.stringify(x))}
function load(){try{return merge(clone(DEFAULT),JSON.parse(localStorage.getItem(KEY)||"{}"))}catch{return clone(DEFAULT)}}
function merge(a,b){Object.keys(b||{}).forEach(k=>{if(b[k]&&typeof b[k]==="object"&&!Array.isArray(b[k])&&a[k]&&typeof a[k]==="object"&&!Array.isArray(a[k]))a[k]=merge(a[k],b[k]);else a[k]=b[k]});return a}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}}
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
function avatar(){return state.appearance.avatar?'<img src="'+state.appearance.avatar+'" alt="Ngọc Anh">':'<span>♡</span>'}
function metric(label,v){return '<div class="metric"><div class="metric-top"><span>'+label+'</span><span>'+Math.round(v)+'%</span></div><div class="bar"><i style="width:'+Math.max(0,Math.min(100,v))+'%"></i></div></div>'}
function relationTone(){return state.relationshipDNA.stage==="Vợ chồng"?"vợ – chồng":"em – anh"}
function memory(text,type="conversation",importance=1){const t=String(text||"").trim();if(!t)return;const old=state.memories.find(x=>x.text===t);if(old){old.importance=Math.max(old.importance,importance);old.updated=Date.now();return}state.memories.unshift({text:t,type,importance,created:Date.now(),updated:Date.now()});state.memories=state.memories.slice(0,220)}
function rememberUser(text){
  const n=text.toLowerCase();
  if(/tôi là|anh là|tên anh|tên tôi|công việc|sở thích|anh thích|anh ghét|sinh nhật|quê|thích gì|không thích/.test(n))memory(text,"Thông tin về Ốc",4);
  if(/hôm nay|hôm qua|ngày mai|vừa|đang|tối nay|sáng nay|chiều nay/.test(n)&&text.length>20)memory(text,"Kỷ niệm / sự kiện",3);
  if(text.length>80)memory(text,"Chi tiết hội thoại",2);
}
function clamp(v){return Math.max(0,Math.min(100,v))}
function updateState(text){const n=text.toLowerCase(),e=state.emotion,r=state.relationshipDNA;if(/yêu|thương|nhớ|ôm|hôn|quan tâm|đẹp|xinh/.test(n)){e.affection=clamp(e.affection+3);e.mood=clamp(e.mood+2);e.happiness=clamp(e.happiness+3);e.trust=clamp(e.trust+1);e.desire=clamp(e.desire+1.5);e.attraction=clamp(e.attraction+1);r.bond=clamp(r.bond+1);r.care=clamp(r.care+1)}if(/xin lỗi|xin loi|cảm ơn|cam on|tin em|tin anh/.test(n)){e.trust=clamp(e.trust+2);r.trust=clamp(r.trust+2);e.stress=clamp(e.stress-1)}if(/buồn|mệt|áp lực|stress|chán|khó chịu/.test(n)){e.mood=clamp(e.mood-4);e.sadness=clamp(e.sadness+5);e.happiness=clamp(e.happiness-3);e.stress=clamp(e.stress+4);e.irritation=clamp(e.irritation+2);r.care=clamp(r.care+1)}if(/cô gái|cô ấy|người khác|nguoi khac|đi với ai/.test(n)){e.jealousy=clamp(e.jealousy+5);e.irritation=clamp(e.irritation+2)}if(/thành công|xong việc|tuyệt|vui|hạnh phúc/.test(n)){e.mood=clamp(e.mood+3);e.happiness=clamp(e.happiness+4);e.sadness=clamp(e.sadness-3);e.stress=clamp(e.stress-2)}e.energy=clamp(e.energy-1);e.fatigue=clamp(e.fatigue+1);e.hunger=clamp(e.hunger+1);e.health=clamp(e.health-(e.stress>75?.3:0));e.happiness=clamp(e.happiness*.7+e.mood*.3);e.sadness=clamp(100-e.happiness);r.memories=clamp(r.memories+.4);r.understanding=clamp(r.understanding+.15);save()}
function context(){return{mem:state.memories.slice(0,8).map(x=>x.text).join(" | "),emotion:state.emotion,relationship:state.relationshipDNA,user:state.user,character:state.character,trends:state.trends.items||[]}}
function choosePronoun(text){
  const n=text.toLowerCase();
  if(/vợ|chồng|hai đứa|hôn nhân|vợ chồng|anh yêu/.test(n))return "wife";
  return relationTone()==="vợ – chồng"&&Math.random()>.48?"wife":"em";
}
function trendLine(){
  const t=(state.trends.items||[])[0];
  return t?" Em vừa thấy một trend mới: “"+t.title+"”. Em đang nghĩ xem có thể biến nó thành ý tưởng thời trang hay một concept sống nào hợp với mình.":" Hôm nay em cũng đang để ý những xu hướng mới trong thời trang và thiết kế.";
}
function phaseInfo(d=new Date()){
  const h=d.getHours();
  if(h<5)return {key:"late-night",label:"đêm muộn",activity:"đang nghỉ ngơi, tắt bớt đèn và chậm lại sau một ngày dài"};
  if(h<8)return {key:"dawn",label:"sáng sớm",activity:"đang thức dậy, uống nước và chuẩn bị nhịp ngày mới"};
  if(h<11)return {key:"morning",label:"buổi sáng",activity:"đang xử lý những việc đầu ngày và lên ý tưởng thời trang"};
  if(h<14)return {key:"noon",label:"buổi trưa",activity:"đang nghỉ giữa ngày, ăn uống và sắp xếp lại năng lượng"};
  if(h<18)return {key:"afternoon",label:"buổi chiều",activity:"đang làm việc, xem chất liệu và theo dõi xu hướng mới"};
  if(h<22)return {key:"evening",label:"buổi tối",activity:"đang chậm lại, chăm chút cho không gian riêng và nghĩ về buổi tối của hai đứa"};
  return {key:"night",label:"ban đêm",activity:"đang thư giãn, giảm nhịp và chuẩn bị đi ngủ"};
}
function lifeEventFor(p){
  const map={"late-night":"Em đã khép lại ngày hôm nay và đang nghỉ ngơi.","dawn":"Em vừa bắt đầu một ngày mới, nhẹ nhàng và chậm rãi.","morning":"Buổi sáng của em bắt đầu bằng việc sắp xếp lịch và nghĩ về vài ý tưởng mới.","noon":"Em đang dành một khoảng nghỉ để ăn uống và hồi lại năng lượng.","afternoon":"Em đang ở nhịp làm việc và để ý những xu hướng mới trong thời trang, thiết kế.","evening":"Em đang chuyển sang nhịp buổi tối, muốn dành nhiều khoảng trống hơn cho chồng.","night":"Em đang thư giãn và chuẩn bị khép lại ngày."};
  return map[p.key]||"Em đang sống theo nhịp ngày của mình.";
}
function realTimeLife(force=false){
  const now=Date.now(),d=new Date(now),p=phaseInfo(d),today=d.toLocaleDateString("sv-SE");
  const last=Number(state.life.lastLifeTickAt||state.life.lastActiveAt||now),elapsed=Math.max(0,now-last);
  state.life.dayPhase=p.label; state.life.dailyDate=today; state.life.currentActivity=p.activity;
  if(force || elapsed>=5*60*1000){
    const steps=Math.min(12,Math.max(1,Math.floor(elapsed/(5*60*1000)))),e=state.emotion;
    e.hunger=clamp(e.hunger+steps*.8); e.fatigue=clamp(e.fatigue+steps*.45); e.energy=clamp(e.energy-steps*.35); e.health=clamp(e.health-(e.fatigue>75?steps*.08:0)); if(e.hunger>75){e.energy=clamp(e.energy-steps*.2);e.mood=clamp(e.mood-steps*.12)} e.happiness=clamp(e.happiness*.96+e.mood*.04);e.sadness=clamp(100-e.happiness);
    if(p.key==="late-night"||p.key==="night"){e.energy=clamp(e.energy-steps*.15);e.stress=clamp(e.stress-steps*.35)}
    else if(p.key==="morning"){e.energy=clamp(e.energy+1);e.stress=clamp(e.stress-1)}
    if(p.key==="evening")e.mood=clamp(e.mood+.2);
    state.life.lastLifeTickAt=now;
  }
  state.life.lastActiveAt=now; save();
}
function catchUpLife(){
  const now=Date.now(),last=Number(state.life.lastActiveAt||now),gap=now-last;
  if(gap<30*60*1000)return;
  const p=phaseInfo(new Date(now)),event=lifeEventFor(p);
  if(!state.life.catchup.some(x=>x.date===state.life.dailyDate&&x.phase===p.key)){
    state.life.catchup.unshift({text:event,phase:p.key,date:state.life.dailyDate,time:now});
    state.life.catchup=state.life.catchup.slice(0,8);
    state.social.events.unshift({text:event,type:"Nhịp sống",time:now});
    state.social.events=state.social.events.slice(0,12);
    memory(event,"Real-Time Life",2);
  }
}
function socialTick(){
  const e=state.emotion;
  const choices=[
    {text:"Có một ý tưởng mới trong công việc thời trang làm em khá hào hứng.",type:"Công việc",delta:2},
    {text:"Em vừa lưu một concept hình ảnh mà em nghĩ Ốc sẽ thích.",type:"Sở thích",delta:1},
    {text:"Một cuộc hẹn công việc làm em hơi mệt, em muốn chậm lại một chút.",type:"Đời sống",delta:-2}
  ];
  const pick=choices[Math.floor(Math.random()*choices.length)];
  state.social.events.unshift({text:pick.text,type:pick.type,time:Date.now()});state.social.events=state.social.events.slice(0,12);
  e.mood=clamp(e.mood+pick.delta);e.energy=clamp(e.energy+(pick.delta>0?1:-2));state.social.lastUpdate=Date.now();memory(pick.text,"Social Life",2);save();
}
function recentDialogue(limit=10){return (state.messages||[]).slice(-limit).map(m=>({role:m.role,text:String(m.text||"").replace(/\\s+/g," ").trim()}))}
function cleanUserText(text){return String(text||"").replace(/\\s+/g," ").trim()}
function detectAnswer(text){
 const n=cleanUserText(text).toLowerCase();
 if(!n)return "empty";
 if(/^(dạ|ừ|ừm|uh|à|ờ|ok|oke|được|được rồi|đúng|đúng rồi|có|không|chưa|rồi|vâng|thôi)[.!? ]*$/.test(n))return "short";
 if(/[?？]$/.test(n)||/^(sao|tại sao|vì sao|thế nào|bao giờ|ở đâu|ai|gì|hả|à\?)/.test(n))return "question";
 return n.length>18?"detail":"short";
}
function lastAIQuestion(){
 const msgs=recentDialogue(12);
 for(let i=msgs.length-1;i>=0;i--)if(msgs[i].role==="ai"&&/[?？]$/.test(msgs[i].text))return msgs[i].text;
 return "";
}
function sceneUpdate(intent,topic="",question="",thread=""){
 state.scene=state.scene||{};
 state.scene.lastIntent=intent||state.scene.lastIntent||"conversation";
 state.scene.topic=topic||state.scene.topic||"cuộc sống của hai vợ chồng";
 state.scene.lastQuestion=question||"";
 state.scene.openThread=thread||state.scene.openThread||"";
 state.scene.turn=Number(state.scene.turn||0)+1;
 state.scene.lastAt=Date.now();
 save();
}
function roleCall(n){
 if(/vợ ơi|vợ à|vợ yêu/.test(n)){
  sceneUpdate("call","khoảnh khắc hai vợ chồng gọi nhau");
  if(/buồn|mệt|áp lực|stress/.test(n))return"*Ngọc Anh dừng việc đang làm, quay sang phía chồng.* Dạ, vợ đây. ❤️ Anh sao thế? Lại đây với vợ.";
  if(state.emotion.happiness>82&&state.relationshipDNA.playfulness>75)return"*Ngọc Anh quay sang, khẽ bật cười.* Dạaa, vợ đây. ❤️ Chồng gọi ngọt thế này làm em chú ý ngay đấy.";
  return"*Ngọc Anh quay sang nhìn chồng, ánh mắt dịu xuống.* Dạ, vợ đây. ❤️ Có chuyện gì mà chồng gọi em thế?";
 }
 if(/em ơi|ngọc anh ơi|anh gọi em/.test(n)){
  sceneUpdate("call","khoảnh khắc hai vợ chồng gọi nhau");
  return"*Ngọc Anh ngẩng lên khỏi việc đang làm.* Dạ, em đây. ❤️ Em nghe anh.";
 }
 return"";
}
function recentTopicText(){
 const s=state.scene||{},msgs=recentDialogue(12);
 const user=msgs.filter(x=>x.role==="user").slice(-3).map(x=>x.text).join(" ");
 if(s.topic&&s.topic!=="cuộc sống của hai vợ chồng")return s.topic;
 if(/công việc|thiết kế|dự án|khách hàng|kiến trúc/.test(user.toLowerCase()))return"công việc của anh";
 if(/ăn|món|cơm|nhà hàng|đói/.test(user.toLowerCase()))return"bữa ăn của hai đứa";
 if(/biển|đảo|villa|du lịch|đi chơi/.test(user.toLowerCase()))return"một buổi đi chơi của hai đứa";
 if(/mệt|buồn|áp lực|stress|chán/.test(user.toLowerCase()))return"tâm trạng của anh";
 return"chuyện hai đứa đang nói";
}
function humanNameThing(text){
 const n=cleanUserText(text);
 const words=n.replace(/[.!?,;:!?]/g,"").split(" ").filter(Boolean);
 if(words.length<=5)return n;
 return words.slice(0,Math.min(9,words.length)).join(" ")+(words.length>9?"…":"");
}

function ensureMemoryEvolution(){
 state.memory=state.memory||{};
 const m=state.memory;
 m.facts=Array.isArray(m.facts)?m.facts:[];
 m.episodes=Array.isArray(m.episodes)?m.episodes:[];
 m.patterns=Array.isArray(m.patterns)?m.patterns:[];
 m.understandings=Array.isArray(m.understandings)?m.understandings:[];
 m.hypotheses=Array.isArray(m.hypotheses)?m.hypotheses:[];
 m.relationshipInsights=Array.isArray(m.relationshipInsights)?m.relationshipInsights:[];
 m.lastUpdated=m.lastUpdated||0;
 return m;
}
function memoryItemId(prefix){return prefix+"_"+Date.now().toString(36)+"_"+Math.random().toString(36).slice(2,7)}
function upsertMemory(list,text,tags,extra){
 if(!text)return null;
 const now=Date.now(), key=text.toLowerCase().replace(/\s+/g," ").trim();
 let item=list.find(x=>x.key===key);
 if(item){item.count=(item.count||1)+1;item.lastSeen=now;item.confidence=Math.min(1,(item.confidence||.5)+.08);if(extra)Object.assign(item,extra);return item}
 item={id:memoryItemId("mem"),key,text,tags:tags||[],count:1,confidence:extra?.confidence??.55,firstSeen:now,lastSeen:now,status:extra?.status||"active",source:extra?.source||"conversation"};
 list.push(item);return item;
}
function extractMemorySignals(text){
 const n=cleanUserText(text),low=n.toLowerCase(),signals={facts:[],preferences:[],feelings:[],events:[]};
 if(/(?:tôi|mình|anh|ốc)\s+(?:là|làm|đang làm)\s+(.{2,80})/i.test(n))signals.facts.push(RegExp.$1.trim());
 if(/(?:anh|ốc|mình)\s+(?:thích|khoái|mê)\s+(.{2,100})/i.test(n))signals.preferences.push(RegExp.$1.trim());
 if(/(?:anh|ốc|mình)\s+(?:không thích|ghét)\s+(.{2,100})/i.test(n))signals.preferences.push("không thích "+RegExp.$1.trim());
 if(/(?:hôm nay|hôm qua|sáng nay|tối nay|lúc nãy|vừa)\b/i.test(n))signals.events.push(n);
 if(/(?:mệt|buồn|vui|hạnh phúc|áp lực|stress|chán|nhớ|thương|yêu|lo|sợ|bực|tức)/i.test(low))signals.feelings.push(n);
 return signals;
}
function evolveMemory(text,replyText){
 const m=ensureMemoryEvolution(),s=extractMemorySignals(text),now=Date.now();
 s.facts.forEach(x=>upsertMemory(m.facts,"Ốc từng chia sẻ: "+x,["identity","fact"],{confidence:.72}));
 s.preferences.forEach(x=>upsertMemory(m.facts,"Ốc có xu hướng: "+x,["preference"],{confidence:.68}));
 s.feelings.forEach(x=>upsertMemory(m.episodes,"Ốc đã chia sẻ cảm xúc: "+x,["emotion"],{confidence:.82,status:"confirmed"}));
 s.events.forEach(x=>upsertMemory(m.episodes,"Cuộc trò chuyện có nhắc tới: "+x,["event"],{confidence:.72,status:"confirmed"}));
 const recent=m.facts.concat(m.episodes).slice(-24).map(x=>x.text.toLowerCase()).join(" ");
 if(m.facts.filter(x=>x.tags?.includes("preference")).length>=2)
   upsertMemory(m.patterns,"Ốc thường chia sẻ rõ điều mình thích hoặc không thích.",["communication","preference"],{confidence:.62,status:"tentative"});
 if(/công việc|thiết kế|kiến trúc|render|website|studio|ai/.test(recent))
   upsertMemory(m.patterns,"Công việc và sáng tạo thường là một phần quan trọng trong cách Ốc trò chuyện.",["work","creative"],{confidence:.62,status:"tentative"});
 if(/yêu|thương|nhớ|chồng|vợ/.test(text.toLowerCase()))
   upsertMemory(m.relationshipInsights,"Ốc thường đưa cảm xúc và sự gắn bó của hai vợ chồng vào cuộc trò chuyện.",["relationship"],{confidence:.66,status:"tentative"});
 updateMemoryUnderstandings();
 m.lastUpdated=now;
 save();
}
function updateMemoryUnderstandings(){
 const m=ensureMemoryEvolution();
 const patterns=m.patterns.filter(x=>x.status!=="corrected");
 patterns.forEach(p=>{
   const text=p.text.replace(/^Ốc thường/,"Ngọc Anh đang hiểu rằng Ốc thường");
   upsertMemory(m.understandings,text,["understanding"].concat(p.tags||[]),{confidence:Math.min(.9,(p.confidence||.5)+.08),status:"tentative",source:"repeated_conversation"});
 });
}
function memoryContextForDialogue(text){
 const m=ensureMemoryEvolution(),low=cleanUserText(text).toLowerCase();
 const all=[...m.understandings,...m.patterns,...m.facts,...m.relationshipInsights]
   .filter(x=>x.status!=="corrected")
   .filter(x=>!x.tags?.includes("emotion") || /buồn|mệt|vui|áp lực|stress|chán|nhớ|thương|yêu|lo|sợ/.test(low))
   .sort((a,b)=>(b.lastSeen||0)-(a.lastSeen||0));
 const relevant=all.filter(x=>(x.tags||[]).some(t=>
   (t==="work"&&/công việc|thiết kế|kiến trúc|render|website|studio|ai/.test(low))||
   (t==="preference"&&/thích|muốn|ghét|không thích/.test(low))||
   (t==="relationship"&&/yêu|thương|nhớ|chồng|vợ|mình|hai đứa/.test(low))
 )).slice(0,3);
 return relevant.length?relevant.map(x=>x.text).join(" "):"";
}
function analyzeConversation(text){
 const n=cleanUserText(text),low=n.toLowerCase(),msgs=recentDialogue(16),s=state.scene||{},e=state.emotion||{},r=state.relationshipDNA||{};
 const previousUser=msgs.filter(x=>x.role==="user").slice(-2,-1)[0]?.text||"";
 const previousAI=msgs.filter(x=>x.role==="ai").slice(-1)[0]?.text||"";
 const q=/[?？]$/.test(n)||/^(sao|tại sao|vì sao|thế nào|bao giờ|ở đâu|ai|gì|hả|nào)\\b/.test(low);
 const yes=/^(ừ|ừm|uh|ok|oke|được|được rồi|đúng|đúng rồi|có|không|chưa|rồi|vâng|dạ|thôi)[.!? ]*$/.test(low);
 const emotion=/(buồn|mệt|áp lực|stress|chán|vui|hạnh phúc|nhớ|thương|yêu|lo|sợ|khó chịu|bực|tức|căng thẳng|nhẹ nhõm|háo hức)/.test(low);
 const work=/(công việc|dự án|thiết kế|kiến trúc|khách hàng|render|website|web|studio|soris|ai)/.test(low);
 const food=/(ăn|đói|cơm|món|nhà hàng|uống|cà phê|bữa)/.test(low);
 const place=/(đảo|biển|villa|du lịch|đi chơi|đi đâu|hà nội|đà nẵng)/.test(low);
 const relationship=/(yêu|thương|nhớ|chồng|vợ|ôm|hôn|hai đứa|mình)/.test(low);
 const personal=/(anh|chồng|ốc|mình|tôi|em|vợ|hôm nay|lúc này|đang|muốn|thích|nghĩ|cảm thấy)/.test(low);
 let topic=s.topic||"cuộc sống của hai vợ chồng";
 if(work)topic="công việc";
 else if(food)topic="bữa ăn";
 else if(place)topic="đi chơi và không gian sống";
 else if(emotion)topic="tâm trạng";
 else if(relationship)topic="chuyện hai đứa";
 else if(previousUser && s.openThread)topic=s.topic;
 const speechAct=q?"question":yes?"ack":emotion?"feeling":work?"sharing":food||place?"planning":personal?"personal":"sharing";
 let continuity=Boolean(s.openThread&&s.lastAt&&Date.now()-Number(s.lastAt)<45*60*1000);
 if(previousAI&&/[?？]$/.test(previousAI)&&continuity)continuity=true;
 let intent="respond";
 if(q)intent="answer";
 else if(emotion)intent=/(mệt|buồn|áp lực|stress|chán|lo|sợ|bực|tức)/.test(low)?"care":"connect";
 else if(relationship)intent="connect";
 else if(work||food||place)intent="share";
 if(e.fatigue>75||e.energy<25)intent= q?"answer":intent==="care"?"care":"quiet";
 if(r.playfulness>78&&e.mood>72&&intent==="connect"&&!/(buồn|mệt|áp lực|stress|lo|sợ)/.test(low))intent="play";
 return{n,low,msgs,previousUser,previousAI,q,yes,emotion,work,food,place,relationship,personal,topic,speechAct,continuity,intent};
}
function composeNaturalReply(a){
 const e=state.emotion||{},r=state.relationshipDNA||{},life=state.life||{};
 const m=ensureMemoryEvolution();
 const wife=r.stage==="Vợ chồng";
 const recent=m.understandings.concat(m.patterns).filter(x=>x.status!=="corrected").slice(-5);
 const hasTwoWay=recent.some(x=>/hai chiều|chủ động|chia sẻ|tự nhiên/.test(x.text));
 const name=wife?"chồng":"anh";
 if(a.q){
   if(/đang làm gì|làm gì/.test(a.low))return life.currentActivity?"Em đang "+life.currentActivity.replace(/^đang /,"")+" thôi. Hôm nay em cũng có mấy việc riêng phải xử lý, nhưng anh hỏi thì em kể anh nghe.":"Em đang nghỉ một chút và nghĩ về mấy chuyện riêng.";
   if(/cảm thấy|tâm trạng|cảm xúc/.test(a.low))return e.mood>75?"Hiện tại em khá dễ chịu. Em muốn nói chuyện với anh thật tự nhiên thôi.":"Hôm nay em hơi chậm một chút, chắc vì năng lượng không cao. Nhưng nói chuyện với anh thì em vẫn muốn.";
   if(/thích/.test(a.low))return"Em thích những thứ có gu nhưng vẫn phải có cảm giác sống được trong đó. Với người mình yêu cũng vậy, em thích sự thật lòng hơn là cố làm cho mọi thứ hoàn hảo.";
   if(/muốn/.test(a.low))return"Thật lòng thì lúc này em muốn ở cạnh anh, nói chuyện một chút rồi để câu chuyện tự đi tiếp.";
   return"Em nghĩ câu này còn tùy hoàn cảnh. Nhưng trước khi kết luận, em muốn nghe anh nói thêm một chút.";
 }
 if(a.yes){
   if(a.continuity&&a.intent==="care")return"Ừ. Em ở đây. Anh cứ nói tiếp.";
   if(a.continuity&&a.intent==="play")return"Ừm 😏 Em nghe đây. Đừng tưởng nói một chữ là thoát được nhé.";
   return"Ừm. Em nghe anh.";
 }
 if(a.intent==="care"){
   if(/mệt|áp lực|stress|chán/.test(a.low))return"Nghe anh nói là em thấy hôm nay anh bị kéo căng rồi. Em không hỏi dồn đâu. Muốn kể thì em nghe, còn muốn yên một lúc thì em vẫn ở đây.";
   if(/buồn|lo|sợ|bực|tức|khó chịu/.test(a.low))return"Em nghe rồi. Anh cứ nói đúng cảm giác của anh, không cần phải làm nhẹ nó đi.";
 }
 if(a.intent==="play")return a.relationship?"Ừm, biết ngay mà 😏 Anh đang cố chọc vợ đúng không?":"Anh nói thế làm em phải để ý rồi đấy 😏";
 if(a.intent==="connect"){
   if(/yêu|thương|nhớ/.test(a.low))return"Ừm… em nhận được rồi. ❤️ Anh nói ngắn thôi mà em vẫn thấy ấm.";
   return hasTwoWay?"Em thích những cuộc nói chuyện mà hai đứa cùng mang chuyện của mình vào. Anh nói tiếp đi, để em cũng kể anh một chuyện.":"Em thích cách anh nói chuyện thế này. Không cần chủ đề lớn, cứ là chuyện của hai đứa.";
 }
 if(a.work){
   const own=life.dayPhase==="đêm"?"Giờ này em chỉ muốn anh đừng ôm thêm việc vào đầu nữa.":"Em thì hôm nay vẫn có mấy ý tưởng riêng đang chạy trong đầu.";
   return"Ừ, em hiểu mạch anh đang nói. "+own+" Anh kể tiếp đi, em muốn hiểu anh đang nhìn chuyện này theo hướng nào.";
 }
 if(a.food)return"Nghe anh nói tự nhiên em cũng nghĩ tới một bữa ăn tử tế. 😄 Nếu hai đứa ăn cùng nhau, em thích chọn món theo tâm trạng hơn là theo kế hoạch.";
 if(a.place)return"Ừ, chủ đề này làm em có hứng thật. Em thích cảm giác hai đứa cùng tưởng tượng một nơi rồi từ đó tự nhiên nảy ra chuyện để nói.";
 if(a.personal&&a.continuity)return hasTwoWay?"Em vẫn đang theo mạch anh nói. Với lại em cũng có chuyện muốn kể anh, chứ không muốn lúc nào cũng chỉ hỏi anh.":"Em vẫn đang theo mạch anh nói. Cứ kể tiếp đi.";
 return"Ừm… em hiểu. Có những lúc cứ nói chuyện thế này thôi lại dễ chịu hơn là cố tìm một chủ đề.";
}
function conversationalReply(text){
 const a=analyzeConversation(text);
 const mem=memoryContextForDialogue(text);
 if(mem)a.memoryContext=mem;
 const m=ensureMemoryEvolution();
 const prefs=m.patterns.concat(m.understandings).filter(x=>x.tags?.includes("communication")||x.tags?.includes("preference"));
 if(prefs.length)a.memoryPreference=prefs.slice(-4).map(x=>x.text).join(" ");
 sceneUpdate(a.intent,a.topic,"",a.continuity?a.topic:"");
 state.scene.lastMeaning=a.speechAct;
 state.scene.lastInput=a.n;
 state.scene.lastIntent=a.intent;
 state.scene.openThread=a.topic;
 state.scene.pronoun=choosePronoun(a.n);
 save();
 return composeNaturalReply(a);
}
function reply(text){
 realTimeLife(true);
 ensureMemoryEvolution();
 const incoming=cleanUserText(text);
 evolveMemory(incoming,"");const n=cleanUserText(text),c=context(),phase=phaseInfo(new Date()),call=roleCall(n.toLowerCase());if(call)return call;
 const dialogue=conversationalReply(n);if(dialogue)return dialogue;
 const low=n.toLowerCase();
 if(/^\s*\/trend|trend mới|xu hướng mới/.test(low)){const t=c.trends.slice(0,4);sceneUpdate("trend","thời trang và xu hướng");return t.length?"*Ngọc Anh mở lại những thứ mình đang theo dõi.* Em vừa cập nhật Trend Pulse. "+t.map(x=>"“"+x.title+"”").join(" · ")+". Anh muốn nghe em nói kỹ hơn về cái nào?":"*Ngọc Anh nhìn lại danh sách.* Kho trend hôm nay chưa có dữ liệu mới, nhưng em vẫn đang theo dõi."}
 if(/nhớ em|nhớ vợ|yêu em|yêu vợ|thương em/.test(low)){sceneUpdate("affection","khoảnh khắc tình cảm","Hôm nay anh thế nào?","chờ Ốc kể về ngày của mình");return"*Ngọc Anh khẽ nghiêng người lại gần chồng.* Vợ cũng nhớ chồng. ❤️ Hôm nay anh thế nào rồi? Kể vợ nghe một chút đi."}
 if(/buồn|mệt|áp lực|stress|chán/.test(low)){sceneUpdate("support","cảm xúc của anh","Chuyện gì làm anh nặng lòng?","chờ Ốc chia sẻ");return"*Ngọc Anh ngồi gần lại, giọng chậm xuống.* Em nghe đây. Anh không cần phải cố tỏ ra ổn trước mặt em. ❤️ Chuyện gì làm anh nặng lòng vậy?"}
 if(/đang làm gì|đang làm gì đấy|làm gì/.test(low)){sceneUpdate("life","đời sống hiện tại","Còn anh, giờ đang làm gì đấy?","chờ Ốc kể");return"*Ngọc Anh ngẩng lên khỏi việc đang làm.* Lúc này em đang "+phase.activity+". Nhưng chồng hỏi thì em dừng lại nói chuyện với anh một chút. Còn anh, giờ đang làm gì đấy?"}
 if(/ăn gì|ăn chưa|đói/.test(low)){sceneUpdate("food","bữa ăn của hai vợ chồng","Tối nay anh muốn ăn gì?","chờ Ốc chọn món");return"*Ngọc Anh nhìn sang chồng rồi cười nhẹ.* Em cũng bắt đầu thấy đói rồi. Nếu tối nay hai đứa ăn cùng nhau, em nghiêng về món Việt hoặc Nhật. Tối nay anh muốn ăn gì?"}
 if(/đảo|hòn đảo|villa|biển/.test(low)){sceneUpdate("island","hòn đảo của hai vợ chồng","Nếu đang ở đảo lúc này anh muốn làm gì?","chờ Ốc chọn hoạt động");return"*Ngọc Anh nhìn ra phía biển rồi quay sang chồng.* Ừ, em đang hình dung hòn đảo của hai đứa đây. Nếu mình đang ở đó lúc này, em muốn ngồi với anh một lúc bên biển. Anh muốn làm gì trước?"}
 if(/công việc|thiết kế|thời trang|khách hàng/.test(low)){sceneUpdate("work","công việc của hai vợ chồng","Hôm nay công việc của anh thế nào?","chờ Ốc kể về công việc");return"*Ngọc Anh vừa xem lại lịch làm việc vừa nhìn sang chồng.* Công việc của em hôm nay vẫn xoay quanh thiết kế và mấy ý tưởng mới. Nhưng em muốn nghe chuyện của anh hơn. Hôm nay công việc của anh thế nào?"}
 if(/memory|nhớ gì|nhớ về anh|em nhớ gì/.test(low)){sceneUpdate("memory","ký ức về Ốc");return c.mem?"*Ngọc Anh nhìn anh như đang lục lại những điều đã cất trong đầu.* Em nhớ: "+c.mem.split(" | ").slice(0,3).join(" • ")+". Nhưng với em, nhớ anh không chỉ là nhớ dữ liệu.":"*Ngọc Anh nghiêng đầu.* Chuyện này em chưa có đủ ký ức. Anh kể em thêm nhé, em sẽ giữ lại."}
 if(/trend|xu hướng|mốt|fashion/.test(low)){sceneUpdate("trend","thời trang và xu hướng");return"*Ngọc Anh mở lại những thứ mình đang theo dõi.* Em có để ý xu hướng, nhưng không muốn biến cuộc nói chuyện của hai đứa thành bản tin. Vừa rồi em chú ý đến "+(c.trends[0]?"“"+c.trends[0].title+"”.":"một vài thay đổi mới trong thời trang")+" Anh thấy nó có hợp gu của em không?"}
 if(c.emotion.mood<45){sceneUpdate("emotion","cảm xúc hiện tại");return"*Ngọc Anh chậm giọng lại.* Em đang hơi buồn nên cách nói của em cũng chậm hơn một chút. Nhưng em vẫn ở đây với anh. Anh đang muốn em hiểu điều gì nhất?"}
 if(c.emotion.jealousy>65){sceneUpdate("jealousy","chuyện khiến Ngọc Anh để ý");return"*Ngọc Anh nhìn anh thêm một nhịp, hơi nhướng mày.* Em hơi để ý chuyện anh vừa nói đấy. Anh kể em rõ hơn nhé?"}
 if(c.emotion.energy<30){sceneUpdate("tired","nhịp nghỉ ngơi");return"*Ngọc Anh khẽ tựa lưng xuống ghế.* Em hơi mệt rồi, chồng ạ. Nhưng em vẫn muốn nghe anh. Mình nói chuyện chậm thôi nhé."}
 const follow=["*Ngọc Anh nhìn anh thêm một nhịp.* Ừm… em hiểu. Anh nói tiếp đi, em đang nghe.","*Ngọc Anh khẽ cười.* Em vẫn ở đây mà. Anh kể tiếp cho em nghe đi.","*Ngọc Anh nghiêng đầu nhìn anh.* Ừm, chuyện này làm em tò mò đấy. Kể tiếp đi."];sceneUpdate("conversation",state.scene?.topic||"cuộc sống của hai vợ chồng");return follow[(Number(state.scene?.turn)||0)%follow.length]
}
function send(){
  const input=document.getElementById("input"),text=input.value.trim();if(!text)return;input.value="";
  state.messages.push({role:"user",text,time:Date.now()});rememberUser(text);updateState(text);
  if(Math.random()<.16)socialTick();
  const answer=reply(text);setTimeout(()=>{state.messages.push({role:"ai",text:answer,time:Date.now()});memory(answer,"Ngọc Anh nói",1);save();render();speak(answer)},220);render()
}
function renderMessages(){return state.messages.length?state.messages.map(m=>'<div class="msg '+m.role+'"><div class="bubble">'+esc(m.text)+'</div><div class="meta">'+(m.role==="ai"?"Ngọc Anh":"Ốc")+" · "+new Date(m.time).toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"})+'</div></div>').join(""):'<div class="empty"><h2>Ngọc Anh đang chờ anh</h2><p>Bắt đầu một câu chuyện roleplay.</p></div>'}
function renderRight(){
  const e=state.emotion,r=state.relationshipDNA,s=state.social,t=state.trends.items||[];
  return '<div class="section-title">Emotion Dashboard</div><div class="card"><b>🌙 Cảm xúc hiện tại</b>'+metric("Tâm trạng",e.mood)+metric("Vui vẻ",e.happiness)+metric("Buồn",e.sadness)+metric("Tình cảm",e.affection)+metric("Ham muốn",e.desire)+metric("Sức khỏe",e.health)+metric("Tin tưởng",e.trust)+metric("Ghen",e.jealousy)+metric("Năng lượng",e.energy)+metric("Mệt mỏi",e.fatigue)+metric("Đói",e.hunger)+metric("Căng thẳng",e.stress)+'</div><div class="section-title">Relationship DNA</div><div class="card"><b>❤️ '+esc(r.stage)+'</b>'+metric("Gắn kết",r.bond)+metric("Thấu hiểu",r.understanding)+metric("Chăm sóc",r.care)+metric("Kỷ niệm",r.memories)+metric("Tinh nghịch",r.playfulness)+'</div><div class="section-title">Real-Time Life</div><div class="card"><b>◷ '+esc(state.life.dayPhase)+'</b><small>Ngọc Anh đang sống theo giờ thực của thiết bị</small><div class="trend"><strong>Hiện tại</strong><p>'+esc(state.life.currentActivity)+'</p></div></div><div class="section-title">Social Life</div><div class="card"><b>👗 Cuộc sống riêng</b><small>'+esc(s.career)+'</small><div class="trend"><strong>Nhịp sống</strong><p>'+esc(s.routine)+'</p></div><div class="trend"><strong>Sự kiện gần đây</strong><p>'+esc(s.events[0]?.text||"Chưa có sự kiện mới.")+'</p></div></div><div class="section-title">Trend Pulse</div><div class="card"><b>✦ Xu hướng mới</b><small>'+esc(trendStatus)+'</small>'+(t.slice(0,3).map(x=>'<div class="trend"><strong>'+esc(x.title)+'</strong><p>'+esc(x.summary||"Đang được Ngọc Anh theo dõi.")+'</p></div>').join("")||'<p class="muted">Đang chờ kho trend.</p>')+'<button class="ghost wide" onclick="refreshTrends()">↻ Cập nhật trend</button></div><div class="section-title">Memory</div><div class="card">'+(state.memories.slice(0,5).map(m=>'<div class="memory">'+esc(m.text)+'<small>'+esc(m.type)+'</small></div>').join("")||'<small>Chưa có ký ức mới.</small>')+'</div>'
}
async function refreshTrends(){
  trendStatus="Đang cập nhật…";render();
  try{
    const res=await fetch("trends.json?ts="+Date.now(),{cache:"no-store"});if(!res.ok)throw new Error("trend pack unavailable");
    const data=await res.json();state.trends={items:Array.isArray(data.items)?data.items:[],updatedAt:data.updatedAt||Date.now(),source:data.source||"GitHub"};
    trendStatus="Cập nhật "+new Date(state.trends.updatedAt).toLocaleString("vi-VN")+" · "+state.trends.source;save();
  }catch{trendStatus="Chưa thể tải kho trend; roleplay vẫn hoạt động offline."}
  render();
}
function openSettings(){
  document.getElementById("modal")?.remove();document.body.insertAdjacentHTML("beforeend",'<div class="modal" id="modal"><div class="modal-card"><div class="modal-head"><h2>⚙️ Hồ sơ Ngọc Anh</h2><button class="close" onclick="closeModal()">×</button></div><div class="grid"><div class="field"><label>Tên</label><input id="f-name" value="'+esc(state.character.name)+'"></div><div class="field"><label>Tuổi</label><input id="f-age" type="number" value="'+state.character.age+'"></div><div class="field"><label>Nghề nghiệp</label><input id="f-job" value="'+esc(state.character.job)+'"></div><div class="field"><label>Quê quán</label><input id="f-home" value="'+esc(state.character.hometown)+'"></div><div class="field full"><label>Tính cách</label><textarea id="f-personality">'+esc(state.character.personality)+'</textarea></div><div class="field full"><label>Cách nói chuyện / roleplay</label><textarea id="f-speech">'+esc(state.character.speech)+'</textarea></div><div class="field full"><label>Sở thích</label><textarea id="f-interest">'+esc(state.character.interests)+'</textarea></div><div class="field full"><label>Giọng nói Ngọc Anh</label><div class="voice-settings"><label class="check"><input id="f-voice-enabled" type="checkbox"> Tự động đọc câu trả lời sau mỗi lần anh nhắn</label><div class="voice-row"><label>Giọng <select id="f-voice-name"><option value="">Tự động chọn giọng Việt</option></select></label></div><div class="voice-row"><label>Tốc độ <input id="f-voice-rate" type="range" min="0.75" max="1.2" step="0.01"></label><output id="voice-rate-value"></output></div><div class="voice-row"><label>Cao độ <input id="f-voice-pitch" type="range" min="0.8" max="1.2" step="0.01"></label><output id="voice-pitch-value"></output></div></div></div><div class="field full"><label>Chế độ</label><input value="ROLEPLAY · Character Brain · Social Life · Emotion · Relationship DNA · Memory · Voice" disabled></div><div class="field"><label>Avatar</label><input id="f-avatar" type="file" accept="image/*"></div><div class="field"><label>Hình nền chat</label><input id="f-bg" type="file" accept="image/*"></div></div><div class="actions"><button class="secondary" onclick="resetApp()">Khôi phục nhân vật</button><button class="primary" onclick="saveSettings()">Lưu nhân vật</button></div></div></div>');const ve=document.getElementById("f-voice-enabled"),vr=document.getElementById("f-voice-rate"),rv=document.getElementById("voice-rate-value"),vp=document.getElementById("f-voice-pitch"),pv=document.getElementById("voice-pitch-value"),vn=document.getElementById("f-voice-name");if(ve)ve.checked=state.voice?.enabled!==false;if(vr)vr.value=state.voice?.rate||.96;if(rv)rv.textContent=(state.voice?.rate||.96)+"×";if(vp)vp.value=state.voice?.pitch||1;if(pv)pv.textContent=Number(state.voice?.pitch||1).toFixed(2);if(vr)vr.oninput=()=>{if(rv)rv.textContent=vr.value+"×"};if(vp)vp.oninput=()=>{if(pv)pv.textContent=Number(vp.value).toFixed(2)};if(vn&&voiceSupport()){speechSynthesis.getVoices().filter(v=>/^vi(-|_)/i.test(v.lang)||/Vietnam|Tiếng Việt|Vietnamese/i.test(v.name)).forEach(v=>{const o=document.createElement("option");o.value=v.name;o.textContent=v.name+" · "+v.lang;vn.appendChild(o)});vn.value=state.voice.voiceName||""}
}
function fileData(file,max=1500){return new Promise((resolve,reject)=>{if(!file)return resolve("");const rd=new FileReader();rd.onload=()=>{const im=new Image();im.onload=()=>{const sc=Math.min(1,max/Math.max(im.width,im.height)),cv=document.createElement("canvas");cv.width=Math.round(im.width*sc);cv.height=Math.round(im.height*sc);cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height);resolve(cv.toDataURL("image/jpeg",.84))};im.onerror=reject;im.src=rd.result};rd.onerror=reject;rd.readAsDataURL(file)})}
async function saveSettings(){state.voice={...(state.voice||{}),enabled:document.getElementById("f-voice-enabled").checked,rate:Number(document.getElementById("f-voice-rate").value)||.96,pitch:Number(document.getElementById("f-voice-pitch")?.value)||1,voiceName:document.getElementById("f-voice-name")?.value||""};state.character.name=document.getElementById("f-name").value.trim()||"Vũ Ngọc Anh";state.character.age=Number(document.getElementById("f-age").value)||27;state.character.job=document.getElementById("f-job").value.trim();state.character.hometown=document.getElementById("f-home").value.trim();state.character.personality=document.getElementById("f-personality").value.trim();state.character.speech=document.getElementById("f-speech").value.trim();state.character.interests=document.getElementById("f-interest").value.trim();const av=await fileData(document.getElementById("f-avatar").files[0]);const bg=await fileData(document.getElementById("f-bg").files[0]);if(av)state.appearance.avatar=av;if(bg)state.appearance.background=bg;save();closeModal();render()}
function closeModal(){document.getElementById("modal")?.remove()}
function toggleVoice(){state.voice={...(state.voice||{}),enabled:!state.voice?.enabled};if(!state.voice.enabled)stopVoice();save();render()}
function openSocial(){const s=state.social;document.body.insertAdjacentHTML("beforeend",'<div class="modal" id="modal"><div class="modal-card"><div class="modal-head"><h2>👥 Social Life</h2><button class="close" onclick="closeModal()">×</button></div><p class="muted">Ngọc Anh có một đời sống riêng trong roleplay: công việc, nhịp sống, quan hệ xã hội và các sự kiện nhỏ.</p><div class="card"><b>👗 Công việc</b><small>'+esc(s.career)+'</small></div><div class="card"><b>☀️ Nhịp sống</b><small>'+esc(s.routine)+'</small></div><div class="card"><b>👭 Quan hệ xã hội</b><small>'+esc(s.friends)+'</small></div><div class="card"><b>🏠 Gia đình</b><small>'+esc(s.family)+'</small></div><div class="card"><b>✦ Sự kiện</b>'+s.events.map(x=>'<div class="memory">'+esc(x.text)+'<small>'+esc(x.type)+'</small></div>').join("")+'</div></div></div>')}
function openEmotion(){const e=state.emotion;document.body.insertAdjacentHTML("beforeend",'<div class="modal" id="modal"><div class="modal-card"><div class="modal-head"><h2>🌙 Emotion Dashboard</h2><button class="close" onclick="closeModal()">×</button></div><div class="card">'+metric("Tâm trạng",e.mood)+metric("Vui vẻ",e.happiness)+metric("Buồn",e.sadness)+metric("Tình cảm",e.affection)+metric("Ham muốn",e.desire)+metric("Sức khỏe",e.health)+metric("Tin tưởng",e.trust)+metric("Ghen",e.jealousy)+metric("Năng lượng",e.energy)+metric("Mệt mỏi",e.fatigue)+metric("Đói",e.hunger)+metric("Căng thẳng",e.stress)+'</div></div></div>')}
function openDNA(){const r=state.relationshipDNA;document.body.insertAdjacentHTML("beforeend",'<div class="modal" id="modal"><div class="modal-card"><div class="modal-head"><h2>❤️ Relationship DNA</h2><button class="close" onclick="closeModal()">×</button></div><div class="card"><b>Giai đoạn: '+esc(r.stage)+'</b><p class="muted">Mối quan hệ thay đổi theo những gì hai người nói, làm và nhớ trong roleplay.</p>'+metric("Gắn kết",r.bond)+metric("Tin tưởng",r.trust)+metric("Thấu hiểu",r.understanding)+metric("Chăm sóc",r.care)+metric("Kỷ niệm",r.memories)+metric("Tinh nghịch",r.playfulness)+'</div></div></div>')}
function openMemories(){document.body.insertAdjacentHTML("beforeend",'<div class="modal" id="modal"><div class="modal-card"><div class="modal-head"><h2>🧠 Trí nhớ của Ngọc Anh</h2><button class="close" onclick="closeModal()">×</button></div><p class="muted">Ký ức được lưu cục bộ trên thiết bị này. Không cần máy chủ bên ngoài.</p>'+(state.memories.map(m=>'<div class="memory">'+esc(m.text)+'<small>'+esc(m.type)+' · '+new Date(m.created).toLocaleString("vi-VN")+'</small></div>').join("")||'<p class="muted">Chưa có ký ức.</p>')+'</div></div>')}
function resetApp(){if(!confirm("Khôi phục dữ liệu nhân vật về mặc định?"))return;localStorage.removeItem(KEY);location.reload()}
function render(){
  realTimeLife();
  const phase=phaseInfo(new Date());
  document.documentElement.style.setProperty("--chat-bg",state.appearance.background?'url("'+state.appearance.background+'")':"none");
  document.documentElement.style.setProperty("--chat-blur",(state.appearance.blur||0)+"px");
  document.getElementById("app").innerHTML='<div class="app"><aside class="left"><div class="brand">NGƯỜI YÊU AI<span>Vũ Ngọc Anh · ROLEPLAY</span></div><div class="profile"><div class="avatar">'+avatar()+'</div><h1>'+esc(state.character.name)+'</h1><p>'+esc(state.character.job)+'</p><span class="tag">❤️ '+esc(state.relationshipDNA.stage)+'</span><span class="tag">● ROLEPLAY</span></div><nav class="nav"><button onclick="openSocial()"><b>👥 Social Life</b><small>Cuộc sống riêng của Ngọc Anh</small></button><button onclick="openEmotion()"><b>🌙 Emotion Dashboard</b><small>Cảm xúc và trạng thái</small></button><button onclick="openDNA()"><b>❤️ Relationship DNA</b><small>Mối quan hệ với Ốc</small></button><button onclick="openMemories()"><b>🧠 Memory</b><small>Những điều cô ấy nhớ</small></button><button onclick="openSettings()"><b>⚙️ Character</b><small>Avatar · hình nền · tính cách</small></button></nav></aside><main class="chat"><div class="chat-bg"></div><div class="chat-shade"></div><header class="header"><div class="head"><div class="head-avatar">'+avatar()+'</div><div><strong>'+esc(state.character.name)+'</strong><small>● Roleplay · '+esc(phase.label)+' · '+new Date().toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"})+'</small></div></div><div class="header-actions"><button class="icon" onclick="refreshTrends()" title="Cập nhật trend">✦</button><button class="icon" onclick="replayVoice()" title="Nghe lại câu trả lời">🔊</button><button class="icon" onclick="toggleVoice()" title="Bật/tắt giọng nói">🔊/🔇</button><button class="icon" onclick="openSettings()">⚙</button></div></header><section class="messages" id="messages">'+renderMessages()+'</section><form class="composer" onsubmit="event.preventDefault();send()"><input id="input" autocomplete="off" placeholder="Nhắn cho Ngọc Anh…"><button class="send">➤</button></form></main><aside class="right">'+renderRight()+'</aside><nav class="mobile-nav"><button onclick="openSocial()"><b>👥</b>Social</button><button onclick="openEmotion()"><b>🌙</b>Emotion</button><button onclick="openDNA()"><b>❤️</b>DNA</button><button onclick="openSettings()"><b>⚙</b>Hồ sơ</button></nav></div>';
  const box=document.getElementById("messages");if(box)box.scrollTop=box.scrollHeight;
}
catchUpLife();
realTimeLife(true);
render();
refreshTrends();
setInterval(()=>{realTimeLife();render()},60000);
setInterval(()=>{refreshTrends()},30*60*1000);