const mongoose = require("mongoose");
const { Schema } = mongoose;

const answerSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true, // Auto-generate ObjectId for each answer
  },
  text: {
    type: String,
    required: true,
  },
  is_chosen: {
    type: Boolean,
    required: true,
  },
  is_correct: {
    type: Boolean,
    required: true,
  },
  points: Number,
});

const quizResultSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quizId: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    name: {
      type: String,
    },
    score: {
      type: Number,
      default: 0,
    },
    topic: {
      type: String,
    },
    desktopImage: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    results: [
      {
        resultId: {
          type: Schema.Types.ObjectId,
          auto: true,
        },
        name: {
          type: String,
        },
        questionNumber: {
          type: Number,
          required: true,
        },
        question: {
          type: String,
          required: true,
        },
        answers: [answerSchema],
        topic: {
          type: String,
        },
        desktopImage: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now(),
        },
      },
    ],
  },
  { timestamps: true }
);

const QuizResult = mongoose.model("QuizResults", quizResultSchema);
module.exports = QuizResult;
