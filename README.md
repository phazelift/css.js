css.js
======

***Write CSS with Javascript, Coffeescipt or any other JS flavour***

Use css.js to write your CSS in Javascript, having all benefits from a programming language at your disposal. Use
variables, databases, sockets, or whatever you need to style and organize your app.

Although we're targeting Javascript, all examples are in Coffeescript, mainly to show how it looks writing CSS in it. Coffeescript
(and some equivalents) are absolutely sweet for writing readable objects IMHO. I translated all Coffeescript examples to Javascript.
You can find them at the end of this readme.

**Key features:**
- virtually eliminate the need for external .css files
- use variables, databases, sockets, or whatever you need for your CSS
- work with Number values instead of 'px'/unit juggling
- fetch any CSS value with ease, in number or string format, with or without unit
- fetch a specific CSS rule, or fetch 'deep' all rules down the hierarchy
- dynamically add/change/remove CSS while keeping the DOM in sync
- set listeners on rules, selectors, properties, and listen 'deep' if you need to
- support for @keyframes and @media queries
- build-in prettifier for debugging

Any feature requests or feedback is appreciated. I am always on the lookout for bugs, please let me know if you found one in css.js.
<br/>
___

All examples throughout this readme are tested and should work in node.js and all major browsers.

A quick example (in Coffeescript):
```coffeescript

# some data to work with
colors=
	white		: '#eee'
	gray		: '#444'
	black		: '#111'

borders=
	thin		: 'solid 1px '+ colors.gray
	fat			: 'solid 5px '+ colors.gray

# create a new instance of Css
css= new Css

# set units for those properties you want to use as Numbers
css.units
	.set '%', 'width height'
	.set 'px', 'top left'

# write your css:
css.add 'div',
	color	: colors.white

css.add '#body',
	width	: 100
	height	: 100
	border	: borders.fat
	# you can either use or mix camel-case and dashes
	backgroundColor: colors.black

css.add '#header',
	width	: css.getn '#body width'
	height	: css.getn('#body height')* .15
	border	: borders.thin
	backgroundColor: colors.white

	'#title':
		position	: 'relative'
		left		: 50
		top			: 30
		color		: colors.gray

		':hover':
			backgroundColor: colors.black


# add .dump to the last line of the final script, it will dynamically create
# a style-sheet with the rules from context and insert it into the DOM:
console.log css.dump()
# div{color:#eee;}#body{width:100%;height:100%;border:solid 5px #444;background-color:#111;}#header{width:100%;height:15%;border:solid 1px #444;background-color:#eee;}#header #title{position:relative;left:50px;top:30px;color:#444;}


# .dump defaults to compressed output, use .dump_ to get prettified output:
console.log css.dump_()
# div{
# 		color             :#eee;
# }
# #body{
# 		width             :100%;
# 		height            :100%;
# 		border            :solid 5px #444;
# 		background-color  :#111;
# }
# #header{
# 		width             :100%;
# 		height            :15%;
# 		border            :solid 1px #444;
# 		background-color  :#eee;
# }
# #header #title{
# 		position          :relative;
# 		left              :50px;
# 		top               :30px;
# 		color             :#444;
# }
# #header #title:hover{
# 		background-color  :#111;
# }
```
As you can see in the output, the units set with `css.units.set` are applied to the properties as expected.
Also interesting is the `#header #title` and `#header #title:hover` selectors with properties, you can see they get their
own rule in the stylesheet. Theoretically you can go as deep as you like, and by doing so, creating a heirarchical tree with
properties safely seperated from other selectors.

There are quite some nice features included for manipulating the css object, especially the inherited methods of xs.js,
they form the core of css.js. Check the xs.js API at: https://github.com/phazelift/xs.js
___
#### Included:

css.js includes the full types.js(2kB) and xs.js(10kB) libraries, and the necessary parts of strings.js and
words.js.

- types.js is a tiny custom type checker/enforcer. It's API can be found at: https://github.com/phazelift/types.js
- strings.js is a string manipulation library. It's API can be found at: https://github.com/phazelift/strings.js
- words.js is a toolbox for manipulating the words in a string. It's API can be found at: https://github.com/phazelift/words.js
- xs.js is a Javascript deep object manipulation tool/library, with string based access. It's API can be found at: https://github.com/phazelift/xs.js

If you want to use the included libraries, you can:
```coffeescript
Types		= Css.Types
Tools		= Css.Tools
Strings		= Css.Strings
Words		= Css.Words
Xs			= Css.Xs
```
___
**node.js**

When using css.js in node.js, you can use `npm install css.js`.
```coffeescript
Css= require 'css.js'
```

**AMD**

When using AMD, you can load css.js like so:
```javascript
require.config

	paths:
		css: [ 'path/to/css.min(.js') ]

require ['css'], ( Css ) ->

	css= new Css '#hello',
		world: '!'

	console.log css.dump()
	# #hello{world:!;}
```

