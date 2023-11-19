# WebSocket Time Server

This is a simple WebSocket time server that provides real-time updates of the current time. It also serves static HTML pages for displaying the current time and date, and providing information about the server.

## Usage

To run the server, start the Node.js:

```
npm start
```

The server will start listening on port `3000`. You can then access the server at http://localhost:3000.

## API

The server provides the following endpoints:

* `/`: Returns the current time.
* `/date`: Returns the current date.
* `/about`: Provides information about the server.
* `/realtime`: Establishes a WebSocket connection with the server that sends real-time updates.

## Required dependencies

The following dependencies are required to run the server:

* `uuid`
* `ws`

## Development

To run the server in development mode, use the following command:

```
npm run dev
```

This will start the Node.js process with `nodemon`, which will automatically restart the server whenever you make changes to the code.

## License

This project is licensed under the MIT License.
