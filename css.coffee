# css.coffee - A library that enables you to write CSS in Javascript, Coffeescript, or any other JS flavour.
#
# Copyright (c) 2014 Dennis Raymondo van der Sluis
#
# This program is free software: you can redistribute it and/or modify
#     it under the terms of the GNU General Public License as published by
#     the Free Software Foundation, either version 3 of the License, or
#     (at your option) any later version.
#
#     This program is distributed in the hope that it will be useful,
#     but WITHOUT ANY WARRANTY; without even the implied warranty of
#     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#     GNU General Public License for more details.
#
#     You should have received a copy of the GNU General Public License
#     along with this program.  If not, see <http://www.gnu.org/licenses/>

"use strict"

#----------------------------------------------------------------------------------------------------------
#													types.coffee (types.js v1.5.0)
#

instanceOf	= ( type, value ) -> value instanceof type
typeOf		= ( value, type= 'object' ) -> typeof value is type

LITERALS=
	'Boolean'	: false
	'String'		: ''
	'Object'		: {}
	'Array'		: []
	'Function'	: ->
	'Number'		: do ->
		number= new Number
		number.void= true
		return number

TYPES=
	'Undefined'		: ( value ) -> value is undefined
	'Null'			: ( value ) -> value is null
	'Function'		: ( value ) -> typeOf value, 'function'
	'Boolean'		: ( value ) -> typeOf value, 'boolean'
	'String'			: ( value ) -> typeOf value, 'string'
	'Array'			: ( value ) -> typeOf(value) and instanceOf Array, value
	'RegExp'			: ( value ) -> typeOf(value) and instanceOf RegExp, value
	'Date'			: ( value ) -> typeOf(value) and instanceOf Date, value
	'Number'			: ( value ) -> typeOf(value, 'number') and (value is value) or ( typeOf(value) and instanceOf(Number, value) )
	'Object'			: ( value ) -> typeOf(value) and (value isnt null) and not instanceOf(Boolean, value) and not instanceOf(Number, value) and not instanceOf(Array, value) and not instanceOf(RegExp, value) and not instanceOf(Date, value)
	'NaN'				: ( value ) -> typeOf(value, 'number') and (value isnt value)
	'Defined'		: ( value ) -> value isnt undefined

TYPES.StringOrNumber= (value) -> TYPES.String(value) or TYPES.Number(value)

Types= _=
	parseIntBase: 10


createForce= ( type ) ->
	convertType= ( value ) ->
		switch type
			when 'Number' then return value if (_.isNumber value= parseInt value, _.parseIntBase) and not value.void
			when 'String' then return value+ '' if _.isStringOrNumber value
			else return value if Types[ 'is'+ type ] value

	return ( value, replacement ) ->

		return value if value? and undefined isnt value= convertType value
		return replacement if replacement? and undefined isnt replacement= convertType replacement
		return LITERALS[ type ]


testValues= ( predicate, breakState, values= [] ) ->
	return ( predicate is TYPES.Undefined ) if values.length < 1
	for value in values
		return breakState if predicate(value) is breakState
	return not breakState


breakIfEqual= true
do -> for name, predicate of TYPES then do ( name, predicate ) ->
	Types[ 'is'+ name ]	= predicate
	Types[ 'not'+ name ]	= ( value ) -> not predicate value
	Types[ 'has'+ name ]	= -> testValues predicate, breakIfEqual, arguments
	Types[ 'all'+ name ]	= -> testValues predicate, not breakIfEqual, arguments
	Types[ 'force'+ name ]= createForce name if name of LITERALS

Types.intoArray= ( args... ) ->
	if args.length < 2
		if _.isString args[ 0 ]
			args= args.join( '' ).replace( /^\s+|\s+$/g, '' ).replace( /\s+/g, ' ' ).split ' '
		else if _.isArray args[ 0 ]
			args= args[ 0 ]
	return args

Types.typeof= ( value ) ->
	for name, predicate of TYPES
		return name.toLowerCase() if predicate( value ) is true

#
# end of types.js
#-------------------------------------------------------------------------------------------------------

