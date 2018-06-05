onmessage = function (message) {
    var data =  message.data;
    data.msg = 'ok, received from "task.js"';
    postMessage(data);
}