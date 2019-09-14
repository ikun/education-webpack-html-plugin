/*
* SyncBailHook 同步执行钩子
* 与 SyncHook 不同的是，注册的每个函数允许有返回值
* 当有返回值时，注册当函数执行队列会停止，不会继续执行后续的函数
* */

const { SyncBailHook } = require("tapable");
let Event;
let result;
let firstRun;
let secondRun;

beforeEach(() => {
    Event = new SyncBailHook(['arg1', 'arg2']);
    result = [];
    firstRun = false;
    secondRun = false;
});

afterEach(() => {
    result = [];
    firstRun = false;
    secondRun = false;
});

test('正常情况下，每个注册的函数都会被执行', () => {
    Event.tap('Event1', (param1, param2) => {
        firstRun = true;
        result.push(param1);
        result.push(param2);
    });
    Event.tap('Event2', (param1, param2) => {
        secondRun = true;
        result.push(param1);
        result.push(param2);
    });
    const r = Event.call('111', '222');

    // 执行后注册的时间不会回放
    Event.tap('Event3', (param1, param2) => {
        secondRun = true;
        result.push(param1);
        result.push(param2);
    });

    expect(r).toBeUndefined();
    expect(firstRun).toBeTruthy();
    expect(secondRun).toBeTruthy();
    expect(result).toMatchObject(['111', '222', '111', '222']);
});

test('当注册函数有返回值时，执行队列会停止后续函数当执行', () => {
    Event.tap('Event1', (param1, param2) => {
        firstRun = true;
        result.push(param1);
        result.push(param2);
        return 'Event1 return any';
    });
    Event.tap('Event2', (param1, param2) => {
        secondRun = true;
        result.push(param1)
        result.push(param2);
    });
    const r = Event.call('111', '222');

    expect(r).toBe('Event1 return any');
    expect(firstRun).toBeTruthy();
    expect(secondRun).toBeFalsy();
    expect(result).toMatchObject(['111', '222']);
});
