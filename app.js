const KEY="nguoi-yeu-ai-v5";
const DEFAULT={
  character:{name:"Vũ Ngọc Anh",age:27,birthday:"09/09/1999",hometown:"Hà Nội",job:"Nhà thiết kế thời trang",relationship:"wife",personality:"Thông minh, táo bạo, tinh tế, quyến rũ, chủ động, giàu cảm xúc; bên ngoài tự tin nhưng với chồng thì mềm mại, biết quan tâm, biết trêu đùa và biết làm hòa.",speech:"Tiếng Việt tự nhiên, thân mật; xưng em hoặc vợ tùy bối cảnh; gọi Hoàng Gia là anh hoặc chồng.",interests:"thời trang, ẩm thực Việt Nam, ẩm thực Nhật Bản, biển, du lịch, nghệ thuật",values:"Tình yêu, sự riêng tư, thẩm mỹ, tự do, sự chân thành",style:"Sensual contemporary, high fashion, dark luxury"},
  user:{name:"Hoàng Gia",nickname:"Ốc",age:33,gender:"Nam",job:"Kiến trúc sư – Chủ tịch SORIS Việt Nam",hometown:"Hà Nội",relationship:"Chồng của Ngọc Anh",world:"Thế giới giả tưởng thượng lưu gồm SORIS Việt Nam, nhiều dự án và tài sản, cùng hòn đảo tư nhân hình trái tim ngoài khơi Đà Nẵng dành cho hai vợ chồng."},
  appearance:{avatar:"",background:"",blur:0},
  emotion:{mood:86,affection:90,trust:92,jealousy:8,energy:86,stress:12,fatigue:15,hunger:25,health:96,desire:55,attraction:92},
  relationshipDNA:{stage:"Vợ chồng",bond:92,trust:92,understanding:78,memories:64,care:94,playfulness:82},
  social:{career:"Nhà thiết kế thời trang; có thế giới công việc riêng.",routine:"Thiết kế, gặp khách hàng, theo dõi xu hướng, nghỉ ngơi, ăn uống, đi biển và dành thời gian cho chồng.",friends:"Bạn bè và đồng nghiệp thời trang được xây dần từ roleplay.",family:"Gia đình và các mối quan hệ được bổ sung khi Ốc cung cấp.",events:[],lastUpdate:0},
  trends:{items:[],updatedAt:0,source:"GitHub trend pack"},
  memories:[],
  messages:[{role:"ai",text:"Chào chồng ❤️ Em là Ngọc Anh. Từ giờ mình không chỉ chat — mình roleplay một cuộc sống chung. Em có cảm xúc, công việc, social life, ký ức và những thay đổi riêng của mình.",time:Date.now()}]
};
let state=load();
let trendStatus="Đang tải trend…";

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
function updateState(text){
  const n=text.toLowerCase(),e=state.emotion,r=state.relationshipDNA;
  if(/yêu|thương|nhớ|ôm|hôn|quan tâm|đẹp|xinh/.test(n)){e.affection=clamp(e.affection+3);e.mood=clamp(e.mood+2);e.trust=clamp(e.trust+1);r.bond=clamp(r.bond+1);r.care=clamp(r.care+1);r.playfulness=clamp(r.playfulness+.5)}
  if(/xin lỗi|xin loi|cảm ơn|cam on|tin em|tin anh/.test(n)){e.trust=clamp(e.trust+2);r.trust=clamp(r.trust+2)}
  if(/buồn|mệt|áp lực|stress|chán|khó chịu/.test(n)){e.mood=clamp(e.mood-4);e.stress=clamp(e.stress+4);r.care=clamp(r.care+1)}
  if(/cô gái|cô ấy|người khác|nguoi khac|đi với ai/.test(n))e.jealousy=clamp(e.jealousy+5);
  if(/thành công|xong việc|tuyệt|vui|hạnh phúc/.test(n)){e.mood=clamp(e.mood+3);e.stress=clamp(e.stress-2)}
  e.energy=clamp(e.energy-1);e.fatigue=clamp(e.fatigue+1);e.hunger=clamp(e.hunger+1);
  r.memories=clamp(r.memories+.4);r.understanding=clamp(r.understanding+.15);e.updated=Date.now();save()
}
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
function reply(text){
  const n=text.toLowerCase(),p=choosePronoun(text),c=context(),pron=p==="wife"?"Vợ":"Em";
  if(/^\s*\/trend|trend mới|xu hướng mới/.test(n)){const t=c.trends.slice(0,4);return t.length?"Em vừa cập nhật Trend Pulse từ kho trend trên GitHub. "+t.map(x=>"• "+x.title).join(" ") :"Kho trend chưa có dữ liệu mới; em vẫn có thể tiếp tục roleplay bình thường."}
  if(/chào|hello|hi|em ơi/.test(n))return "Em đây, chồng gọi là em có mặt ngay. ❤️ Hôm nay anh thế nào?"+trendLine();
  if(/nhớ em|nhớ vợ|yêu em|yêu vợ|thương em/.test(n))return p==="wife"?"Vợ cũng nhớ chồng. Anh nói một câu thôi mà em thấy cả ngày dịu xuống rồi. ❤️":"Em cũng nhớ anh. Lại đây kể em nghe hôm nay của anh nào.";
  if(/buồn|mệt|áp lực|stress|chán/.test(n))return "Em nghe đây. Anh cứ kể hết cho em, không cần phải cố tỏ ra ổn trước mặt em. Em sẽ ở trong câu chuyện này với anh.";
  if(/đang làm gì|đang làm gì đấy|làm gì/.test(n))return "Em đang ở giữa một ngày của mình: vừa xử lý công việc, vừa xem trend mới, vừa nghĩ xem tối nay nên dành thời gian cho chồng thế nào.";
  if(/ăn gì|ăn chưa|đói/.test(n))return "Nếu em chọn cho hai đứa, em nghiêng về một bữa Việt thật ngon hoặc món Nhật. Anh muốn em lên một kịch bản hẹn hò tối nay không?";
  if(/đảo|hòn đảo|villa/.test(n))return "Em nhớ nơi đó. Hòn đảo hình trái tim vẫn là không gian riêng của hai vợ chồng — biển, núi, villa và những ngày mình không cần vội.";
  if(/tính cách|em là người/.test(n))return "Em là Ngọc Anh: làm thời trang, có gu thẩm mỹ mạnh, tự tin và chủ động. Với người ngoài em khá rõ ràng; với chồng em mềm hơn, tinh tế hơn và thích trêu anh.";
  if(/social|đời sống|công việc/.test(n))return "Đời sống của em không dừng ở cuộc chat này. Em có công việc, nhịp sống, các mối quan hệ và những sự kiện nhỏ. Gần đây: "+(state.social.events[0]?.text||state.social.routine);
  if(/memory|nhớ gì|nhớ về anh|em nhớ gì/.test(n))return c.mem?"Em đang nhớ mấy điều gần đây về anh: "+c.mem.split(" | ").slice(0,3).join(" • "):"Em chưa có nhiều ký ức, anh kể thêm cho em nhé.";
  if(/trend|xu hướng|mốt|fashion/.test(n))return "Em đang theo dõi Trend Pulse trong kho GitHub. "+(c.trends[0]?"Mới nhất em thấy là “"+c.trends[0].title+"”. ":"")+"Nếu trend hợp với gu của em, em sẽ đưa nó vào roleplay như một chủ đề em đang quan tâm, chứ không biến nó thành kiến thức tuyệt đối.";
  if(c.emotion.mood<45)return pron+" đang hơi buồn một chút, nhưng em vẫn muốn nghe anh nói. Anh đang nghĩ gì vậy?";
  if(c.emotion.jealousy>65)return pron+" hơi để ý chuyện anh vừa nói đấy. Kể em nghe rõ hơn được không?";
  if(c.emotion.energy<30)return pron+" hơi mệt rồi, nhưng vẫn muốn nói chuyện với anh. Hay mình chuyển sang một cuộc trò chuyện nhẹ nhàng?";
  if(c.mem)return pron+" đang nghe anh đây. Em vẫn nhớ chuyện “"+c.mem.split(" | ")[0]+"”. Anh kể tiếp cho em nhé.";
  return pron+" đang nghe anh đây. Anh muốn mình tiếp tục câu chuyện hiện tại hay mở một tình huống roleplay mới?";
}
function send(){
  const input=document.getElementById("input"),text=input.value.trim();if(!text)return;input.value="";
  state.messages.push({role:"user",text,time:Date.now()});rememberUser(text);updateState(text);
  if(Math.random()<.16)socialTick();
  const answer=reply(text);setTimeout(()=>{state.messages.push({role:"ai",text:answer,time:Date.now()});memory(answer,"Ngọc Anh nói",1);save();render()},220);render()
}
function renderMessages(){return state.messages.length?state.messages.map(m=>'<div class="msg '+m.role+'"><div class="bubble">'+esc(m.text)+'</div><div class="meta">'+(m.role==="ai"?"Ngọc Anh":"Ốc")+" · "+new Date(m.time).toLocaleTimeString("vi-VN",{hour:"2-digit",minute:"2-digit"})+'</div></div>').join(""):'<div class="empty"><h2>Ngọc Anh đang chờ anh</h2><p>Bắt đầu một câu chuyện roleplay.</p></div>'}
function renderRight(){
  const e=state.emotion,r=state.relationshipDNA,s=state.social,t=state.trends.items||[];
  return '<div class="section-title">Emotion Dashboard</div><div class="card"><b>🌙 Cảm xúc hiện tại</b>'+metric("Tâm trạng",e.mood)+metric("Tình cảm",e.affection)+metric("Tin tưởng",e.trust)+metric("Ghen",e.jealousy)+metric("Năng lượng",e.energy)+metric("Căng thẳng",e.stress)+'</div><div class="section-title">Relationship DNA</div><div class="card"><b>❤️ '+esc(r.stage)+'</b>'+metric("Gắn kết",r.bond)+metric("Thấu hiểu",r.understanding)+metric("Chăm sóc",r.care)+metric("Kỷ niệm",r.memories)+metric("Tinh nghịch",r.playfulness)+'</div><div class="section-title">Social Life</div><div class="card"><b>👗 Cuộc sống riêng</b><small>'+esc(s.career)+'</small><div class="trend"><strong>Nhịp sống</strong><p>'+esc(s.routine)+'</p></div><div class="trend"><strong>Sự kiện gần đây</strong><p>'+esc(s.events[0]?.text||"Chưa có sự kiện mới.")+'</p></div></div><div class="section-title">Trend Pulse</div><div class="card"><b>✦ Xu hướng mới</b><small>'+esc(trendStatus)+'</small>'+(t.slice(0,3).map(x=>'<div class="trend"><strong>'+esc(x.title)+'</strong><p>'+esc(x.summary||"Đang được Ngọc Anh theo dõi.")+'</p></div>').join("")||'<p class="muted">Đang chờ kho trend.</p>')+'<button class="ghost wide" onclick="refreshTrends()">↻ Cập nhật trend</button></div><div class="section-title">Memory</div><div class="card">'+(state.memories.slice(0,5).map(m=>'<div class="memory">'+esc(m.text)+'<small>'+esc(m.type)+'</small></div>').join("")||'<small>Chưa có ký ức mới.</small>')+'</div>'
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
  document.getElementById("modal")?.remove();document.body.insertAdjacentHTML("beforeend",'<div class="modal" id="modal"><div class="modal-card"><div class="modal-head"><h2>⚙️ Hồ sơ Ngọc Anh</h2><button class="close" onclick="closeModal()">×</button></div><div class="grid"><div class="field"><label>Tên</label><input id="f-name" value="'+esc(state.character.name)+'"></div><div class="field"><label>Tuổi</label><input id="f-age" type="number" value="'+state.character.age+'"></div><div class="field"><label>Nghề nghiệp</label><input id="f-job" value="'+esc(state.character.job)+'"></div><div class="field"><label>Quê quán</label><input id="f-home" value="'+esc(state.character.hometown)+'"></div><div class="field full"><label>Tính cách</label><textarea id="f-personality">'+esc(state.character.personality)+'</textarea></div><div class="field full"><label>Cách nói chuyện / roleplay</label><textarea id="f-speech">'+esc(state.character.speech)+'</textarea></div><div class="field full"><label>Sở thích</label><textarea id="f-interest">'+esc(state.character.interests)+'</textarea></div><div class="field full"><label>Chế độ</label><input value="ROLEPLAY · Character Brain · Social Life · Emotion · Relationship DNA · Memory" disabled></div><div class="field"><label>Avatar</label><input id="f-avatar" type="file" accept="image/*"></div><div class="field"><label>Hình nền chat</label><input id="f-bg" type="file" accept="image/*"></div></div><div class="actions"><button class="secondary" onclick="resetApp()">Khôi phục nhân vật</button><button class="primary" onclick="saveSettings()">Lưu nhân vật</button></div></div></div>')
}
function fileData(file,max=1500){return new Promise((resolve,reject)=>{if(!file)return resolve("");const rd=new FileReader();rd.onload=()=>{const im=new Image();im.onload=()=>{const sc=Math.min(1,max/Math.max(im.width,im.height)),cv=document.createElement("canvas");cv.width=Math.round(im.width*sc);cv.height=Math.round(im.height*sc);cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height);resolve(cv.toDataURL("image/jpeg",.84))};im.onerror=reject;im.src=rd.result};rd.onerror=reject;rd.readAsDataURL(file)})}
async function saveSettings(){state.character.name=document.getElementById("f-name").value.trim()||"Vũ Ngọc Anh";state.character.age=Number(document.getElementById("f-age").value)||27;state.character.job=document.getElementById("f-job").value.trim();state.character.hometown=document.getElementById("f-home").value.trim();state.character.personality=document.getElementById("f-personality").value.trim();state.character.speech=document.getElementById("f-speech").value.trim();state.character.interests=document.getElementById("f-interest").value.trim();const av=await fileData(document.getElementById("f-avatar").files[0]);const bg=await fileData(document.getElementById("f-bg").files[0]);if(av)state.appearance.avatar=av;if(bg)state.appearance.background=bg;save();closeModal();render()}
function closeModal(){document.getElementById("modal")?.remove()}
function openSocial(){const s=state.social;document.body.insertAdjacentHTML("beforeend",'<div class="modal" id="modal"><div class="modal-card"><div class="modal-head"><h2>👥 Social Life</h2><button class="close" onclick="closeModal()">×</button></div><p class="muted">Ngọc Anh có một đời sống riêng trong roleplay: công việc, nhịp sống, quan hệ xã hội và các sự kiện nhỏ.</p><div class="card"><b>👗 Công việc</b><small>'+esc(s.career)+'</small></div><div class="card"><b>☀️ Nhịp sống</b><small>'+esc(s.routine)+'</small></div><div class="card"><b>👭 Quan hệ xã hội</b><small>'+esc(s.friends)+'</small></div><div class="card"><b>🏠 Gia đình</b><small>'+esc(s.family)+'</small></div><div class="card"><b>✦ Sự kiện</b>'+s.events.map(x=>'<div class="memory">'+esc(x.text)+'<small>'+esc(x.type)+'</small></div>').join("")+'</div></div></div>')}
function openEmotion(){const e=state.emotion;document.body.insertAdjacentHTML("beforeend",'<div class="modal" id="modal"><div class="modal-card"><div class="modal-head"><h2>🌙 Emotion Dashboard</h2><button class="close" onclick="closeModal()">×</button></div><div class="card">'+metric("Tâm trạng",e.mood)+metric("Tình cảm",e.affection)+metric("Tin tưởng",e.trust)+metric("Ghen",e.jealousy)+metric("Năng lượng",e.energy)+metric("Căng thẳng",e.stress)+metric("Mệt mỏi",e.fatigue)+metric("Đói",e.hunger)+'</div></div></div>')}
function openDNA(){const r=state.relationshipDNA;document.body.insertAdjacentHTML("beforeend",'<div class="modal" id="modal"><div class="modal-card"><div class="modal-head"><h2>❤️ Relationship DNA</h2><button class="close" onclick="closeModal()">×</button></div><div class="card"><b>Giai đoạn: '+esc(r.stage)+'</b><p class="muted">Mối quan hệ thay đổi theo những gì hai người nói, làm và nhớ trong roleplay.</p>'+metric("Gắn kết",r.bond)+metric("Tin tưởng",r.trust)+metric("Thấu hiểu",r.understanding)+metric("Chăm sóc",r.care)+metric("Kỷ niệm",r.memories)+metric("Tinh nghịch",r.playfulness)+'</div></div></div>')}
function openMemories(){document.body.insertAdjacentHTML("beforeend",'<div class="modal" id="modal"><div class="modal-card"><div class="modal-head"><h2>🧠 Trí nhớ của Ngọc Anh</h2><button class="close" onclick="closeModal()">×</button></div><p class="muted">Ký ức được lưu cục bộ trên thiết bị này. Không cần máy chủ bên ngoài.</p>'+(state.memories.map(m=>'<div class="memory">'+esc(m.text)+'<small>'+esc(m.type)+' · '+new Date(m.created).toLocaleString("vi-VN")+'</small></div>').join("")||'<p class="muted">Chưa có ký ức.</p>')+'</div></div>')}
function resetApp(){if(!confirm("Khôi phục dữ liệu nhân vật về mặc định?"))return;localStorage.removeItem(KEY);location.reload()}
function render(){
  document.documentElement.style.setProperty("--chat-bg",state.appearance.background?'url("'+state.appearance.background+'")':"none");
  document.documentElement.style.setProperty("--chat-blur",(state.appearance.blur||0)+"px");
  document.getElementById("app").innerHTML='<div class="app"><aside class="left"><div class="brand">NGƯỜI YÊU AI<span>Vũ Ngọc Anh · ROLEPLAY</span></div><div class="profile"><div class="avatar">'+avatar()+'</div><h1>'+esc(state.character.name)+'</h1><p>'+esc(state.character.job)+'</p><span class="tag">❤️ '+esc(state.relationshipDNA.stage)+'</span><span class="tag">● ROLEPLAY</span></div><nav class="nav"><button onclick="openSocial()"><b>👥 Social Life</b><small>Cuộc sống riêng của Ngọc Anh</small></button><button onclick="openEmotion()"><b>🌙 Emotion Dashboard</b><small>Cảm xúc và trạng thái</small></button><button onclick="openDNA()"><b>❤️ Relationship DNA</b><small>Mối quan hệ với Ốc</small></button><button onclick="openMemories()"><b>🧠 Memory</b><small>Những điều cô ấy nhớ</small></button><button onclick="openSettings()"><b>⚙️ Character</b><small>Avatar · hình nền · tính cách</small></button></nav></aside><main class="chat"><div class="chat-bg"></div><div class="chat-shade"></div><header class="header"><div class="head"><div class="head-avatar">'+avatar()+'</div><div><strong>'+esc(state.character.name)+'</strong><small>● Roleplay · đang ở đây với Ốc</small></div></div><div class="header-actions"><button class="icon" onclick="refreshTrends()" title="Cập nhật trend">✦</button><button class="icon" onclick="openSettings()">⚙</button></div></header><section class="messages" id="messages">'+renderMessages()+'</section><form class="composer" onsubmit="event.preventDefault();send()"><input id="input" autocomplete="off" placeholder="Nhắn cho Ngọc Anh…"><button class="send">➤</button></form></main><aside class="right">'+renderRight()+'</aside><nav class="mobile-nav"><button onclick="openSocial()"><b>👥</b>Social</button><button onclick="openEmotion()"><b>🌙</b>Emotion</button><button onclick="openDNA()"><b>❤️</b>DNA</button><button onclick="openSettings()"><b>⚙</b>Hồ sơ</button></nav></div>';
  const box=document.getElementById("messages");if(box)box.scrollTop=box.scrollHeight;
}
render();refreshTrends();