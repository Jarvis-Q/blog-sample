/**
 * 基于Promise/A+规范实现
 */

// 基础状态
const PENDING = 'pending';
const FULFLLED = 'fulfilled';
const REJECTED = 'rejected';

function Promise (excutor) {
    // 缓存当前promise实例对象
    let scope = this;
    // 初始状态
    scope.status = PENDING;
    // fulfilled状态时 返回的信息
    scope.value = undefined;
    // reject状态时 拒绝的原因
    scope.reason = undefined;
    // 存储fulfilled状态对应的onFulFilled函数
    scope.onFulfilledCallbacks = [];
    // 存储rejected状态时onRejected函数
    scope.onRejectedCallbacks = [];

    // value 为成功态时的终值
    function resolve (value) {
        // fulfilled状态时，传递的值如果是Promise的一个实例，则直接调用其管道函数(then)
        if (value instanceof Promise) {
            return value.then(resolve, reject);
        }

        // 为什么resolve 使用setTimeout实现
        // 2.2.4规范 onFulfilled和onRejected 只允许在执行上下文(execution context)栈仅包含平台代码时运行
        // 注：这里的平台代码指的是引擎、环境以及promise的实施代码。
        // 实践中要确保 onFulfilled和onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行
        setTimeout(() => {
            // 调用resolve 回调对应onFulfilled函数
            if (scope.status === PENDING) {
                // 只能由pending状态 =>fulfilled状态(避免调用多次resolve, reject)
                scope.status = FULFLLED;
                scope.value = value;
                scope.onFulfilledCallbacks.forEach(cb => cb(scope.value));
            }
        })
    }

    // reason 为失败态时接收的拒因
    function reject (reason) {
        setTimeout(() => {
            // 调用rejected 回调对应onRejected函数
            if (scope.status === PENDING) {
                // 只能由pending状态 =>rejected状态(避免调用多次resolve, reject)
                scope.status = REJECTED;
                scope.value = value;
                scope.onRejectedCallbacks.forEach(cb => cb(scope.value));
            }
        })
    }

    // 捕获excutor执行器中抛出的异常
    // 所有Promise执行代码的异常都会被在这里抛出
    // like:
    // new Promise((resolve, reject) => {
    //      // here, some wrong thing happened
    // })
    try {
        excutor(resolve, reject);
    } catch (e) {
        reject(e);
    }
}

/**
 * 对resolve 进行改造增强 针对resolve中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then方法返回的新的promise对象
 * @param  {[type]} x         promise1中onFulfilled的返回值
 * @param  {[type]} resolve   promise2的resolve方法
 * @param  {[type]} reject    promise2的reject方法
 */
function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('循环引用'));
    }

    // 避免多次调用
    let called = false;

    // 如果x是一个promise对象 (该判断和下面 判断是不是thenable对象重复 所以可有可无)
    // 获得它的终值 继续resolve
    if (x instanceof Promise) {
        // 如果为等待态，需要等待直至x被执行或拒绝，并解析y值
        if (x.status === PENDING) {
            x.then(y => {
                resolvePromise(promise2, y, resolve, reject);
            }, reason => {
                reject(reason);
            })
        } else { 
            x.then(resolve, reject);
        }
    } else if (x != null && ((typeof x === 'object') || (typeof x === 'function'))) {
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x, 
                y => {
                    if (called) return;
                    called = true;
                    resolvePromise(promise2, y, resolve, reject);
                }, reason => {
                    if (called) return;
                    called = true;
                    reject(reason);
                })
            } else {
                resolve(x);
            }
        } catch (e) {
            if (called) return;
            called = true;
            reject(e);
        }
    } else {
        resolve(x);
    }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
    const scope = this;
    let newPromise;
    // 处理参数默认值 保证参数后续能够继续执行
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
        throw reason;
    }

    // 同步或二次调用
    if (scope.status === FULFLLED) {
        return newPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onFulfilled(scope.value);
                    resolvePromise(newPromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            })
        })
    }
    // 同步或二次调用
    if (scope.status === REJECTED) {
        return newPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    let x = onRejected(scope.reason);
                    resolvePromise(newPromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            })
        })
    }

    // 等待态(异步操作可能会是此态)
    if (scope.status === PENDING) {
        // 当异步调用resolve/rejected时 将onFulfilled/onRejected收集暂存到集合中
        return newPromise = new Promise((resolve, reject) => {
            scope.onFulfilledCallbacks.push(value => {
                try {
                    // onFulfilled 执行的是外层应用的代码
                    let x = onFulfilled(value);
                    resolvePromise(newPromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            });
            scope.onRejectedCallbacks.push(reason => {
                try {
                    let x = onRejected(reason);
                    resolvePromise(newPromise, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            })
        })
    }
}