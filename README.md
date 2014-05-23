# UniqueSortedList

Extends [darsain/sortedlist](https://github.com/darsain/sortedlist) to create a unique sorted list.

Read about limitations here: [darsain/list#limitations](https://github.com/darsain/list#limitations).

## Install

With [component(1)](https://github.com/component/component):

```bash
component install darsain/uniquesortedlist
```

## Usage

```js
var UniqueSortedList = require('uniquesortedlist');
var list = new UniqueSortedList(['b', 'c', 'b', 'c', 'a']);
list.join(); // a,b,c
list.push('a');
list.join(); // a,b,c
list.unshift('d');
list.join(); // a,b,c,d
```

With custom order & compare functions:

```js
var data = [
	{ id: 'a', name: 'Bruce' },
	{ id: 'c', name: 'Tomas' },
	{ id: 'b', name: 'Adam' },
	{ id: 'b', name: 'George' }
];
var order = function order(a, b) {
	return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
};
var compare = function compare(a, b) {
	return a.id === b.id;
};
var list = new UniqueSortedList(data, order, compare);
list.push({ id: 'c', name: 'John' });
console.log(list); // {id:'b',name:'Adam'}, {id:'a',name:'Bruce'}, {id:'c',name:'Tomas'}
```

## API

### UniqueSortedList([array], [orderFunction], [compareFunction])

UniqueSortedList constructor. `new` keyword is optional.

Supported signatures:

```js
UniqueSortedList([]);
UniqueSortedList([], orderFunction);
UniqueSortedList([], orderFunction, compareFunction);
UniqueSortedList(orderFunction, compareFunction);
UniqueSortedList(null, compareFunction);
```

#### [array]

`Object`

Array, or an array-like object to create a UniqueSortedList from.

Can be `Array`, `List`, `NodeList`, `arguments`, ... everything that looks like `{ 0: 'foo', length: 1 }`.

If you want to have a UniqueSortedList of objects, pass the custom order & compare functions to the arguments below.

#### [orderFunction]

Function for ordering items. Receives 2 arguments, and has to:

- return -1 when a < b
- return 1 when a > b
- return 0 otherwise

Example:

```js
function orderFunction(a, b) {
	return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
}
```

#### [compareFunction]

Function for comparing 2 items. Receives 2 arguments and has to return `true` when items match, or `false` otherwise.

Example:

```js
function compareFunction(a, b) {
	return a.id === b.id;
}
```

If the unique identifier matches the order identifier, you can omit the **compareFunction**. This will also make the unique lookups way faster as UniqueSortedList can now use binary search.

For example, if you are sorting by object's *name* property, and this property also specifies the unique identifier (there can't be any items with the same *name* property), you can just omit the **compareFunction**. But if you're sorting by object's *name* property, but using *id* property as a unique identifier, you have to pass both functions.

#### *Inherits all methods from [SortedList](https://github.com/darsain/sortedlist#api)*

*Methods documented below are either new, or vary from their previous behavior.*

### #compare(a, b)

Current compare function. Compares 2 items and returns `true` when they match, `false` otherwise.

By default `#compare` is `null`. You can set it with constructor's 2nd argument.

### #indexOf(item)

Returns the index of an item in list, or `-1` when not found.

Uses `#compare()` to find an `item` in a list. If `#compare` is not available, it'll fall back to a faster binary search which will use `orderFunction` passed to a constructor, or a default order function which does a raw compare on an items themselves.

### #insert(item)

Adds a new unique item to a list on a sorted position while ignoring duplicates.

Returns new item index, or - when item was not unique - an index of an item already in a list.

## Testing

To run tests:

```
component install --dev
component build --dev
```

And open `test/index.html`

## License

MIT