// var app = require('express')();
// //var http = require('http').Server(app);

// app.get('/', function(req, res){
//   res.send('<h1>Hello world</h1>');
// });
// app.get('/a', function(req, res){
//   res.send('<h1>Hello world aaa</h1>');
// });
// //app.listen(8800);
// app.listen(3000, function(){
//   console.log('listening on *:3000');
// });
const io = require('socket.io-client');
const socket = io('http://localhost:9090?uuid=abc');
socket.on('advert_info',(data)=>{
console.log(data);
console.log(data['key']);
})
socket.send('advert_info','hello!');
function sendMessage() {
  socket.emit('advert_info','hello!!!',(data)=>{
    console.log(data);
    socket.close();
  });
}
sendMessage();
//sendMessage();
//sendMessage();
//socket.close();
// server-side

// const io = require('socket.io')();
// // middleware
// io.use((socket, next) => {
//   let token = socket.handshake.query.token;
//   if (isValid(token)) {
//     return next();
//   }
//   return next(new Error('authentication error'));
// });

// // then
// io.on('connection', (socket) => {
//   let token = socket.handshake.query.token;
//   // ...
// });