import app from "./app.js";
import { connectDB } from "./lib/db.js";
import { pgConnection } from "./lib/db.js";
import { ENV } from "./lib/ENV.js";
import {createServer} from 'node:http';
import { initailizeSocket } from "./lib/socket.js";

const server = createServer(app)
initailizeSocket(server)

connectDB()
pgConnection()

server.listen(ENV.PORT, ()=> {
  console.log(`Server is running on http://localhost:${ENV.PORT}`)
})