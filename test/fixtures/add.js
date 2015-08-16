'use strict';

/**
* FUNCTION: add( ...value )
*	Adds input values.
*
* @param {...Number} value - input value
* @returns {Number} sum
*/
function add() {
	var len = arguments.length,
		sum = 0,
		i;

	for ( i = 0; i < len; i++ ) {
		sum += arguments[ i ];
	}
	return sum;
}

// EXPORTS //

module.exports = add;
