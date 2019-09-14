/*
* SyncWaterfallHook 同步执行钩子
* 与 SyncHook 不同的是，每个函数的入参数据，是前一个函数的返回值
* 如果初始入参为多个参数，则后续函数能改变的参数只是第一个，其他的参数不会变化
* */

const { SyncWaterfallHook: SyncWaterfallHookTest } = require("tapable");
let Event;
let result;
let firstRun;
let secondRun;

beforeEach(() => {
    Event = new SyncWaterfallHookTest(['arg1', 'arg2']);
    result = [];
    firstRun = false;
    secondRun = false;
});

afterEach(() => {
    result = [];
    firstRun = false;
    secondRun = false;
});

test('注册的函数依次执行，下一个函数的入参是上一个函数的返回值，如果上一个函数没有返回值，则向上寻找', () => {
    Event.tap('Event1', (param1, param2) => {
        firstRun = true;
        result.push(param1);
        result.push(param2);
    });
    Event.tap('Event2', (param1, param2) => {
        secondRun = true;
        result.push(param1);
        result.push(param2);
        return '222';
    });
    Event.tap('Event3', (param1, param2) => {
        secondRun = true;
        result.push(param1);
        result.push(param2);
    });
    const r = Event.call('111', '1111');

    expect(r).toBe('222');
    expect(firstRun).toBeTruthy();
    expect(secondRun).toBeTruthy();
    expect(result).toMatchObject(['111', '1111', '111', '1111', '222', '1111']);
});
