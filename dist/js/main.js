/*!
 * photoboard v2.0.0: The WordPress theme for Photoboard
 * (c) 2016 Chris Ferdinandi
 * MIT License
 * https://github.com/cferdinandi/photoboard
 * Open Source Credits: https://github.com/ftlabs/fastclick, https://github.com/toddmotto/fluidvids, http://prismjs.com
 */

(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.drop = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, (function (root) {

	'use strict';

	//
	// Variables
	//

	var drop = {}; // Object for public APIs
	var supports = 'querySelector' in document && 'addEventListener' in root && 'classList' in document.createElement('_'); // Feature test
	var isTouch = 'ontouchstart' in document; // Check for touch support
	var settings;

	// Default settings
	var defaults = {
		selector: '[data-dropdown]',
		activeClass: 'active',
		initClass: 'js-drop',
		callback: function () {}
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
	var extend = function () {

		// Variables
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		// Check if a deep merge
		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function (obj) {
			for ( var prop in obj ) {
				if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
					// If deep merge and property is an object, merge properties
					if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
						extended[prop] = buoy.extend( true, extended[prop], obj[prop] );
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for ( ; i < length; i++ ) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;

	};

	/**
	 * Get closest DOM element up the tree that contains a class or data attribute
	 * @param  {Element} elem The base element
	 * @param  {String} selector The class or data attribute to look for
	 * @return {Boolean|Element} False if no match
	 */
	var getClosest = function ( elem, selector ) {

		// Variables
		var firstChar = selector.charAt(0);
		var supports = 'classList' in document.documentElement;
		var attribute, value;

		// If selector is a data attribute, split attribute from value
		if ( firstChar === '[' ) {
			selector = selector.substr(1, selector.length - 2);
			attribute = selector.split( '=' );

			if ( attribute.length > 1 ) {
				value = true;
				attribute[1] = attribute[1].replace( /"/g, '' ).replace( /'/g, '' );
			}
		}

		// Get closest match
		for ( ; elem && elem !== document; elem = elem.parentNode ) {

			// If selector is a class
			if ( firstChar === '.' ) {
				if ( supports ) {
					if ( elem.classList.contains( selector.substr(1) ) ) {
						return elem;
					}
				} else {
					if ( new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test( elem.className ) ) {
						return elem;
					}
				}
			}

			// If selector is an ID
			if ( firstChar === '#' ) {
				if ( elem.id === selector.substr(1) ) {
					return elem;
				}
			}

			// If selector is a data attribute
			if ( firstChar === '[' ) {
				if ( elem.hasAttribute( attribute[0] ) ) {
					if ( value ) {
						if ( elem.getAttribute( attribute[0] ) === attribute[1] ) {
							return elem;
						}
					} else {
						return elem;
					}
				}
			}

			// If selector is a tag
			if ( elem.tagName.toLowerCase() === selector ) {
				return elem;
			}

		}

		return null;

	};

	/**
	 * Close all dropdown menus
	 * @param {Object} options Custom settings
	 * @public
	 */
	drop.closeDrops = function () {

		// Get dropdowns
		var drops = document.querySelectorAll( settings.selector );

		// Close all the dropdowns
		forEach(drops, (function (drop) {
			drop.classList.remove( settings.activeClass );
		}));

	};

	/**
	 * Open a dropdown menu
	 * @public
	 * @param  {Element} toggle  Element that triggered the expand or collapse
	 * @param  {Object}  options Custom settings
	 */
	drop.openDrop = function ( toggle, options ) {

		// Selectors and variables
		var settings = extend( settings || defaults, options || {} );  // Merge user options with defaults

		// Close any open dropdown menus
		drop.closeDrops();

		// Open the toggled dropdown menu
		toggle.classList.add( settings.activeClass );

		// Run callbacks after drop toggle
		settings.callback( toggle );

	};

	/**
	 * Handle toggle and document click events
	 * @param {Event} event
	 * @private
	 */
	var clickHandler = function (event) {

		// Variables
		var toggle = event.target;
		var menu = getClosest( toggle, settings.selector );

		if ( menu ) {
			// If dropdown menu, do nothing
			return;
		} else {
			// If document body, close open dropdown menus
			drop.closeDrops();
		}

	};

	var focusHandler = function (event) {

		// Variables
		var target = event.target;
		var toggle = getClosest( target, settings.selector );

		// If focused element isn't dropdown, close all dropdowns and end
		if ( !toggle ) {
			drop.closeDrops();
			return;
		}

		// If focused element is currently active dropdown, end
		if ( toggle.classList.contains( settings.activeClass ) ) {
			return;
		}

		// Otherwise, activate the dropdown
		drop.openDrop(toggle, settings);

	};

	var hoverHandler = function (event) {

		// Variables
		var target = event.target;
		var toggle = getClosest( target, settings.selector );

		// If a dropdown menu, activate it
		if ( toggle && !toggle.classList.contains( settings.activeClass ) ) {
			drop.openDrop(toggle, settings); // Open this dropdown

			// Prevent default on touch devices
			if ( isTouch ) {
				event.preventDefault();
			}
		}
	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	drop.destroy = function () {

		if ( !settings ) return;

		// Remove init class
		document.documentElement.classList.remove( settings.initClass );

		// Remove event listeners
		document.removeEventListener('click', clickHandler, false);
		document.removeEventListener('focusin', focusHandler, false);
		document.removeEventListener('mouseover', hoverHandler, false);

		// Close all dropdowns
		drop.closeDrops();

		// Reset variables
		settings = null;

	};

	/**
	 * Initialize Drop
	 * @public
	 * @param {Object} options User settings
	 */
	drop.init = function ( options ) {

		// feature test
		if ( !supports ) return;

		// Destroy any existing initializations
		drop.destroy();

		// Selectors and variables
		settings = extend( defaults, options || {} ); // Merge user options with defaults
		var toggles = document.querySelectorAll( settings.selector + ' > a' );

		// Add class to HTML element to activate conditional CSS
		document.documentElement.classList.add( settings.initClass );

		// Event listeners
		document.addEventListener('click', clickHandler, false);
		document.addEventListener('focus', focusHandler, true);
		document.addEventListener('mouseover', hoverHandler, false);
		if ( isTouch ) {
			document.addEventListener('touchstart', hoverHandler, false);
		}

	};


	//
	// Public APIs
	//

	return drop;

}));
/**
 * Add markup and load video JS
 */
;(function (window, document, undefined) {

	'use strict';

	var videos = document.querySelectorAll( 'a[href*=".mov"], a[href*=".MOV"], a[href*=".mp4"], a[href*=".MP4"], a[href*=".m4v"], a[href*=".M4V"]' );
	var directory = document.querySelector( 'meta[name="photoboard-video-js-directory"]' );

	if ( videos.length === 0 || !directory || !directory.content ) return;

	loadCSS(directory.content + 'css/video-js.min.css');
	loadJS(directory.content + 'js/video.min.js', (function () {
		for (var i = 0; i < videos.length; i++) {

			if ( videos[i].parentNode.classList.contains( 'wp-video-shortcode' ) ) continue;

			// Insert HTML5 video element
			var div = document.createElement('div');
			var format = videos[i].href.substring( videos[i].href.length - 3 );
			if ( format === 'm4v' ) {
				format = 'mp4';
			}
			div.innerHTML = '<p>x</p><video id="example_video_' + i + '" class="vjs-default-skin" controls preload="auto"><source src="' + videos[i].href + '" type="video/' + format + '"></video>';
			videos[i].parentNode.parentNode.insertBefore( div.childNodes[1], videos[i].parentNode );

			// load Video.js
			videojs(videos[i]);

			// Convert link to download button
			div.innerHTML = '<p>x</p><a class="btn" href="' + videos[i].href + '" download><svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 17 17"><path d="M8.5 9.563l4.25-4.25H9.562v-4.25H7.437v4.25H4.249zm3.864-1.739l-1.191 1.191 4.318 1.61-6.99 2.607-6.99-2.607 4.318-1.61-1.191-1.191L.002 9.563v4.25l8.5 3.188 8.5-3.188v-4.25z"/></svg> Download <span class="screen-reader">' + videos[i].innerHTML + '</a>';
			videos[i].parentNode.parentNode.insertBefore( div.childNodes[1], videos[i].parentNode );
			videos[i].parentNode.parentNode.className += ' text-right';
			videos[i].parentNode.style.display = 'none';
			videos[i].parentNode.style.visibility = 'hidden';


		}
	}));

})(window, document);
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.rightHeight = factory(root);
	}
})(typeof global !== "undefined" ? global : this.window || this.global, (function (root) {

	'use strict';

	//
	// Variables
	//

	var rightHeight = {}; // Object for public APIs
	var supports = 'querySelector' in document && 'addEventListener' in root; // Feature test
	var settings, containers, eventTimeout;

	// Default settings
	var defaults = {
		selector: '[data-right-height]',
		selectorContent: '[data-right-height-content]',
		callback: function () {}
	};


	//
	// Methods
	//

	/**
	 * A simple forEach() implementation for Arrays, Objects and NodeLists.
	 * @private
	 * @author Todd Motto
	 * @link   https://github.com/toddmotto/foreach
	 * @param {Array|Object|NodeList} collection Collection of items to iterate
	 * @param {Function}              callback   Callback function for each iteration
	 * @param {Array|Object|NodeList} scope      Object/NodeList/Array that forEach is iterating over (aka `this`)
	 */
	var forEach = function ( collection, callback, scope ) {
		if ( Object.prototype.toString.call( collection ) === '[object Object]' ) {
			for ( var prop in collection ) {
				if ( Object.prototype.hasOwnProperty.call( collection, prop ) ) {
					callback.call( scope, collection[prop], prop, collection );
				}
			}
		} else {
			for ( var i = 0, len = collection.length; i < len; i++ ) {
				callback.call( scope, collection[i], i, collection );
			}
		}
	};

	/**
	 * Merge two or more objects. Returns a new object.
	 * @private
	 * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
	 * @param {Object}   objects  The objects to merge together
	 * @returns {Object}          Merged values of defaults and options
	 */
	var extend = function () {

		// Variables
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		// Check if a deep merge
		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function (obj) {
			for ( var prop in obj ) {
				if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
					// If deep merge and property is an object, merge properties
					if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
						extended[prop] = extend( true, extended[prop], obj[prop] );
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for ( ; i < length; i++ ) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;

	};


	/**
	 * Wait until document is ready to run method
	 * @private
	 * @param  {Function} fn Method to run
	 */
	var ready = function ( fn ) {

		// Sanity check
		if ( typeof fn !== 'function' ) return;

		// If document is already loaded, run method
		if ( document.readyState === 'interactive'  ) {
			return fn();
		}

		// Otherwise, wait until document is loaded
		document.addEventListener( 'DOMContentLoaded', fn, false );

	};


	/**
	 * Get an element's distance from the top of the Document.
	 * @private
	 * @param  {Node} elem The element
	 * @return {Number}    Distance from the top in pixels
	 */
	var getOffsetTop = function ( elem ) {
		var location = 0;
		if (elem.offsetParent) {
			do {
				location += elem.offsetTop;
				elem = elem.offsetParent;
			} while (elem);
		}
		return location >= 0 ? location : 0;
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
			if ( getOffsetTop(contentFirst) - getOffsetTop(contentSecond) === 0 ) {
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
		var contents = container.querySelectorAll( settings.selectorContent );
		var isStacked = checkIfStacked(contents);
		var height = '0';

		// Reset each content area to its natural height
		forEach(contents, (function (content) {
			resetHeight( content );
		}));

		// If content areas are not stacked, give them equal heights
		if ( !isStacked ) {
			forEach(contents, (function (content) {
				height = getHeight( content, height );
			}));
			forEach(contents, (function (content) {
				setHeight( content, height );
			}));
		}

		settings.callback( container ); // Run callbacks after adjust content

	};

	/**
	 * For each group of content, adjust the content area heights
	 * @private
	 * @param  {NodeList} containers A collection of content wrappers
	 * @param  {Object}   settings
	 */
	var runRightHeight = function ( containers, settings ) {
		forEach(containers, (function (container) {
			rightHeight.adjustContainerHeight( container, settings );
		}));
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
			eventTimeout = setTimeout((function() {
				eventTimeout = null;
				runRightHeight( containers, settings );
			}), 66);
		}
	};

	/**
	 * Destroy the current initialization.
	 * @public
	 */
	rightHeight.destroy = function () {

		if (!settings) return;

		// Reset content and remove event listeners
		forEach(containers, (function (container) {
			var contents = container.querySelectorAll( settings.selectorContent );
			forEach(contents, (function (content) {
				resetHeight( content );
			}));
		}));
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
		containers = document.querySelectorAll( settings.selector ); // Groups of content

		// Events and listeners
		ready((function() {
			runRightHeight( containers, options ); // Run Right Height on load
		}));
		root.addEventListener('resize', eventThrottler, false); // Run Right Height on window resize

	};


	//
	// Public APIs
	//

	return rightHeight;

}));
(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define([], factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.xray = factory(root);
	}
})(typeof global !== 'undefined' ? global : this.window || this.global, (function (root) {

	'use strict';

	//
	// Variables
	//

	var xray = {}; // Object for public APIs
	var supports = 'querySelector' in document && 'addEventListener' in root && 'classList' in document.createElement('_'); // Feature test
	var settings, toggles;

	// Default settings
	var defaults = {
		selector: '[data-x-ray]',
		selectorShow: '[data-x-ray-show]',
		selectorHide: '[data-x-ray-hide]',
		toggleActiveClass: 'active',
		initClass: 'js-x-ray',
		callback: function () {}
	};


	//
	// Methods
	//

	/**
	 * A simple forEach() implementation for Arrays, Objects and NodeLists.
	 * @private
	 * @author Todd Motto
	 * @link   https://github.com/toddmotto/foreach
	 * @param {Array|Object|NodeList} collection Collection of items to iterate
	 * @param {Function}              callback   Callback function for each iteration
	 * @param {Array|Object|NodeList} scope      Object/NodeList/Array that forEach is iterating over (aka `this`)
	 */
	var forEach = function ( collection, callback, scope ) {
		if ( Object.prototype.toString.call( collection ) === '[object Object]' ) {
			for ( var prop in collection ) {
				if ( Object.prototype.hasOwnProperty.call( collection, prop ) ) {
					callback.call( scope, collection[prop], prop, collection );
				}
			}
		} else {
			for ( var i = 0, len = collection.length; i < len; i++ ) {
				callback.call( scope, collection[i], i, collection );
			}
		}
	};

	/**
	 * Merge two or more objects. Returns a new object.
	 * @private
	 * @param {Boolean}  deep     If true, do a deep (or recursive) merge [optional]
	 * @param {Object}   objects  The objects to merge together
	 * @returns {Object}          Merged values of defaults and options
	 */
	var extend = function () {

		// Variables
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		// Check if a deep merge
		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function (obj) {
			for ( var prop in obj ) {
				if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
					// If deep merge and property is an object, merge properties
					if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
						extended[prop] = extend( true, extended[prop], obj[prop] );
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for ( ; i < length; i++ ) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;

	};

	/**
	 * Get the closest matching element up the DOM tree.
	 * @private
	 * @param  {Element} elem     Starting element
	 * @param  {String}  selector Selector to match against (class, ID, data attribute, or tag)
	 * @return {Boolean|Element}  Returns null if not match found
	 */
	var getClosest = function ( elem, selector ) {

		// Variables
		var firstChar = selector.charAt(0);
		var attribute, value;

		// If selector is a data attribute, split attribute from value
		if ( firstChar === '[' ) {
			selector = selector.substr(1, selector.length - 2);
			attribute = selector.split( '=' );

			if ( attribute.length > 1 ) {
				value = true;
				attribute[1] = attribute[1].replace( /"/g, '' ).replace( /'/g, '' );
			}
		}

		// Get closest match
		for ( ; elem && elem !== document; elem = elem.parentNode ) {

			// If selector is a class
			if ( firstChar === '.' ) {
				if ( elem.classList.contains( selector.substr(1) ) ) {
					return elem;
				}
			}

			// If selector is an ID
			if ( firstChar === '#' ) {
				if ( elem.id === selector.substr(1) ) {
					return elem;
				}
			}

			// If selector is a data attribute
			if ( firstChar === '[' ) {
				if ( elem.hasAttribute( attribute[0] ) ) {
					if ( value ) {
						if ( elem.getAttribute( attribute[0] ) === attribute[1] ) {
							return elem;
						}
					} else {
						return elem;
					}
				}
			}

			// If selector is a tag
			if ( elem.tagName.toLowerCase() === selector ) {
				return elem;
			}

		}

		return null;

	};

	/**
	 * Toggle password visibility
	 * @private
	 * @param  {NodeList} pws Password fields to toggle
	 */
	var togglePW = function ( pws ) {
		forEach(pws, (function (pw) {
			var pwType = pw.type.toLowerCase();
			if ( pwType === 'password' ) {
				pw.type = 'text';
			} else if ( pwType === 'text' ) {
				pw.type = 'password';
			}
		}));
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
		var showText = toggle.querySelector( settings.selectorShow );
		var hideText = toggle.querySelector( settings.selectorHide );
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

		togglePW( pws ); // Show/Hide password
		updateToggleText( toggle, settings ); // Change the toggle text

		settings.callback( toggle, pwSelector ); // Run callbacks after password visibility toggle

	};

	/**
	 * Handle toggle click events
	 * @private
	 */
	var eventHandler = function (event) {
		var toggle = getClosest( event.target, settings.selector );
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
			forEach( toggles, (function ( toggle ) {

				// Get elements
				var pws = document.querySelectorAll( toggle.getAttribute('data-x-ray') );
				var showText = toggle.querySelector( settings.selectorShow );
				var hideText = toggle.querySelector( settings.selectorHide );

				// Reset to default password state
				forEach( pws, (function ( pw ) {
					pw.type = 'password';
				}));
				showText.classList.remove(settings.toggleActiveClass);
				hideText.classList.remove(settings.toggleActiveClass);

			}));
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
		toggles = document.querySelectorAll( settings.selector ); // Get show/hide password toggles

		document.documentElement.classList.add( settings.initClass ); // Add class to HTML element to activate conditional CSS

		// Initialize password visibility defaults
		forEach(toggles, (function (toggle, index) {
			var visibility = toggle.getAttribute('data-default');
			var pwID = toggle.getAttribute('data-x-ray');
			loadDefaultVisibility( toggle, visibility, pwID, settings );
		}));

		// Listen for click events
		document.addEventListener('click', eventHandler, false);

	};


	//
	// Public APIs
	//

	return xray;

}));
/**
 * Script initializations
 */

// Dropdown menus
drop.init({
	selector: '.menu-item-has-children'
});

// Right height
if ( document.querySelector( '[data-right-height]' ) ) {
	rightHeight.init();
}

// Add show/hide password checkbox
;(function (window, document, undefined) {

	'use strict';

	// Check that password fields exists
	var pws = document.querySelector( '.wpwebapp-form-password' );
	if ( !pws ) return;

	// Get submit button
	var submit = document.querySelector( '.wpwebapp-form-button' );
	if ( !submit ) return;

	// Inject password toggle
	var div = document.createElement('div');
	div.innerHTML = '<p>x</p><label class="x-ray"><input type="checkbox" data-x-ray=".wpwebapp-form-password" data-default="hide"> Show password</label>';
	submit.parentNode.insertBefore( div.childNodes[1], submit );

	// Initialize X-Ray
	xray.init();

})(window, document);