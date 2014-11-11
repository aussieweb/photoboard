/**
 * photoboard v1.2.0
 * Theme for the Photoboard app, by Chris Ferdinandi.
 * http://github.com/cferdinandi/photoboard
 * 
 * Free to use under the MIT License.
 * http://gomakethings.com/mit/
 */

/**
 * x-ray v4.5.2
 * A script to toggle password visibility, by Chris Ferdinandi.
 * http://github.com/cferdinandi/x-ray
 * 
 * Free to use under the MIT License.
 * http://gomakethings.com/mit/
 */

/*
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-01-31
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*global self, document, DOMException */

/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

if ("document" in self && !("classList" in document.createElement("_"))) {

	(function (view) {

		"use strict";

		if (!('Element' in view)) return;

		var
			classListProp = "classList",
			protoProp = "prototype",
			elemCtrProto = view.Element[protoProp],
			objCtr = Object,
			strTrim = String[protoProp].trim || function () {
				return this.replace(/^\s+|\s+$/g, "");
			},
			arrIndexOf = Array[protoProp].indexOf || function (item) {
				var
					i = 0,
					len = this.length;
				for (; i < len; i++) {
					if (i in this && this[i] === item) {
						return i;
					}
				}
				return -1;
			},
			// Vendors: please allow content code to instantiate DOMExceptions
			DOMEx = function (type, message) {
				this.name = type;
				this.code = DOMException[type];
				this.message = message;
			},
			checkTokenAndGetIndex = function (classList, token) {
				if (token === "") {
					throw new DOMEx(
						"SYNTAX_ERR",
						"An invalid or illegal string was specified"
					);
				}
				if (/\s/.test(token)) {
					throw new DOMEx(
						"INVALID_CHARACTER_ERR",
						"String contains an invalid character"
					);
				}
				return arrIndexOf.call(classList, token);
			},
			ClassList = function (elem) {
				var
					trimmedClasses = strTrim.call(elem.getAttribute("class") || ""),
					classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [],
					i = 0,
					len = classes.length;
				for (; i < len; i++) {
					this.push(classes[i]);
				}
				this._updateClassName = function () {
					elem.setAttribute("class", this.toString());
				};
			},
			classListProto = ClassList[protoProp] = [],
			classListGetter = function () {
				return new ClassList(this);
			};
		// Most DOMException implementations don't allow calling DOMException's toString()
		// on non-DOMExceptions. Error's toString() is sufficient here.
		DOMEx[protoProp] = Error[protoProp];
		classListProto.item = function (i) {
			return this[i] || null;
		};
		classListProto.contains = function (token) {
			token += "";
			return checkTokenAndGetIndex(this, token) !== -1;
		};
		classListProto.add = function () {
			var
				tokens = arguments,
				i = 0,
				l = tokens.length,
				token,
				updated = false;
			do {
				token = tokens[i] + "";
				if (checkTokenAndGetIndex(this, token) === -1) {
					this.push(token);
					updated = true;
				}
			}
			while (++i < l);

			if (updated) {
				this._updateClassName();
			}
		};
		classListProto.remove = function () {
			var
				tokens = arguments,
				i = 0,
				l = tokens.length,
				token,
				updated = false;
			do {
				token = tokens[i] + "";
				var index = checkTokenAndGetIndex(this, token);
				if (index !== -1) {
					this.splice(index, 1);
					updated = true;
				}
			}
			while (++i < l);

			if (updated) {
				this._updateClassName();
			}
		};
		classListProto.toggle = function (token, force) {
			token += "";

			var
				result = this.contains(token),
				method = result ? force !== true && "remove" : force !== false && "add";

			if (method) {
				this[method](token);
			}

			return !result;
		};
		classListProto.toString = function () {
			return this.join(" ");
		};

		if (objCtr.defineProperty) {
			var classListPropDesc = {
				get: classListGetter,
				enumerable: true,
				configurable: true
			};
			try {
				objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
			} catch (ex) { // IE 8 doesn't support enumerable:true
				if (ex.number === -0x7FF5EC54) {
					classListPropDesc.enumerable = false;
					objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
				}
			}
		} else if (objCtr[protoProp].__defineGetter__) {
			elemCtrProto.__defineGetter__(classListProp, classListGetter);
		}

	}(self));

}
/**
 * Right-Height v2.6.4
 * Dynamically set content areas of different lengths to the same height, by Chris Ferdinandi.
 * http://github.com/cferdinandi/right-height
 * 
 * Free to use under the MIT License.
 * http://gomakethings.com/mit/
 */