#													a selection of tools.js
#
class Tools

	@positiveIndex: ( index, max ) ->
		return false if 0 is index= _.forceNumber index, 0
		max= Math.abs _.forceNumber max
		if Math.abs( index ) <= max
			return index- 1 if index > 0
			return max+ index
		return false


	# only for sorted arrays
	@noDupAndReverse: ( array ) ->
		length= array.length- 1
		newArr= []
		for index in [length..0]
			newArr.push array[ index ] if newArr[ newArr.length- 1 ] isnt array[ index ]
		return newArr

	@insertSort: ->
		array= _.intoArray.apply @, arguments
		if array.length > 1
			length= array.length- 1
			for index in [ 1..length ]
				current	= array[ index ]
				prev		= index- 1
				while ( prev >= 0 ) && ( array[prev] > current )
					array[ prev+1 ]= array[ prev ]
					--prev
				array[ +prev+1 ]= current
		return array

#
# end of Tools
#---------------------------------------------------------------------------------------------------

#													a selection of strings.js (v 1.2.7)
#

class Strings

	@create: ->
		string= ''
		string+= _.forceString( arg ) for arg in arguments
		return string

	@find: ( string, toFind, flags ) ->
		indices= []
		return indices if '' is string= _.forceString string
		flags= _.forceString flags, 'g'
		if _.isStringOrNumber toFind
			toFind= new RegExp Strings.regEscape(toFind+ ''), flags
		else if _.isRegExp toFind
			toFind= new RegExp toFind.source, flags
		else return indices
		# check for global flag, without it a while/exec will hang the system..
		if toFind.global
			indices.push( result.index+ 1 ) while result= toFind.exec string
		else
			indices.push( result.index+ 1 ) if result= toFind.exec string
		return indices

	@trim					: ( string= '' ) -> (string+ '').replace /^\s+|\s+$/g, ''
	@oneSpace			: ( string= '' ) -> (string+ '').replace /\s+/g, ' '
	@oneSpaceAndTrim	: ( string ) -> Strings.oneSpace( Strings.trim(string) )

	@split: ( string, delimiter ) ->
		string= Strings.oneSpaceAndTrim string
		result= []
		return result if string.length < 1
		delimiter= _.forceString delimiter, ' '
		array= string.split delimiter[ 0 ] or ''
		for word in array
			continue if word.match /^\s$/
			result.push Strings.trim word
		return result

	@xs: ( string= '', callback ) ->
		string= _.forceString string
		return '' if -1 is length= string.length- 1
		callback	= _.forceFunction callback, (char) -> char
		result= ''
		for index in [0..length]
			if response= callback( string[index], index )
				if response is true then result+= string[ index ]
				else if _.isStringOrNumber response
					result+= response
		return result

	@times: ( string, amount ) ->
		return '' if '' is string= _.forceString string
		amount= _.forceNumber amount, 1
		times= ''
		times+= string while amount-- > 0
		return times

	@hasUpper: ( string ) -> /[A-Z]+/g.test string

	@REGEXP_SPECIAL_CHARS: ['?', '\\', '[', ']', '(', ')', '*', '+', '.', '/', '|', '^', '$', '<', '>', '-', '&']

	@regEscape: ( string ) ->
		return string if '' is string= _.forceString string
		return Strings.xs string, ( char ) ->
			return '\\'+ char	if char in Strings.REGEXP_SPECIAL_CHARS
			return true

	@replace: ( string= '', toReplace= '', replacement= '', flags= 'g' ) ->
		if not ( _.isStringOrNumber(string) and (_.typeof(toReplace) in [ 'string', 'number', 'regexp' ]) )
			return _.forceString string
		if _.notRegExp toReplace
			toReplace= Strings.regEscape (toReplace+ '')
			toReplace= new RegExp toReplace, flags	# check if needed -> _.forceString flags
		return (string+ '').replace toReplace, replacement

	@toCamel: ( string, char ) ->
		string= _.forceString string
		char	= _.forceString char, '-'
		match	= new RegExp( Strings.regEscape( char )+ '([a-z])', 'ig' )
		Strings.replace string, match, (all, found) -> found.toUpperCase()

	@unCamel: ( string, insertion ) ->
		string	= _.forceString string
		insertion= _.forceString insertion, '-'
		return Strings.replace( string, /([A-Z])/g, insertion+ '$1' ).toLowerCase()

	@remove: ( string= '', toRemove... ) ->
		return string if ('' is string= _.forceString string) or (toRemove.length < 1)
		string= Strings.replace( string, remove ) for remove in toRemove
		return string

	@count: ( string, toFind ) -> Strings.find( string, toFind ).length

	@contains: ( string, substring ) -> Strings.count( string, substring ) > 0

