'use strict';

// MODULES //

var isFunction = require( 'validate.io-function' ),
	isNumber = require( 'validate.io-number-primitive' ),
	isMatrixLike = require( 'validate.io-matrix-like' ),
	matrix = require( 'dstructs-matrix' ),
	validate = require( './validate.js' );


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
		opts = {},
		isMatrix,
		err,
		fcn,
		out,
		arr,
		dt,
		M, N,
		x,
		i, j, k;

	for ( i = 0; i < nargs; i++ ) {
		args[ i ] = arguments[ i ];
	}
	i = nargs - 1;
	x = args[ i ];
	if (
		!isMatrixLike( x ) &&
		(x === x && !isNumber( x ))
	) {
		nargs -= 1;
		err = validate( opts, args[ nargs ] );
		if ( err ) {
			throw err;
		}
		args.length = nargs;
	}
	fcn = args.shift();
	nargs -= 1;
	if ( !isFunction( fcn ) ) {
		throw new TypeError( 'invalid input argument. First argument must be a function. Value: `' + fcn + '`.' );
	}
	if ( opts.out ) {
		out = args.shift();
		if ( !isMatrixLike( out ) ) {
			throw new TypeError( 'invalid input argument. Output argument must be a matrix. Value: `' + out + '`.' );
		}
		M = out.shape[ 0 ];
		N = out.shape[ 1 ];
		nargs -= 1;
	}
	isMatrix = new Array( nargs );
	for ( i = 0; i < nargs; i++ ) {
		x = args[ i ];
		if ( isMatrixLike( x ) ) {
			if ( M === void 0 ) {
				M = x.shape[ 0 ];
				N = x.shape[ 1 ];
			}
			else if (
				x.shape[ 0 ] !== M ||
				x.shape[ 1 ] !== N
			) {
				throw new Error( 'invalid input argument. All input matrices must have the same dimensions.' );
			}
			isMatrix[ i ] = true;
		}
		else if ( isNumber( x ) || x !== x ) {
			isMatrix[ i ] = false;
		}
		else {
			throw new TypeError( 'invalid input argument. Input data structures must be either matrices or number primitives. Value: `' + x + '`.' );
		}
	}
	if ( M === void 0 ) {
		throw new Error( 'invalid input arguments. At least one argument must be a matrix.' );
	}
	if ( !opts.out ) {
		dt = opts.dtype || 'float64';
		out = matrix( [M,N], dt );
	}
	arr = new Array( nargs );
	for ( i = 0; i < M; i++ ) {
		for ( j = 0; j < N; j++ ) {
			for ( k = 0; k < nargs; k++ ) {
				if ( isMatrix[ k ] ) {
					arr[ k ] = args[ k ].get( i, j );
				} else {
					arr[ k ] = args[ k ];
				}
			}
			out.set( i, j, fcn.apply( null, arr ) );
		}
	}
	return out;
} // end FUNCTION apply()


// EXPORTS //

module.exports = apply;
