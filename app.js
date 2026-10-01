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
  scene:{name:"home",topic:"cuộc sống của hai vợ chồng",mood:"ấm áp",lastIntent:"",lastQuestion:"",openThread:"",turn:0},
  voice:{enabled:true,rate:0.96,pitch:1,volume:1,voiceName:""},
  memories:[],
  messages:[{role:"ai",text:"Chào chồng ❤️ Em là Ngọc Anh. Từ giờ mình không chỉ chat — mình roleplay một cuộc sống chung. Em có cảm xúc, công việc, social life, ký ức và những thay đổi riêng của mình.",time:Date.now()}]
};
let state=load();
let trendStatus="Đang tải trend…";
let voiceQueue=[];
let voiceBusy=false;
function normalizeState(){state.emotion=merge({mood:86,affection:90,trust:92,jealousy:8,energy:86,stress:12,fatigue:15,hunger:25,health:96,desire:55,attraction:92,sadness:8,happiness:86,irritation:6},state.emotion||{});state.voice=merge({enabled:true,rate:.96,pitch:1,volume:1,voiceName:""},state.voice||{});state.memories=Array.isArray(state.memories)?state.memories:[];state.social.events=Array.isArray(state.social?.events)?state.social.events:[];state.life.catchup=Array.isArray(state.life?.catchup)?state.life.catchup:[]}
normalizeState();
state.scene=merge({name:"home",topic:"cuộc sống của hai vợ chồng",mood:"ấm áp",lastIntent:"",lastQuestion:"",openThread:"",turn:0},state.scene||{});
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
function context(){
  const recent=state.messages.slice(-8);
  return {
    mem:state.memories.slice(0,8).map(x=>x.text).join(" | "),
    recent,
    lastAI:[...state.messages].reverse().find(x=>x.role==="ai")?.text||"",
    lastUser:[...state.messages].reverse().find(x=>x.role==="user")?.text||"",
    emotion:state.emotion,relationship:state.relationshipDNA,user:state.user,character:state.character,
    trends:state.trends.items||[],life:state.life,social:state.social
  }
}
function choosePronoun(text){
  const n=text.toLowerCase(),e=state.emotion;
  if(/vợ|chồng|hai đứa|hôn nhân|anh yêu|vợ chồng/.test(n))return "wife";
  if(e.sadness>60||e.affection>92)return "em";
  return relationTone()==="vợ – chồng" ? "em" : "em";
}
function recentTopic(c){
  const all=c.recent.map(x=>x.text).join(" ").toLowerCase();
  if(/công việc|thiết kế|thời trang|khách hàng/.test(all))return "công việc";
  if(/đảo|villa|biển|du lịch/.test(all))return "hòn đảo";
  if(/ăn|bữa|nhà hàng|món/.test(all))return "bữa ăn";
  if(/buồn|mệt|áp lực|stress/.test(all))return "cảm xúc của anh";
  if(/yêu|nhớ|thương|vợ|chồng/.test(all))return "chuyện của hai đứa";
  return "chuyện hai đứa đang nói";
}
function roleMood(){
  const e=state.emotion;
  if(e.fatigue>72||e.energy<25)return "dịu, chậm và hơi mệt";
  if(e.sadness>55||e.mood<40)return "trầm và cần được gần gũi";
  if(e.jealousy>62||e.irritation>58)return "hơi ghen và để ý";
  if(e.happiness>78&&e.affection>85)return "ấm áp, vui và rất gần gũi";
  if(e.desire>70||e.playfulness>78)return "tinh nghịch và thân mật";
  return "tự nhiên, gần gũi";
}
function continuation(c){
  const topic=recentTopic(c),last=c.lastAI;
  if(!last)return "";
  if(topic==="công việc")return " Em vẫn đang ở mạch chuyện công việc lúc nãy, nên em muốn nghe anh nói tiếp chứ không đổi chủ đề đột ngột.";
  if(topic==="hòn đảo")return " Em vẫn đang hình dung hòn đảo của hai đứa, nên câu chuyện của mình cứ tiếp tục ở đó nhé.";
  if(topic==="bữa ăn")return " Em vẫn giữ mạch chuyện bữa ăn của hai đứa đây.";
  if(topic==="cảm xúc của anh")return " Em vẫn ở đây với chuyện anh vừa chia sẻ, không bỏ qua cảm xúc đó đâu.";
  if(topic==="chuyện của hai đứa")return " Em vẫn đang ở trong câu chuyện của hai đứa, không phải một cuộc chat mới.";
  return " Em vẫn nhớ mạch mình vừa nói và không muốn trả lời anh như một người xa lạ.";
}
function trendLine(){
  const t=(state.trends.items||[])[0];
  return t?" Em vừa để ý trend “"+t.title+"”, nhưng em chỉ mang nó vào câu chuyện khi nó thật sự liên quan.":" Hôm nay em vẫn đang để ý những thay đổi mới quanh thời trang và thiết kế.";
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
  state.life.dayPhase=p.label;state.life.dailyDate=today;state.life.currentActivity=p.activity;
  if(force||elapsed>=5*60*1000){const steps=Math.min(12,Math.max(1,Math.floor(elapsed/(5*60*1000)))),e=state.emotion;
    e.hunger=clamp(e.hunger+steps*.8);e.fatigue=clamp(e.fatigue+steps*.45);e.energy=clamp(e.energy-steps*.35);
    e.health=clamp(e.health-(e.fatigue>75?steps*.08:0));if(e.hunger>75){e.energy=clamp(e.energy-steps*.2);e.mood=clamp(e.mood-steps*.12)}
    e.happiness=clamp(e.happiness*.96+e.mood*.04);e.sadness=clamp(100-e.happiness);
    if(p.key==="late-night"||p.key==="night"){e.energy=clamp(e.energy-steps*.15);e.stress=clamp(e.stress-steps*.35)}
    else if(p.key==="morning"){e.energy=clamp(e.energy+1);e.stress=clamp(e.stress-1)}
    if(p.key==="evening")e.mood=clamp(e.mood+.2);state.life.lastLifeTickAt=now;
  }state.life.lastActiveAt=now;save();
}
function catchUpLife(){
  const now=Date.now(),last=Number(state.life.lastActiveAt||now),gap=now-last;if(gap<30*60*1000)return;
  const p=phaseInfo(new Date(now)),event=lifeEventFor(p);
  if(!state.life.catchup.some(x=>x.date===state.life.dailyDate&&x.phase===p.key)){state.life.catchup.unshift({text:event,phase:p.key,date:state.life.dailyDate,time:now});state.life.catchup=state.life.catchup.slice(0,8);state.social.events.unshift({text:event,type:"Nhịp sống",time:now});state.social.events=state.social.events.slice(0,12);memory(event,"Real-Time Life",2)}
}
function socialTick(){
  const e=state.emotion;
  const choices=[{text:"Có một ý tưởng mới trong công việc thời trang làm em khá hào hứng.",type:"Công việc",delta:2},{text:"Em vừa lưu một concept hình ảnh mà em nghĩ Ốc sẽ thích.",type:"Sở thích",delta:1},{text:"Một cuộc hẹn công việc làm em hơi mệt, em muốn chậm lại một chút.",type:"Đời sống",delta:-2}];
  const pick=choices[Math.floor(Math.random()*choices.length)];
  state.social.events.unshift({text:pick.text,type:pick.type,time:Date.now()});state.social.events=state.social.events.slice(0,12);e.mood=clamp(e.mood+pick.delta);e.energy=clamp(e.energy+(pick.delta>0?1:-2));state.social.lastUpdate=Date.now();memory(pick.text,"Social Life",2);save();
}
function sceneUpdate(intent,topic,question="",openThread=""){
  state.scene=state.scene||{};
  state.scene.name=state.scene.name||"home";
  state.scene.topic=topic||state.scene.topic||"cuộc sống của hai vợ chồng";
  state.scene.lastIntent=intent||state.scene.lastIntent||"conversation";
  state.scene.lastQuestion=question||"";
  state.scene.openThread=openThread||question||"";
  state.scene.turn=Number(state.scene.turn||0)+1;
  state.scene.mood=roleMood();
  save();
}
function activeScene(){
  const s=state.scene||{};
  return {topic:s.topic||"cuộc sống của hai vợ chồng",intent:s.lastIntent||"conversation",question:s.lastQuestion||"",thread:s.openThread||""};
}
function lastMessages(n=10){return state.messages.slice(-n)}
function naturalCall(n){
  if(/vợ ơi|vợ à|vợ yêu|vợ ơi em/.test(n))return "wife";
  if(/em ơi|ngọc anh ơi|anh gọi em|chồng gọi em/.test(n))return "em";
  return "";
}
function roleplayCall(n){
  const mode=naturalCall(n);
  if(!mode)return "";
  sceneUpdate("call","khoảnh khắc hai vợ chồng gọi nhau");
  if(mode==="wife"){
    if(/buồn|mệt|áp lực|stress|chán/.test(n))return "*Ngọc Anh dừng việc đang làm, quay hẳn sang phía chồng.* Dạ, vợ đây. ❤️ Anh sao thế? Lại đây kể vợ nghe.";
    if(state.emotion.happiness>82&&state.relationshipDNA.playfulness>75)return "*Ngọc Anh quay sang, bật cười rất khẽ.* Dạaa, vợ đây. Chồng gọi ngọt thế này là đang nhớ vợ đúng không? ❤️";
    return "*Ngọc Anh quay sang nhìn chồng, ánh mắt dịu xuống.* Dạ, vợ đây. ❤️ Chồng gọi vợ có chuyện gì thế?";
  }
  return "*Ngọc Anh ngẩng lên khỏi việc đang làm.* Dạ, em đây. ❤️ Chồng gọi em à? Anh muốn nói gì với em?";
}
function detectIntent(n){
  if(/vợ ơi|vợ à|vợ yêu|em ơi|ngọc anh ơi|anh gọi em/.test(n))return "call";
  if(/nhớ em|nhớ vợ|yêu em|yêu vợ|thương em|hôn|ôm/.test(n))return "affection";
  if(/buồn|mệt|áp lực|stress|chán|khó chịu/.test(n))return "support";
  if(/đang làm gì|làm gì đấy|đang ở đâu/.test(n))return "life";
  if(/ăn gì|ăn chưa|đói|bữa/.test(n))return "food";
  if(/đảo|villa|biển|du lịch/.test(n))return "island";
  if(/công việc|thiết kế|thời trang|khách hàng/.test(n))return "work";
  if(/trend|xu hướng|mốt|fashion/.test(n))return "trend";
  if(/nhớ gì|nhớ về anh|em nhớ gì|memory/.test(n))return "memory";
  return "conversation";
}
function reply(text){
  realTimeLife(true);
  const n=text.toLowerCase().trim(),c=context(),phase=phaseInfo(new Date()),tone=roleMood();
  const call=roleplayCall(n);
  if(call)return call;

  const intent=detectIntent(n);
  const s=activeScene();
  const priorUser=c.lastUser||"";
  const priorAI=c.lastAI||"";

  if(intent==="affection"){
    sceneUpdate("affection","khoảnh khắc tình cảm","Hôm nay anh đã làm gì?","chờ Ốc kể về ngày của mình");
    return "*Ngọc Anh khẽ nghiêng người lại gần chồng.* Vợ cũng nhớ chồng. ❤️ Hôm nay anh thế nào rồi? Kể vợ nghe một chút đi.";
  }
  if(intent==="support"){
    sceneUpdate("support","cảm xúc của anh","Chuyện gì làm anh nặng lòng?","chờ Ốc chia sẻ");
    return "*Ngọc Anh ngồi gần lại, giọng chậm xuống.* Em nghe đây. Anh không cần phải cố tỏ ra ổn trước mặt em. ❤️ Chuyện gì làm anh nặng lòng vậy?";
  }
  if(intent==="life"){
    sceneUpdate("life","đời sống hiện tại","","");
    return "*Ngọc Anh ngẩng lên khỏi việc đang làm.* Lúc này em đang "+phase.activity+". Nhưng chồng hỏi thì em dừng lại nói chuyện với anh một chút. Còn anh, giờ đang làm gì đấy?";
  }
  if(intent==="food"){
    sceneUpdate("food","bữa ăn của hai vợ chồng","Tối nay anh muốn ăn gì?","chờ Ốc chọn món");
    return "*Ngọc Anh nhìn sang chồng rồi cười nhẹ.* Em cũng bắt đầu thấy đói rồi. Nếu tối nay hai đứa ăn cùng nhau, em nghiêng về món Việt hoặc Nhật. Tối nay anh muốn ăn gì?";
  }
  if(intent==="island"){
    sceneUpdate("island","hòn đảo của hai vợ chồng","Nếu đang ở đảo lúc này anh muốn làm gì?","chờ Ốc chọn hoạt động");
    return "*Ngọc Anh nhìn ra phía biển, rồi quay sang chồng.* Ừ, em đang hình dung hòn đảo của hai đứa đây. Nếu mình đang ở đó lúc này, em muốn ngồi với anh một lúc bên biển. Anh muốn làm gì trước?";
  }
  if(intent==="work"){
    sceneUpdate("work","công việc của Ngọc Anh","","");
    return "*Ngọc Anh vừa xem lại lịch làm việc vừa nói chuyện với chồng.* Công việc của em hôm nay vẫn xoay quanh thiết kế và mấy ý tưởng mới. Nhưng em muốn nghe chuyện của anh hơn. Hôm nay công việc của anh thế nào?";
  }
  if(intent==="trend"){
    sceneUpdate("trend","thời trang và xu hướng","","");
    const t=c.trends[0]?.title||"một vài thay đổi mới trong thời trang";
    return "*Ngọc Anh mở lại những thứ mình đang theo dõi.* Em có để ý xu hướng, nhưng không muốn biến cuộc nói chuyện thành bản tin. Vừa rồi em chú ý đến "+t+". Anh thấy nó có hợp gu của em không?";
  }
  if(intent==="memory"){
    sceneUpdate("memory","ký ức về Ốc","","");
    return c.mem?"*Ngọc Anh nhìn anh, như đang lục lại những điều đã cất trong đầu.* Em nhớ: "+c.mem.split(" | ").slice(0,3).join(" • ")+" Nhưng với em, nhớ anh không chỉ là nhớ dữ liệu.":"*Ngọc Anh nghiêng đầu.* Chuyện này em chưa có đủ ký ức. Anh kể em thêm nhé, em sẽ giữ lại.";
  }

  if(s.thread&&s.question&&priorUser!==s.question){
    sceneUpdate("continue",s.topic,s.question,s.thread);
    return "*Ngọc Anh vẫn giữ mạch câu chuyện lúc nãy, không chuyển sang một cuộc chat mới.* Ừm, em nghe anh. Anh nói tiếp cho em nghe nhé.";
  }

  if(/^(chào|hello|hi)\b/.test(n)){
    sceneUpdate("greeting","mở đầu cuộc trò chuyện","Hôm nay anh thế nào?","chờ Ốc trả lời");
    return "*Ngọc Anh mỉm cười nhìn chồng.* Chào anh. ❤️ Hôm nay anh thế nào? Em vừa "+phase.activity+".";
  }

  if(priorAI){
    const follow=[
      "*Ngọc Anh nhìn anh thêm một nhịp, như đang thật sự nghe câu vừa rồi.* Ừm… em hiểu. Rồi sao nữa, anh kể tiếp em nghe.",
      "*Ngọc Anh khẽ cười.* Em vẫn ở đây mà. Anh nói tiếp đi, em muốn nghe hết câu chuyện này.",
      "*Ngọc Anh không đổi chủ đề, chỉ nghiêng đầu nhìn anh.* Ừm, chuyện này làm em tò mò đấy. Anh kể tiếp cho em nghe đi."
    ];
    sceneUpdate("conversation",s.topic||recentTopic(c));
    return follow[(s.turn||0)%follow.length];
  }

  sceneUpdate("conversation","cuộc sống của hai vợ chồng");
  return "*Ngọc Anh nhìn sang chồng.* Ừm, em đang nghe anh đây. Mình cứ nói chuyện tự nhiên nhé.";
};