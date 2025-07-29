require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();

const userRoute = require('./routes/user');
const dataRoute = require('./routes/data');
const { restrictToLogin, checkForAuth } = require('./middleware');
const { connectDB } = require('./config/DB')
const USER = require("./models/users");
const USER_DATA = require('./models/data');

const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'token']
}));

// Handle preflight requests
app.options('*', cors());

// Db Connection

connectDB()

//  Auth Middleware
app.use(checkForAuth);

// Routes
app.get("/allUsers", restrictToLogin(["admin"]), async (req, res) => {
  const allUsers = await USER_DATA.find().populate("user");
  res.json({
    allUsers,
    admin: req.user
  });
});

app.get("/employee", restrictToLogin(["employee"]), async (req, res) => {
  const user = await USER.findOne({ fullname: req.user.fullname });
  const data = await USER_DATA.findOne({ user: req.user._id });

  if (!user) {
    return res.status(401).json({ message: "Invalid user" });
  }

  res.json({ user, data });
});

app.post('/logout', (req, res) => {
  return res.status(200).json({ message: 'Logged out successfully' });
});

app.get('/', (req, res) => {
  return res.send("Api is Working");
});


// Other Routes
app.use("/", dataRoute);
app.use("/user", userRoute);

// DB Connection
app.listen(PORT, () => {
  console.log("Server is listening on PORT: " + PORT);
});