**Browser**
```html
<script src="css.min.js"></script>
```
After this you can access css.js and it's included full and partial libraries via the global window.Css as
shown above.
___
# API

If you see more types for a value in the method description like: `<string>/<number> value`, it means that type `<string>` is expected,
but type `<number>` is accepted too.

`<intoArray>` refers to Types.intoArray. It accepts space delimited strings, multiple arguments, or an
array. See the types.js API for a description.
___

Css
===


Css extends Xs (xs.js). See the xs.js API for more info on what's available.

___
**Css.unit**
> `<object> Css.unit`

Css.unit is an alias for Css.Units.unit. It holds the global units. See Css.Units for all methods, properties and examples.
___
**Css.valuePosition**
> `<number> Css.valuePosition= 18`

You can set Css.valuePosition to adjust the spacing between key and value in the prettified output.
___
**Css.prototype.constructor**
> `<this> Css( <string> selector, <object> keyVal )`

If you call the constructor without arguments, it initializes the object, making it ready for use. You can also
call the constructor with a selector and a key:val object if you want to create an object right away.

The constructor calls .add and passes through the arguments. See Css.prototype.add for more info about adding css rules.

Some different ways to initialize a new instance of Css:
```coffeescript
# the most basic start of a Css object:
css= new Css

# or with a selector:
css= new Css 'div',
	color: '#222'

# or a selector path at once with sub paths inside:
css= new Css '#body #sidebar',

	width	: '100px'
	height	: '600px'
	backgroundColor: '#222'

	'#menuItem':
		marginLeft: '10px'
		backgroundColor: '#333'

		'#text':
		 	color: '#24a'

		 	':hover':
		 		color: '#25a'

	'#footer':
		backgroundColor: '#111'

console.log css.dump_()
#	#body #sidebar{
#		width             : 100px;
#		height            : 600px;
#		background-color  : #222;
#	}
#	#body #sidebar #menuItem{
#		margin-left       : 10px;
#		background-color  : #333;
#	}
#	#body #sidebar #menuItem #text{
#		color             : #24a;
#	}
#	#body #sidebar #menuItem #text:hover{
#		color             : #25a;
#	}
#	#body #sidebar #footer{
#		background-color  : #111;
#	}
```
___
**Css.prototype.object** (inherited from xs.js)
> `<object> object`

Inherited from xs.js, it's the actual object holding the Css rules. You can always directly access .object if you
need faster or direct access to some node.
```coffeescript
css= new Css 'div ul li', { color: '#333' }
console.log css.object.div.ul.li.color
# #333
```
___
**Css.prototype.style**

Used internally.
___
**Css.prototype.stylesheet**
> `<object> stylesheet`

Points to the stylesheet element in the DOM for this context.
___
**Css.prototype.keyframes**
> `<object> keyframes`

Css.prototype.keyframes is an instance of Css.Keyframes, which is the object taking care of @keyframes rules. Because @keyframes rules
have a different format than normal CSS they are handled seperately in css.js. Check Css.Keyframes for all methods and examples.
___
**Css.prototype.units**
> `<object> units`

Css.prototype.units is an instance of Css.Units, it is context based, and properties set to context will override equal properties of
Css.Units.unit. See Css.Units for all methods, properties and examples.
___
**Css.prototype.unit**
> `<object> unit`

Css.prototype.unit is identical to Css.Units.unit, except for that it is context based, and overrides equal properties in Css.Units.unit.
```coffeescript
Css.Units.set 'px', 'width height'

css= new Css 'div',
	top: 100
	width: 33
	height: 99

css.unit.width= 'pt'

console.log css.dump_()
div{
	top				: 100;
	width			: 33pt;
	height			: 99px;
}

```
As you can see in the output, top has no units. Any method like: .getu, dump(), etc.. will always finally look if there is a global
unit for a given property, but it won't guess when no unit is found. Therefore, always set the unit for properties you want to use
with numeric values.
___
**Css.prototype.prefixes**
> `<array> prefixes`

Use contextual .prefixes to override the global Css.Browser.prefixes. Each instance of Css can have it's own prefix set. See
Css.Brower.prefixes for an example.
___
**Css.prototype.specific**
> `<array> specific`

Use contextual .specific to override the global Css.Browser.specific. Each instance of Css can have it's own browser-specific set. See
Css.Brower.specific for an example.
___
**Css.prototype.keyVal**

Used internally.
___
**Css.prototype.remove**	(overrides Xs.prototype.remove)
> `<this> remove( <string> selector, <boolean> domToo= true )`

Removes selector from the Css.object. If domToo is set to true (default), the selector will also be removed from the DOM.
___
**Css.prototype.add**	(overrides Xs.prototype.add)
> `<this> add( <string> selector, <object>/<string>/<number> value, <boolean> toDom= true )`

If value is not an object then the last word from selector will be popped and used as key/property for that value (direct property targeting).

