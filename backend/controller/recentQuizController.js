const { userModel } = require("../models/userModels");
const quizModel = require("../models/quizModel");

//@desc Get Recent Quizzes Taken by User
//@route GET /api/users/:id/recent-quizzes
//@access Private
const recentQuiz = async (req, res) => {
  const { id } = req.params;
  let { limit } = req.query;

  try {
    const user = await userModel
      .findById(id)
      .populate({
        path: "quizzes.quizId",
        model: "Quiz",
      })
      .select("name quizzes");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }

    limit = parseInt(limit)

    // Retrieve unique recent quizzes
    const recentQuizzesSet = new Set();
    const recentQuizzes = [];
    for (let i = user.quizzes.length - 1; i >= 0; i--) {
      const quiz = user.quizzes[i];
      const {
        date,
        quizId: { topic },
      } = quiz;
      if (!recentQuizzesSet.has(topic)) {
        recentQuizzesSet.add(topic);

        // Fetch the image related to the topic from quizModel
        const quizData = await quizModel.findOne({ topic });
        const image = quizData ? quizData.desktopImage : "";

        recentQuizzes.unshift({ topic, Date: date.toDateString(), image });
      }

      if (recentQuizzes.length >= 5) {
        break;
      }
    }

    res.status(200).json({
      success: true,
      username: user.name,
      recentQuizzes,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error Retrieving Recent Quiz" });
  }
};

module.exports = recentQuiz;
