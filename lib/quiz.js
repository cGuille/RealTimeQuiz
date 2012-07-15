(function () {
  "use strict";

  var fs = require("fs")
    , Question = require("./question").Question;

  module.exports.loadFromJSONFile = loadFromJSONFile;
  module.exports.getQuestions = getQuestions;
  module.exports.pick = pick;

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
      questions[i] = new Question(i, question);
    });

    return questions;
  }

  function pick(questions) {
    var i = rand_int(0, questions.length - 1)
      , q = questions[i];

    questions.splice(i, 1);
    return q;
  }

  function rand_int(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}());
