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

createCss= ( Words, Xs ) ->

	Strings	= Words.Strings
	_			= Words.Types


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
		@Xs			: Xs
		@Words		: Words
		@Strings		: Words.Strings
		@Types		: Words.Types
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
			@style.set selector, value if toDom
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

	return Css
#
# end of Css

# load dependencies, create Css and make it available for: AMD, Browser or node.js
if define? and ( typeof define is 'function' ) and define.amd
	define 'css', [ 'words.min', 'xs.min' ], ( Words, Xs ) -> createCss Words, Xs

else if window?
	window.Css= createCss window.Words, window.Xs

else if module?
	Xs= require 'xs.js'
	module.exports= createCss Xs.Words, Xs