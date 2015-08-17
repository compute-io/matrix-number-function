'use strict';

// MODULES //

var isMatrixLike = require( 'validate.io-matrix-like' ),
	isNumber = require( 'validate.io-number-primitive' ),
	matrix = require( 'dstructs-matrix' );


// APPLY //

/**
* FUNCTION: apply( fcn, ...value[, opts] )
*	Applies a function to each matrix element by broadcasting numeric arguments.
*
* @param {Function} fcn - function to apply
* @param {Matrix|Number} value - input values
* @param {Object} [opts] - function options
* @param {String} [opts.dtype="float64"] - output data type
* @param {Boolean} [opts.out=false] - boolean indicating whether an output matrix has been provided
* @returns {Matrix} output matrix
*/
function apply() {
	var nargs = arguments.length,
		args = new Array( nargs ),
		isMatrix,
		opts,
		fcn,
		out,
		arr,
		dt,
		M, N,
		idx, end, // start/end indices
		i, j, k, l, p;

	for ( i = 0; i < nargs; i++ ) {
		args[ i ] = arguments[ i ];
	}
	nargs -= 1;
	if ( !isMatrixLike( args[ nargs ] ) && !isNumber( args[ nargs ] ) ) {
		opts = args[ nargs ];
		nargs -= 1;
	} else {
		opts = {};
	}
	end = nargs;
	fcn = args[ 0 ];
	if ( opts.out ) {
		out = args[ 1 ];
		idx = 2;
		nargs -= 1;
	} else {
		idx = 1;
	}
	isMatrix = new Array( end-idx+1 );
	for ( l = 0, k = idx; k <= end; l++, k++ ) {
		if ( isNumber( args[ k ] ) ) {
			isMatrix[ l ] = false;
		} else {
			isMatrix[ l ] = true;
			p = k;
		}
	}
	if ( !opts.out ) {
		dt = opts.dtype || 'float64';
		out = matrix( args[ p ].shape, dt );
		idx = 1;
	}
	arr = new Array( nargs );
	M = out.shape[ 0 ];
	N = out.shape[ 1 ];
	for ( i = 0; i < M; i++ ) {
		for ( j = 0; j < N; j++ ) {
			for ( l = 0, k = idx; k <= end; l++, k++ ) {
				if ( isMatrix[ l ] ) {
					arr[ l ] = args[ k ].get( i, j );
				} else {
					arr[ l ] = args[ k ];
				}
			}
			out.set( i, j, fcn.apply( null, arr ) );
		}
	}
	return out;
} // end FUNCTION apply()


// EXPORTS //

module.exports = apply;
