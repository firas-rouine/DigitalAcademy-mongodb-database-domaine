// models/QuizModel.js

const fs = require('fs').promises;
const path = require('path');

class QuizModel {
  constructor() {
    this.quizzesPath = path.join(__dirname, '../data/results.json');
  }

// create new user answers
  async storeResults(quizId, userId, userResults) {
    try {
      const quizzesData = await fs.readFile(this.quizzesPath, 'utf-8');
      const quizzes = quizzesData ? JSON.parse(quizzesData) : { quizzes: [] };

      const quizIndex = quizzes.quizzes.findIndex(quiz => quiz.quizId === quizId);

      if (quizIndex !== -1) {
        const userResultWithId = {
          userId: userId,
          answers: userResults,
        };

        quizzes.quizzes[quizIndex].users.push(userResultWithId);

      } else {
        // Quiz not found, create a new quiz with the provided data
        const newQuiz = {
          quizId: quizId,
          users: [
            {
              userId: userId,
              answers: userResults,
            }
          ],
        };

        quizzes.quizzes.push(newQuiz);
      }

      // Write the updated data back to the JSON file
      await fs.writeFile(this.quizzesPath, JSON.stringify(quizzes, null, 2));

      return { success: true, message: 'Results stored successfully.' };

    } catch (error) {
      console.error('Error storing results:', error);
      return { success: false, message: 'Error storing results.' };
    }
  }


// get a user response
  async getResults(quizId, userId) {
    try {
      const quizzesData = await fs.readFile(this.quizzesPath, 'utf-8');
      const quizzes = quizzesData ? JSON.parse(quizzesData) : { quizzes: [] };
  
      const quizIndex = quizzes.quizzes.findIndex(quiz => quiz.quizId === quizId);
  
      if (quizIndex !== -1) {
        const userResults = quizzes.quizzes[quizIndex].users.find(user => user.userId === userId);
  
        if (userResults !== undefined) {
          // User found in the specified quiz
          return userResults;
        } else {
          // User not found in the specified quiz
          return { success: false, message: 'User not found in the specified quiz.' };
        }
      } else {
        // Quiz not found
        return { success: false, message: 'Quiz not found.' };
      }
    } catch (error) {
      console.error('Error retrieving results:', error);
      return { success: false, message: 'Error retrieving results.' };
    }
  }


  async deleteResults(quizId, userId) {
    try {
      const resultsData = await fs.readFile(this.quizzesPath, 'utf-8');
      const resultsArray = resultsData ? JSON.parse(resultsData) : [];

      const quizIndex = resultsArray.quizzes.findIndex(result => result.quizId === quizId);
      if (quizIndex !== -1) {
        const userIndex = resultsArray.quizzes[quizIndex].users.findIndex(user => user.userId === userId);
        if (userIndex !== -1) {
          resultsArray.quizzes[quizIndex].users.splice(userIndex, 1);
          await fs.writeFile(this.quizzesPath, JSON.stringify(resultsArray, null, 2));
          return { success: true, message: 'User answers deleted successfully.' };
        }
      }

      return { success: false, message: 'User or quiz not found.' };
    } catch (error) {
      console.error('Error deleting user answers:', error);
      return { success: false, message: 'Error deleting user answers.' };
    }
  }
  
}

module.exports = QuizModel;
