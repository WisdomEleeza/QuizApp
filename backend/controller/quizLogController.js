const { userModel } = require("../models/userModels");
const QuizResult = require("../models/quizResultModel");

// @desc Get Quiz Logs for a User
// @route GET /api/users/:userId/quiz-logs
// @access Private
const getQuizLogs = async (req, res) => {
  const { userId } = req.params;

  try {
    // Get the user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User Not Found" });
    }

    // Get all quiz logs for the user
    const quizResults = await QuizResult.find({ userId: userId });

    // Use Sets to keep track of unique topics for passed and attempted quizzes
    const passedTopicsSet = new Set();
    const attemptedTopicsSet = new Set();

    // Extract the required information for both passed and attempted quizzes
    const passedQuizData = [];
    const attemptedQuizData = [];

    quizResults.forEach((quizResult) => {
      const quiz = {
        desktopImage: quizResult.desktopImage,
        topic: quizResult.topic,
        date: quizResult.date.toDateString(),
      };

      if (quizResult.score >= 80) {
        // Check if the topic is not already in the set before adding to the passedQuizData
        if (!passedTopicsSet.has(quizResult.topic)) {
          passedTopicsSet.add(quizResult.topic);
          passedQuizData.push(quiz);
        }
      }

      // Check if the topic is not already in the set before adding to the attemptedQuizData
      if (!attemptedTopicsSet.has(quizResult.topic)) {
        attemptedTopicsSet.add(quizResult.topic);
        attemptedQuizData.push(quiz);
      }
    });

    res.status(200).json({
      success: true,
      passedQuizzes: passedQuizData,
      attemptedQuizzes: attemptedQuizData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something Went Wrong" });
  }
};

module.exports = getQuizLogs;
