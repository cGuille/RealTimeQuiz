(function () {
  "use strict";

  module.exports.CheckingFactory = CheckingFactory;

  var orders = "must contain|must be".split("|")
    , types  = "the text|the word|the number|the date".split("|")

    , NotImplementedError = require("./personnalerrors").NotImplementedError;

  function CheckingFactory() {
    var i, j, l1, l2;

    this.cache = {};

    for (i = 0, l1 = orders.length; i < l1; i += 1) {
      this.cache[orders[i]] = {};
      for (j = 0, l2 = types.length; j < l2; j += 1) {
        this.cache[orders[i]][types[j]] = {};
      }
    }
  }

  CheckingFactory.prototype.getChecker = function(command) {
    var order     = command[0]
      , type      = command[1]
      , ref_value = command[2];

    if (!this.cache[order][type][ref_value]) {
      try {
        this.cache[order][type][ref_value] = this.factories[order][type](ref_value);
      } catch (error) {
        console.error("Catched an error: ", error, " throwing NotImplementedError (CheckingFactory)");
        throw new NotImplementedError(order + " " + type);
      }
    }
    return this.cache[order][type][ref_value];
  };

  CheckingFactory.prototype.factories = {
    "must be": {
      "the text": function (ref_value) {
        return function (input) {
          return input.search(new RegExp(ref_value, "i")) === 0;
        };
      },

      "the word": function (ref_value) {
        return function (input) {
          return input.search(new RegExp(ref_value, "i")) === 0;
        };
      },

      "the number": function (ref_value) {
        return function (input) {
          return parseNumber(input) === ref_value;
        };
      },

      "the date": function (ref_value) {
        return function (input) {
          return this.factories["must be"]["the text"](date_format_from_string(ref_value))(date_format_from_string(input));
        };
      }
    },


    "must contain": {
      "the text": function (ref_value) {
        return function (input) {
          return input.search(new RegExp(".*" + ref_value + ".*", "i")) === 0;
        };
      },

      "the word": function (ref_value) {
        return function (input) {
          return input.search(new RegExp(".*\\b" + ref_value + "\\b.*", "i")) === 0;
        };
      },

      "the number": function (ref_value) {
        return function (input) {
          return input.search(new RegExp(".*\\b" + ref_value + "\\b.*", "i")) === 0;
        };
      },

      "the date": function (ref_value) {
        return function (input) {
          return this.factories["must contain"]["the text"](date_format_from_string(ref_value))(date_format_from_string(input));
        };
      }
    }
  };

  // TOOLS
  // Todo: parseNumber
  // Try to get a number from str (e.g.: "twenty two" → 22)
  function parseNumber(str) {
    return parseFloat(str.replace(/^\D*/, ""));
  }

  // Todo: date_format_from_string
  // Try several date format to get a Date (moment.js?) object from str.
  function date_format_from_string(str) {
    return;
  }
}());


  // CheckingFactory.prototype.getChecker = function(command) {
  //   var order     = command[0]
  //     , type      = command[1]
  //     , ref_value = command[2];

  //   if (!this.cache[order][type][ref_value]) {
  //     this.cache[order][type][ref_value] = factory(order, type, ref_value);
  //   }
  //   return this.cache[order][type][ref_value];
  // };

  // Must return a function which takes the user input as parameter and
  // returns true or false whether the user input match the constraints or not.
  // function factory(order, type, ref_value) {
  //   switch (order) {
  //     case "must be":
  //       switch (type) {
  //         case "the text":
  //           return must_be_the_text(ref_value);
  //         case "the word":
  //           return must_be_the_word(ref_value);
  //         case "the number":
  //           return must_be_the_number(ref_value);
  //         case "the date":
  //         default:
  //           throw new NotImplementedError(order + " " + type);
  //           break;
  //       }
  //       break;
  //     case "must contain":
  //       switch (type) {
  //         case "the text":
  //           return must_contain_the_text(ref_value);
  //         case "the word":
  //           return must_contain_the_word(ref_value);
  //         case "the number":
  //           return must_contain_the_number(ref_value);
  //         case "the date":
  //         default:
  //           throw new NotImplementedError(order + " " + type);
  //           break;
  //       }
  //     default:
  //         throw new NotImplementedError(order);
  //       break;
  //   }
  // }

  // TEXT
  // function must_be_the_text(ref_value) {
  //   return function (input) {
  //     return input.search(new RegExp(ref_value, "i")) === 0;
  //   };
  // }
  // function must_contain_the_text(ref_value) {
  //   return function (input) {
  //     return input.search(new RegExp(".*" + ref_value + ".*", "i")) === 0;
  //   };
  // }

  // WORD
  // function must_be_the_word(ref_value) {
  //   return function (input) {
  //     return input.search(new RegExp(ref_value, "i")) === 0;
  //   };
  // }
  // function must_contain_the_word(ref_value) {
  //   return function (input) {
  //     return input.search(new RegExp(".*\\b" + ref_value + "\\b.*", "i")) === 0;
  //   };
  // }

  // NUMBER
  // function must_be_the_number(ref_value) {
  //   return function (input) {
  //     return parseNumber(input) === ref_value;
  //   };
  // }
  // function must_contain_the_number(ref_value) {
  //   return function (input) {
  //     return input.search(new RegExp(".*\\b" + ref_value + "\\b.*", "i")) === 0;
  //   };
  // }

  //DATE
  // Note: Idea: transform input & ref_value into the same date format (return false if not possible) then call: must_be_the_text(ref_formated)(input_formated)
  // function must_be_the_date(ref_value) {
  //   return function (input) {
  //     return must_be_the_text(date_format_from_string(ref_value))(date_format_from_string(input));
  //   };
  // }
  // function must_contain_the_date(ref_value) {
  //   return function (input) {
  //     return must_contain_the_text(date_format_from_string(ref_value))(date_format_from_string(input));
  //   };
  // }
