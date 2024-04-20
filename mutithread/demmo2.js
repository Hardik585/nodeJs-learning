const cluster = require('cluster');
const os = require('os');

// Function to simulate a CPU-intensive task
function performTask(data) {
    // Simulate CPU-intensive task (e.g., heavy computation)
    // In this example, we'll just square the input number
    return data * data;
}

// Notification function that we want to keep single-threaded
function sendNotification(message) {
    console.log("Sending notification:", message);
    // Perform notification logic here
}   

if (cluster.isMaster) {
    // Master process

    // Fork worker processes based on the number of CPU cores
    const numCPUs = os.cpus().length;
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    // Listen for worker process exit events
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
        // Restart the worker
        cluster.fork();
    });

    // Simulate some CPU-intensive tasks
    const inputData = [1, 2, 3, 4, 5];
    for (let data of inputData) {
        // Send data to worker processes for processing
        const worker = Object.values(cluster.workers)[Math.floor(Math.random() * numCPUs)];
        worker.send(data);
    }

    // Send a notification from the main process
    sendNotification("Task processing completed.");
} else {
    // Worker process

    // Listen for messages from the master process
    process.on('message', (data) => {
        // Receive data from master process and perform CPU-intensive task
        const result = performTask(data);
        // Send result back to master process
        process.send(result);
    });
}
