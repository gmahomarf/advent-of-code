// Copied from https://nodejs.org/docs/latest-v20.x/api/async_context.html#using-asyncresource-for-a-worker-thread-pool

import { AsyncResource } from 'node:async_hooks';
import { EventEmitter } from 'node:events';
import { Worker } from 'node:worker_threads';

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

class WorkerPoolTaskInfo extends AsyncResource {
    constructor(callback, progressCallback) {
        super('WorkerPoolTaskInfo');
        this.callback = callback;
        this.progressCallback = progressCallback;
    }

    done(err, result) {
        this.runInAsyncScope(this.callback, null, err, result);
        this.emitDestroy();  // `TaskInfo`s are used only once.
    }

    progress(err, result) {
        this.runInAsyncScope(this.progressCallback, null, err, result);
    }
}

export class WorkerPool extends EventEmitter {
    constructor(numThreads, workerUrl) {
        super();
        this.numThreads = numThreads;
        this.workerUrl = workerUrl;
        this.workers = [];
        this.freeWorkers = [];
        this.tasks = [];

        for (let i = 0; i < numThreads; i++)
            this.addNewWorker();

        // Any time the kWorkerFreedEvent is emitted, dispatch
        // the next task pending in the queue, if any.
        this.on(kWorkerFreedEvent, () => {
            if (this.tasks.length > 0) {
                const { task, callback } = this.tasks.shift();
                this.runTask(task, callback);
            }
        });
    }

    addNewWorker() {
        const worker = new Worker(this.workerUrl);
        worker.on('message', (result) => {
            // In case of success: Call the callback that was passed to `runTask`,
            // remove the `TaskInfo` associated with the Worker, and mark it as free
            // again.
            if (worker[kTaskInfo].progressCallback) {
                worker[kTaskInfo].progress(null, result);
            } else {
                worker[kTaskInfo].done(null, result);
                worker[kTaskInfo] = null;
                this.freeWorkers.push(worker);
                this.emit(kWorkerFreedEvent);
            }
        });
        worker.on('error', (err) => {
            // In case of an uncaught exception: Call the callback that was passed to
            // `runTask` with the error.
            if (worker[kTaskInfo])
                worker[kTaskInfo].done(err, null);
            else
                this.emit('error', err);
            // Remove the worker from the list and start a new Worker to replace the
            // current one.
            this.workers.splice(this.workers.indexOf(worker), 1);
            this.addNewWorker();
        });
        this.workers.push(worker);
        this.freeWorkers.push(worker);
        this.emit(kWorkerFreedEvent);
    }

    runTask(task, callback, progressCallback = () => { }) {
        if (this.freeWorkers.length === 0) {
            // No free threads, wait until a worker thread becomes free.
            this.tasks.push({ task, callback });
            return;
        }

        const worker = this.freeWorkers.pop();
        worker[kTaskInfo] = new WorkerPoolTaskInfo(callback, progressCallback);
        worker.postMessage(task);
    }

    async close(data) {
        await Promise.all(this.workers.map(w => w.terminate()))
        this.emit('close', data);
    }
}
