/* jshint evil:true */
'use strict';

// MODULES //

var isArray = require( 'validate.io-array' ),
	isFunction = require( 'validate.io-function' );


// CREATE //

/**
* FUNCTION: create( [fcn,] types )
*	Returns a function for applying a function to each matrix element.
*
* @param {Function} [fcn] - function to apply. If not provided, a function must be provided at runtime.
* @param {String[]} types - argument types
* @returns {Function} apply function
*/
function create() {
	var nargs = arguments.length,
		types,
		flg,
		num,
		fcn,
		n,
		f,
		i;

	if ( nargs === 1 ) {
		types = arguments[ 0 ];
		flg = true;
	}
	else if ( isFunction( arguments[ 0 ] ) ) {
		fcn = arguments[ 0 ];
		types = arguments[ 1 ];
		flg = false;
	}
	else {
		throw new TypeError( 'invalid input arguments. Must provide a function to apply and an array specifying argument types. Values: `' + arguments + '`.' );
	}
	if ( !isArray( types ) ) {
		throw new TypeError( 'invalid input arguments. Argument types must be a string array. Value: `' + types + '`.' );
	}
	num = types.length;
	for ( i = 0; i < num; i++ ) {
		if ( types[ i ] === 'matrix' ) {
			n = i;
		}
		else if ( types[ i ] !== 'number' ) {
			throw new TypeError( 'invalid input argument. An argument type must be either `matrix` or `number`. Value: `' + types[ i ] + '`.' );
		}
	}
	if ( n === void 0 ) {
		throw new Error( 'invalid input argument. At least one input argument must be a matrix.' );
	}
	// Update the number of input arguments to include the output matrix...
	n = num;
	num += 1;

	// Code generation. Start with the function definition...
	f = 'return function apply(';

	// Check if a function will be provided at runtime...
	if ( flg ) {
		f += 'fcn,';
	}
	// Create the matrix arguments...
	// => function apply( [fcn,] o, v1, v2,...) {
	f += 'o,';
	for ( i = 1; i < num; i++ ) {
		f += 'v' + i;
		if ( i < n ) {
			f += ',';
		}
	}
	f += '){';

	// Create the function body...

	// Create internal variables...
	// => var M, N, i, j;
	f += 'var M,N,i,j;';

	// Perform shape validation...
	f += 'M=o.shape[0];';
	f += 'N=o.shape[1];';
	for ( i = 1; i < num; i++ ) {
		if ( types[ i-1 ] === 'matrix' ) {
			f += 'if(v'+i+'.shape[0]!==M||v'+i+'.shape[1]!==N){';
			f += 'throw new Error(\'invalid input argument. All matrices must have the same dimensions.\');';
			f += '}';
		}
	}
	/*
		var M, N,
			i, j;

		M = o.shape[ 0 ];
		N = o.shape[ 1 ];
		if ( v1.shape[0] !== M || v1.shape[1] !== N ) {
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
		if ( types[ i-1 ] === 'matrix' ) {
			f += 'v' + i + '.get(i,j)';
		} else {
			f += 'v' + i;
		}
		if ( i < n ) {
			f += ',';
		}
	}
	f += '));';
	f += '}}';
	/*
		for ( i = 0; i < M; i++ ) {
			for ( j = 0; j < N; j++ ) {
				o.set( i, j, fcn( v1.get(i,j), v2.get(i,j),...) );
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
		function apply( [fcn,] o, v1, v2,...) {
			var M, N,
				i, j;

			M = o.shape[ 0 ];
			N = o.shape[ 1 ];
			if ( v1.shape[0] !== M ||
				v1.shape[1] !== N
			) {
				throw new Error(...);
			}
			...
			for ( i = 0; i < M; i++ ) {
				for ( j = 0; j < N; j++ ) {
					o.set( i, j, fcn( v1.get(i,j), v2.get(i,j),...) );
				}
			}
			return o;
		}
	*/
} // end FUNCTION create()


// EXPORTS //

module.exports = create;