#
# end of Strings
#-------------------------------------------------------------------------------------------------

#													a selection of words.js
#

class Words

	@delimiter: ' '

	constructor: -> @set.apply @, arguments

	get: ->
		return @words.join( Words.delimiter ) if arguments.length < 1
		string= ''
		for index in arguments
			index= Tools.positiveIndex( index, @count )
			string+= @words[ index ]+ Words.delimiter if index isnt false
		return Strings.trim string

	set: ( args... ) ->
		@words= []
		args= _.intoArray.apply @, args
		return @ if args.length < 1
		for arg in args
			@words.push( str ) for str in Strings.split Strings.create( arg ), Words.delimiter
		return @

	xs: ( callback= -> true ) ->
		return @ if _.notFunction( callback ) or @count < 1
		result= []
		for word, index in @words
			if response= callback( word, index )
				if response is true then result.push word
				else if _.isStringOrNumber response
					result.push response+ ''
		@words= result
		return @

	pop: ( amount ) ->
		amount= Math.abs _.forceNumber amount, 1
		popped= ''
		for n in [ 1..amount ]
			pop= @words.pop()
			popped= (pop+ ' '+ popped) if pop isnt undefined
		return popped.trim()

	startsWith: ( start ) ->
		return false if '' is start= _.forceString start
		result= true
		start= new Words start
		start.xs ( word, index ) =>
			result= false if word isnt @words[ index ]
		return result

	remove: ->
		return @ if arguments.length < 1
		args= []
		for arg in arguments
			if _.isString arg
				args.unshift arg
			else if _.isNumber arg
				args.push Tools.positiveIndex arg, @count
		args= Tools.noDupAndReverse Tools.insertSort args
		for arg, index in args
			if _.isNumber arg
				@xs ( word, index ) => true if index isnt arg
			else if _.isString arg then @xs ( word ) -> true if word isnt arg
		return @

Object.defineProperty Words::, '$', { get: -> @.get() }
Object.defineProperty Words::, 'count', { get: -> @words.length }

#
# end of Words
#-------------------------------------------------------------------------------------------------

#														Xs PRIVATE
#

