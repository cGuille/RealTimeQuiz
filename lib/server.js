var app = require("http").createServer(httpRequestHandler)
  , io = require("socket.io").listen(app)
  , fs = require("fs")
  , path = require("path")
  , Quiz = require("./quiz")

  , lib_dir = process.cwd() + "/lib/"
  , static_dir =  process.cwd() + "/static/"
  , port = 8080
  , quiz_file = "myquiz"
  , QUESTIONS_INTERVAL = 5; // seconds

Quiz.loadFromJSONFile(static_dir + quiz_file + ".json", function (quiz) {
  var questions = Quiz.getQuestions(quiz)
    , question;

  app.listen(port);
  console.log("Server started");
  console.log("   - port: " + port);
  console.log("   - working directory: " + process.cwd());

  newQuestion();
  io.sockets.on("connection", function (socket) {
    console.log(socket);
    if (question) {
      io.sockets.emit("question", {
        question: question.question
      });
    }

    socket.on("identification", function (data) {
      socket.set("nickname", data.nickname || "anonymous");
    });

    socket.on("answer", function (request) {
      socket.get("nickname", function (err, nickname) {
        if (err) throw err;

        io.sockets.emit("message", {
          time: +new Date(),
          author: nickname,
          content: request.answer
        });

        if (question) {
          if (question.check(request.answer)) {
            socket.emit("good answer", {
              question: question.question,
              answer: request.answer,
              possible_answers: question.answers
            });
            question = null;
            io.sockets.emit("end of question", null);
            io.sockets.emit("message", {
              time: +new Date(),
              author: null,
              content: "La réponse a été trouvée par " + nickname + " ! Soyez prêt, nouvelle question dans " + QUESTIONS_INTERVAL + " secondes."
            });
            setTimeout(newQuestion, QUESTIONS_INTERVAL * 1000);
          }
        }
      });
    });
  });

  function newQuestion() {
    question = Quiz.pick(questions);

    if (question) {
      io.sockets.emit("question", {
        question: question.question
      });
    } else {
      io.sockets.emit("end of quiz", null);
    }
  }
});

function httpRequestHandler (req, res) {
  var dpath, fpath;

  switch (req.url) {
    // WHITELIST
    case "/client.html":
    case "/client.js":
      fpath = req.url;
      break;
    // DEFAULT ROUTE
    case "/":
      fpath = "/client.html";
      break;
    // 404
    default:
      fpath = "/404.html";
      console.error(404, req.url);
      break;
  }

  switch (path.extname(fpath)) {
    case ".js":
      dpath = lib_dir;
      break;
    case ".html":
    case ".css":
      dpath = static_dir;
      break;
    default:
      res.writeHead(500);
      return res.end("Cannot handle the file extension '" + path.extname(fpath) + "'.");
      break;
  }

  fs.readFile(dpath + fpath, function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end("Error while handling your request.");
    }

    fpath === "/404.html" ? res.writeHead(404) : res.writeHead(200);
    res.end(data);
  });
}
