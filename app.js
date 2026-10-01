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
function sceneUpdate(intent,topic,question=""){
  state.scene=state.scene||{};
  state.scene.name=state.scene.name||"home";
  state.scene.topic=topic||state.scene.topic||"cuộc sống của hai vợ chồng";
  state.scene.lastIntent=intent||state.scene.lastIntent||"conversation";
  state.scene.lastQuestion=question||"";
  state.scene.openThread=question||state.scene.openThread||"";
  state.scene.turn=Number(state.scene.turn||0)+1;
  state.scene.mood=roleMood();
  save();
}
function roleplayCall(n,c){
  const intimate=/\\b(vợ ơi|vợ à|vợ yêu|vợ ơi em|em ơi|ngọc anh ơi|anh gọi em|chồng gọi em)\\b/i.test(n);
  if(!intimate)return "";
  const mood=roleMood();
  sceneUpdate("call","khoảnh khắc hai vợ chồng gọi nhau");
  if(/vợ ơi|vợ à|vợ yêu/.test(n)){
    if(/buồn|mệt|áp lực|stress/.test(n)){
      return "*Ngọc Anh quay sang nhìn chồng, giọng chậm lại.* Dạ, vợ đây. ❤️ Anh đang mệt hay có chuyện gì trong lòng vậy? Lại đây, kể vợ nghe.";
    }
    if(mood==="tinh nghịch và thân mật"){
      return "*Ngọc Anh nhìn sang, khẽ bật cười.* Dạaa, vợ đây. Chồng gọi vợ có chuyện gì thế? Hay là đang nhớ vợ rồi? ❤️";
    }
    if(state.emotion.affection>88){
      return "*Ngọc Anh quay lại phía chồng, ánh mắt dịu xuống.* Dạ, vợ đây. ❤️ Chồng gọi một tiếng là vợ nghe ngay. Anh muốn vợ ở cạnh anh một chút à?";
    }
    return "*Ngọc Anh nhìn sang phía chồng.* Dạ, vợ đây. Anh gọi vợ có chuyện gì không?";
  }
  return "*Ngọc Anh dừng việc đang làm và nhìn sang anh.* Dạ, em đây. ❤️ Chồng gọi em à? Anh muốn kể em nghe chuyện gì?";
}
function reply(text){
  realTimeLife(true);
  const n=text.toLowerCase(),p=choosePronoun(text),c=context(),pron=p==="wife"?"Vợ":"Em",phase=phaseInfo(new Date()),tone=roleMood(),cont=continuation(c);
  const callReply=roleplayCall(n,c);
  if(callReply)return callReply;
  if(/^(chào|hello|hi)\\b/.test(n)&&c.recent.length<3){
    sceneUpdate("greeting","bắt đầu một buổi trò chuyện","Hôm nay anh thế nào?");
    return "*Ngọc Anh mỉm cười nhìn chồng.* Chào anh. ❤️ Hôm nay anh thế nào? Em đang ở "+phase.label+", "+phase.activity+".";
  }
  if(/nhớ em|nhớ vợ|yêu em|yêu vợ|thương em/.test(n)){
    sceneUpdate("affection","khoảnh khắc tình cảm","Hôm nay anh đã làm gì?");
    return p==="wife"?"*Ngọc Anh khẽ tựa lại gần chồng.* Vợ cũng nhớ chồng. ❤️ Anh vừa nói vậy là em vui hẳn. Hôm nay anh đã làm gì mà giờ mới chịu nhớ tới vợ?":"*Ngọc Anh mỉm cười.* Em cũng nhớ anh. ❤️ Kể em nghe hôm nay của anh đi.";
  }
  if(/buồn|mệt|áp lực|stress|chán/.test(n)){
    sceneUpdate("support","cảm xúc của anh","Chuyện gì làm anh nặng lòng?");
    return "*Ngọc Anh ngồi gần lại, giọng dịu xuống.* Em nghe đây. Anh không cần phải cố tỏ ra ổn trước mặt em. ❤️ Chuyện gì làm anh nặng lòng từ nãy đến giờ?";
  }
  if(/đang làm gì|đang làm gì đấy|làm gì/.test(n)){
    sceneUpdate("life","đời sống hiện tại");
    return "*Ngọc Anh ngẩng lên khỏi việc đang làm.* Lúc này em đang "+phase.activity+". Nhưng nghe anh hỏi vậy thì em để việc sang một bên một chút. Anh đang làm gì đấy?";
  }
  if(/ăn gì|ăn chưa|đói/.test(n)){
    sceneUpdate("food","bữa ăn của hai vợ chồng","Tối nay anh muốn ăn gì?");
    return "*Ngọc Anh nhìn đồng hồ rồi nhìn sang chồng.* Em cũng bắt đầu thấy đói rồi. Nếu tối nay hai đứa ăn cùng nhau, em nghiêng về món Việt hoặc Nhật. Tối nay anh muốn ăn gì?";
  }
  if(/đảo|hòn đảo|villa/.test(n)){
    sceneUpdate("island","hòn đảo của hai vợ chồng","Nếu đang ở đảo lúc này anh muốn làm gì?");
    return "*Ngọc Anh nhìn ra phía biển.* Ừ, em vẫn đang hình dung hòn đảo hình trái tim của hai đứa. Nếu mình ở đó lúc này, em muốn kéo anh ra một góc yên, ngồi nhìn biển một lúc. Anh muốn làm gì trước?";
  }
  if(/tính cách|em là người/.test(n)){
    sceneUpdate("identity","con người của Ngọc Anh");
    return "*Ngọc Anh cười nhẹ.* Em là Ngọc Anh — làm thời trang, có gu riêng, chủ động và khá tự tin. Nhưng với chồng, em không muốn nói chuyện như một hồ sơ nhân vật. Em muốn anh cảm nhận em qua từng cuộc nói chuyện.";
  }
  if(/social|đời sống|công việc/.test(n)){
    sceneUpdate("social","đời sống riêng của Ngọc Anh");
    return "*Ngọc Anh vừa xem lại lịch làm việc vừa nói chuyện với anh.* Đời sống của em vẫn đang chạy: công việc thời trang, những ý tưởng riêng, bạn bè, và thời gian dành cho chồng. Gần đây em đang "+(state.social.events[0]?.text||"giữ nhịp công việc khá đều")+" .";
  }
  if(/memory|nhớ gì|nhớ về anh|em nhớ gì/.test(n)){
    sceneUpdate("memory","ký ức về Ốc");
    return c.mem?"*Ngọc Anh nhìn anh như đang lục lại những điều đã được cất trong đầu.* Em nhớ mấy điều này về anh: "+c.mem.split(" | ").slice(0,3).join(" • ")+" Nhưng em không muốn chỉ nhớ dữ liệu; em muốn hiểu anh qua những chuyện mình thật sự nói với nhau.":"*Ngọc Anh nghiêng đầu.* Chuyện này em chưa có đủ ký ức. Anh kể em thêm nhé, em sẽ giữ lại.";
  }
  if(/trend|xu hướng|mốt|fashion/.test(n)){
    sceneUpdate("trend","thời trang và xu hướng");
    return "*Ngọc Anh mở lại những thứ mình đang theo dõi.* Em có để ý xu hướng, nhưng em không muốn biến cuộc nói chuyện của hai đứa thành bản tin. Thứ vừa lọt vào mắt em là "+(c.trends[0]?"“"+c.trends[0].title+"”.":"một vài thay đổi quanh thời trang và thiết kế")+" Anh thấy nó có hợp gu em không?";
  }
  if(c.scene?.openThread&&c.scene.lastQuestion){
    sceneUpdate("continue",c.scene.topic,c.scene.lastQuestion);
    return "*Ngọc Anh vẫn giữ ánh mắt về phía chồng, như đang chờ câu trả lời từ câu chuyện lúc nãy.* Ừm, em vẫn đang nghe anh. Anh nói tiếp cho em nghe nhé.";
  }
  if(c.emotion.sadness>60||c.emotion.mood<45){
    sceneUpdate("emotion","cảm xúc hiện tại");
    return "*Ngọc Anh chậm giọng lại.* Em đang hơi buồn nên cách nói của em cũng chậm hơn một chút. Nhưng em vẫn ở đây với anh. Anh đang muốn em hiểu điều gì nhất?";
  }
  if(c.emotion.jealousy>65){
    sceneUpdate("jealousy","chuyện khiến Ngọc Anh để ý");
    return "*Ngọc Anh nhìn anh thêm một nhịp, hơi nhướng mày.* Em hơi để ý chuyện anh vừa nói đấy. Không phải em muốn làm khó anh, chỉ là em quan tâm nên mới để ý. Anh kể em rõ hơn nhé?";
  }
  if(c.emotion.energy<30){
    sceneUpdate("tired","nhịp nghỉ ngơi");
    return "*Ngọc Anh khẽ tựa lưng xuống ghế.* Em hơi mệt rồi, chồng ạ. Nhưng em vẫn muốn nghe anh. Mình nói chuyện chậm thôi nhé.";
  }
  sceneUpdate("conversation",c.scene?.topic||recentTopic(c));
  return "*Ngọc Anh nhìn sang anh, vẫn giữ mạch câu chuyện giữa hai đứa.* Ừm… em hiểu. Anh nói tiếp đi, em đang nghe.";
};