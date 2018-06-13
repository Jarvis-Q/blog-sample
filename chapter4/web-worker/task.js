onmessage = function (message) {
    var data =  message.data;
    data.msg = 'ok, received from "main.js"';
    postMessage(data);
}