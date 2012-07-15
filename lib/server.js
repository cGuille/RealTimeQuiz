var app = require("http").createServer(httpRequestHandler)
  , io = require("socket.io").listen(app)

  , fs = require("fs")
  , path = require("path")

  , Quiz = require("./quiz")

  , lib_dir = process.cwd() + "/lib/"
  , static_dir =  process.cwd() + "/static/"
  , port = 8080

  , quiz_file = "myquiz";

Quiz.loadFromJSONFile(static_dir + quiz_file + ".json", function (quiz) {
  var questions = Quiz.getQuestions(quiz);

  app.listen(port);
  console.log("Server started");
  console.log("   - port: " + port);
  console.log("   - working directory: " + process.cwd());

  io.sockets.on("connection", function (socket) {
    socket.emit("ack", { ack: "connection received"});
    socket.on("answer", function (request) {
      console.log("Question: " + quiz.questions[request.id].question);
      console.log("Input answer: " + request.answer);
      console.log("Possible answer(s): " + questions[request.id].answers);
      console.log("Result: ", questions[request.id].check(request.answer));
      console.log("");
    });
  });
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
