(function () {
  "use strict";

  module.exports.NotImplementedError = NotImplementedError;

  function NotImplementedError(this_feature) {
    this.message = "Error: '" + this_feature + "' has not been implemented yet."
  }
  NotImplementedError.prototype = new Error();
  NotImplementedError.prototype.constructor = NotImplementedError;
}());
