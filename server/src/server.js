import app from "./app.js";
import { connectDB } from "./lib/db.js";
import { pgConnection } from "./lib/db.js";
import { ENV } from "./lib/ENV.js";

connectDB()
pgConnection("Sirius", "postgres", "857249")

app.listen(ENV.PORT, ()=> {
  console.log(`Server is running on http://localhost:${ENV.PORT}`)
})