```coffeescript
css= new Css '#header #left color', '#333'
console.log css.dump()
# #header #left{color:#333}

css.add '#header #left #menu #item color', 'green'
console.log css.dump()
# #header #left{color:#333;}#header #left #menu #item{color:green;}
```
___
**Css.prototype.set**	(overrides Xs.prototype.set)
> `<this> set( <string> selector, <object>/<string>/<number> newValue, <boolean> toDom= true )`

If newValue is not an object then the last word from selector will be popped and used as key/property for that value (direct property targeting).

If the selector is found in the DOM, also the DOM will be set, unless toDom is set to a falsey value.

```coffeescript
css= new Css 'div ul li', { color: '#333' }
css.set 'div ul li color', '#111'
console.log css.gets 'div ul li color'
# #111
```
___
**Css.prototype.get**	(overrides Xs.prototype.get)
> `<string>/<number> get( <string>/<number> selectorAndKey )`

.get is the same as .gets and .getn, only it won't try to convert the type of the value. If it's a string, you'll get a string, if it's
a number, you'll get a number. If it the value found at selectorAndKey is not of type string or number it will return an empty string.
```coffeescript
css= new Css '#body',
	left: 100
	right: '100'

console.log css.get '#body left'
# 100

console.log css.get '#body right'
# '100'

console.log css.get '#body top'
# ''
```
___
**Css.prototype.gets**	(overrides Xs.prototype.gets)
> `<string> gets( <string>/<number> selectorAndKey )`

Returns the value found at selectorAndKey as String, only if selectorAndKey exists in .object and it's value is of type String or Number.
If no valid value can be resolved from selectorAndKey, .gets returns an empty string.
```coffeescript
css= new Css '#body',
	opacity: 0.1

console.log css.gets '#body opacity'
# '0.1'

console.log css.gets '#body right'
# ''
```
___
**Css.prototype.getn**	(overrides Xs.prototype.getn)
> `<number> getn( <string>/<number> selector, <number> replacement )`

Calls .get and tries to force it's result to be a number, if that fails, replacement will be used if replacement
is given, otherwise a zero 0 will be returned.

```coffeescript
css= new Css '#body width', '100px'

# #body width is found, so 42 will be ignored
console.log css.getn '#body width', 42
# 100 (typeof 100 === 'number')

# no replacement value defaults to 0
console.log css.getn '#body height'
# 0

# #body height is not found, replacement will be used
console.log css.getn '#body height', 42
# 42
```
___
**Css.prototype.getu**
> `<string> getu( <string>/<number> path )`

Returns the value found at path as string including it's unit. This method is needed when working with number values to fetch the
value including it's unit
```coffeescript
css= new Css '#body width', 100
# no unit set for width, getu can only return value as string
console.log css.getu '#body width'
# '100'

Css.Units.set '%', 'width'
# unit is found and will be appended to value
console.log css.getu '#body width'
# '100%'
```
___
**Css.prototype.getRule**
> `<string> getRule( <string> selector )`

Returns the selector if found, otherwise an empty string.
___
**Css.prototype.getRule_**
> `<string> getRule_( <string> selector )`

Returns .getRule prettified.
___
**Css.prototype.getRules**
> `<string> getRules( <string> selector )`

Returns the selector and all sub-selectors found deep below the selector, or an empty string if nothing is found.
___
**Css.prototype.getRules_**
> `<string> getRules_( <string> selector )`

Returns .getRules prettified.
___
**Css.prototype.dump**
> `<string> dump( <boolean> toDom= true )`

Returns an assembled string containing all CSS rules (including @keyframes and @media selectors). If the client is a browser and the
toDom argument is left true, a new DOM stylesheet will be created and inserted into the DOM. A reference to the stylesheet will be
stored in context: Css.prototype.stylesheet. If toDom is set false, dump only returns the CSS string.
```coffeescript
css= new Css '#body #display',

	left: 100

	'#title':
		left: '10%'
		backgroundColor: '#492'

		':hover':
			backgroundColor: '#481'

css.units.set 'px', 'left'

console.log css.dump()
# #body #display{left:100px;}#body #display #title{left:10%;background-color:#492;}#body #display #title:hover{background-color:#481;}
```
With the browser, this method has to be called to create the resulting style sheet, and can normally be called best as final
statement from all scripts.
___
**Css.dump_**
> `<string> dump_( <boolean> toDom= true )`

Css.prototype.dump_ returns a prettified.dump.

Although .dump_ still generates valid CSS, it should not be used at production.
___
**Css.prototype.addListener** (inherited from xs.js)
> `<Listener> addListener( <string> nodePath, <function> callback )`

Adds a listener to the nodePath in your context. nodePath must include a key/property. If the value found at nodePath
changes, callback will be triggered. Two arguments will be passed to callback: the actual nodePath that was triggered
and the new value.

.addListener returns an object with two methods: .trigger( <any type> value ) and .remove(). .trigger triggers the listeners callback
and passes value through. .remove removes the listener. The method can still be called safely, it only does nothing and returns undefined.