class Xs

	# checks if the object has at least one property
	emptyObject= ( object ) ->
		for key of object
			return false if object.hasOwnProperty key
		return true

	# target needs the empty object literal as default for the recursive operation
	extend= ( target= {}, source, append ) ->
		for key, value of source
			if _.isObject value
	     		extend target[ key ], value, append
	      else
				target[ key ]= value if not ( append and target.hasOwnProperty key )
		return target

	# 3 response options for the callack: key, value, remove
	xs= ( object, callback ) ->
		# force callback to be a function, returning true by default, so if only object is given
		# the return array contains all nodes in object
		callback= _.forceFunction callback, -> true

		# traverse will call itself recursively until either the last node has been processed or
		# the callback returns {stop: true}
		traverse= ( node ) ->
			for key, value of node
				# check the recursive node instead of value to reach terminators as well
				continue if _.notObject node
				path.push key
				if response= callback key, value, path

					if _.isObject response
						if response.remove is true
							delete node[ key ]
						else
							if _.isDefined response.value
								value= node[ key ]= response.value
								continue
							if _.isDefined(response.key) and '' isnt responseKey= _.forceString response.key
								# only change key name if no key already exists with response.key/newName
								if not node.hasOwnProperty responseKey
									node[ responseKey ]= value
									delete node[ key ]

					result.push
						key		: key
						value		: value
						path		: path.join ' '

					return if response?.stop is true

				traverse value
				path.pop()

		result	= []
		path		= []
		traverse object
		return result

	# made this second xs method for specific paths because it's way faster
	# command has 3 options: key, value, remove
	xsPath= ( object, path, command ) ->
		# after oneSpaceAndTrim we can't get sparse, use the standard/faster .split
		nodes= Strings.oneSpaceAndTrim( _.forceString(path) ).split ' '
		return if nodes[ 0 ] is ''

		length= nodes.length- 2
		if length > -1
			# find the node at path
			for index in [0..length]
				# try to build path from the root
				return if undefined is object= object[ nodes[index] ]
		else index= 0

		# the path exists, object is the node and index points to the key
		key= nodes[ index ]
		# check object with .hasOwnProperty to allow for undefined keys
		if _.isDefined( command ) and object.hasOwnProperty key
			if command.remove
				return delete object[ key ]
			# only change key to new name if that new name is not a key already
			if command.key and not object.hasOwnProperty command.key
				object[ command.key ]= object[ key ]
				delete object[ key ]
				key= command.key
			if command.value and object.hasOwnProperty key
				object[ key ]= command.value

		result= object[ key ]
		return result

	#													Xs STATIC

	# give access to dependencies
	@Types	: Types
	@Tools	: Tools
	@Strings	: Strings
	@Words	: Words

	@empty: ( object ) ->
		return false if _.notObject( object ) or object instanceof Number
		return emptyObject object

	@extend: ( target, source ) -> extend _.forceObject(target), _.forceObject(source)
	@append: ( target, source ) -> extend _.forceObject(target), _.forceObject(source), true

	@add: ( object= {}, path, value ) ->
		if _.isObject path
			return extend object, path, true
		path= new Words path
		valueIsObject= _.isObject value
		target= object
		for node, index in path.words
			target[ node ]?= {} if ( index < (path.count- 1) or valueIsObject )
			if index < (path.count- 1)
				target= target[ node ] if target.hasOwnProperty node
			else if valueIsObject
				extend target[ node ], value, true
			else target[ node ]?= value
		return object

	@xs: ( object, callback ) ->
		return [] if _.notObject object
		return xs object, callback

	# shallow copy
	@copy: ( object ) ->
		return {} if _.notObject object
		traverse= ( copy, node ) ->
			for key, value of node
				# not sure if this will work everywhere without .hasOwnProperty, need to check
				if _.isObject node then copy[ key ]= value # if node.hasOwnProperty( key )
				else traverse value
			return copy
		return traverse {}, object

	@get: ( object, path, commands ) ->
		return xsPath(object, path, commands) if _.isObject object
		return ''

	@getn: ( object, path, replacement ) -> _.forceNumber Xs.get(object, path), replacement
	@gets: ( object, path ) -> _.forceString Xs.get( object, path )
	@geta: ( object, path ) -> _.forceArray Xs.get( object, path )
	@geto: ( object, path ) -> _.forceObject Xs.get( object, path )

	@keys: ( object, path ) ->
		keys= []
		if _.isObject path= Xs.get object, path
			keys.push key for key of path
		return keys

	@values: ( object, path ) ->
		values= []
		if _.isObject path= Xs.get object, path
			values.push value for key, value of path
		return values

# end of statics
#														Xs DYNAMIC

	constructor: ( path, value ) ->
		@object= {}
		Xs.add( @object, path, value ) if path

	xs: ( callback ) -> Xs.xs @object, callback

	empty: -> emptyObject @object

	copy: -> Xs.copy @object

	add: ( path, value ) -> Xs.add @object, path, value

	remove: ( path ) -> xsPath @object, path, {remove: true}

	removeAll: ( query ) ->
		if '' isnt query= Strings.trim query
			Xs.xs @object, ( key ) -> {remove: true} if key is query
		return @

	set: ( nodePath, value ) ->
		return '' if '' is nodePath= _.forceString nodePath

		if value= xsPath @object, nodePath, {value: value}
			if _.isObject value
				keys= new Xs( value ).search()
				for key in keys
					@triggerListener( nodePath+ ' '+ key.path, value )
			else
				@triggerListener nodePath, value
		return value

	setAll: ( query, value ) ->
		if '' isnt query= Strings.trim query
			Xs.xs @object, ( key ) -> {value: value} if key is query
			@triggerListener( result.path, value ) for result in @search query
		return @

	setKey: ( query, name ) -> xsPath @object, query, {key: name}

	setAllKeys: ( query, name ) ->
		if '' isnt query= Strings.trim query
			Xs.xs @object, ( key ) -> {key: name} if key is query
		return @

	search: ( query ) ->
		if _.isDefined query
			return [] if '' is query= Strings.trim query
		if query then predicate= ( key ) -> true if key is query
		else predicate= -> true
		result= @xs predicate
		return result

	list: ( query ) ->
		return [] if '' is query= Strings.oneSpaceAndTrim query
		if query then returnValue= ( path ) -> true if new Words( path.join(' ') ).startsWith query
		else returnValue= -> true
		return @xs ( k, v, path ) -> returnValue path

	get: ( path ) ->
		return @object if path is undefined
		return xsPath @object, path

	getn	: ( path, replacement ) -> Xs.getn @object, path, replacement
	gets	: ( path ) -> Xs.gets @object, path
	geta	: ( path ) -> Xs.geta @object, path
	geto	: ( path ) -> Xs.geto @object, path

	keys: ( path ) ->
		keys= []
		# not calling Xs.keys because it checks for validity of @object, slower..
		if _.isObject path= xsPath @object, path
			keys.push key for key of path
		return keys

	values: ( path ) ->
		values= []
		if _.isObject path= xsPath @object, path
			values.push value for key, value of path
		return values

	paths: ( node ) ->
		paths= []
		paths.push( entry.path ) for entry in @search node
		return paths

	addListener: ( path, callback ) ->
		@listeners= new Listeners if not @listeners
		return @listeners.add path, callback

	triggerListener: ( path, data ) ->	@listeners.trigger( path, data ) if @listeners; @

	removeListener: ( paths... ) ->
		if @listeners then for path in paths
			@listeners.remove path
		return @
