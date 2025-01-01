const User = require('../models/userModel');
const Log = require('../models/Log');

// Authentication function
exports.authenticateUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate input
      if (!email || !password) {
        return res.status(400).send({ error: 'Email and password are required.' });
      }
  
      // Find user by email
      const user = await User.findOne({ email });
      console.log('User fetched:', user); // Check if user is fetched correctly
  
      if (!user) {
        return res.status(401).send({ error: 'Invalid email or password.' });
      }
  
      // Check if password is correctly set
      console.log('User password from DB:', user.password); // Should not be undefined or null
      console.log('User password :', password);
      // Compare passwords directly
      if (password === user.password) {
        await invalidateUserSessions(req, user.userId); // Pass the user's database ID for session invalidation
        req.session.authenticated = true;
        req.session.sessionId = generateSessionId();
        req.session.userId = user.userId;
        logUserActivity(user.userId);
        res.redirect('/home.html'); // Redirect on successful login
      } else {
        res.status(401).send({ error: 'Invalid email or password.' });
      }
    } catch (error) {
      console.error('Authentication error:', error);
      res.status(500).send({ error: 'An error occurred during authentication.' });
    }
  };
  
// Protect route middleware
exports.protectRoute = (req, res, next) => {
    if (req.session.authenticated && req.session.sessionId && req.session.userId) {
        next();
    } else {
        res.redirect('/');
    }
};

// Get logged-in user ID
exports.getLoggedInUserId = (req, res) => {
    const userId = req.session.userId; // Assuming userId is stored in session after authentication

    if (userId) {
        res.status(200).json({ userId });
    } else {
        res.status(401).json({ error: 'User not authenticated' });
    }
};

// Generate a unique session ID
function generateSessionId() {
    return Math.random().toString(36).substr(2, 9);
}

// Log user activity
async function logUserActivity(userId) {
    const timestamp = new Date().toISOString();

    // Find user details from the database
    const user = await User.findOne({ userId }).exec();

    if (user && user.status === 'pack1') {
        const activity = new Log({
            userId: user.userId,
            username: user.username,
            email: user.email,
            phone: user.phone,
            timestamp
        });

        try {
            await activity.save(); // Save log to MongoDB
            console.log('Activity logged successfully'); // Debug output
        } catch (err) {
            console.error('Error logging activity:', err); // Debug output
        }
    } else {
        console.log('User status is not pack1; activity not logged.'); // Debug output
    }
}

// Invalidate user sessions
async function invalidateUserSessions(req, userId) {
    const sessions = Object.keys(req.sessionStore.sessions);

    for (const sessionId of sessions) {
        const sessionData = JSON.parse(req.sessionStore.sessions[sessionId]);
        if (sessionData.userId === userId) {
            await new Promise((resolve, reject) => {
                req.sessionStore.destroy(sessionId, (err) => {
                    if (err) {
                        console.error('Error invalidating session:', err);
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
    }
}
