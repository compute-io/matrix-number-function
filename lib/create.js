/* jshint evil:true */
'use strict';

// MODULES //

var isPositiveInteger = require( 'validate.io-positive-integer' ),
	isFunction = require( 'validate.io-function' );


// CREATE //

/**
* FUNCTION: create( [fcn,] num )
*	Returns a function for applying a function to each matrix element.
*
* @param {Function} [fcn] - function to apply. If not provided, a function must be provided at runtime.
* @param {Number} num - number of matrix arguments (including the output matrix)
* @returns {Function} apply function
*/
function create() {
	var nargs = arguments.length,
		flg,
		num,
		fcn,
		n,
		f,
		i;

	if ( nargs === 1 ) {
		num = arguments[ 0 ];
		flg = true;
	}
	else if ( isFunction( arguments[ 0 ] ) ) {
		fcn = arguments[ 0 ];
		num = arguments[ 1 ];
		flg = false;
	}
	else {
		throw new TypeError( 'invalid input arguments. Must provide a function to apply and the number of matrix arguments. Values: `' + arguments + '`.' );
	}
	if ( !isPositiveInteger( num ) ) {
		throw new TypeError( 'invalid input arguments. Parameter specifying the number of matrix arguments must be a positive integer. Value: `' + num + '`.' );
	}
	n = num - 1;

	// Code generation. Start with the function definition...
	f = 'return function apply(';

	// Check if a function will be provided at runtime...
	if ( flg ) {
		f += 'fcn,';
	}
	// Create the matrix arguments...
	// => function apply( [fcn,] o, m1, m2,...) {
	f += 'o,';
	for ( i = 1; i < num; i++ ) {
		f += 'm' + i;
		if ( i < n ) {
			f += ',';
		}
	}
	f += '){';

	// Create the function body...

	// Create internal variables...
	// => var M, N, i, j;
	f += 'var M,N,i,j;';

	// Perform shape validation (where we assume all input args are matrices)...
	f += 'M=o.shape[0];';
	f += 'N=o.shape[1];';
	for ( i = 1; i < num; i++ ) {
		f += 'if(m'+i+'.shape[0]!==M||m'+i+'.shape[1]!==N){';
		f += 'throw new Error(\'invalid input argument. All matrices must have the same dimensions.\');';
		f += '}';
	}
	/*
		var M, N,
			i, j;

		M = o.shape[ 0 ];
		N = o.shape[ 1 ];
		if ( m1.shape[0] !== M || m1.shape[1] !== N ) {
			throw new Error(...);
		}
		...
	*/

	// Apply the function to each matrix element...
	f += 'for(i=0;i<M;i++){';
	f += 'for(j=0;j<N;j++){';
	f += 'o.set(i,j,';
	if ( flg ) {
		f += 'fcn';
	} else {
		f += 'apply._f';
	}
	f += '(';
	for ( i = 1; i < num; i++ ) {
		f += 'm' + i + '.get(i,j)';
		if ( i < n ) {
			f += ',';
		}
	}
	f += '));';
	f += '}}';
	/*
		for ( i = 0; i < M; i++ ) {
			for ( j = 0; j < N; j++ ) {
				o.set( i, j, fcn( m1.get(i,j), m2.get(i,j),...) );
			}
		}
	*/

	// Return the output matrix...
	f += 'return o;';

	// Close the function:
	f += '};';

	// Create the function in the global scope...
	f = ( new Function( f ) )();

	// If provided an apply function, bind the apply function to the created function so it may be referenced during invocation...
	if ( flg === false ) {
		f._f = fcn;
	}
	return f;
	/*
		function apply( [fcn,] o, m1, m2,...) {
			var M, N,
				i, j;

			M = o.shape[ 0 ];
			N = o.shape[ 1 ];
			if ( m1.shape[0] !== M ||
				m1.shape[1] !== N
			) {
				throw new Error(...);
			}
			...
			for ( i = 0; i < M; i++ ) {
				for ( j = 0; j < N; j++ ) {
					o.set( i, j, fcn( m1.get(i,j), m2.get(i,j),...) );
				}
			}
			return o;
		}
	*/
} // end FUNCTION create()


// EXPORTS //

module.exports = create;
