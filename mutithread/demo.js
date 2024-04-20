const os = require("os");
const cluster = require("cluster");

function task(data) {
    return data * data;
}

function notification(message) {
    console.log("sending message : " + message);
}
let x = 0;
const numCpus = os.cpus().length;
if (cluster.isMaster) {

    for (let i = 0; i < os.cpus().length; i++) {
        console.log("create thread no : " + i);
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log("hi");
        console.log(`worker exit unexpectedly ${worker.process.pid} died`);
    })

    const inputData = [1, 2, 3, 4, 5];
    for (const data of inputData) {
        const worker = Object.values(cluster.workers)[Math.floor(Math.random() * numCpus)]
        worker.send(data);
    }

    notification("Task completed" + x++);
}
else {
    process.on('message', (data) => {
        // Receive data from master process and perform CPU-intensive task
        const result = task(data);
        // Send result back to master process
        process.send(result);
    });
}

