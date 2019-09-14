/*
* SyncHook 同步执行钩子
* 每个注册的函数都会以同样的入参被执行
* 函数执行顺序是注册时的顺序
* */

const { SyncHook } = require("tapable");
let Event;
let result;
let firstRun;
let secondRun;

beforeEach(() => {
    Event = new SyncHook(['arg1', 'arg2']);
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

    expect(r).toBeUndefined();
    expect(firstRun).toBeTruthy();
    expect(secondRun).toBeTruthy();
    expect(result).toMatchObject(['111', '222', '111', '222']);
});

test('当注册函数有返回值时，也不影响注册队列的执行', () => {
    Event.tap('Event1', (param1, param2) => {
        firstRun = true;
        result.push(param1);
        result.push(param2);
        return 'Event1 return any';
    });
    Event.tap('Event2', (param1, param2) => {
        secondRun = true;
        result.push(param1);
        result.push(param2);
    });
    const r = Event.call('111', '222');

    expect(r).toBeUndefined();
    expect(firstRun).toBeTruthy();
    expect(secondRun).toBeTruthy();
    expect(result).toMatchObject(['111', '222', '111', '222']);
});
