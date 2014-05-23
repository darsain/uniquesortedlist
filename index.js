var SortedList = require('sortedlist');
var inherit = require('inherit');
var definer = require('definer');
var proto = SortedList.prototype;
var writableDescriptor = { writable: true };

module.exports = UniqueSortedList;

function UniqueSortedList(array, orderFunction, compareFunction) {
	if (!(this instanceof UniqueSortedList)) return new UniqueSortedList(array, orderFunction, compareFunction);
	if (typeof array === 'function' || arguments.length === 2 && !array) {
		compareFunction = orderFunction;
		orderFunction = array;
		array = null;
	}
	definer(this).define('compare', compareFunction, writableDescriptor);
	SortedList.call(this, array, orderFunction);
}

inherit(UniqueSortedList, SortedList);

definer(UniqueSortedList.prototype)
	.type('m')

	.m('constructor', UniqueSortedList)
	.m('indexOf', indexOf)
	.m('insert', insert);

function indexOf(item) {
	if (!this.compare) return proto.indexOf.call(this, item);
	for (var i = 0; i < this.length; i++)
		if (this.compare(this[i], item)) return i;
	return -1;
}

function insert(item) {
	var index = this.indexOf(item);
	return ~index ? index : proto.insert.call(this, item);
}