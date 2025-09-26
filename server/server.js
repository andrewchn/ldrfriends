// server.js
const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");

const { connectDB, getDB } = require("./db");
const { createGroup, joinGroup, leaveGroup, getUserGroup } = require("./helpers/groupHelper");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

connectDB();

app.post("/signup", async (req, res) => {
  console.log("POST /signup");

  try {
    const db = getDB();
    const { username, password } = req.body;

    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db
      .collection("users")
      .insertOne({ username, password: hashedPassword });

    res.json({ message: "User created", username: username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  console.log("POST /login");
  try {
    const db = getDB();
    const { username, password } = req.body;
    const user = await db.collection("users").findOne({ username });

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    res.json({
      message: "Login successful",
      user: { id: user._id, username: username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/getusergroup", async (req, res) => {
    console.log("GET /getusergroup");
  try {
    const db = getDB();
    const { username } = req.query;

    const groupCode = await getUserGroup(username, db);

    res.json({
      message: "User group found",
      groupCode
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
})

app.post("/creategroup", async (req, res) => {
  console.log("POST /creategroup");
  try {
    const db = getDB();
    const { username } = req.body;

    const groupCode = await createGroup(username, db);

    res.json({
      message: "Group created",
      groupCode: groupCode
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/joingroup", async (req, res) => {
  console.log("POST /joingroup");
  try {
    const db = getDB();
    const { username, groupCode } = req.body;

    await joinGroup(username, groupCode, db);

    res.json({
      message: "Group joined",
      groupCode,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/leaveGroup", async (req, res) => {
  console.log("POST /leaveGroup");
  try {
    const db = getDB();
    const { username } = req.body;

    await leaveGroup(username, groupCode, db);

    res.json({
      message: "Left group",
      groupCode
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
