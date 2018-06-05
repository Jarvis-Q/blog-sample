var worker = new Worker('task.js');

worker.postMessage({
    id: 1,
    msg: 'This is a Worker message'
});

worker.onmessage = function (message) {
    var data = message.data;
    console.log(data);

    // 中止worker
    worker.terminate();
}

worker.onerror = function (error) {
    throw new Error(`fileName: ${error.fileName}, errLineNo: ${error.lineno}, message: ${error.message}`);
}