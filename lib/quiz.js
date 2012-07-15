(function () {
  "use strict";

  var fs = require("fs")
    , Question = require("./question").Question;

  module.exports.loadFromJSONFile = loadFromJSONFile;
  module.exports.getQuestions = getQuestions;

  function loadFromJSONFile(filepath, callback) {
    fs.readFile(filepath, function (err, data) {
      if (err) {
        throw err;
      }
      callback(JSON.parse(data));
    });
  }

  function getQuestions(quiz) {
    var questions = new Array(quiz.questions.length);

    quiz.questions.forEach(function (question, i) {
      questions[i] = new Question(question);
    });

    return questions;
  }
}());
