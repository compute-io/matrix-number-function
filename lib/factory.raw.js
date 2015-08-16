'use strict';

// MODULES //

var isPositiveInteger = require( 'validate.io-positive-integer' ),
	isFunction = require( 'validate.io-function' ),
	matrix = require( 'dstructs-matrix' ),
	validate = require( './validate.js' ),
	create = require( './create.js' );


// FACTORY //

/**
* FUNCTION: factory( [fcn,] num[, options] )
*	Returns a function for applying a function to each matrix element.
*
* @param {Function} [fcn] - function to apply
* @param {Number} num - number of matrix arguments
* @param {Object} [options] - function options
* @param {String} [options.dtype="float64"] - output data type
* @returns {Function} apply function
*/
function factory() {
	var opts = {},
		matrixFcn,
		options,
		vFLG,
		num,
		fcn,
		err,
		flg,
		dt;

	// Parse the input arguments (polymorphic interface)...
	if ( arguments.length === 1 ) {
		num = arguments[ 0 ];
		vFLG = 2; // arg #s
	}
	else if ( arguments.length === 2 ) {
		if ( isFunction( arguments[ 0 ] ) ) {
			fcn = arguments[ 0 ];
			num = arguments[ 1 ];
			vFLG = 12; // arg #s
		} else {
			num = arguments[ 0 ];
			options = arguments[ 1 ];
			vFLG = 23; // arg #s
		}
	}
	else {
		fcn = arguments[ 0 ];
		num = arguments[ 1 ];
		options = arguments[ 2 ];
		vFLG = 123; // arg #s
	}
	if ( !isPositiveInteger( num ) ) {
		throw new TypeError( 'invalid input argument. Argument specifying number of input matrices must be a positive integer. Value: `' + num + '`.' );
	}
	// If an apply function has been provided, validate...
	if ( vFLG === 123 ) {
		if ( !isFunction( fcn ) ) {
			throw new TypeError( 'invalid input argument. Apply function must be a function. Value: `' + fcn + '`.' );
		}
	}
	// If an `options` argument has been provided, validate...
	if ( vFLG === 23 || vFLG === 123 ) {
		err = validate( opts, options );
		if ( err ) {
			throw err;
		}
	}
	dt = opts.dtype || 'float64';
	flg = !fcn;
	if ( flg ) {
		matrixFcn = create( num+1 );
		num += 1;
	} else {
		matrixFcn = create( fcn, num+1 );
	}
	/**
	* FUNCTION: apply( [fcn,]...matrix )
	*	Applies a function to each matrix element.
	*
	* @private
	* @param {Function} [fcn] - function to apply
	* @param {...Matrix} matrix - input matrices
	* @returns {Matrix} output matrix
	*/
	return function apply() {
		var nargs = arguments.length,
			args = new Array( nargs ),
			out,
			i;

		for ( i = 0; i < nargs; i++ ) {
			args[ i ] = arguments[ i ];
		}
		if ( nargs !== num ) {
			throw new Error( 'invalid input arguments. Must provide ' + num + ' arguments.' );
		}
		out = matrix( args[ num-1 ].shape, dt );
		if ( flg ) {
			// Make sure that the output matrix comes after the function to apply...
			args.unshift( null );
			args[ 0 ] = args[ 1 ];
			args[ 1 ] = out;
		} else {
			args.unshift( out );
		}
		return matrixFcn.apply( null, args );
	};
} // end FUNCTION factory()


// EXPORTS //

module.exports = factory;
