const http = require('http');
const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const User = require("./models/User");
const Leave = require("./models/Leave");
const OD = require("./models/OD");
const AttendanceModel = require("./models/Attendance");
const AttendanceAdjustment = require("./models/AttendanceAdjustment");

const PORT = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/leaveApp').then(() => {
    console.log("Connected to MongoDB (leaveApp)");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/'); },
    filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage: storage }).single('file');

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    if (pathname.startsWith('/uploads/') && method === 'GET') {
        const filePath = path.join(__dirname, pathname);
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end("File not found");
            } else {
                res.writeHead(200);
                res.end(data);
            }
        });
        return;
    }

    if ((pathname === "/upload" || pathname === "/od") && method === "POST") {
        upload(req, res, async (err) => {
            if (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ message: "Upload error" }));
                return;
            }
            try {
                if (pathname === "/upload") {
                    const { username } = req.body;
                    if (req.file && username) {
                        await User.findOneAndUpdate({ username }, { profileImg: req.file.filename });
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: "File uploaded successfully", filename: req.file.filename }));
                    } else {
                        res.writeHead(400); res.end(JSON.stringify({ message: "Missing data" }));
                    }
                } else if (pathname === "/od") {
                    const { username, event, date } = req.body;
                    const proofFile = req.file ? req.file.filename : "";
                    const newOD = new OD({ username, event, date, proofFile });
                    await newOD.save();
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "OD request submitted" }));
                }
            } catch (err) {
                res.writeHead(500); res.end(JSON.stringify({ message: "Server error" }));
            }
        });
        return;
    }

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const getJson = () => {
                try { return body ? JSON.parse(body) : {}; } catch (e) { return {}; }
            };

            if (pathname === "/" && method === "GET") {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write("<h1>Home Page</h1>");
                res.end();
            }
            else if (pathname === "/login" && method === "POST") {
                const { username, password } = getJson();
                const user = await User.findOne({ username: username?.trim(), password: password?.trim() });
                if (user) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "Login successful", username: user.username, role: user.role, profileImg: user.profileImg }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: "Invalid credentials" }));
                }
            }
            else if (pathname === "/signup" && method === "POST") {
                const { username, password, role } = getJson();
                const newUser = new User({ username: username?.trim(), password: password?.trim(), role: role || 'student' });
                await newUser.save();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Signup successful" }));
            }
            else if (pathname === "/leaves" && method === "GET") {
                const username = parsedUrl.searchParams.get('username');
                const role = parsedUrl.searchParams.get('role');
                const leaves = role === 'teacher' ? await Leave.find().sort({ createdAt: -1 }) : await Leave.find({ username }).sort({ createdAt: -1 });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(leaves));
            }
            else if (pathname === "/leaves" && method === "POST") {
                const { username, reason, startDate, endDate } = getJson();
                const newLeave = new Leave({ username, reason, startDate, endDate });
                await newLeave.save();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Leave applied successfully" }));
            }
            else if (pathname.includes("/status") && method === "PUT") {
                const parts = pathname.split('/');
                const id = parts[2];
                const { status } = getJson();
                if (pathname.includes("leaves")) { await Leave.findByIdAndUpdate(id, { status }); } 
                else { await OD.findByIdAndUpdate(id, { status }); }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Status updated" }));
            }
            else if (pathname === "/od" && method === "GET") {
                const username = parsedUrl.searchParams.get('username');
                const role = parsedUrl.searchParams.get('role');
                const ods = role === 'teacher' ? await OD.find().sort({ createdAt: -1 }) : await OD.find({ username }).sort({ createdAt: -1 });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(ods));
            }
            else if (pathname === "/students" && method === "GET") {
                const students = await User.find({ role: "student" }, "username");
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(students));
            }
            else if (pathname.startsWith("/attendance")) {
                if (method === "GET") {
                    if (pathname === "/attendance/today") {
                        const today = new Date(); today.setHours(0, 0, 0, 0);
                        const records = await AttendanceModel.find({ date: { $gte: today } });
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(records));
                    } else if (pathname === "/attendance/adjustments") {
                        const adjustments = await AttendanceAdjustment.find();
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(adjustments));
                    } else {
                        const username = pathname.split('/').pop();
                        const totalMarked = await AttendanceModel.countDocuments({ username });
                        const presentMarked = await AttendanceModel.countDocuments({ username, status: "Present" });
                        const adj = await AttendanceAdjustment.findOne({ username });
                        const extraPresent = adj ? adj.extraPresent : 0;
                        const extraAbsent = adj ? adj.extraAbsent : 0;
                        const present = presentMarked + extraPresent;
                        const absent = (totalMarked - presentMarked) + extraAbsent;
                        const total = present + absent;
                        const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ username, total, present, absent, percentage, extraPresent, extraAbsent }));
                    }
                } else if (method === "POST") {
                    if (pathname === "/attendance") {
                        const { username, status } = getJson();
                        const date = new Date(); date.setHours(0, 0, 0, 0);
                        await AttendanceModel.findOneAndUpdate({ username, date }, { status }, { upsert: true });
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: "Attendance saved" }));
                    } else if (pathname === "/attendance/adjust") {
                        const { username, type, change } = getJson();
                        const field = type === 'present' ? 'extraPresent' : 'extraAbsent';
                        let adj = await AttendanceAdjustment.findOne({ username });
                        if (!adj) adj = new AttendanceAdjustment({ username });
                        adj[field] = Math.max(0, (adj[field] || 0) + Number(change));
                        await adj.save();
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Adjustment saved', adj }));
                    }
                }
            }
            else {
                res.writeHead(404);
                res.end("Invalid Request");
            }
        } catch (error) {
            console.error("Server Error:", error);
            res.writeHead(500); res.end(JSON.stringify({ message: "Internal server error" }));
        }
    });
});

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
