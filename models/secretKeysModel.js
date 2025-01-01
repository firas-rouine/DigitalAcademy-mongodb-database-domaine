const fs = require('fs');
const path = require('path');

const secretKeysPath = path.join(__dirname, '../data/secretKeys.json');

// Function to get a user by username and password
function getUserByUsernameAndPassword(username, password) {
    const secretKeysData = loadSecretKeys();
    const matchedCredential = secretKeysData.credentials.find(credential => 
        (credential.username === username || credential.email === username) && credential.password === password
    );
    return matchedCredential ? matchedCredential.userId : null;
}
function getUserById(userId) {
    const secretKeysData = loadSecretKeys();
    return secretKeysData.credentials.find(credential => credential.userId === userId) || null;
}
// Private function to load secret keys data from the JSON file
function loadSecretKeys() {
    try {
        const secretKeysData = JSON.parse(fs.readFileSync(secretKeysPath, 'utf8'));
        return secretKeysData;
    } catch (error) {
        console.error('Error reading secret keys:', error);
        return { credentials: [] };
    }
}

module.exports = {
    getUserByUsernameAndPassword,
    getUserById
};