(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define('rightHeight', factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.rightHeight = factory(root);
	}
})(window || this, function (root) {

	'use strict';

	//
	// Variables
	//

	var rightHeight = {}; // Object for public APIs
	var supports = !!document.querySelector && !!root.addEventListener; // Feature test
	var settings, containers, eventTimeout;

	// Default settings
	var defaults = {
		callbackBefore: function () {},
		callbackAfter: function () {}
	};


	//
	// Methods
	//

	/**
	 * A simple forEach() implementation for Arrays, Objects and NodeLists
	 * @private
	 * @param {Array|Object|NodeList} collection Collection of items to iterate
	 * @param {Function} callback Callback function for each iteration
	 * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
	 */
	var forEach = function (collection, callback, scope) {
		if (Object.prototype.toString.call(collection) === '[object Object]') {
			for (var prop in collection) {
				if (Object.prototype.hasOwnProperty.call(collection, prop)) {
					callback.call(scope, collection[prop], prop, collection);
				}
			}
		} else {
			for (var i = 0, len = collection.length; i < len; i++) {
				callback.call(scope, collection[i], i, collection);
			}
		}
	};

	/**
	 * Merge defaults with user options
	 * @private
	 * @param {Object} defaults Default settings
	 * @param {Object} options User options
	 * @returns {Object} Merged values of defaults and options
	 */
	var extend = function ( defaults, options ) {
		var extended = {};
		forEach(defaults, function (value, prop) {
			extended[prop] = defaults[prop];
		});
		forEach(options, function (value, prop) {
			extended[prop] = options[prop];
		});
		return extended;
	};

	/**
	 * Calculate distance to top of page
	 * @private
	 * @param  {Element} content The content area to get the distance for
	 * @return {Number} Distance to the top of the document
	 */
	var getDistanceToTop = function ( content ) {
		var distance = 0;
		if (content.offsetParent) {
			do {
				distance += content.offsetTop;
				content = content.offsetParent;
			} while (content);
		}
		return distance;
	};

	/**
	 * Check if a group of content areas are stacked
	 * @private
	 * @param  {NodeList} contents A collection of content areas to compare
	 * @return {Boolean} Returns true if elements are stacked
	 */
	var checkIfStacked = function ( contents ) {

		// Selectors and variables
		var contentFirst = contents.item(0);
		var contentSecond = contents.item(1);

		// Determine if content containers are stacked
		if ( contentFirst && contentSecond ) {
			if ( getDistanceToTop(contentFirst) - getDistanceToTop(contentSecond) === 0 ) {
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}

	};

	/**
	 * Reset the content height to 'auto'
	 * @private
	 * @param  {Element} content The content area to set to height: auto
	 */
	var resetHeight = function ( content ) {
		content.style.height = '';
		content.style.minHeight = '';
	};

	/**
	 * Get the natural height of each content area, and
	 * record the tallest height to set for all other elements.
	 * @private
	 * @param  {Element} content A content area
	 * @param  {Number} height The current tallest height
	 * @return {Number} The updated tallest height
	 */
	var getHeight = function ( content, height ) {
		if ( content.offsetHeight > height ) {
			height = content.offsetHeight;
		}
		return height;
	};

	/**
	 * Set the height of each content area
	 * @private
	 * @param {Element} content The content area to set a height for
	 * @param {Number} height The height of the tallest content area
	 */
	var setHeight = function ( content, height ) {
		content.style.height = height + 'px';
	};

	/**
	 * Get all content areas within a group
	 * @public
	 * @param  {Element} container The wrapper that contains a set of content areas
	 * @param  {Object} options
	 */
	rightHeight.adjustContainerHeight = function ( container, options ) {

		// Selectors and variables
		var settings = extend( settings || defaults, options || {} );  // Merge user options with defaults
		var contents = container.querySelectorAll('[data-right-height-content]');
		var isStacked = checkIfStacked(contents);
		var height = '0';

		settings.callbackBefore( container ); // Run callbacks before adjusting content

		// Reset each content area to its natural height
		forEach(contents, function (content) {
			resetHeight( content );
		});

		// If content areas are not stacked, give them equal heights
		if ( !isStacked ) {
			forEach(contents, function (content) {
				height = getHeight( content, height );
			});
			forEach(contents, function (content) {
				setHeight( content, height );
			});
		}

		settings.callbackAfter( container ); // Run callbacks after adjust content

	};

	/**
	 * For each group of content, adjust the content area heights
	 * @private
	 * @param  {NodeList} containers A collection of content wrappers
	 * @param  {Object} settings
	 */
	var runRightHeight = function () {
		forEach(containers, function (container) {
			rightHeight.adjustContainerHeight( container, settings );
		});
	};

	/**
	 * On window resize, only run 'runRightHeight' at a rate of 15fps for better performance
	 * @private
	 * @param  {Function} eventTimeout Timeout function
	 * @param  {NodeList} containers A collection of content wrappers
	 * @param  {Object} settings
	 */
	var eventThrottler = function () {
		if ( !eventTimeout ) {
			eventTimeout = setTimeout(function() {
				eventTimeout = null;
				runRightHeight( containers, settings );
			}, 66);
		}
	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	rightHeight.destroy = function () {

		if (!settings) return;

		// Reset content and remove event listeners
		forEach(containers, function (container) {
			var contents = container.querySelectorAll('[data-right-height-content]');
			forEach(contents, function (content) {
				resetHeight( content );
			});
		});
		root.removeEventListener('resize', eventThrottler, false);

		// Reset variables
		settings = null;
		containers = null;
		eventTimeout = null;

	};

	/**
	 * Initialize Right Height
	 * @public
	 * @param {Object} options User settings
	 */
	rightHeight.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Destroy any existing initializations
		rightHeight.destroy();

		// Selectors and variables
		settings = extend( defaults, options || {} ); // Merge user options with defaults
		containers = document.querySelectorAll('[data-right-height]'); // Groups of content

		// Events and listeners
		runRightHeight( containers, options ); // Run Right Height on load
		root.addEventListener('load', runRightHeight, false);
		root.addEventListener('resize', eventThrottler, false); // Run Right Height on window resize

	};


	//
	// Public APIs
	//

	return rightHeight;

});
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define('xray', factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.xray = factory(root);
	}
})(window || this, function (root) {

	'use strict';

	//
	// Variables
	//

	var xray = {}; // Object for public APIs
	var supports = !!document.querySelector && !!root.addEventListener; // Feature test
	var settings, toggles;

	// Default settings
	var defaults = {
		toggleActiveClass: 'active',
		initClass: 'js-x-ray',
		callbackBefore: function () {},
		callbackAfter: function () {}
	};


	//
	// Methods
	//

	/**
	 * A simple forEach() implementation for Arrays, Objects and NodeLists
	 * @private
	 * @param {Array|Object|NodeList} collection Collection of items to iterate
	 * @param {Function} callback Callback function for each iteration
	 * @param {Array|Object|NodeList} scope Object/NodeList/Array that forEach is iterating over (aka `this`)
	 */
	var forEach = function (collection, callback, scope) {
		if (Object.prototype.toString.call(collection) === '[object Object]') {
			for (var prop in collection) {
				if (Object.prototype.hasOwnProperty.call(collection, prop)) {
					callback.call(scope, collection[prop], prop, collection);
				}
			}
		} else {
			for (var i = 0, len = collection.length; i < len; i++) {
				callback.call(scope, collection[i], i, collection);
			}
		}
	};

	/**
	 * Merge defaults with user options
	 * @private
	 * @param {Object} defaults Default settings
	 * @param {Object} options User options
	 * @returns {Object} Merged values of defaults and options
	 */
	var extend = function ( defaults, options ) {
		var extended = {};
		forEach(defaults, function (value, prop) {
			extended[prop] = defaults[prop];
		});
		forEach(options, function (value, prop) {
			extended[prop] = options[prop];
		});
		return extended;
	};

	/**
	 * Get the closest matching element up the DOM tree
	 * @param {Element} elem Starting element
	 * @param {String} selector Selector to match against (class, ID, or data attribute)
	 * @return {Boolean|Element} Returns false if not match found
	 */
	var getClosest = function (elem, selector) {
		var firstChar = selector.charAt(0);
		for ( ; elem && elem !== document; elem = elem.parentNode ) {
			if ( firstChar === '.' ) {
				if ( elem.classList.contains( selector.substr(1) ) ) {
					return elem;
				}
			} else if ( firstChar === '#' ) {
				if ( elem.id === selector.substr(1) ) {
					return elem;
				}
			} else if ( firstChar === '[' ) {
				if ( elem.hasAttribute( selector.substr(1, selector.length - 2) ) ) {
					return elem;
				}
			}
		}
		return false;
	};

	/**
	 * Toggle password visibility
	 * @private
	 * @param  {NodeList} pws Password fields to toggle
	 */
	var togglePW = function ( pws ) {
		forEach(pws, function (pw) {
			var pwType = pw.type.toLowerCase();
			if ( pwType === 'password' ) {
				pw.type = 'text';
			} else if ( pwType === 'text' ) {
				pw.type = 'password';
			}
		});
	};

	/**
	 * Load default visibility
	 * @private
	 * @param  {Element} toggle The element that toggles password visibility
	 * @param  {String} visibility Should the password be visible or hidden by default?
	 * @param  {String} pwSelector ID of the password field
	 * @param  {Object} settings
	 */
	var loadDefaultVisibility = function ( toggle, visibility, pwSelector, settings ) {
		var showText = toggle.querySelector('[data-x-ray-show]');
		var hideText = toggle.querySelector('[data-x-ray-hide]');
		var pws = document.querySelectorAll(pwSelector);
		if ( visibility === 'show' ) {
			togglePW(pws);
			if ( hideText ) {
				hideText.classList.add( settings.toggleActiveClass );
			}
		} else {
			if ( showText ) {
				showText.classList.add( settings.toggleActiveClass );
			}
		}
	};

	/**
	 * Update toggle text
	 * @private
	 * @param  {Element} toggle The element that toggles password visibility
	 * @param  {Object} settings
	 */
	var updateToggleText = function ( toggle, settings ) {
		var showText = toggle.querySelector('.x-ray-show');
		var hideText = toggle.querySelector('.x-ray-hide');
		if ( hideText ) {
			hideText.classList.toggle( settings.toggleActiveClass );
		}
		if ( showText ) {
			showText.classList.toggle( settings.toggleActiveClass );
		}
	};

	/**
	 * Show or hide password visibility
	 * @public
	 * @param  {Element} toggle The element that toggles password visibility
	 * @param  {String} pwSelector The selector for the password fields
	 * @param  {Object} options
	 * @param  {Event} event
	 */
	xray.runToggle = function ( toggle, pwSelector, options, event ) {

		// Selectors and variables
		var settings = extend( settings || defaults, options || {} );  // Merge user options with defaults
		var pws = document.querySelectorAll( pwSelector );

		settings.callbackBefore( toggle, pwSelector ); // Run callbacks before password visibility toggle

		togglePW( pws ); // Show/Hide password
		updateToggleText( toggle, settings ); // Change the toggle text

		settings.callbackAfter( toggle, pwSelector ); // Run callbacks after password visibility toggle

	};

	/**
	 * Handle toggle click events
	 * @private
	 */
	var eventHandler = function (event) {
		var toggle = getClosest(event.target, '[data-x-ray]');
		if ( toggle ) {
			if ( toggle.tagName.toLowerCase() === 'a' || toggle.tagName.toLowerCase() === 'button' ) {
				event.preventDefault();
			}
			xray.runToggle( toggle, toggle.getAttribute('data-x-ray'), settings );
		}
	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	xray.destroy = function () {
		if ( !settings ) return;
		document.documentElement.classList.remove( settings.initClass );
		document.removeEventListener('click', eventHandler, false);
		if ( toggles ) {
			forEach( toggles, function ( toggle ) {

				// Get elements
				var pws = document.querySelectorAll( toggle.getAttribute('data-x-ray') );
				var showText = toggle.querySelector('[data-x-ray-show]');
				var hideText = toggle.querySelector('[data-x-ray-hide]');

				// Reset to default password state
				forEach( pws, function ( pw ) {
					pw.type = 'password';
				});
				showText.classList.remove(settings.toggleActiveClass);
				hideText.classList.remove(settings.toggleActiveClass);

			});
		}
		settings = null;
		toggles = null;
	};

	/**
	 * Initialize X-Ray
	 * @public
	 * @param {Object} options User settings
	 */
	xray.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Destroy any existing initializations
		xray.destroy();

		// Selectors and variables
		settings = extend( defaults, options || {} ); // Merge user options with defaults
		toggles = document.querySelectorAll('[data-x-ray]'); // Get show/hide password toggles

		document.documentElement.classList.add( settings.initClass ); // Add class to HTML element to activate conditional CSS

		// Initialize password visibility defaults
		forEach(toggles, function (toggle, index) {
			var visibility = toggle.getAttribute('data-default');
			var pwID = toggle.getAttribute('data-x-ray');
			loadDefaultVisibility( toggle, visibility, pwID, settings );
		});

		// Listen for click events
		document.addEventListener('click', eventHandler, false);

	};


	//
	// Public APIs
	//

	return xray;

});