Check Xs.Listeners in the xs.js API for a more elaborate explanation.
```coffeescript
css= new Css 'body background', '#222'

bodyListener= css.addListener 'body background', ( path, value ) ->
	console.log 'Omg! the entire background has changed to '+ value+ '!'

css.set 'body background', 'blue'
# Omg! the entire background has changed to blue!

# or manually trigger the listener with the returned trigger
# and override the value argument:
bodyListener.trigger 'a bluish color'
# Omg! the entire background has changed to a bluish color!

bodyListener.remove()
bodyListener.trigger 'no answer..'
```
___
Css.Units
=========

Css.Units is the resource for automatically appending a unit to key:value pairs. This makes it possible to work with numeric values,
as long as you specify what unit needs to be appended in the final output.

**Css.Units.all**
> `<array> Css.Units.all`

Css.Units.All contains all (all?) CSS units. This is used internally, but can be modified to optimize for speed.

```coffeescript
Css.Units.all: [ '%', 'px', 'pt', 'em', 'pc', 'ex', 'deg', 'cm', 'mm', 'ms', 's', 'ch', 'rem', 'vw', 'vh', 'vmin', 'vmax', 'in', 'grad', 'rad', 'turn', 'Hz', 'kHz', 'dpi', 'dpcm', 'dppx' ]
```
Prepend to the array:
```coffeescript
Css.Units.all.unshift 'unit'
```
or use a custom/reduced version to speed-up processing in large projects:
```coffeescript
Css.Units.all= [ '%', 'px', 'pt', 's', 'ms', 'deg' ]
```
___
**Css.Units.unit**
> `<object> Css.Units.unit`

Css.Units.unit is the actual object where all global unit references are stored. By default Css.Units.unit is empty {}. You can
add to Css.Units.unit with Css.Units.set() method, or directly as shown below:
```coffeescript
# create a Css object and work with numbers
css= new Css 'div',
	width: 33

# set global width directly to automatically append 'px'
# I use the alias for Css.Units.unit: Css.unit
Css.unit.width= 'px'

console.log css.dump()
# div{width:33px;}
```
___
**Css.Units.hasUnit**
> `<string>/<boolean> Css.Units.hasUnit( <string> value )`

Returns the unit found, if value is a CSS number+unit pair, otherwise a boolean false is returned.
```coffeescript
console.log Css.Units.hasUnit 'spin'
# false

if unit= Css.Units.hasUnit '100in'
	console.log unit
# in
```
___
**Css.Units.strip**
> `<string> Css.Units.strip( <string> value )`

Returns value without a possible CSS unit.
```coffeescript
console.log Css.Units.strip 'spin'
# spin

console.log Css.Units.strip '100in'
# 100

```
___
**Css.Units.set**
> `<this> Css.Units.set( <string> unit, <intoArray> names )`

Css.Units.set is to make adding multiple properties for the same unit more convenient. Css.Units.set expects a css-unit (string) and
css-property names in any intoArray format. Every name will be added to the Css.Units.unit object with the given css-unit as
value.

In the example I use the alias Css.unit to show the contents of the 'golbal' unit object:
```coffeescript
Css.Units.set( 'px', 'width height' ).set( '%', 'left right' )
console.log Css.unit
# { width: 'px', height: 'px', left: '%', right: '%' }

css= new Css 'div',
	left: 0

# use .getu to fetch the value+unit
console.log css.getu 'div left'
# 0%
```
___
**Css.Units.remove**
> `<this> Css.Units.remove( <intoArray> names )`

Remove one or more css-properties from .unit object.
```coffeescript
Css.Units.set( 'px', 'width height' ).set( '%', 'left right' )
console.log Css.unit
# { width: 'px', height: 'px', left: '%', right: '%' }

# use .remove allows for multiple removals at once
Css.Units.remove 'left right'
console.log Css.unit
{ width: 'px', height: 'px' }

# or use the standard JS delete operation for one if you prefer
delete Css.unit[ 'width' ]
console.log Css.unit
{ height: 'px' }
```
___
**Css.Units.prototype.constructor**
> `<this> constructor`

The constructor is used internally by Css to create a new instance of Css.Units, which will override it's own static global
settings in Css.unit. You normally would not need to call this yourself.
___
**Css.Units.prototype.get**
> `<string> get( <string> key, <string> value, <object> context1, ..., contextN )`

.get is used internally to fetch the preferred unit.
___
**Css.Units.prototype.set**
> `<this> set( <string> unit, <string> key1, ..., keyN )`

.set is identical to Css.Units.set, it only is not static. keys/properties added with .set will override Css.Units.unit keys.
___

**Css.Units.prototype.remove**
> `<this> remove( <string> key1, ..., keyN )`

Remove keys/properties from this context.
___


Css.Keyframes
=============
**Css.Keyframes.constructor**
> `<this> Css.Keyframes.constructor( <this> parent )`

