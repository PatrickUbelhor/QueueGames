# QueueGames
This application requires [NodeJS](https://nodejs.org/en/).

The server MUST be online before opening web client.

## Server
* NodeJS server written in Typescript
* Written in TypeScript
* Communicates with clients using websockets
* Runs on port 8080.

#### To compile and start server:
1. Navigate to: `/server`
2. Install dependencies: `npm install`
3. Compile code: `tsc`
4. Navigate to: `/server/build`
5. Run command: `node Main.js`


## Client
* React framework
* Written in TypeScript
* Communicates with server using websockets

#### To run the client:
1. Navigate to: `/web`
2. Install dependencies: `npm install`
3. Run command: `npm start`
4. Open web browser and connect to `localhost:3000`
