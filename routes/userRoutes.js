const express = require('express');
const path = require('path');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authenticationController');

// Route to authenticate users
router.post('/authenticate', authController.authenticateUser);

// Route to serve the HTML form for adding a user
router.get('/add', (req, res) => {
    res.sendFile(path.join(__dirname, '../layouts/home.html'));
});

// Route to handle form submission for adding a user
router.post('/add', userController.addUser);

// Route to get all users
router.get('/getall', userController.getAllUsers);  // New route

// Route to get a specific user by userId

router.get('/get/:userId', userController.getUser);
// Route to handle adding a user
router.post('/user', userController.addUser);

// Route to get logs
router.get('/logs', userController.getLogs);



// Route to update a user by userId
router.put('/update/:userId', userController.updateUser);
// Route to delete a user by userId
router.delete('/delete/:userId', userController.deleteUser);
router.patch('/:userId/startTimeJava', userController.updateUserStartTimeJava);
router.patch('/:userId/startTimeWeb', userController.updateUserStartTimeWeb);
router.patch('/:userId/githubJavaUrl', userController.updateUserGithubJavaLink);
router.patch('/:userId/githubWebUrl', userController.updateUserGithubWebLink);
router.patch('/:userId/ExamButton', userController.updateUserExamButton);
module.exports = router;
