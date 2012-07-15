var socket = io.connect("http://localhost:8080")

  , input_message = document.querySelector("input.message")
  , btn_send_message = document.querySelector("button.send-message")
  , div_question_display = document.querySelector("div.question-display");

socket.on("question", function (data) {
  console.log("question: ", data.question);
  div_question_display.textContent = data.question;
});

socket.on("good answer", function (question) {
  console.log("good answer");
  console.log("Question → " + question.question);
  console.log("Expected → " + question.possible_answers);
  console.log("Given    → " + question.answer);
});

socket.on("end of quiz", function () {
  console.log("end of quiz");
  div_question_display.innerHTML = '<em style="opacity: 0.5">Le quiz est terminé.</em>';
});

function send(evt) {
  var val = input_message.value.trim();

  if (val) {
    send_answer(input_message.value);
    input_message.value = "";
  }
}

function send_answer(answer) {
  socket.emit("answer", {
    answer: answer
  });
}

window.onload = function () {
  input_message.focus();
  input_message.addEventListener("keyup", function (e) {
    if (e.keyCode === 13) {
      send(e);
    }
  }, false);

  btn_send_message.addEventListener("click", send, false);
};