#
# end Xs

# some aliases:
Xs::ls= Xs::list
Xs::find= Xs::search

#---------------------------------------------------------------------------------------------------

#														Listeners
#

class Listeners

	@count: 0
	# simple class-unique name generator, force string, no number
	@newName: -> ''+ (++Listeners.count)

	constructor: ( @listeners= new Xs ) ->

	add: ( path, callback ) ->
		path= Strings.oneSpaceAndTrim path
		name= Listeners.newName()
		if listener= @listeners.get path
			listener[ name ]= callback
		else
			obj= {}
			obj[ name ]= callback
			@listeners.add path, obj
		trigger= @listeners.get path
		return {
			trigger: (data= '') -> trigger[ name ]?( path, data )
			remove: -> delete trigger[ name ]
		}

	trigger: ( path, data= '' ) ->
		for node in @listeners.search '*'
			callbacks= node.value
			if new Words(path).startsWith new Words( node.path ).remove(-1).$
				callback?( path, data ) for name, callback of callbacks

		listeners= @listeners.get Strings.oneSpaceAndTrim path
		for k, listener of listeners
			listener?( path, data )
		return @

	remove: ( path ) -> @listeners.remove Strings.oneSpaceAndTrim path; @

#
# end Listeners
#----------------------------------------------------------------------------------------------------

#
# end of all included libraries

#====================================================================================================
#
#																Css
#
#====================================================================================================


prettify= ( string ) ->

	tabs= -> Strings.times '\t', tabs.count
	tabs.count= 0

	align= ( key ) ->

		if Strings.hasUpper key then adjust= 1
		else adjust= 0
		Strings.times ' ', prettify.valuePosition- adjust- key.length


	pretty= ''
	key	= ''

	for char, index in string
		switch char

			when '{'
				tabs.count++
				pretty+= '{\n'+ tabs()
				key= ''
			when '}'
				tabs.count--
				pretty+= '\n'+ tabs()+ '}\n'+ tabs()
			when ':'
				# avoid placing space in selector
				if tabs.count > 0
					pretty+= align( key )+ char+ ' '
				else
					pretty+= char
			when ';'
				if string[ index+1 ] is '}'
					pretty+= char
				else
					pretty+= ';\n'+ tabs()
				key= ''
			else
				pretty+= char
				key+= char

	return pretty

# set only once outside of function to allow for custom setting
prettify.valuePosition= 18


#																			Browser
#

class Browser

	# '' is the default/non-specific, should always be output last for future browser compatibility
	@prefixes: [ '-webkit-', '-moz-', '-o-', '-ms-', '' ]
	@specific: []

	@each: ( callback, prefixes ) ->

		prefixes= _.intoArray prefixes
		if prefixes[ 0 ] is undefined
			prefixes= Browser.prefixes

		callback( family, index ) for family, index in prefixes

#
# end of Browser

#																			Units
#

