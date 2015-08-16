TODO
====

1. Each exported method should be wrapped
	-	specify argument types
		- 	e.g., `('matrix','number','number','matrix')
	-	create custom validation logic given the specified argument types
		-	e.g., an array of validate fcns; `[isMatrixLike,isNumber,isNumber,isMatrixLike]`
2. for general apply, either matrix-like or `number`
	-	how to implement apply logic? have to check if `arg[k]` is number each time? => yes.
3. 