The constructor doesn't need to be called directly. Css automatically creates an instance (.keyframes) when you create a new instance
of Css.
___
**Css.Keyframes.prototype.keyframes**
> `<object> keyframes`

Css.Keyframes.prototype.keyframes object holds all keyframes added with .addKeyframes.
___
**Css.Keyframes.prototype.units**
> `<object> units`

Css.Keyframes.prototype.units is an instance of Css.Units. All dynamic methods of Css.Units can be used. All units set with
Css.Keyframes.prototype.units, will override any other units set by an instance of Css or Css.units itself.

```coffeescript
# turn off global prefixes to have less output here
Css.Browser.prefixes= ['']
# set global unit for left
Css.Units.set 'px', 'left'

css= new Css 'div',
	left: 10

css.keyframes.add 'someId',
	'0':
		left: 30
	'100':
		left: 40

# now override any global or Css context units
css.keyframes.unit.left= '%'
# see that only the @keyframes units are overridden
console.log css.dump_()
@keyframes someId{
	0%{
		left              : 30%;
	}
	100%{
		left              : 40%;
	}

}
div{
	left              : 10px;
}
```
___
**Css.Keyframes.prototype.unit**
> `<object> unit`

Css.Keyframes.prototype.unit is the contextual holder of units for keyframes. You can set your units directly for your keyframes like so:
___


**Css.Keyframes.prototype.add**
> `<this> add( <string> selector, <object> keyVal )`

Adds a keyframes rule to the .keyframes object. Below an example that also shows the object format used for writing keyframes rules.
```coffeescript
Css.Units.set 'px', 'top left'
css= new Css 'div',
	animation: 'squareAnim 5s linear 2s infinite alternate'

# note that I don't need to use the %, it will be added automatically
# only add an id as first argument
css.addKeyframes 'squareAnim',
	'0'	:
		left	: 0
		top		: 0
	# or you can do CSS style inline
	'25'	: { left: 200, top:   0 }
	'50'	: { left: 200, top:	200 }
	'75'	: { left:	0, top:	200 }
	'100'	: { left:	0, top:   0 }
```
___
**Css.Keyframes.prototype.remove**
> `<this> remove( id )`

Remove the keyframe with id from Css.Keyframes.keyframes
___
**Css.Keyframes.prototype.get**
> `<string> get( id )`

Returns a specific @keyframe rule, or an empty string if not found.
___
**Css.Keyframes.prototype.set**
> `<this> set( <string> id, <object> frames )`

.set is like .add, only it overwrites a possible exising rule.
___

**Css.Keyframes.prototype.get**
> `<string> get( <string> id )`

Returns the full keyframe rule with id as string. All set prefixes and units will be applied.
___
**Css.Keyframes.prototype.get_**
> `<string> get_( <string> id )`

Returns .get prettified.
___
**Css.Keyframes.prototype.dump**
> `<string> dump()`

Returns a string with all keyframes rules in Css.Keyframes.keyframes. Normally you don't need to call this directly because
Css.prototype.dump_() calls this automatically.
___
**Css.Keyframes.prototype.dump_**
> `<string> dump_( selector )`

Returns .dump prettified.
___
Css.Browser
===========

**Css.Browser.prefixes**
> `<array> Css.Browser.prefixes`

Css.Browser.prefixes holds browser-specific prefixes used for automatically adding them to @keyframes and/or CSS properties.

Initially Css.Browser.prefixes defaults to: [ '-webkit-', '-moz-', '-o-', '-ms-', '' ]

For the default key without prefixes, Css.Browser.prefixes at least needs a '' empty string in it's array for it to show. For future
browser compatibility it is best to always have the '' empty string as last index of the array.

```coffeescript
# set global browser prefixes
Css.Browser.prefixes=  [ '-webkit-', '' ]

# let Css watch for animation as a browser-specific property
Css.Browser.specific.push 'animation'

# set left to have % as global unit so we can use numbers
Css.Units.set '%', 'left'

css1= new Css 'div',
	animation: 'anim1 5s linear'

css2= new Css 'div',
	animation: 'anim2 5s linear'

# give each instance a @keyframes animation
css1.keyframes.add 'anim1',
	'0':
		left: 10
	'100':
		left: 100

css2.keyframes.add 'anim2',
	'0':
		left: 10
	'100':
		left: 100

# give css2 its own prefixes, this will also affect css2.keyframes!
css2.prefixes= [ '-moz-', '' ]

# and give left another unit for css2
css2.unit.left= 'px'

# let css2 not watch for animation as a browser-specific property by
# overriding Css.Browser.specific
# use at least '' to show non-prefixed key
css2.specific= ['']

# css1: global unit and prefixes
console.log css1.dump_()

@-webkit-keyframes anim1{
	0%{
		left              : 10%;
	}
	100%{
		left              : 100%;
	}
}
@keyframes anim1{
	0%{
		left              : 10%;
	}
	100%{
		left              : 100%;
	}
}
div{
	-webkit-animation : anim1 5s linear;
	animation         : anim1 5s linear;
}

# see css2 context overriding the global unit and prefixes
console.log css2.dump_()

@-moz-keyframes anim2{
	0%{
		left              : 10px;
	}
	100%{
		left              : 100px;
	}
}
@keyframes anim2{
	0%{
		left              : 10px;
	}
	100%{
		left              : 100px;
	}
}
div{
	animation         : anim2 5s linear;
}
```
___

