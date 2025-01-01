const User = require('../models/userModel');
const Log = require('../models/Log');


const getNextUserId = async () => {
  const lastUser = await User.aggregate([
    {
      $addFields: {
        numericUserId: { $toInt: "$userId" } // Cast userId to an integer
      }
    },
    { $sort: { numericUserId: -1 } }, // Sort by numeric userId in descending order
    { $limit: 1 } // Get the last user
  ]).exec();

  if (lastUser && lastUser.length > 0) {
    const lastId = lastUser[0].numericUserId;
    const nextId = lastId + 1;
    return nextId;
  } else {
    return 0; // Starting ID if no user found
  }
};





// Fetch user data by userId
exports.getUser = async (req, res) => {
    console.log('Fetching user with ID:', req.params.userId);
    try {
      const user = await User.findOne({ userId: req.params.userId }).exec();
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'An error occurred while fetching user data' });
    }
  };
  

// Add user data
exports.addUser = async (req, res) => {
  try {
    const nextUserId = await getNextUserId();
    const newUser = new User({ ...req.body, userId: nextUserId });
    await newUser.save();
    res.status(201).json({ msg: 'User added successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding user data' });
  }
};

// Validate user login
exports.validateUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    res.json({ msg: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during login' });
  }
};

// Fetch logs (assuming logs are in the User model, adjust if needed)
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.find(); // Use the Log model to fetch logs
    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'An error occurred while fetching logs' });
  }
};

// Update user data by userId

exports.updateUser = async (req, res) => {
    console.log('Updating user with ID:', req.params.userId); // Debug log
    try {
      const { username, password, email,phone, status,coupon } = req.body;
      const user = await User.findOne({ userId: req.params.userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      user.username = username || user.username;
      // if (password) {
      //   const salt = await bcrypt.genSalt(10); // Generate a salt
      //   user.password = await bcrypt.hash(user.password, salt); // Hash the password
      // }
      user.email = email || user.email;
      user.password = password || user.password;
      user.phone = phone || user.phone;
      user.status = status || user.status;
      user.coupon = coupon || user.coupon;
      await user.save();
      res.status(200).json({ msg: 'User updated successfully', user });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'An error occurred while updating the user.' });
    }
  };
  
  
  


exports.getAllUsers = (req, res) => {
    User.find({})
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ error: 'Failed to fetch users' }));
};
exports.deleteUser = async (req, res) => {
    try {
      const userId = req.params.userId;
      console.log(`Received request to delete user with ID: ${userId}`); // Debugging statement
  
      const result = await User.deleteOne({ userId });
      if (result.deletedCount === 0) {
        console.log('User not found'); // Debugging statement
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ msg: 'User deleted successfully' });
    } catch (error) {
      console.error('Failed to delete user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  };
  


  exports.updateUserStartTimeJava = async (req, res) => {
    console.log('Updating startTime for user with ID:', req.params.userId); // Debug log
    try {
      const user = await User.findOne({ userId: req.params.userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      user.startTimeJava = new Date();
      await user.save();
      res.status(200).json({ msg: 'User startTime updated successfully', startTimeJava: user.startTimeJava });
    } catch (error) {
      console.error('Error updating startTime:', error);
      res.status(500).json({ error: 'An error occurred while updating the startTime.' });
    }
  };
  exports.updateUserStartTimeWeb = async (req, res) => {
    console.log('Updating startTime for user with ID:', req.params.userId); // Debug log
    try {
      const user = await User.findOne({ userId: req.params.userId });
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }
      user.startTimeWeb = new Date();
      await user.save();
      res.status(200).json({ msg: 'User startTime updated successfully', startTimeWeb: user.startTimeWeb });
    } catch (error) {
      console.error('Error updating startTime:', error);
      res.status(500).json({ error: 'An error occurred while updating the startTime.' });
    }
  };
  // Update user's GitHub link by userId
  exports.updateUserGithubJavaLink = async (req, res) => {
    console.log('Updating GitHub link for user with ID:', req.params.userId); // Debug log
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        user.githubJavaUrl = req.body.githubJavaUrl ;
        await user.save();
        res.status(200).json({ msg: 'GitHub link updated successfully', githubJavaUrl: user.githubJavaUrl });
    } catch (error) {
        console.error('Error updating GitHub link:', error);
        res.status(500).json({ error: 'An error occurred while updating the GitHub link.' });
    }
  };

exports.updateUserGithubWebLink = async (req, res) => {
  console.log('Updating GitHub link for user with ID:', req.params.userId); // Debug log
  try {
      const user = await User.findOne({ userId: req.params.userId });
      if (!user) {
          return res.status(404).json({ error: 'User not found.' });
      }
      console.log(req.body.githubWebUrl);
      
      user.githubWebUrl = req.body.githubWebUrl || user.githubWebUrl;
      await user.save();
      res.status(200).json({ msg: 'GitHub link updated successfully', githubWebUrl: user.githubWebUrl });
  } catch (error) {
      console.error('Error updating GitHub link:', error);
      res.status(500).json({ error: 'An error occurred while updating the GitHub link.' });
  }
};
exports.updateUserExamButton = async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    user.ExamButton = new Date();
    await user.save();
    res.status(200).json({ msg: 'User startTime updated successfully', ExamButton: user.ExamButton });
  } catch (error) {
    console.error('Error updating startTime:', error);
    res.status(500).json({ error: 'An error occurred while updating the startTime.' });
  }
};