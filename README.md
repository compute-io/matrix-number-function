Matrix-Number Function
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> Applies a function to each [matrix](https://github.com/dstructs/matrix) element by broadcasting numeric arguments.


## Installation

``` bash
$ npm install compute-matrix-number-function
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

``` javascript
var matrixfun = require( 'compute-matrix-number-function' );
```

<a name="matrixfun"></a>
#### matrixfun( fcn, ...value[, options] )

Applies a `function` to each [`matrix`](https://github.com/dstructs/matrix) element by broadcasting numeric arguments. `value` arguments may be either [`matrices`](https://github.com/dstructs/matrix) or `number` primitives.

``` javascript
var matrix = require( 'dstructs-matrix' );

var mat = matrix( [5,5], 'int8' );
/*
    [ 0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0 ]
*/

function add( x, y ) {
	return x + y;
}

var out = matrixfun( add, mat, 5 );
/*
    [ 5 5 5 5 5
      5 5 5 5 5
      5 5 5 5 5
      5 5 5 5 5
      5 5 5 5 5 ]
*/
```

The function accepts the following `options`:

*	__dtype__: output data type. Default: `float64`.
*	__out__: `boolean` indicating whether an output [`matrix`](https://github.com/dstructs/matrix) has been provided. Default: `false`.

By default, the output [`matrix`](https://github.com/dstructs/matrix) data type is `float64` in order to preserve precision. To specify a different data type, set the `dtype` option (see [`matrix`](https://github.com/dstructs/matrix) for a list of acceptable data types).

``` javascript
var out = matrixfun( add, mat, 5, {
	'dtype': 'int8';
});
/*
    [ 5 5 5 5 5
      5 5 5 5 5
      5 5 5 5 5
      5 5 5 5 5
      5 5 5 5 5 ]
*/
var dtype = out.dtype;
// returns 'int8'
```

By default, the `function` returns a new [`matrix`](https://github.com/dstructs/matrix). To mutate a [`matrix`](https://github.com/dstructs/matrix) (e.g., when input values can be discarded or when optimizing memory usage), set the `out` option to `true` to indicate that an output [`matrix`](https://github.com/dstructs/matrix) has been provided as the __first__ [`matrix`](https://github.com/dstructs/matrix) argument.

``` javascript
var out = matrix( [5,5], 'int8' );
/*
    [ 0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0 ]
*/

matrixfun( add, out, mat, 5, {
	'out': 'true';
});
/*
      [ 5 5 5 5 5
        5 5 5 5 5
out =   5 5 5 5 5
        5 5 5 5 5
        5 5 5 5 5 ]
*/
```

===
### Factory

The main exported `function` does __not__ make any assumptions regarding the number of input [`matrices`](https://github.com/dstructs/matrix) or `numbers`. To create a reusable [`matrix`](https://github.com/dstructs/matrix) function where argument `types` known, a factory method is provided.


<a name="matrixfun-factory"></a>
#### matrixfun.factory( [fcn,] types[, options] )

Creates an apply `function` to apply a `function` to each [`matrix`](https://github.com/dstructs/matrix) element.

``` javascript
var mfun = matrixfun.factory( ['matrix','number'] );

function add( x, y ) {
	return x + y;
}

var mat = matrix( [5,5], 'int8' );

for ( var i = 0; i < 5; i++ ) {
	for ( var j = 0; j < 5; j++ ) {
		mat.set( i, j, i*5 + j );
	}
}
/*
       [  0  1  2  3  4
          5  6  7  8  9
mat =    10 11 12 13 14
         15 16 17 18 19
         20 21 22 23 24 ]
*/

var out = mfun( add, mat, 5 );
/*
    [  5  6  7  8  9
      10 11 12 13 14
      15 16 17 18 19
      20 21 22 23 24
      25 26 27 28 29 ]
*/
```

An apply `function` may be provided during `function` creation.

``` javascript
var madd = matrixfun.factory( add, ['matrix','number'] );

var out = madd( mat, 5 );
/*
    [  5  6  7  8  9
      10 11 12 13 14
      15 16 17 18 19
      20 21 22 23 24
      25 26 27 28 29 ]
*/
```

The function accepts the following `options`:

*	__dtype__: output data type. Default: `float64`.

By default, the output [`matrix`](https://github.com/dstructs/matrix) data type is `float64`. To specify a different data type, set the `dtype` option.

``` javascript
var madd = matrixfun.factory( add, ['matrix','number'], {
	'dtype': 'int32';
});

var out = madd( mat, 5 );
/*
    [  5  6  7  8  9
      10 11 12 13 14
      15 16 17 18 19
      20 21 22 23 24
      25 26 27 28 29 ]
*/

var dtype = out.dtype;
// returns 'int32'

// ...and for all subsequent calls...
out = madd( mat, 100 );
dtype = out.dtype;
// returns 'int32'
```

__Note__: a factory `function` __always__ returns a new [`matrix`](https://github.com/dstructs/matrix).


===
### Create

To facilitate using [`matrix`](https://github.com/dstructs/matrix) functions within an application where input arguments are of known types and where memory management occurs externally, a method to create minimal [`matrix`](https://github.com/dstructs/matrix) functions is provided.

#### matrixfun.create( [fcn,] types )

Creates an apply `function` to apply a `function` to each [`matrix`](https://github.com/dstructs/matrix) element. The `types` argument defines the input argument types (either [`'matrix'`](https://github.com/dstructs/matrix) or `'number'`).

``` javascript
var mfcn = matrixfun.create( ['number','matrix'] );

var out = mfcn( add, out, 5, mat );
/*
    [  5  6  7  8  9
      10 11 12 13 14
      15 16 17 18 19
      20 21 22 23 24
      25 26 27 28 29 ]
*/

function subtract( x, y ) {
	return x - y;
}

out = mfcn( subtract, out, 5, mat );
/*
    [   0  -1  -2  -3  -4
       -5  -6  -7  -8  -9
      -10 -11 -12 -13 -14
      -15 -16 -17 -18 -19
      -20 -21 -22 -23 -24 ]
*/
```

An apply `function` may be provided during `function` creation.

``` javascript
var madd = matrixfun.create( add, ['matrix','number'] );

var out = madd( out, mat, 5 );
/*
    [  5  6  7  8  9
      10 11 12 13 14
      15 16 17 18 19
      20 21 22 23 24
      25 26 27 28 29 ]
*/
```



===
### Raw

Lower-level APIs are provided which forgo some of the guarantees of the above APIs, such as input argument validation. While use of the above APIs is encouraged in REPL environments, use of the lower-level interfaces may be warranted when arguments are of a known type or when performance is paramount.

#### matrixfun.raw( fcn, ...value[, options] )

Applies a `function` to each [`matrix`](https://github.com/dstructs/matrix) element.

``` javascript
var mat = matrix( [5,5], 'int8' );
/*
    [ 0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0 ]
*/

var out = matrixfun.raw( add, mat, 5 );
/*
    [ 5 5 5 5 5
      5 5 5 5 5
      5 5 5 5 5
      5 5 5 5 5
      5 5 5 5 5 ]
*/
```

The function accepts the same `options` as the main exported [function](#matrixfun).


#### matrixfun.rawFactory( [fcn,] types[, options] )

Creates an apply `function` to apply a `function` to each [`matrix`](https://github.com/dstructs/matrix) element.

``` javascript
var mfun = matrixfun.rawFactory( ['number','matrix'] );

var out = mfun( add, 5, mat );
/*
    [  5  6  7  8  9
      10 11 12 13 14
      15 16 17 18 19
      20 21 22 23 24
      25 26 27 28 29 ]
*/
```

The function accepts the same `options` as [`matrixfun.factory()`](#matrixfun-factory).



## Notes

*	Both factory methods, as well as the `.create()` method, use dynamic code evaluation. Beware when using these methods in the browser as they may violate your [content security policy](https://developer.mozilla.org/en-US/docs/Web/Security/CSP) (CSP). 



## Examples

``` javascript
var matrix = require( 'dstructs-matrix' ),
	matrixfun = require( 'compute-matrix-number-function' );

var mat1,
	mat2,
	out,
	d, i;

d = new Int32Array( 25 );
for ( i = 0; i < d.length; i++ ) {
	d[ i ] = i;
}
mat1 = matrix( d, [5,5], 'int32' );
/*
    [  0  1  2  3  4
       5  6  7  8  9
      10 11 12 13 14
      15 16 17 18 19
      20 21 22 23 24 ]
*/

d = new Int8Array( 25 );
for ( i = 0; i < d.length; i++ ) {
	d[ i ] = 5;
}
mat2 = matrix( d, [5,5], 'int8' );
/*
    [ 5 5 5 5 5
      5 5 5 5 5
      5 5 5 5 5
      5 5 5 5 5
      5 5 5 5 5 ]
*/

function add( x, y, z ) {
	return x + y + z;
}

out = matrixfun( add, mat1, 10, mat2 );
/*
    [ 15 16 17 18 19
      20 21 22 23 24
      25 26 27 28 29
      30 31 32 33 34
      35 36 37 38 39 ]
*/
console.log( out.toString() );
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2015. The [Compute.io](https://github.com/compute-io) Authors.


[npm-image]: http://img.shields.io/npm/v/compute-matrix-number-function.svg
[npm-url]: https://npmjs.org/package/compute-matrix-number-function

[travis-image]: http://img.shields.io/travis/compute-io/matrix-number-function/master.svg
[travis-url]: https://travis-ci.org/compute-io/matrix-number-function

[codecov-image]: https://img.shields.io/codecov/c/github/compute-io/matrix-number-function/master.svg
[codecov-url]: https://codecov.io/github/compute-io/matrix-number-function?branch=master

[dependencies-image]: http://img.shields.io/david/compute-io/matrix-number-function.svg
[dependencies-url]: https://david-dm.org/compute-io/matrix-number-function

[dev-dependencies-image]: http://img.shields.io/david/dev/compute-io/matrix-number-function.svg
[dev-dependencies-url]: https://david-dm.org/dev/compute-io/matrix-number-function

[github-issues-image]: http://img.shields.io/github/issues/compute-io/matrix-number-function.svg
[github-issues-url]: https://github.com/compute-io/matrix-number-function/issues
