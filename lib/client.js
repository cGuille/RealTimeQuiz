var socket = io.connect("http://localhost:8080");

socket.on("ack", function (data) {
    console.log(data);
});

function send_answer(id, anwser) {
    socket.emit("answer", {
        id: id,
        answer: anwser
    });
}
