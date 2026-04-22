import app from "./app.js";
import { connectDB } from "./config/db.js";
import { ENV } from "./lib/ENV.js";

connectDB()

app.listen(ENV.PORT, ()=> {
  console.log(`Server is running on http://localhost:${ENV.PORT}`)
})