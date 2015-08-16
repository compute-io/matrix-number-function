/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	matrix = require( 'dstructs-matrix' ),
	noop = require( './fixtures/noop.js' ),
	add = require( './fixtures/add.js' ),
	factory = require( './../lib/factory.raw.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'apply factory (raw)', function tests() {

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
