var assert = require('assert');
var SortedList = require('sortedlist');
var UniqueSortedList = require('uniquesortedlist');

/**
 * Creates a function that returns an object property.
 */
function getProp(name) {
	return function (obj) {
		return obj[name];
	};
}

/**
 * Custom order function.
 */
function orderFunction(a, b) {
	return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
}

/**
 * Custom compare function.
 */
function compareFunction(a, b) {
	return a.id === b.id;
}

describe('UniqueSortedList([array], [orderFunction], [compareFunction])', function () {
	var data = [
		{ id: 'c', name: 'Adam' },
		{ id: 'a', name: 'Tomas' },
		{ id: 'b', name: 'Robert' },
		{ id: 'a', name: 'Tomas' },
		{ id: 'c', name: 'Adam' },
		{ id: 'c', name: 'Adam' }
	];
	it('should inherit from SortedList', function () {
		var list = new UniqueSortedList();
		assert(list instanceof UniqueSortedList);
		assert(list instanceof SortedList);
	});
	it('should not require a new keyword' , function () {
		assert(UniqueSortedList() instanceof UniqueSortedList);
	});
	it('should have a correct constructor' , function () {
		assert(new UniqueSortedList().constructor === UniqueSortedList);
	});
	it('should uniquefy & sort initial data', function () {
		var list = new UniqueSortedList('bacabcc'.split(''));
		assert(list.join() === 'a,b,c');
	});
	it('should uniquefy & sort initial data with custom order function', function () {
		var list = new UniqueSortedList(data, orderFunction);
		assert(list.map(getProp('id')).join() === 'c,b,a');
	});
	it('should uniquefy & sort initial data with custom order & compare function', function () {
		var list = new UniqueSortedList(data, orderFunction, compareFunction);
		assert(list.compare === compareFunction);
		assert(list.map(getProp('id')).join() === 'c,b,a');
	});
	it('should support UniqueSortedList([array]) signature', function () {
		var list = new UniqueSortedList('bcbaabc'.split(''));
		assert(!list.compare);
		assert(list.join() === 'a,b,c');
	});
	it('should support UniqueSortedList([array], [orderFunction]) signature', function () {
		var list = new UniqueSortedList(data, orderFunction);
		assert(list._order === orderFunction);
		assert(!list.compare);
		assert(list.map(getProp('name')).join(), 'Adam,Robert,Tomas');
	});
	it('should support UniqueSortedList([array], [orderFunction], [compareFunction]) signature', function () {
		var list = new UniqueSortedList(data, orderFunction, compareFunction);
		assert(list._order === orderFunction);
		assert(list.compare === compareFunction);
		assert(list.map(getProp('name')).join(), 'Adam,Robert,Tomas');
	});
	it('should support UniqueSortedList([orderFunction]) signature', function () {
		var list = new UniqueSortedList(orderFunction);
		assert(list._order === orderFunction);
		assert(!list.compare);
		assert(list.length === 0);
	});
	it('should support UniqueSortedList([orderFunction], [compareFunction]) signature', function () {
		var list = new UniqueSortedList(orderFunction, compareFunction);
		assert(list._order === orderFunction);
		assert(list.compare === compareFunction);
		assert(list.length === 0);
	});
	it('should for...in loop only thorugh items', function () {
		var list = new UniqueSortedList(data, orderFunction, compareFunction);
		var keys = [];
		for (var key in list) keys.push(key);
		assert(keys.join() === '0,1,2');
	});
});

describe('#indexOf(item)', function () {
	it('should use SortedList#indexOf when no compare function was passed', function () {
		var data = [
			{ name: 'Robert' },
			{ name: 'Adam' },
			{ name: 'Tomas' }
		];
		var list = UniqueSortedList(data, orderFunction);
		assert(list.indexOf(data[1]) === 0);
		assert(list.indexOf({ name: 'Foo' }) === -1);
		assert(list.map(getProp('name')).join() === 'Adam,Robert,Tomas');
	});
	it('should use #compare() when order & compare function was passed', function () {
		var data = [
			{ id: 'a', name: 'Robert' },
			{ id: 'c', name: 'Adam' },
			{ id: 'b', name: 'Tomas' }
		];
		var list = UniqueSortedList(data, orderFunction, compareFunction);
		assert(list.indexOf(data[2]) === 2);
		assert(list.indexOf({ id: 'f', name: 'Foo' }) === -1);
		assert(list.map(getProp('name')).join() === 'Adam,Robert,Tomas');
	});
});

describe('#insert(item)', function () {
	var data = [
		{ id: 'a', name: 'Robert' },
		{ id: 'c', name: 'Adam' },
		{ id: 'b', name: 'Tomas' }
	];
	it('should insert unique items - simple list', function () {
		var list = UniqueSortedList('bca'.split(''));
		list.insert('d');
		assert(list.join() === 'a,b,c,d');
	});
	it('should insert unique items - object mode with orderFunction', function () {
		var list = UniqueSortedList(data, orderFunction);
		list.insert({ id: 'a', name: 'Rufus' });
		assert(list.map(getProp('name')).join() === 'Adam,Robert,Rufus,Tomas');
	});
	it('should insert unique items - object mode with orderFunction & compareFunction', function () {
		var list = UniqueSortedList(data, orderFunction, compareFunction);
		list.insert({ id: 'd', name: 'Rufus' });
		assert(list.map(getProp('name')).join() === 'Adam,Robert,Rufus,Tomas');
	});
	it('should ignore duplicate items - simple list', function () {
		var list = UniqueSortedList('bca'.split(''));
		list.insert('b');
		assert(list.join() === 'a,b,c');
	});
	it('should ignore duplicate items - object mode with orderFunction', function () {
		var list = UniqueSortedList(data, orderFunction);
		list.insert({ id: 'd', name: 'Adam' });
		assert(list.map(getProp('name')).join() === 'Adam,Robert,Tomas');
	});
	it('should ignore duplicate items - object mode with orderFunction & compareFunction', function () {
		var list = UniqueSortedList(data, orderFunction, compareFunction);
		list.insert({ id: 'b', name: 'Rufus' });
		assert(list.map(getProp('name')).join() === 'Adam,Robert,Tomas');
	});
});