**Css.Browser.specific**
> `<array> Css.Browser.specific`

Css.Browser.specific is an array holding all CSS properties (initially empty) that use browser-specific prefixes. Because of the many
browser vendors and the countless properties and variations of these properties amongst the vendors, there is not even an up to date
listing available, let alone creating a waterproof system of automatically adding them to your CSS.

Therefore, in css.js you can add your own selection of prefixes and list of browser-specific properties triggering them. All properties
found in Css.Browser.specific will be duplicated with the prefixes listed in Css.Browser.prefixes.

```coffeescript
Css.Browser.prefixes= [ '-o-', '-webkit-','-moz-', '' ]
Css.Browser.specific= [ 'animation', 'transform', 'transition', 'etc..' ]

css= new Css '#animDiv',
	animation: 'fadeAnimation 5s linear'

console.log css.dump_()

#animDiv{
	-webkit-animation     : fadeAnimation 5s linear;
	-moz-animation        : fadeAnimation 5s linear;
	-o-animation          : fadeAnimation 5s linear;
	animation             : fadeAnimation 5s linear;
}
```
___
**Css.Browser.each**
> `Css.Browser.each( <function> callback, <intoArray> prefixes )`

Used internally to apply all preferred browser specific prefixes.
___

Javascript examples:
====================

