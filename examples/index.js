'use strict';

var matrix = require( 'dstructs-matrix' ),
	matrixfun = require( './../lib' );

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
