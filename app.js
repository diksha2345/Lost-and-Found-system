const express = require("express");
const path = require("path");
const fs = require('fs');
const app = express();

// Add middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for all necessary folders - update the order and paths
app.use('/Student_View_Lost', express.static(path.join(__dirname, 'Student_View_Lost')));
app.use('/User_Profile', express.static(path.join(__dirname, 'User_Profile')));
app.use('/login-signup', express.static(path.join(__dirname, 'login-signup')));
app.use('/assets', express.static(path.join(__dirname, "assets")));
app.use('/home', express.static(path.join(__dirname, "home")));
app.use('/home-page', express.static(path.join(__dirname, "home-page")));
app.use('/ReportMissing', express.static(path.join(__dirname, "ReportMissing")));
app.use('/claim-confirmation', express.static(path.join(__dirname, 'claim-confirmation')));
app.use(express.static(path.join(__dirname)));

// Main routes - serve login page directly at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login-signup", "login", "login.html"));
});

app.get("/userProfile", (req, res) => {
  res.sendFile(path.join(__dirname, "User_Profile", "userProfile.html"));
});   

// Protected routes - should be accessed only after login
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "home", "home.html"));
});

app.get("/UserProfile", (req, res) => {
  res.sendFile(path.join(__dirname, "User_Profile", "userProfile.html"));
});

app.get("/StudentView", (req, res) => {
  res.sendFile(path.join(__dirname, "Student_View_Lost", "StudentView.html"));
});

app.get("/ReportMissing", (req, res) => {
  res.sendFile(path.join(__dirname, "ReportMissing", "ReportMissing.html"));
});

app.get("/ClaimConfirmation", (req, res) => {
  res.sendFile(path.join(__dirname, "claim-confirmation", "claim.html"));
});

// Auth routes
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login-signup", "login", "login.html"));
});

app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "login-signup", "signup", "signup.html"));
});

// Add new routes for user authentication
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  
  // Read existing users
  let users = [];
  try {
    const data = fs.readFileSync('users.json', 'utf8');
    users = JSON.parse(data);
  } catch (err) {
    // If file doesn't exist or is empty, start with empty array
  }

  // Check if user already exists
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ error: 'User already exists' });
  }

  // Add new user
  users.push({ name, email, password });

  // Save updated users
  fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
  res.json({ success: true });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Read users
  let users = [];
  try {
    const data = fs.readFileSync('users.json', 'utf8');
    users = JSON.parse(data);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  // Check credentials
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  res.json({ success: true, user: { name: user.name, email: user.email } });
});

app.listen(3000, () => {  
  console.log("Server running on port 3000");
  console.log("Access the application at http://localhost:3000");
});

