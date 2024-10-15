const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const QuizController = require('./controllers/quizController');
const authenticationController = require('./controllers/authenticationController');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

// Import controllers
const quizController = new QuizController();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use secure cookies in production with HTTPS
}));

// Authentication and Authorization
app.use('/WEB%20FUNDAMENTALS/*', authenticationController.protectRoute);
app.use('/PRE-BOOTCAMP%20WEB%20DEVELOPMENT/*', authenticationController.protectRoute);
app.use('/exams/*', authenticationController.protectRoute);
app.use('/home.html', authenticationController.protectRoute);
app.use('/examJava.html', authenticationController.protectRoute);
app.use('/examWeb.html', authenticationController.protectRoute);
app.use('/Java/*', authenticationController.protectRoute);
app.use('/users', userRoutes);

// Serve static files from the "landing page" directory
app.use(express.static(path.join(__dirname, 'layouts/landingpage')));

// Serve "index.html" for the root route "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'layouts/landingpage/index.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'layouts/landingpage/contact.html'));
});

// Serve about.html at "/about"
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'layouts/landingpage/about.html'));
});

// Static files
app.use(express.static(path.join(__dirname, 'layouts')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/data', express.static(path.join(__dirname, 'data')));

// Quiz routes
app.post('/store-results/:quizId', quizController.storeResults.bind(quizController));
app.get('/get-results/:quizId', quizController.getResults.bind(quizController));
app.delete('/delete-results/:quizId', quizController.deleteResults.bind(quizController));

// User and logs routes
app.get('/getLoggedInUserId', authenticationController.getLoggedInUserId);
app.get('/logs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'logs.html'));
});

// MongoDB connection
mongoose.connect('mongodb+srv://firasrouine:firasrouine@cluster0.hvybzwa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('Error connecting to MongoDB:', err));

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
