const fs = require('fs');
const url = require('url');
const http = require('http');
const WebSocket = require('ws');

// Use uuid to generate a unique id for each websocket connection
const { v4: uuidv4 } = require('uuid');

const settings = {
  locale: 'uk-UA',
  serverPort: 3000,
  wsViewName: 'realtime',
  maxWebSocketConnections: 2,
};

const sendResponse = (res, code, data) => {
  res.writeHead(code, { 'Content-Type': 'text/html' });
  res.end(data);
};

/**
 * Handles incoming HTTP requests and sends appropriate responses based on the requested pathname.
 * @param {http.IncomingMessage} req - The incoming request object.
 * @param {http.ServerResponse} res - The response object used to send the response.
 */
const handleRequest = (req, res) => {
  // Parse the URL to get the pathname
  const parsedUrl = url.parse(req.url, true);

  switch (parsedUrl.pathname) {
    case '/':
      sendResponse(res, 200, `Current time: ${new Date().toLocaleTimeString(settings.locale)}`);
      break;
    case '/date':
      sendResponse(res, 200, `Current date: ${new Date().toLocaleDateString(settings.locale)}`);
      break;
    case '/about':
      sendResponse(res, 200, 'A time server returning current time and date');
      break;
    case `/${settings.wsViewName}`:
      fs.readFile(`./views/${settings.wsViewName}.html`, (err, data) => {
        if (err) {
          sendResponse(res, 500, 'Internal server error');
        } else {
          sendResponse(res, 200, data);
        }
      });
      break;
    default:
      sendResponse(res, 404, 'Not found');
  }
};

/**
 * Handles a WebSocket connection.
 * 
 * @param {WebSocket} ws - The WebSocket connection.
 */
const handleWebSocketConnection = (ws) => {
  if (webSocketTimeServer.clients.size <= settings.maxWebSocketConnections) {
    // This is a hack to add a unique id to the websocket connection
    ws.clientId = uuidv4();

    console.log(`Client ${ws.clientId} connected`);

    // Send the current time every second
    const interval = setInterval(() => {
      ws.send(new Date().toLocaleTimeString(settings.locale));
    }, 1000);

    // When the client disconnects, stop sending the time
    ws.on('close', (code) => {
      console.log(`Client ${ws.clientId} disconnected with code ${code}`);
      clearInterval(interval);
    });
  } else {
    console.log(`Max number of clients reached (${settings.maxWebSocketConnections})`);
    ws.close();
  }
};

const timeServer = http.createServer(handleRequest);
const webSocketTimeServer = new WebSocket.Server({ server: timeServer });

webSocketTimeServer.on('connection', handleWebSocketConnection);

timeServer.listen(settings.serverPort, () => {
  console.log(`Server running at http://localhost:${settings.serverPort}/`);
});
