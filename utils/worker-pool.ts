// Copied from https://nodejs.org/docs/latest-v20.x/api/async_context.html#using-asyncresource-for-a-worker-thread-pool

declare global {
    var Bun: unknown;
}

import { availableParallelism } from 'node:os';
import { AsyncResource } from 'node:async_hooks';
import { EventEmitter } from 'node:events';
import { Worker } from 'node:worker_threads';

const kTaskInfo = Symbol('kTaskInfo');
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent');

type WorkerCallback<T> = (err: Error | null, message: T | null) => void
class WorkerWithInfo<T> extends Worker {
    [kTaskInfo]: WorkerPoolTaskInfo<T> | null = null;
}

class WorkerPoolTaskInfo<T> extends AsyncResource {
    constructor(readonly callback: WorkerCallback<T>) {
        super('WorkerPoolTaskInfo');
    }

    done(...[err, result]: Parameters<WorkerCallback<T>>) {
        this.runInAsyncScope(this.callback, null, err, result);
        this.emitDestroy();  // `TaskInfo`s are used only once.
    }
}

export class WorkerPool<Task, Result> extends EventEmitter {
    readonly numThreads: number;
    readonly workers: WorkerWithInfo<Result>[];
    readonly freeWorkers: WorkerWithInfo<Result>[];
    readonly tasks: { task: Task, callback: WorkerCallback<Result> }[]
    constructor(public readonly workerUrl: string | URL, numThreads = -1) {
        super();
        this.numThreads = numThreads < 1 ? availableParallelism() : numThreads;
        this.workers = [];
        this.freeWorkers = [];
        this.tasks = [];

        for (let i = 0; i < this.numThreads; i++)
            this.addNewWorker();

        // Any time the kWorkerFreedEvent is emitted, dispatch
        // the next task pending in the queue, if any.
        this.on(kWorkerFreedEvent, () => {
            if (this.tasks.length > 0) {
                const { task, callback } = this.tasks.shift()!;
                this.runTask(task, callback);
            } else if (this.freeWorkers.length === this.workers.length) {
                this.emit('finished');
            }
        });
    }

    addNewWorker() {
        // Bun can run this fine. tsx can't
        // See https://github.com/nodejs/node/issues/47747#issuecomment-2287745567
        const worker = !global.Bun && this.workerUrl.toString().endsWith('.ts') ?
            new WorkerWithInfo<Result>(getTSXWrappedImport(this.workerUrl), {
                eval: true,
            })
            : new WorkerWithInfo<Result>(this.workerUrl);
        worker.on('message', (result) => {
            // In case of success: Call the callback that was passed to `runTask`,
            // remove the `TaskInfo` associated with the Worker, and mark it as free
            // again.
            worker[kTaskInfo]?.done(null, result);
            worker[kTaskInfo] = null;
            this.freeWorkers.push(worker);
            this.emit(kWorkerFreedEvent);
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

    runTask(task: Task, callback: WorkerCallback<Result>) {
        if (this.freeWorkers.length === 0) {
            // No free threads, wait until a worker thread becomes free.
            this.tasks.push({ task, callback });
            return;
        }

        const worker = this.freeWorkers.pop()!;
        worker[kTaskInfo] = new WorkerPoolTaskInfo(callback);
        worker.postMessage(task);
    }

    close() {
        for (const worker of this.workers) worker.terminate();
    }

    async waitUntilFinished() {
        return new Promise((resolve, reject) => {
            this.on('finished', resolve);
            this.on('error', reject);
        });
    }

    async waitUntilFinishedAndClose() {
        await this.waitUntilFinished();
        this.close();
    }
}

function getTSXWrappedImport(importUrl: string | URL) {
    return `import('tsx/esm/api').then(({ register }) => { register(); import('${importUrl}') })`
}
