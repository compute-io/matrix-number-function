/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	matrix = require( 'dstructs-matrix' ),
	add = require( './fixtures/add.js' ),
	apply = require( './../lib/apply.raw.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'apply (raw)', function tests() {

	it( 'should export a function', function test() {
		expect( apply ).to.be.a( 'function' );
	});

	it( 'should apply a function to a single matrix', function test() {
		var mat,
			out,
			d, i;

		d = new Int8Array( 4 );
		for ( i = 0; i < d.length; i++ ) {
			d[ i ] = 1;
		}
		mat = matrix( d, [2,2], 'int8' );

		out = apply( add, mat, 1 );
		assert.strictEqual( out.toString(), '2,2;2,2' );
	});

	it( 'should apply a function to multiple matrices', function test() {
		var mat1,
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

		out = apply( add, mat1, 5, mat2 );
		assert.strictEqual( out.toString(), '8,8;8,8' );
	});

	it( 'should apply a function and return a matrix having a specified type', function test() {
		var mat,
			out,
			d, i;

		d = new Int8Array( 4 );
		for ( i = 0; i < d.length; i++ ) {
			d[ i ] = 1;
		}
		mat = matrix( d, [2,2], 'int8' );

		out = apply( add, mat, 1, {
			'dtype': 'float32'
		});
		assert.strictEqual( out.dtype, 'float32' );
		assert.strictEqual( out.toString(), '2,2;2,2' );
	});

	it( 'should apply a function to a single matrix and use a provided output matrix', function test() {
		var mat,
			out,
			actual,
			d, i;

		d = new Int8Array( 4 );
		for ( i = 0; i < d.length; i++ ) {
			d[ i ] = 1;
		}
		mat = matrix( d, [2,2], 'int8' );

		out = matrix( [2,2] );
		actual = apply( add, out, 1, mat, {
			'out': true
		});
		assert.strictEqual( out, actual );
		assert.strictEqual( out.toString(), '2,2;2,2' );
	});

});
