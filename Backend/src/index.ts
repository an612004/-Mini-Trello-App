import express from "express";
import db from "./config/firebaseConfig";
import router from "./routers/index";
import cors from "cors"
import session from "express-session";


const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true, 
}));

app.use(session({
  secret: process.env.SESSION_SECRET || "supersecret", 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));

app.use(express.json())
app.use(express.urlencoded({extended: true}))

db
app.use(router)
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
