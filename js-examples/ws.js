const WebSocket = require('ws');

let ws_url = 'ws://localhost:9985/api/v1/streams/valid_transactions'


startWebSocketListener()
function startWebSocketListener() {
    const ws = new WebSocket(ws_url, {origin: 'http://localhost:9985'});

    ws.on('open', function open() {
        console.log('web socket connected')
    })

    ws.on('close', function close() {
        console.log('web socket disconnected')
    })

    ws.on('message', function incoming(data) {
        console.log('Message recieved:', data.toString())
    })
}