const KEY="nguoi-yeu-ai-v1";
const base={setup:false,character:{name:"Linh",age:25,relationship:"lover",face:"Khuôn mặt trái xoan, ánh mắt dịu, nụ cười nhẹ",hair:"Tóc dài tự nhiên, màu nâu đen",body:"Cao 165cm, dáng thanh lịch, cân đối",style:"Modern feminine, thanh lịch",voice:"Nữ, ấm và nhẹ",personality:"Dịu dàng, tinh tế, hài hước, biết lắng nghe, đôi lúc tinh nghịch",speech:"Tiếng Việt tự nhiên, ngắn gọn, thân mật"},user:{name:"",likes:"",dislikes:""},memories:[],messages:[]};
let state=load();
function load(){try{return Object.assign(structuredClone(base),JSON.parse(localStorage.getItem(KEY)||"{}"))}catch(e){return structuredClone(base)}}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function esc(s){return String(s||"").replace(/[&<>"']/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]})}
function rel(){return {new:"Mới làm quen",dating:"Đang tìm hiểu",lover:"Người yêu",wife:"Vợ/chồng"}[state.character.relationship]||"Tùy chỉnh"}
function render(){
document.getElementById("app").innerHTML='<div class="app"><aside class="side"><div class="brand">NGƯỜI YÊU AI<small>ONE CHARACTER · LONG MEMORY</small></div><div class="avatar">♡</div><div class="profile"><h2>'+esc(state.character.name)+'</h2><div class="muted">'+rel()+" · "+state.character.age+' tuổi</div><p class="pill">Ký ức: '+state.memories.length+'</p></div><button onclick="openSetup()">⚙ Hồ sơ nhân vật</button><button onclick="openMemories()">🧠 Ký ức của em</button><button onclick="resetAll()">↻ Bắt đầu lại</button><div class="muted" style="margin-top:auto;font-size:12px">Dữ liệu bản thử nghiệm nằm trên thiết bị này.</div></aside><main class="chat"><header class="top"><div><b>'+esc(state.character.name)+'</b><div class="muted" style="font-size:12px">'+rel()+" · đang trò chuyện</div></div><button onclick=\"openSetup()\">Thiết lập</button></header><section class=\"messages\" id=\"messages\">"+(state.messages.length?state.messages.map(function(m){return '<div class="msg '+m.role+'"><div class="bubble">'+esc(m.text).replace(/\n/g,"<br>")+'</div>'+(m.role==="ai"&&m.action?'<div class="role">'+esc(m.action)+'</div>':"")+"</div>"}).join(""):'<div class="empty">Bắt đầu cuộc trò chuyện với '+esc(state.character.name)+'<br><span class="muted">Cô ấy sẽ tự nhận diện những điều đáng nhớ.</span></div>')+'</section><form class="composer" onsubmit="send(event)"><input id="input" autocomplete="off" placeholder="Nói điều gì đó với cô ấy…"><button>Gửi</button></form></main></div>';
document.getElementById("messages").scrollTop=999999;
if(!state.setup) setTimeout(openSetup,150);
}
function openSetup(){
var c=state.character,u=state.user;
document.body.insertAdjacentHTML("beforeend",'<div class="modal" id="modal"><div class="card"><h2>Thiết lập cô ấy một lần</h2><p class="muted">Một nhân vật duy nhất, có thể chỉnh sửa sau này.</p><div class="grid"><div class="field"><label>Tên</label><input id="f-name" value="'+esc(c.name)+'"></div><div class="field"><label>Tuổi (18+)</label><input id="f-age" type="number" min="18" value="'+c.age+'"></div><div class="field"><label>Mối quan hệ ban đầu</label><select id="f-rel"><option value="new">Mới làm quen</option><option value="dating">Đang tìm hiểu</option><option value="lover">Người yêu</option><option value="wife">Vợ/chồng</option></select></div><div class="field"><label>Tên của bạn</label><input id="f-user" value="'+esc(u.name)+'"></div><div class="field full"><label>Khuôn mặt / nhận diện</label><input id="f-face" value="'+esc(c.face)+'"></div><div class="field"><label>Tóc</label><input id="f-hair" value="'+esc(c.hair)+'"></div><div class="field"><label>Vóc dáng</label><input id="f-body" value="'+esc(c.body)+'"></div><div class="field"><label>Phong cách</label><input id="f-style" value="'+esc(c.style)+'"></div><div class="field"><label>Giọng nói</label><input id="f-voice" value="'+esc(c.voice)+'"></div><div class="field full"><label>Tính cách</label><textarea id="f-personality">'+esc(c.personality)+'</textarea></div><div class="field full"><label>Cách nói chuyện</label><textarea id="f-speech">'+esc(c.speech)+'</textarea></div><div class="field"><label>Bạn thích</label><input id="f-likes" value="'+esc(u.likes)+'"></div><div class="field"><label>Bạn không thích</label><input id="f-dislikes" value="'+esc(u.dislikes)+'"></div></div><div class="actions"><button onclick="closeModal()">Hủy</button><button class="primary" onclick="saveSetup()">Lưu nhân vật</button></div></div></div>');
document.getElementById("f-rel").value=c.relationship
}
function closeModal(){var m=document.getElementById("modal");if(m)m.remove()}
function saveSetup(){
var g=function(id){return document.getElementById(id).value};
state.character=Object.assign({},state.character,{name:g("f-name").trim()||"Linh",age:Math.max(18,+g("f-age")||25),relationship:g("f-rel"),face:g("f-face"),hair:g("f-hair"),body:g("f-body"),style:g("f-style"),voice:g("f-voice"),personality:g("f-personality"),speech:g("f-speech")});
state.user={name:g("f-user"),likes:g("f-likes"),dislikes:g("f-dislikes")};state.setup=true;save();closeModal();render()
}
function addMemory(text,type,importance){if(!text.trim())return;var found=state.memories.find(function(m){return m.text.toLowerCase()===text.toLowerCase()});if(!found){state.memories.unshift({id:Date.now(),text:text.trim(),type:type||"conversation",importance:importance||1,created:new Date().toISOString()});state.memories=state.memories.slice(0,200)}}
function extractMemory(text){
var rules=[[/tôi tên là (.+)/i,"Tên của bạn là $1","profile"],[/anh tên là (.+)/i,"Tên của bạn là $1","profile"],[/tôi thích (.+)/i,"Bạn thích $1","preference"],[/anh thích (.+)/i,"Bạn thích $1","preference"],[/tôi không thích (.+)/i,"Bạn không thích $1","preference"],[/anh không thích (.+)/i,"Bạn không thích $1","preference"],[/sinh nhật (?:của )?tôi là (.+)/i,"Sinh nhật của bạn là $1","important"],[/sinh nhật (?:của )?anh là (.+)/i,"Sinh nhật của bạn là $1","important"],[/anh đang (.+)/i,"Gần đây bạn đang $1","episode"],[/tôi đang (.+)/i,"Gần đây bạn đang $1","episode"]];
rules.forEach(function(r){var m=text.match(r[0]);if(m)addMemory(r[1].replace("$1",m[1]),r[2],r[2]==="important"?3:2)})
}
function context(){return state.memories.slice(0,10).map(function(m){return m.text}).join("; ")}
function response(text){
var low=text.toLowerCase(),answer,action;
if(/buồn|mệt|áp lực|chán|stress/.test(low)){answer="Lại đây nào. Em nghe anh kể nhé. Hôm nay có chuyện gì làm anh mệt vậy?";action="*Cô nhìn anh dịu dàng, rồi ngồi lại gần như muốn dành cho anh một khoảng yên tĩnh.*"}
else if(/nhớ em|nhớ cô|nhớ/.test(low)){answer="Em cũng vui vì anh tìm đến em. Kể em nghe hôm nay của anh đi.";action="*Cô mỉm cười, ánh mắt mềm lại.*"}
else if(/yêu|thương/.test(low)){answer=state.character.relationship==="wife"?"Em biết mà. Lại đây, để em ôm anh một chút.":"Nghe anh nói vậy tự nhiên em thấy vui. Em ở đây mà.";action="*Cô khẽ cười, hơi nghiêng đầu nhìn anh.*"}
else if(/hôm nay|đang làm gì/.test(low)){answer=context()?"Em vẫn nhớ những chuyện anh từng kể: "+context()+". Hôm nay anh thế nào?":"Em đang ở đây nói chuyện với anh. Còn anh, hôm nay thế nào?";action="*Cô chống cằm, chăm chú nghe anh kể.*"}
else{answer="Em nghe đây. "+(context()?"Em vẫn nhớ: "+context()+". ":"")+"Anh kể tiếp cho em nhé.";action="*Cô nhìn anh chăm chú, chờ anh nói tiếp.*"}
return {answer:answer,action:action}
}
function send(e){e.preventDefault();var input=document.getElementById("input"),text=input.value.trim();if(!text)return;state.messages.push({role:"user",text:text,time:Date.now()});extractMemory(text);var r=response(text);state.messages.push({role:"ai",text:r.answer,action:r.action,time:Date.now()});save();render()}
function openMemories(){
document.body.insertAdjacentHTML("beforeend",'<div class="modal" id="modal"><div class="card"><h2>🧠 Ký ức của em</h2><p class="muted">Thông tin được nhận diện từ cuộc trò chuyện.</p>'+(state.memories.length?state.memories.map(function(m){return '<div class="memory"><b>'+esc(m.text)+'</b><span class="muted">'+esc(m.type)+" · "+new Date(m.created).toLocaleDateString("vi-VN")+'</span><button style="float:right" onclick="delMemory('+m.id+')">Xóa</button></div>'}).join(""):'<p class="muted">Chưa có ký ức nào.</p>')+'<div class="actions"><button onclick="closeModal()">Đóng</button></div></div></div>')
}
function delMemory(id){state.memories=state.memories.filter(function(m){return m.id!==id});save();closeModal();openMemories()}
function resetAll(){if(confirm("Xóa toàn bộ nhân vật, ký ức và hội thoại trên thiết bị này?")){localStorage.removeItem(KEY);state=load();render()}}
render();