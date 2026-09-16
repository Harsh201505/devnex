require("dotenv").config();

const express = require("express");
const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_KEY = process.env.ADMIN_KEY || "change-this-key";

// Make sure database directory exists
const dataDir = path.join(__dirname, "data");
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "devnex.db");
const db = new sqlite3.Database(dbPath);

app.use(helmet({contentSecurityPolicy:false}));
app.use(express.json({limit:"20kb"}));
app.use(express.urlencoded({extended:false,limit:"20kb"}));
app.use(express.static(path.join(__dirname,"public")));

const fs = require("fs");

const dataDir = path.join(__dirname, "data");

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "devnex.db");
const db = new sqlite3.Database(dbPath);
db.serialize(()=>db.run(`CREATE TABLE IF NOT EXISTS enquiries(
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 phone TEXT NOT NULL,
 email TEXT,
 business TEXT,
 message TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`));

const limiter=rateLimit({windowMs:15*60*1000,max:30,standardHeaders:true,legacyHeaders:false});
app.use("/api/",limiter);

function clean(v,max=1000){return String(v??"").trim().replace(/[<>]/g,"").slice(0,max)}
function validPhone(v){return /^[0-9+()\\-\\s]{7,20}$/.test(v)}

app.post("/api/enquiries",(req,res)=>{
 const name=clean(req.body.name,80), phone=clean(req.body.phone,20), email=clean(req.body.email,120);
 const business=clean(req.body.business,80), message=clean(req.body.message,1000);
 if(!name||!phone||!message) return res.status(400).json({error:"Name, phone and message are required."});
 if(!validPhone(phone)) return res.status(400).json({error:"Please enter a valid phone number."});
 if(email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return res.status(400).json({error:"Please enter a valid email."});
 db.run(`INSERT INTO enquiries(name,phone,email,business,message) VALUES(?,?,?,?,?)`,
  [name,phone,email,business,message],function(err){
   if(err) return res.status(500).json({error:"Database error."});
   res.status(201).json({ok:true,id:this.lastID});
 });
});

app.get("/api/health",(req,res)=>res.json({ok:true,service:"Dev.Nex API"}));

app.get("/api/enquiries",(req,res)=>{
 if(req.get("x-admin-key")!==ADMIN_KEY) return res.status(401).json({error:"Unauthorized"});
 db.all("SELECT * FROM enquiries ORDER BY id DESC",(err,rows)=>{
   if(err) return res.status(500).json({error:"Database error."});
   res.json(rows);
 });
});

app.get("/admin",(req,res)=>{
 if(req.query.key!==ADMIN_KEY) return res.status(401).send("Unauthorized. Add ?key=YOUR_ADMIN_KEY");
 db.all("SELECT * FROM enquiries ORDER BY id DESC",(err,rows)=>{
   if(err) return res.status(500).send("Database error.");
   const items=rows.map(x=>`<tr><td>${x.id}</td><td>${x.name}</td><td>${x.phone}</td><td>${x.email||""}</td><td>${x.business||""}</td><td>${x.message}</td><td>${x.created_at}</td></tr>`).join("");
   res.send(`<!doctype html><title>Dev.Nex Enquiries</title><style>body{font-family:Arial;background:#080808;color:#eee;padding:30px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #333;padding:9px;text-align:left}th{color:#d8ff3e}td{font-size:13px}</style><h1>Dev.Nex Enquiries</h1><table><tr><th>ID</th><th>Name</th><th>Phone</th><th>Email</th><th>Business</th><th>Message</th><th>Date</th></tr>${items}</table>`);
 });
});

app.get("*",(req,res)=>{
 if(req.path.startsWith("/api/")||req.path==="/admin") return res.status(404).end();
 res.sendFile(path.join(__dirname,"public","index.html"));
});

app.listen(PORT,()=>console.log(`Dev.Nex running on http://localhost:${PORT}`));
