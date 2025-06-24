require('dotenv').config();

const express = require("express");
const { connectDB } = require("./Connection");
const cors = require("cors");

const app = express();

const userRoute = require('./routes/user');
const dataRoute = require('./routes/data');
const { restrictToLogin, checkForAuth } = require('./middleware');
const USER = require("./models/users");
const USER_DATA = require('./models/data');

const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
const allowedOrigins = [
  'https://attapp-eight.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: allowedOrigins,
}));

// Handle preflight requests
app.options('*', cors());


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

app.get("/", restrictToLogin(["employee"]), async (req, res) => {
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

// Other Routes
app.use("/", dataRoute);
app.use("/user", userRoute);

// DB Connection
connectDB(process.env.DB_URL).then(() => {
  app.listen(PORT, () => {
    console.log("Server is listening on PORT: " + PORT);
  });
}).catch((err) => {
  console.error("Failed to connect to DB:", err);
});