class Units

	# made private, both static and dynamic can use
	set= ( target, unit, keys ) ->
		for key in keys
			target.unit[ Strings.toCamel key ]= unit

	remove= ( target, keys ) ->
		for key in keys
			delete target.unit[ Strings.toCamel key ]

	@all: [ '%', 'px', 'pt', 'em', 'pc', 'ex', 'deg', 'cm', 'mm', 'ms', 's', 'ch', 'rem', 'vw', 'vh', 'vmin', 'vmax', 'in', 'grad', 'rad', 'turn', 'Hz', 'kHz', 'dpi', 'dpcm', 'dppx' ]

	@unit: {}

	@hasUnit: ( value ) ->
		for unit, index in Units.all
			toFind= new RegExp '^[0-9]+'+ unit+ '$'
			return Units.all[ index ] if toFind.exec value
		return false

	@strip: ( value ) ->
		if unit= Units.hasUnit value
			return Strings.remove value, unit
		return value

	@set: ( unit, keys... ) ->
		set Units, unit, _.intoArray.apply( @, keys )
		return Units

	@remove: ( keys... ) ->
		remove Units, _.intoArray.apply( @, keys )
		return Units

	constructor: ->
		@unit= {}

	# targets are all given instances of Units, that will override each other and Units.unit.
	get: ( key, value, targets... ) ->

		if not Units.hasUnit value
			return unit if unit= @unit[ Strings.toCamel key ]

			# append Units as last fallback, the final unit if no others are found
			targets.push Units
			for target in targets
				# prefer the first valid index
				return unit if '' isnt unit= _.forceString target.unit[ Strings.toCamel key ]

		return ''


	set: ( unit, keys... ) ->
		set @, unit, _.intoArray.apply( @, keys )
		return @

	remove: ( keys... ) ->
		remove @, _.intoArray.apply( @, keys )
		return @
#
# end of Units

#																		Keyframes
#

class Keyframes

	constructor: ( @parent ) ->

		# @keyframes will override the default Units.unit and @parent.unit settings
		@keyframes= {}
		@units= new Units
		@unit	= @units.unit


	# TODO: implement dynamically adding to DOM

	# returns false if id exists, context if all went through
	add: ( id, frames, overwrite ) ->

		# do not add if it exists already, that would be .set
		return if @keyframes[ id ] and not overwrite

		@keyframes[ id ]= {}
		for frame, pairs of frames
			frame= Strings.trim frame
			if Strings.contains frame, '%'
				pct= ''
			else
				pct= '%'
			@keyframes[ id ][ frame+ pct ]= pairs

		return @


	remove: ( id ) ->	delete @keyframes[ id ]; @

	set: ( id, frames ) -> @add id, frames, true

	get: ( id ) ->

		return '' if not @keyframes[ id ]

		frames= id+ '{'
		# get all frames, 0% .. 100%
		for frame, keys of @keyframes[ id ]
			frames+= frame+ '{'

			# get all key:value pairs from this frame
			for key, value of keys
				# prefer own (context based) units above @parent.unit and/or Units.unit
				unit= @units.get key, value, @parent.units
				frames+= key+ ':'+ value+ unit+ ';'

			frames+= '}'

		return frames+= '}'

	get_: ( id ) -> prettify @get id

	# prefixes can be given to override any browser-specific prefixes set already
	dump: ( prefixes ) ->
		all= ''
		for id, keys of @keyframes
			Browser.each ( browser ) =>
					all+= '@'+ browser+ 'keyframes '+ @get id
				,prefixes
		return all

	dump_: -> prettify @dump

#
#end of Keyframes


#																		Style
#
class Style

	@createSheet: ->
		element= document.createElement 'style'
		element.appendChild document.createTextNode '' # some hack..
		document.head.appendChild element
		return element

	@remove: ( selector ) ->
		if window?
			element= document.querySelector selector
			element.remove()

	constructor: ( @parent ) ->
		@sheet= Style.createSheet() if window?

	setSheet: ( sheet ) -> @sheet.innerHTML= _.forceString sheet; @

	# depending on selector, value can be object or string/number
	set: ( selector, value ) ->

		dom= ( selector, key, value ) =>
			return if not selector
			value+= @parent.units.get key, value
			element= document.querySelector selector
			element.style[ key ]= value if element

		if window?
			# if value is an object we have to go deep
			if _.isObject value then @parent.xs ( key, value, path ) ->
				path= new Words path
				# only selectors in Css::object starting with selector
				if path.startsWith( selector ) and _.notObject( value )
					# remove key from path
					path= path.remove( -1 ).$
					dom path, key, value
			else
				# here selector must be a path with a key to a terminator
				path	= new Words selector
				key	= path.pop()
				dom path.$, key, value

