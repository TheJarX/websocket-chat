const express = require('express')
const app = express();
const SOCKET_PORT = process.env.SOCKET_PORT || 3000;
const PORT = process.env.PORT || 3001;
const wsServer = require('ws').Server;
const wss = new wsServer({ port: `${SOCKET_PORT}` });

app.use(express.static('public'));
 
wss.on('connection', ws => {
  console.log('Connection opened');

  ws.on('message', data => {
    wss.clients.forEach( client => { if (client != ws) client.send(data) });
  });

  ws.on('close', () => {
    console.log('Connection closed!');
  });

});


app.listen(PORT, (err) => {
  if(err) throw err;

  console.log('RUNNING ON PORT ' + PORT);
});