**The quick introductory example:**
```javascript
// some data to work with
var colors= {
	 white		: '#eee'
	,gray		: '#444'
	,black		: '#111'
};

var borders= {
	 thin			: 'solid 1px '+ colors.gray
	,fat			: 'solid 5px '+ colors.gray
};

// create a new instance of Css
var css= new Css();

// set units for those properties you want to use as Numbers
css.units
	.set( '%', 'width height' )
	.set( 'px', 'top left' );

// write your css:
css.add( 'div', {
	color	: colors.white
});

css.add( '#body', {
	 width	: 100
	,height	: 100
	,border	: borders.fat
	// you can either use or mix camel-case and dashes
	,backgroundColor: colors.black
});

css.add( '#header', {
	 width	: css.getn( '#body width' )
	,height	: css.getn('#body height')* .15
	,border	: borders.thin
	,backgroundColor: colors.white
	,'#title': {
		 position	: 'relative'
		,left			: 50
		,top			: 30
		,color		: colors.gray
		,':hover': {
			backgroundColor: colors.black
		}
	}
});

// add .dump to the last line of the final script, it will dynamically create
// a style-sheet with the rules from context and insert it into the DOM:
console.log( css.dump() );

div{color:#eee;}#body{width:100%;height:100%;border:solid 5px #444;background-color:#111;}#header{width:100%;height:15%;border:solid 1px #444;background-color:#eee;}#header #title{position:relative;left:50px;top:30px;color:#444;}

// .dump defaults to compressed output, use .dump_ to get prettified output:
console.log( css.dump_() );

div{
	color             :#eee;
}
#body{
	width             :100%;
	height            :100%;
	border            :solid 5px #444;
	background-color  :#111;
}
#header{
	width             :100%;
	height            :15%;
	border            :solid 1px #444;
	background-color  :#eee;
}
#header #title{
	position          :relative;
	left              :50px;
	top               :30px;
	color             :#444;
}
#header #title:hover{
	background-color  :#111;
}
```
___
**Css.prototype.constructor example**
```javascript
// the most basic start of a Css object:
var css= new Css();

// or with a selector:
var css= new Css( 'div', {
	color: '#222'
});

// or a selector path at once with sub paths inside:

var css= new Css( '#body #sidebar', {
	 width	: '100px'
	,height	: '600px'
	,backgroundColor: '#222'
	,'#menuItem': {
		 marginLeft: '10px'
		,backgroundColor: '#333'
		,'#text': {
		 	 color: '#24a'
		 	,':hover': {
		 		color: '#25a'
		 	}
		}
	}
	,'#footer': {
		backgroundColor: '#111'
	}
});

console.log( css.dump_() );

#body #sidebar{
	width             : 100px;
	height            : 600px;
	background-color  : #222;
}
#body #sidebar #menuItem{
	margin-left       : 10px;
	background-color  : #333;
}
#body #sidebar #menuItem #text{
	color             : #24a;
}
#body #sidebar #menuItem #text:hover{
	color             : #25a;
}
#body #sidebar #footer{
	background-color  : #111;
}
```
___
**Css.prototype.object example**
```javascript
var css= new Css( 'div ul li', { color: '#333' } );
console.log( css.object.div.ul.li.color );
// #333
```
___
**Css.prototype.unit example**
```javascript
Css.Units.set( 'px', 'width height' );

var css= new Css( 'div', {
	 top	: 100
	,width	: 33
	,height	: 99
});

css.unit.width= 'pt';

console.log( css.dump_() );

div{
	top				: 100;
	width			: 33pt;
	height			: 99px;
}
```
___
**Css.prototype.add example**
```javascript
var css= new Css( '#header #left color', '#333' );
console.log( css.dump() );
// #header #left{color:#333}

css.add( '#header #left #menu #item color', 'green' )
console.log( css.dump() );
// #header #left{color:#333;}#header #left #menu #item{color:green;}
```
___
**Css.prototype.set example**
```javascript
var css= new Css( 'div ul li', { color: '#333' } );
css.set( 'div ul li color', '#111' );
console.log( css.gets('div ul li color') );
// #111
```
___
**Css.prototype.get example**
```javascript
var css= new Css( '#body', {
	 left	: 100
	,right: '100'
});

console.log( css.get('#body left') );
// 100

console.log( css.get('#body right') );
// '100'

console.log( css.get('#body top') );
// ''
```
___
**Css.prototype.gets example**
```coffeescript
var css= new Css( '#body', {
	opacity: 0.1
});

console.log( css.gets('#body opacity') );
// '0.1'

console.log( css.gets('#body right') );
// ''
```
___
**Css.prototype.getn example**
```javascript
var css= new Css( '#body width', '100px' );

// #body width is found, so 42 will be ignored
console.log( css.getn('#body width', 42) );
// 100 (typeof 100 === 'number')

// no replacement value defaults to 0
console.log( css.getn('#body height') );
// 0

// #body height is not found, replacement will be used
console.log( css.getn('#body height', 42) );
// 42
```
___
**Css.prototype.getu example**
```javascript
var css= new Css( '#body width', 100 );
// no unit set for width, getu can only return value as string
console.log( css.getu('#body width') );
// '100'

Css.Units.set( '%', 'width' );
// unit is found and will be appended to value
console.log( css.getu('#body width') );
// '100%'
```
___
**Css.prototype.dump example**
```javascript
var css= new Css( '#body #display', {
	 left		: 100
	,'#title': {
		 left		: '10%'
		,backgroundColor: '#492'
		,':hover': {
			backgroundColor: '#481'
		}
	}
});

css.units.set( 'px', 'left' );

console.log( css.dump() );
// #body #display{left:100px;}#body #display #title{left:10%;background-color:#492;}#body #display #title:hover{background-color:#481;}
```
___
**Css.prototype.addListener example**
```javascript
var css= new Css( 'body background', '#222' );

var bodyListener= css.addListener( 'body background', function( path, value ){
	console.log( 'Omg! the entire background has changed to '+ value+ '!' );
});

css.set( 'body background', 'blue' );
// Omg! the entire background has changed to blue!

// or manually trigger the listener with the returned trigger
// and override the value argument:
bodyListener.trigger( 'a bluish color' );
// Omg! the entire background has changed to a bluish color!

bodyListener.remove();
bodyListener.trigger( 'no answer..' );
```
___
**Css.Units.all example**
Prepend to the array:
```javascript
Css.Units.all.unshift( 'unit' );
```
or use a custom/reduced version to speed-up processing in large projects:
```javascript
Css.Units.all= [ '%', 'px', 'pt', 's', 'ms', 'deg' ];
```
___
**Css.Units.unit example**
```javascript
// create a Css object and work with numbers
var css= new Css( 'div', {
	width: 33
});

// set global width directly to automatically append 'px'
// I use the alias for Css.Units.unit: Css.unit
Css.unit.width= 'px';

console.log( css.dump() );
// div{width:33px;}
```
___
**Css.Units.hasUnit example**
```javascript
console.log( Css.Units.hasUnit('spin') );
// false

if( unit= Css.Units.hasUnit( '100in') )
	console.log( unit );
// in
```
___
**Css.Units.strip example**
```javascript
console.log( Css.Units.strip('spin') );
// spin

console.log( Css.Units.strip('100in') );
// 100
```
___
**Css.Units.set example**
```javascript
Css.Units.set( 'px', 'width height' ).set( '%', 'left right' );
console.log( Css.unit );
// { width: 'px', height: 'px', left: '%', right: '%' }

var css= new Css( 'div', {
	left: 0
});

// use .getu to fetch the value+unit
console.log( css.getu('div left') );
// 0%
```
___
**Css.Units.remove example**
```javascript
Css.Units.set( 'px', 'width height' ).set( '%', 'left right' );
console.log( Css.unit );
// { width: 'px', height: 'px', left: '%', right: '%' }

// use .remove allows for multiple removals at once
Css.Units.remove( 'left right' );
console.log( Css.unit );
// { width: 'px', height: 'px' }

// or use the standard JS delete operation for one if you prefer
delete Css.unit[ 'width' ];
console.log( Css.unit )
// { height: 'px' }
```
___
**Css.Keyframes.prototype.units example**
```javascript
// turn off global prefixes to have less output here
Css.Browser.prefixes= [''];
// set global unit for left
Css.Units.set( 'px', 'left' );

var css= new Css( 'div', {
	left: 10
});

css.keyframes.add( 'someId', {
	 '0': {
		left: 30
	}
	,'100': {
		left: 40
	}
});

// now override any global or Css context units
css.keyframes.unit.left= '%';
// see that only the @keyframes units are overridden
console.log( css.dump_() );
@keyframes someId{
	0%{
		left              : 30%;
	}
	100%{
		left              : 40%;
	}
}
div{
	left              : 10px;
}
```
___
**Css.Keyframes.prototype.add example**
```javascript
Css.Units.set( 'px', 'top left' );
var css= new Css( 'div', {
	animation: 'squareAnim 5s linear 2s infinite alternate'
});

// note that I don't need to use the %, it will be added automatically
// only add an id as first argument
css.addKeyframes( 'squareAnim', {
	 '0'	: {
		 left		: 0
		,top		: 0
	}
	# or you can do CSS style inline
	,'25'	: { left: 200, top:   0 }
	,'50'	: { left: 200, top:	200 }
	,'75'	: { left:	0, top:	200 }
	,'100'	: { left:	0, top:   0 }
});
```
___




