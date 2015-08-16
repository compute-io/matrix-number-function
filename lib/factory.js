'use strict';

// MODULES //

var isMatrixLike = require( 'validate.io-matrix-like' ),
	isFunction = require( 'validate.io-function' ),
	isNumber = require( 'validate.io-number-primitive' ),
	isArray = require( 'validate.io-array' ),
	matrix = require( 'dstructs-matrix' ),
	validate = require( './validate.js' ),
	create = require( './create.js' );


// FACTORY //

/**
* FUNCTION: factory( [fcn,] types[, options] )
*	Returns a function for applying a function to each matrix element.
*
* @param {Function} [fcn] - function to apply
* @param {String[]} types - argument types
* @param {Object} [options] - function options
* @param {String} [options.dtype="float64"] - output data type
* @returns {Function} apply function
*/
function factory() {
	var opts = {},
		matrixFcn,
		options,
		types,
		vFLG,
		fcn,
		err,
		flg,
		num,
		idx,
		dt,
		i;

	// Parse the input arguments (polymorphic interface)...
	if ( arguments.length === 1 ) {
		types = arguments[ 0 ];
		vFLG = 2; // arg #s
	}
	else if ( arguments.length === 2 ) {
		if ( isFunction( arguments[ 0 ] ) ) {
			fcn = arguments[ 0 ];
			types = arguments[ 1 ];
			vFLG = 12; // arg #s
		} else {
			types = arguments[ 0 ];
			options = arguments[ 1 ];
			vFLG = 23; // arg #s
		}
	}
	else {
		fcn = arguments[ 0 ];
		types = arguments[ 1 ];
		options = arguments[ 2 ];
		vFLG = 123; // arg #s
	}
	if ( !isArray( types ) ) {
		throw new TypeError( 'invalid input argument. Argument specifying argument types must be a string array. Value: `' + types + '`.' );
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
	num = types.length;
	for ( i = 0; i < num; i++ ) {
		if ( types[ i ] === 'matrix' ) {
			idx = i;
			break;
		}
	}
	dt = opts.dtype || 'float64';
	flg = !fcn;
	if ( flg ) {
		matrixFcn = create( types );
		num += 1;
		idx += 1;
	} else {
		matrixFcn = create( fcn, types );
	}
	/**
	* FUNCTION: apply( [fcn,]...value )
	*	Applies a function to each matrix element.
	*
	* @private
	* @param {Function} [fcn] - function to apply
	* @param {Matrix|Number} value - input values
	* @returns {Matrix} output matrix
	*/
	return function apply() {
		var nargs = arguments.length,
			args = new Array( nargs ),
			k = 0,
			fcn,
			out,
			x,
			i, j;

		for ( i = 0; i < nargs; i++ ) {
			args[ i ] = arguments[ i ];
		}
		if ( flg ) {
			fcn = args[ 0 ];
			k = 1;
			if ( !isFunction( fcn ) ) {
				throw new TypeError( 'invalid input argument. First argument must be a function. Value: `' + fcn + '`.' );
			}
		}
		if ( nargs !== num ) {
			throw new Error( 'invalid input arguments. Must provide ' + num + ' input values.' );
		}
		for ( i = k; i < nargs; i++ ) {
			j = i - k;
			x = args[ i ];
			if ( types[ j ] === 'matrix' && !isMatrixLike( x ) ) {
				throw new TypeError( 'invalid input argument. Input data structure must be a matrix. Value: `' + x + '`.' );
			}
			else if (
				types[ j ] === 'number' &&
				(x === x && !isNumber( x ))
			) {
				throw new TypeError( 'invalid input argument. Input data structure must be a number primitive. Value: `' + x + '`.' );
			}
		}
		out = matrix( args[ idx ].shape, dt );
		if ( flg ) {
			// Make sure that the output matrix comes after the function to apply...
			args.unshift( null );
			args[ 0 ] = fcn;
			args[ 1 ] = out;
		} else {
			args.unshift( out );
		}
		return matrixFcn.apply( null, args );
	};
} // end FUNCTION factory()


// EXPORTS //

module.exports = factory;
