"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../src");
describe('ObservableObject', () => {
    test('should recognize that item on parent level got added (init empty)', () => {
        const testObject = src_1.ObservableObject.create({});
        expect(testObject.__dataChanged).toBeFalsy();
        testObject.a = {};
        expect(testObject.__dataChanged).toBeTruthy();
        // Make sure that "__dataChanged" does not returned as a key
        expect(Object.keys(testObject)).toEqual(['a']);
    });
    test('should not recognize that item on parent level changed if it is empty object and option "ignoreEmptyOnFirstChild" === true (init empty)', () => {
        const testObject = src_1.ObservableObject.create({}, undefined, { ignoreEmptyOnFirstChild: true });
        expect(testObject.__dataChanged).toBeFalsy();
        testObject.a = {};
        expect(testObject.__dataChanged).toBeFalsy();
        expect(testObject.a).toEqual({});
    });
    test('should recognize that item on parent level changed if it is not empty object and option "ignoreEmptyOnFirstChild" === true (init empty)', () => {
        const testObject = src_1.ObservableObject.create({}, undefined, { ignoreEmptyOnFirstChild: true });
        expect(testObject.__dataChanged).toBeFalsy();
        testObject.a = { b: 2 };
        expect(testObject.__dataChanged).toBeTruthy();
        expect(testObject.a).toEqual({ b: 2 });
    });
    test('should not recognize that item on parent level changed if it is empty array and option "ignoreEmptyOnFirstChild" === true (init empty)', () => {
        const testObject = src_1.ObservableObject.create({}, undefined, { ignoreEmptyOnFirstChild: true });
        expect(testObject.__dataChanged).toBeFalsy();
        testObject.a = [];
        expect(testObject.__dataChanged).toBeFalsy();
        expect(testObject.a).toEqual([]);
    });
    test('should recognize that item on parent level changed if it is not empty []] and option "ignoreEmptyOnFirstChild" === true (init empty)', () => {
        const testObject = src_1.ObservableObject.create({}, undefined, { ignoreEmptyOnFirstChild: true });
        expect(testObject.__dataChanged).toBeFalsy();
        testObject.a = [1, 2];
        expect(testObject.__dataChanged).toBeTruthy();
        expect(testObject.a).toEqual([1, 2]);
    });
    test('should recognize that item on parent level changed (init data exists)', () => {
        const testObject = src_1.ObservableObject.create({ a: 1 });
        expect(testObject.__dataChanged).toBeFalsy();
        expect(testObject.a).toEqual(1);
        testObject.a = 2;
        expect(testObject.__dataChanged).toBeTruthy();
        expect(testObject.a).toEqual(2);
    });
    test('should recognize that array on parent level changed (init data exists)', () => {
        const testObject = src_1.ObservableObject.create({ a: [1, 2] });
        expect(testObject.__dataChanged).toBeFalsy();
        expect(testObject.a).toEqual([1, 2]);
        testObject.a.push(3);
        expect(testObject.__dataChanged).toBeTruthy();
        expect(testObject.a).toEqual([1, 2, 3]);
    });
    test('should recognize that item on first child level changed (init data exists)', () => {
        const testObject = src_1.ObservableObject.create({ a: { b: 1 } });
        expect(testObject.__dataChanged).toBeFalsy();
        expect(testObject.a.b).toEqual(1);
        testObject.a.b = 2;
        expect(testObject.__dataChanged).toBeTruthy();
        expect(testObject.a.b).toEqual(2);
    });
    test('should recognize that item on first child level changed if it is now empty and option "ignoreEmptyOnFirstChild" === true (init data exists)', () => {
        const testObject = src_1.ObservableObject.create({ a: { b: 1 } }, undefined, {
            ignoreEmptyOnFirstChild: true,
        });
        expect(testObject.__dataChanged).toBeFalsy();
        expect(testObject.a.b).toEqual(1);
        testObject.a = {};
        expect(testObject.__dataChanged).toBeTruthy();
        expect(testObject.a).toEqual({});
    });
    test('should recognize that item on first child level changed if it is now empty and option "ignoreEmptyOnFirstChild" === false (init data exists)', () => {
        const testObject = src_1.ObservableObject.create({ a: { b: 1 } }, undefined, {
            ignoreEmptyOnFirstChild: false,
        });
        expect(testObject.__dataChanged).toBeFalsy();
        expect(testObject.a.b).toEqual(1);
        testObject.a = {};
        expect(testObject.__dataChanged).toBeTruthy();
        expect(testObject.a).toEqual({});
    });
    test('should recognize that array on first child level changed (init data exists)', () => {
        const testObject = src_1.ObservableObject.create({ a: { b: [1, 2] } });
        expect(testObject.__dataChanged).toBeFalsy();
        expect(testObject.a.b).toEqual([1, 2]);
        testObject.a.b.push(3);
        expect(testObject.__dataChanged).toBeTruthy();
        expect(testObject.a.b).toEqual([1, 2, 3]);
    });
    test('should recognize that item on second child level changed (init data exists)', () => {
        const testObject = src_1.ObservableObject.create({ a: { b: { c: 1 } } });
        expect(testObject.__dataChanged).toBeFalsy();
        expect(testObject.a.b).toEqual({ c: 1 });
        expect(testObject.a.b.c).toEqual(1);
        testObject.a.b.c = 2;
        expect(testObject.__dataChanged).toBeTruthy();
        expect(testObject.a.b).toEqual({ c: 2 });
    });
    test('should recognize that item on parent level got deleted (init data exists)', () => {
        const testObject = src_1.ObservableObject.create({ a: 1 });
        expect(testObject.__dataChanged).toBeFalsy();
        expect(testObject.a).toEqual(1);
        delete testObject.a;
        expect(testObject.__dataChanged).toBeTruthy();
        expect(testObject.a).toEqual(undefined);
        expect(testObject).toEqual({});
    });
    test('should recognize that item on parent level got deleted even with and option "ignoreEmptyOnFirstChild" === true (init data exists)', () => {
        const testObject = src_1.ObservableObject.create({ a: 1 }, undefined, {
            ignoreEmptyOnFirstChild: true,
        });
        expect(testObject.__dataChanged).toBeFalsy();
        expect(testObject.a).toEqual(1);
        delete testObject.a;
        expect(testObject.__dataChanged).toBeTruthy();
        expect(testObject.a).toEqual(undefined);
        expect(testObject).toEqual({});
    });
    test('should recognize that item on second child level got deleted (init data exists)', () => {
        const testObject = src_1.ObservableObject.create({ a: { b: { c: 1 } } });
        expect(testObject.__dataChanged).toBeFalsy();
        expect(testObject.a.b).toEqual({ c: 1 });
        delete testObject.a.b;
        expect(testObject.__dataChanged).toBeTruthy();
        expect(testObject.a.b).toEqual(undefined);
        expect(testObject).toEqual({ a: {} });
    });
    test('should recognize that item on second child level changed with null (init data exists)', () => {
        const testObject = src_1.ObservableObject.create({ a: { b: { c: null } } });
        expect(testObject.__dataChanged).toBeFalsy();
        expect(testObject.a.b).toEqual({ c: null });
        expect(testObject.a.b.c).toEqual(null);
        testObject.a.b.c = 2;
        expect(testObject.__dataChanged).toBeTruthy();
        expect(testObject.a.b).toEqual({ c: 2 });
    });
    // test('xxxxxx', () => {
    // 	const testObject = ObservableObject.create({ a: { } }, undefined, { ignoreEmptyOnFirstChild: true });
    // 	expect(testObject.__dataChanged).toBeFalsy();
    // 	expect(testObject).toEqual({ a: { b: { c: 1 } } });
    // 	((testObject.a! as DataObject).b as DataObject).c = 2;
    // 	// expect((testObject.a! as DataObject).b).toEqual({ c: 1 });
    // 	expect(testObject.__dataChanged).toBeTruthy();
    // 	// expect(testObject.a).toEqual({});
    // 	// expect((testObject.a! as DataObject).b).toEqual({ c: 1 });
    // 	// expect(((testObject.a! as DataObject).b! as DataObject).c).toEqual(1);
    // 	// ((testObject.a! as DataObject).b! as DataObject).c = 2;
    // 	// expect((testObject.a! as DataObject).b).toEqual({ c: 2 });
    // });
});
