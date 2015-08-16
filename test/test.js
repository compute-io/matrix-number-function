/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	matrixfun = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'compute-matrix-function', function tests() {

	it( 'should export a function', function test() {
		expect( matrixfun ).to.be.a( 'function' );
	});

	it( 'should export a factory function', function test() {
		expect( matrixfun.factory ).to.be.a( 'function' );
	});

	it( 'should export a function to create matrix functions', function test() {
		expect( matrixfun.create ).to.be.a( 'function' );
	});

	it( 'should export an apply function which provides fewer guarantees when validating input arguments', function test() {
		expect( matrixfun.raw ).to.be.a( 'function' );
	});

	it( 'should export a factory function which provides fewer guarantees when validating input arguments', function test() {
		expect( matrixfun.rawFactory ).to.be.a( 'function' );
	});

});