#
# end of Style


#																			Css (static)
#

class Css extends Xs

# some aliases:
	@Types		: Types
	@Tools		: Tools
	@Strings		: Strings
	@Words		: Words
	@Xs			: Xs

	@Units		: Units
	@unit			: Units.unit
	@Keyframes	: Keyframes
	@Browser		: Browser

	@valuePosition: prettify.valuePosition
#
# end of Css static

#																			Css (dynamic)
#
	constructor: ( path, value ) ->
		super path, value
		@style		= new Style @
		@stylesheet	= @style.sheet
		@keyframes	= new Keyframes @
		@units		= new Units
		@unit			= @units.unit
		# for contextual overriding Browser.prefixes and Browser.specific
		@prefixes	= []
		@specific	= []

# refactor below this line:

	# keyVal handles the units as it is the final stage before output
	keyVal: ( key, value ) ->

		unit= @units.get key, value
		# .unCamel defaults to dashes
		dashKey= Strings.unCamel key
		allBrowsers= ''

		# allow for overriding Browser.specific
		if @specific.length < 1
			specific= Browser.specific
		else
			specific= @specific

		if key in specific

			Browser.each ( browser ) ->
					allBrowsers+= browser+ dashKey+ ':'+ value+ unit+ ';'
				# allow for overriding Browser.prefixes
				,@prefixes
			return allBrowsers

		else
			return dashKey+ ':'+ value+ unit+ ';'


	remove: ( selector, domToo= true ) ->
		super selector
		Style.remove selector if domToo
		return @

	add: ( selector, value, toDom ) ->
		super selector, value
		@style.set( selector, value ) if toDom
		return @

	set: ( selector, value, toDom= true ) ->
		super selector, value
		@style.set( selector, value ) if toDom
		return @

	get: ( path ) ->
		return value if _.isStringOrNumber value= super path
		return ''

	gets: ( path ) -> _.forceString super Strings.toCamel path

	getn: ( path, replacement= 0 ) -> _.forceNumber @get( path ), replacement

	getu: ( path ) ->
		value= @gets path
		return value+ @units.get new Words( path ).get(-1), value

	getRule: ( selector ) ->

		selector= Strings.oneSpaceAndTrim selector
		return '' if Xs.empty node= @geto selector

		props= ''
		for key, value of node
			if _.isStringOrNumber value
				props+= @keyVal key, value

		return '' if not props
		return selector+ '{'+ props+ '}'

	getRule_: ( selector ) -> prettify @getRule selector

	getRules: ( selector ) ->

		selector= Strings.oneSpaceAndTrim selector
		# fetch all nodes 'deep' down selector, including selector, and return if it doesn't exist
		nodes= @list selector
		return '' if nodes.length < 1

		path	= ''
		rules	= ''
		targetNode= new Words( selector ).get -1

		for node in nodes

			continue if node.key is targetNode

			if _.isStringOrNumber node.value
				# it's a terminator, remove the key from node.path
				node.path= new Words( node.path ).remove(-1).$

				# always remove the space in ' :' from selector path
				node.path= Strings.xs node.path, (char, index) ->
					return char	if not ( (node.path[ index ] is ' ') and (node.path[ index+ 1 ] is ':') )

				# prevent outputting multiple equal selectors for each individual key it contains
				if node.path isnt path
					rules+= '}' if rules isnt ''
					path= node.path
					rules+= path+ '{'

				# keyVal adds the unit if needed
				rules+= @keyVal node.key, node.value

		return rules+ '}' if rules
		return ''

	getRules_: ( selector ) -> prettify @getRules selector

	dump: ( toDom= true ) ->

		allRules= @keyframes.dump @prefixes

		# fetch all base selectors
		rootKeys= []
		rootKeys.push key for key of @object

		# fetch deep each base selector
		allRules+= @getRules( rules ) for rules in rootKeys

		# dump to DOM
		@style.setSheet allRules if toDom
		return allRules


	dump_: ( toDom ) -> prettify @dump toDom

#
# end of Css
#--------------------------------------------------------------------------------------------

if define? and ( typeof define is 'function' ) and define.amd
	define 'css', [], -> Css

else if module?
	module.exports= Css

else if window?
	window.Css= Css