/* YOU DONT NEED THESE, these are just for the popup you see */
function closeTreactPopup(){ 
  document.querySelector(".treact-popup").classList.add("hidden");
}
function openTreactPopup(){ 
  document.querySelector(".treact-popup").classList.remove("hidden");
}
document.querySelector(".close-treact-popup").addEventListener("click", closeTreactPopup);
setTimeout(op+enTreactPopup, 3000)

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/user_dashboard', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// User schema
const userSchema = new mongoose.Schema({
    fullName: String,
    username: String,
    email: String,
    phoneNumber: String,
    password: String,
    gender: String
});

const User = mongoose.model('User', userSchema);

// Serve registration page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'sign-up.html'));
});

// Serve login page
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Register user
app.post('/register', async (req, res) => {
    const { fullName, username, email, phoneNumber, password, gender } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        fullName,
        username,
        email,
        phoneNumber,
        password: hashedPassword,
        gender
    });

    newUser.save()
        .then(() => res.send('User registered successfully'))
        .catch(err => res.status(400).send('Error: ' + err));
});

// Admin dashboard to view users
app.get('/dashboard', (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).send('Error: ' + err));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

