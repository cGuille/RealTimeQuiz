(function () {
  "use strict";

  module.exports.Question = Question;

  var ESCAPING_REGEX = /[-[\]{}()*+?.,\\^$|#\s]/g;

  function Question(data) {
    this.question = data.question;
    this.answers = data.answer instanceof Array ? data.answer : [data.answer];
  }

  Question.prototype.check = function(input) {
    return this.answers.every(check(input));
  };

  function check(input) {
    return function (answer) {
      return input.search(new RegExp("\\b" + regex_escape(answer) + "\\b", "ig")) !== -1;
    };
  }

  /*
    based on:
      self.escape = function (str) {
        return nativ.replace.call(str, /[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      };
    from: https://github.com/slevithan/XRegExp/blob/master/src/xregexp.js
  */
  function regex_escape(str) {
    return str.replace(ESCAPING_REGEX, '\\$&');
  }
}());