**Css.Browser.prefixes example**
```coffeescript
// set global browser prefixes
Css.Browser.prefixes=  [ '-webkit-', '' ];

// let Css watch for animation as a browser-specific property
Css.Browser.specific.push( 'animation' );

// set left to have % as global unit so we can use numbers
Css.Units.set( '%', 'left' );

var css1= new Css( 'div', {
	animation: 'anim1 5s linear'
});

var css2= new Css( 'div', {
	animation: 'anim2 5s linear'
});

// give each instance a @keyframes animation
css1.keyframes.add( 'anim1', {
	 '0': {
		left: 10
	}
	,'100': {
		left: 100
	}
});

css2.keyframes.add( 'anim2', {
	 '0': {
		left: 10
	}
	,'100': {
		left: 100
	}
});

// give css2 its own prefixes, this will also affect css2.keyframes!
css2.prefixes= [ '-moz-', '' ];
// and give left another unit for css2
css2.unit.left= 'px';
// let css2 not watch for animation as a browser-specific property by
// overriding Css.Browser.specific
// use at least '' to show non-prefixed key
css2.specific= [''];

// css1: global unit and prefixes
console.log( css1.dump_() );

@-webkit-keyframes anim1{
	0%{
		left              : 10%;
	}
	100%{
		left              : 100%;
	}
}
@keyframes anim1{
	0%{
		left              : 10%;
	}
	100%{
		left              : 100%;
	}
}
div{
	-webkit-animation : anim1 5s linear;
	animation         : anim1 5s linear;
}

// see css2 context overriding the global unit and prefixes
console.log( css2.dump_() );

@-moz-keyframes anim2{
	0%{
		left              : 10px;
	}
	100%{
		left              : 100px;
	}
}
@keyframes anim2{
	0%{
		left              : 10px;
	}
	100%{
		left              : 100px;
	}
}
div{
	animation         : anim2 5s linear;
}
```
___

**Css.Browser.specific example**
```javascript
Css.Browser.prefixes= [ '-o-', '-webkit-','-moz-', '' ];
Css.Browser.specific= [ 'animation', 'transform', 'transition', 'etc..' ];

var css= new Css( '#animDiv', {
	animation: 'fadeAnimation 5s linear'
});

console.log( css.dump_() );

#animDiv{
	-webkit-animation     : fadeAnimation 5s linear;
	-moz-animation        : fadeAnimation 5s linear;
	-o-animation          : fadeAnimation 5s linear;
	animation             : fadeAnimation 5s linear;
}
```
___
change log
==========

**0.2.0**

Removed all dependencies by including only the necessary parts of the libraries. css.min.js is now ~19kB.

types.js and xs.js are now fully included.

If you need to use some parts of strings.js or words.js, you'll have to add them manually to your project.
___
**0.1.5**

Added AMD loader support.
___
**0.1.4**

Fixed bug in prettifier causing invalid CSS when ':' in selector
___
**0.1.0**

First commit, a lot to do..
___
todo:
=====

- make internal DOM operations more robust/cross-browser and flexible
- @media selectors need own processing to become cheaper on the object containing them
- more testing, also on different browsers
- make listeners more specific for any combination of: create, read, update and remove (have to do in xs.js)
- so much more comes to mind
- create some time to do all this..

___
**Additional**

I am always open for feature requests or any feedback. You can reach me at Github.

___
