/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	matrix = require( 'dstructs-matrix' ),
	noop = require( './fixtures/noop.js' ),
	add = require( './fixtures/add.js' ),
	create = require( './../lib/create.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'create apply', function tests() {

	it( 'should export a function', function test() {
		expect( create ).to.be.a( 'function' );
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
				create( value );
			};
		}
	});

	it( 'should throw an error if provided a types argument which is not a string array containing allowed types', function test() {
		var values = [
			['matrix','beep'],
			['number',null],
			[1,2,3]
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				create( value );
			};
		}
	});

	it( 'should throw an error if none of the specified types is a matrix', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			create( ['number','number','number'] );
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
				create( value, ['matrix','number'] );
			};
		}
	});

	it( 'should return a function', function test() {
		var apply;

		apply = create( ['matrix','number'] );
		expect( apply ).to.be.a( 'function' );

		apply = create( noop, ['matrix','number'] );
		expect( apply ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided incompatible matrix-like arguments', function test() {
		var values,
			apply1,
			apply2;

		values = [
			matrix([4,4]),
			matrix([0,0]),
			matrix([5,4])
		];

		apply1 = create( ['matrix','matrix'] );
		apply2 = create( noop, ['matrix','matrix'] );

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue1( values[i] ) ).to.throw( Error );
			expect( badValue2( values[i] ) ).to.throw( Error );
		}
		function badValue1( value ) {
			return function() {
				apply1( noop, matrix([5,5]), value );
			};
		}
		function badValue2( value ) {
			return function() {
				apply2( matrix([5,5]), value );
			};
		}
	});

	it( 'should apply a function to a single matrix', function test() {
		var apply,
			actual,
			mat,
			out,
			d, i;

		d = new Int8Array( 4 );
		for ( i = 0; i < d.length; i++ ) {
			d[ i ] = 1;
		}
		mat = matrix( d, [2,2], 'int8' );

		// General apply...
		out = matrix( [2,2] );

		apply = create( ['matrix','number'] );
		actual = apply( add, out, mat, 1 );

		assert.strictEqual( actual, out );
		assert.strictEqual( out.toString(), '2,2;2,2' );

		// Apply a particular function...
		out = matrix( [2,2] );
		apply = create( add, ['matrix','number'] );

		actual = apply( out, mat, 1 );
		assert.strictEqual( out.toString(), '2,2;2,2' );
	});

	it( 'should apply a function to multiple matrices', function test() {
		var apply,
			actual,
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

		// General apply...
		out = matrix( [2,2] );
		apply = create( ['matrix','number','matrix'] );

		actual = apply( add, out, mat1, 2, mat2 );
		assert.strictEqual( actual, out );
		assert.strictEqual( out.toString(), '5,5;5,5' );

		// Apply a particular function...
		out = matrix( [2,2] );
		apply = create( add, ['matrix','number','matrix'] );

		actual = apply( out, mat1, 2, mat2 );
		assert.strictEqual( actual, out );
		assert.strictEqual( out.toString(), '5,5;5,5' );
	});

});
