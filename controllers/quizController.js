const QuizModel = require('../models/quizModel');

class QuizController {
  constructor() {
    this.quizModel = new QuizModel();
  }

  async storeResults(req, res) {


    const { quizId } = req.params;
    const { userId } = req.session;
    // const userId  = '75df';
    const userResults = req.body;

    const result = await this.quizModel.storeResults(quizId, userId, userResults);

    res.json(result);
  }

  async getResults(req, res) {
    const quizId = req.params.quizId;
    // const userId = '75df';
    const userId = req.session.userId;
    const result = await this.quizModel.getResults(quizId, userId);

    res.json(result);
  }

  async deleteResults(req, res) {
    const quizId = req.params.quizId;
    // const userId = req.params.userId;
    const userId = req.session.userId;

    const result = await this.quizModel.deleteResults(quizId, userId);
    res.json(result);
  }

}

module.exports = QuizController;
