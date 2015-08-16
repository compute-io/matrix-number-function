/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	matrix = require( 'dstructs-matrix' ),
	noop = require( './fixtures/noop.js' ),
	add = require( './fixtures/add.js' ),
	factory = require( './../lib/factory.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'apply factory', function tests() {

	it( 'should export a function', function test() {
		expect( factory ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided a types argument which is not a string array', function test() {
		var values = [
			'5',
			5,
			NaN,
			true,
			null,
			undefined,
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				factory( value );
			};
		}
	});

	it( 'should throw an error if provided a types argument which is not a string array containing allowed types', function test() {
		var values = [
			['matrix',2,3],
			['matrix',null],
			['matrix','number','beep']
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				factory( value );
			};
		}
	});

	it( 'should throw an error if none of the specified types is a matrix', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			factory( ['number','number'] );
		}
	});

	it( 'should throw an error if provided an apply function argument which is not a function', function test() {
		var values = [
			'5',
			5,
			NaN,
			true,
			null,
			undefined,
			[],
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				factory( value, ['matrix','number'], {} );
			};
		}
	});

	it( 'should throw an error if provided an options argument which is not an object', function test() {
		var values = [
			'5',
			5,
			NaN,
			true,
			null,
			undefined,
			[],
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				factory( noop, ['matrix','number'], value );
			};
		}
	});

	it( 'should throw an error if provided an invalid option', function test() {
		var values = [
			5,
			NaN,
			true,
			null,
			undefined,
			[],
			{},
			function(){}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue1( values[i] ) ).to.throw( TypeError );
			expect( badValue2( values[i] ) ).to.throw( TypeError );
		}
		function badValue1( value ) {
			return function() {
				factory( ['matrix','number'], {
					'dtype': value
				});
			};
		}
		function badValue2( value ) {
			return function() {
				factory( noop, ['matrix','number'], {
					'dtype': value
				});
			};
		}
	});

	it( 'should return a function', function test() {
		var apply;

		apply = factory( ['matrix','number'] );
		assert.isFunction( apply );

		apply = factory( noop, ['matrix','number'] );
		assert.isFunction( apply );

		apply = factory( noop, ['matrix','number'], {} );
		assert.isFunction( apply );
	});

	it( 'should throw an error if not provided the correct number of input values', function test() {
		var apply;

		apply = factory( ['matrix','matrix'] );
		expect( foo ).to.throw( Error );
		expect( foo2 ).to.throw( Error );

		apply = factory( noop, ['matrix','matrix'] );
		expect( bar ).to.throw( Error );

		function foo() {
			apply( noop );
		}
		function foo2() {
			var m = matrix( [2,2] );
			apply( noop, m, m, m );
		}
		function bar() {
			apply( matrix( [2,2] ) );
		}
	});

	it( 'should throw an error if not provided arguments having the correct types', function test() {
		var values,
			apply1,
			apply2,
			apply3,
			apply4;

		values = [
			'5',
			true,
			null,
			undefined,
			[],
			{},
			function(){}
		];

		apply1 = factory( noop, ['matrix'] );
		apply2 = factory( ['number','matrix','matrix'] );
		apply3 = factory( noop, ['number','matrix','matrix','matrix'] );
		apply4 = factory( ['number','matrix'] );

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue1( values[i] ) ).to.throw( TypeError );
			expect( badValue2( values[i] ) ).to.throw( TypeError );
			expect( badValue3( values[i] ) ).to.throw( TypeError );
			expect( badValue4( values[i] ) ).to.throw( TypeError );
		}
		function badValue1( value ) {
			return function() {
				apply1( value );
			};
		}
		function badValue2( value ) {
			return function() {
				apply2( noop, 5, matrix([5,5]), value );
			};
		}
		function badValue3( value ) {
			return function() {
				apply3( 5, matrix([5,5]), matrix([5,5]), value );
			};
		}
		function badValue4( value ) {
			return function() {
				apply4( noop, value, matrix([5,5]) );
			};
		}
	});

	it( 'should throw an error if provided incompatible matrix-like arguments', function test() {
		var values,
			apply;

		values = [
			matrix([4,4]),
			matrix([0,0]),
			matrix([5,4])
		];

		apply = factory( ['matrix','matrix'] );

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				apply( noop, matrix([5,5]), value );
			};
		}
	});

	it( 'should throw an error if provided an apply function argument which is not a function', function test() {
		var values,
			apply;

		values = [
			'5',
			5,
			NaN,
			true,
			null,
			undefined,
			[],
			{}
		];

		apply = factory( ['matrix'] );

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				apply( value, matrix([2,2]) );
			};
		}
	});

	it( 'should apply a function to a single matrix', function test() {
		var apply,
			mat,
			out,
			d, i;

		d = new Int8Array( 4 );
		for ( i = 0; i < d.length; i++ ) {
			d[ i ] = 1;
		}
		mat = matrix( d, [2,2], 'int8' );

		// General apply function...
		apply = factory( ['matrix','number'] );
		out = apply( add, mat, 1 );
		assert.strictEqual( out.toString(), '2,2;2,2' );

		// Specialized apply function...
		apply = factory( add, ['matrix','number'] );
		out = apply( mat, 1 );
		assert.strictEqual( out.toString(), '2,2;2,2' );
	});

	it( 'should apply a function to multiple matrices', function test() {
		var apply,
			mat1,
			mat2,
			out,
			d, i;

		d = new Int8Array( 4 );
		for ( i = 0; i < d.length; i++ ) {
			d[ i ] = 1;
		}
		mat1 = matrix( d, [2,2], 'int8' );

		d = new Int8Array( 4 );
		for ( i = 0; i < d.length; i++ ) {
			d[ i ] = 2;
		}
		mat2 = matrix( d, [2,2], 'int8' );

		// General apply function...
		apply = factory( ['matrix','number','matrix'] );
		out = apply( add, mat1, 2, mat2 );
		assert.strictEqual( out.toString(), '5,5;5,5' );

		// Specialized apply function...
		apply = factory( add, ['matrix','number','matrix'] );
		out = apply( mat1, 2, mat2 );
		assert.strictEqual( out.toString(), '5,5;5,5' );
	});

	it( 'should apply a function and return a matrix having a specified type', function test() {
		var apply,
			mat,
			out,
			d, i;

		d = new Int8Array( 4 );
		for ( i = 0; i < d.length; i++ ) {
			d[ i ] = 1;
		}
		mat = matrix( d, [2,2], 'int8' );

		apply = factory( add, ['matrix','number'], {
			'dtype': 'float32'
		});
		out = apply( mat, 1 );

		assert.strictEqual( out.dtype, 'float32' );
		assert.strictEqual( out.toString(), '2,2;2,2' );
	});

});
