var app = require("http").createServer(handler)
  , io = require("socket.io").listen(app)

  , fs = require("fs")
  , path = require("path")

  , lib_dir = process.cwd() + "/lib"
  , static_dir =  process.cwd() + "/static"
  , port = 8080

  , json_quiz = static_dir + "/myquiz.json"
  , quiz;


fs.readFile(json_quiz, function (err, data) {
  if (err) {
    console.error("Cannot read the quiz file '" + json_quiz + "'.");
    console.error("Error: ", err);
    process.exit(-1);
  }
  try {
    quiz = JSON.parse(data);
  } catch (e) {
    console.error("Error while parsing the quiz json file:");
    console.error(e);
    process.exit(-1);
  }
  app.listen(port);
  console.log("Server started");
  console.log("   - port: " + port);
  console.log("   - working directory: " + process.cwd());
});

function handler (req, res) {
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

io.sockets.on("connection", function (socket) {
  socket.emit("news", { hello: "world" });
  socket.on("my other event", function (data) {
    console.log(data);
  });
});
