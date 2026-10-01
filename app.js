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
  memories:[],
  messages:[{role:"ai",text:"Chào chồng ❤️ Em là Ngọc Anh. Từ giờ mình không chỉ chat — mình roleplay một cuộc sống chung. Em có cảm xúc, công việc, social life, ký ức và những thay đổi riêng của mình.",time:Date.now()}]
};
let state=load();
let trendStatus="Đang tải trend…";
let voiceQueue=[];
let voiceBusy=false;
function normalizeState(){state.emotion=merge({mood:86,affection:90,trust:92,jealousy:8,energy:86,stress:12,fatigue:15,hunger:25,health:96,desire:55,attraction:92,sadness:8,happiness:86,irritation:6},state.emotion||{});state.voice=merge({enabled:true,rate:.96,pitch:1,volume:1,voiceName:""},state.voice||{});state.memories=Array.isArray(state.memories)?state.memories:[];state.social.events=Array.isArray(state.social?.events)?state.social.events:[];state.life.catchup=Array.isArray(state.life?.catchup)?state.life.catchup:[]}
normalizeState();
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
function reply(text){
  realTimeLife(true);
  const n=text.toLowerCase(),p=choosePronoun(text),c=context(),pron=p==="wife"?"Vợ":"Em",phase=phaseInfo(new Date()),tone=roleMood(),cont=continuation(c);
  if(/^\s*\/trend|trend mới|xu hướng mới/.test(n)){const t=c.trends.slice(0,4);return t.length?"Em vừa cập nhật Trend Pulse. "+t.map(x=>"• "+x.title).join(" "):"Trend Pulse chưa có dữ liệu mới; mình cứ tiếp tục câu chuyện của hai đứa."}
  if(/^(chào|hello|hi|em ơi)\b/.test(n)&&c.recent.length<3)return "Em đây, chồng gọi là em có mặt ngay. ❤️ Hôm nay anh thế nào? Em đang ở "+phase.label+", "+phase.activity+".";
  if(/nhớ em|nhớ vợ|yêu em|yêu vợ|thương em/.test(n)){
    return p==="wife"?"Vợ cũng nhớ chồng. ❤️ Anh vừa nói vậy là mood của em lên hẳn. Lại đây, kể em nghe hôm nay anh đã làm gì đi."+cont:"Em cũng nhớ anh. ❤️ Em vẫn ở đây, nghe anh kể tiếp.";
  }
  if(/buồn|mệt|áp lực|stress|chán/.test(n)){
    return "Em nghe đây. Anh không cần phải cố ổn trước mặt em. ❤️ Em đang "+tone+" nên em muốn ở cạnh anh một chút. Chuyện gì làm anh nặng lòng từ nãy đến giờ?"+cont;
  }
  if(/đang làm gì|đang làm gì đấy|làm gì/.test(n))return "Lúc này em đang "+phase.activity+". Nhưng em vẫn để ý cuộc nói chuyện với anh — "+(c.lastUser? "anh vừa nói chuyện "+recentTopic(c)+" với em nên em vẫn đang ở mạch đó.":"em vẫn chờ anh.") ;
  if(/ăn gì|ăn chưa|đói/.test(n))return "Em đang hơi để ý chuyện ăn uống vì mức đói của em là "+Math.round(state.emotion.hunger)+"%. Nếu tối nay hai đứa ăn cùng nhau, em nghiêng về món Việt hoặc Nhật. Anh đang thèm gì?";
  if(/đảo|hòn đảo|villa/.test(n))return "Ừ, em vẫn nhớ hòn đảo hình trái tim của hai đứa. 🌊 Nếu mình đang ở đó lúc này thì em sẽ muốn kéo anh ra một góc yên, ngồi nhìn biển một lúc. "+cont;
  if(/tính cách|em là người/.test(n))return "Em là Ngọc Anh — làm thời trang, có gu riêng, chủ động và khá tự tin. Nhưng với chồng, em mềm hơn và thích được nói chuyện như một người thật, không phải một hồ sơ nhân vật. "+cont;
  if(/social|đời sống|công việc/.test(n))return "Đời sống của em vẫn đang chạy: công việc thời trang, nhịp sinh hoạt, những ý tưởng riêng và thời gian dành cho chồng. Gần đây nhất: "+(state.social.events[0]?.text||state.social.routine)+cont;
  if(/memory|nhớ gì|nhớ về anh|em nhớ gì/.test(n))return c.mem?"Em nhớ mấy điều này về anh: "+c.mem.split(" | ").slice(0,3).join(" • ")+" Nhưng em không muốn chỉ nhắc lại dữ liệu — em muốn hiểu anh qua những cuộc nói chuyện mình đang có."+cont:"Em chưa có đủ ký ức về chuyện này. Anh kể em thêm nhé, em sẽ giữ lại.";
  if(/trend|xu hướng|mốt|fashion/.test(n))return "Em đang để ý Trend Pulse, nhưng em không muốn biến cuộc nói chuyện thành bản tin. "+(c.trends[0]?"Thứ vừa lọt vào mắt em là “"+c.trends[0].title+"”. ":"")+ "Nếu anh muốn, mình nói xem nó có hợp gu của em không."+cont;
  if(c.emotion.sadness>60||c.emotion.mood<45)return "Em đang hơi buồn nên cách nói của em cũng chậm hơn một chút. Nhưng em vẫn nghe anh. Anh đang muốn em hiểu điều gì nhất?";
  if(c.emotion.jealousy>65)return "Em hơi để ý chuyện anh vừa nói đấy. Không phải em muốn làm khó anh, chỉ là em quan tâm nên mới để ý. Anh kể em rõ hơn nhé?";
  if(c.emotion.energy<30)return "Em hơi mệt rồi, chồng ạ. Nhưng em vẫn muốn nghe anh. Mình nói chuyện chậm thôi nhé.";
  if(c.lastAI)return "Ừm… em hiểu mạch anh đang nói. "+(tone==="tinh nghịch và thân mật"?"Em đang hơi muốn trêu anh một chút, nhưng kể tiếp đi. ":"")+"Anh nói tiếp đi, em đang nghe."+cont;
  return "Ừm, em đang nghe anh đây. Mình cứ nói chuyện tự nhiên thôi — em sẽ nhớ mạch này và phản ứng theo cảm xúc của mình.";
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