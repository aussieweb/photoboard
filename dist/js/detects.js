/**
 * photoboard v1.0.0
 * Theme for the Photoboard app, by Chris Ferdinandi.
 * http://github.com/cferdinandi/photoboard
 * 
 * Free to use under the MIT License.
 * http://gomakethings.com/mit/
 */

(function (root, factory) {
	if ( typeof define === 'function' && define.amd ) {
		define('loadAsync', factory(root));
	} else if ( typeof exports === 'object' ) {
		module.exports = factory(root);
	} else {
		root.loadAsync = factory(root);
	}
})(this, function (root) {

	'use strict';

	//
	// Variables
	//

	var exports = {}; // Object for public APIs


	//
	// Helper Methods
	//

	exports.js = function ( src, cb ) {
		var ref = window.document.getElementsByTagName( 'script' )[ 0 ];
		var script = window.document.createElement( 'script' );
		script.src = src;
		script.async = true;
		ref.parentNode.insertBefore( script, ref );
		if (cb && typeof(cb) === 'function') {
			script.onload = cb;
		}
		return script;
	};

	exports.css = function ( href, before, media ){
		// Arguments explained:
		// `href` is the URL for your CSS file.
		// `before` optionally defines the element we'll use as a reference for injecting our <link>
		// By default, `before` uses the first <script> element in the page.
		// However, since the order in which stylesheets are referenced matters, you might need a more specific location in your document.
		// If so, pass a different reference element to the `before` argument and it'll insert before that instead
		// note: `insertBefore` is used instead of `appendChild`, for safety re: http://www.paulirish.com/2011/surefire-dom-element-insertion/
		var ss = window.document.createElement( 'link' );
		var ref = before || window.document.getElementsByTagName( 'script' )[ 0 ];
		var sheets = window.document.styleSheets;
		ss.rel = 'stylesheet';
		ss.href = href;
		// temporarily, set media to something non-matching to ensure it'll fetch without blocking render
		ss.media = 'only x';
		// inject link
		ref.parentNode.insertBefore( ss, ref );
		// This function sets the link's media back to `all` so that the stylesheet applies once it loads
		// It is designed to poll until document.styleSheets includes the new sheet.
		function toggleMedia(){
			var defined;
			for( var i = 0; i < sheets.length; i++ ){
				if( sheets[ i ].href && sheets[ i ].href.indexOf( href ) > -1 ){
					defined = true;
				}
			}
			if( defined ){
				ss.media = media || 'all';
			}
			else {
				setTimeout( toggleMedia );
			}
		}
		toggleMedia();
		return ss;
	};


	//
	// Public APIs
	//

	return exports;

});
;(function (window, document, undefined) {

	'use strict';

	/**
	 * Test for @font-face support
	 * @return {Boolean} Returns true if supported
	 */
	var isFontFaceSupported = function () {

		var doc = document,
			head = doc.head || doc.getElementsByTagName( "head" )[ 0 ] || doc.documentElement,
			style = doc.createElement( "style" ),
			rule = "@font-face { font-family: 'webfont'; src: 'https://'; }",
			supportFontFace = false,
			blacklist = (function() {
				var ua = win.navigator.userAgent.toLowerCase(),
					wkvers = ua.match( /applewebkit\/([0-9]+)/gi ) && parseFloat( RegExp.$1 ),
					webos = ua.match( /w(eb)?osbrowser/gi ),
					wppre8 = ua.indexOf( "windows phone" ) > -1 && win.navigator.userAgent.match( /IEMobile\/([0-9])+/ ) && parseFloat( RegExp.$1 ) >= 9,
					oldandroid = wkvers < 533 && ua.indexOf( "Android 2.1" ) > -1;

				return webos || oldandroid || wppre8;
			}()),
			sheet;

		style.type = "text/css";
		head.insertBefore( style, head.firstChild );
		sheet = style.sheet || style.styleSheet;

		if ( !!sheet && !blacklist ) {
			try {
				sheet.insertRule( rule, 0 );
				supportFontFace = sheet.cssRules[ 0 ].cssText && ( /webfont/i ).test( sheet.cssRules[ 0 ].cssText );
				sheet.deleteRule( sheet.cssRules.length - 1 );
			} catch( e ) { }
		}

		return supportFontFace;
	};

	/**
	 * Test for pseudo selector support
	 * @param  {String} selector Selector to test
	 * @return {Boolean} Returns true if supported
	 */
	var selectorSupported = function (selector) {

		var support,
			sheet,
			doc = document,
			root = doc.documentElement,
			head = root.getElementsByTagName('head')[0],

			impl = doc.implementation || {
				hasFeature: function() {
					return false;
				}
			},

		link = doc.createElement("style");
		link.type = 'text/css';

		(head || root).insertBefore(link, (head || root).firstChild);

		sheet = link.sheet || link.styleSheet;

		if (!(sheet && selector)) return false;

		support = impl.hasFeature('CSS2', '') ?

		function(selector) {
			try {
				sheet.insertRule(selector + '{ }', 0);
				sheet.deleteRule(sheet.cssRules.length - 1);
			} catch (e) {
				return false;
			}
			return true;
		} : function(selector) {
			sheet.cssText = selector + ' { }';
			return sheet.cssText.length !== 0 && !(/unknown/i).test(sheet.cssText) && sheet.cssText.indexOf(selector) === 0;
		};

		return support(selector);

	};

	// If @font-face and pseudo selectors are supported, add '.font-face' class to <html> element
	if (isFontFaceSupported && selectorSupported(':before')) {
		document.documentElement.className += (document.documentElement.className ? ' ' : '') + 'font-face';
	}

})(window, document);
;(function (window, document, undefined) {

	'use strict';

	// HTML5 video feature detection
	var supports = (typeof(document.createElement('video').canPlayType) != 'undefined');

	// If SVG is supported, add `.svg` class to <html> element
	if ( supports ) {
		document.documentElement.className += (document.documentElement.className ? ' ' : '') + 'html5-video';
	} else {
		loadAsync.css('//releases.flowplayer.org/5.5.0/skin/minimalist.css');
		loadAsync.js('//code.jquery.com/jquery-1.11.0.min.js');
		loadAsync.js('//releases.flowplayer.org/5.5.0/flowplayer.min.js');
	}


})(window, document);
;(function (window, document, undefined) {

	'use strict';

	// SVG feature detection
	var supports = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;

	// If SVG is supported, add `.svg` class to <html> element
	if ( supports ) {
		document.documentElement.className += (document.documentElement.className ? ' ' : '') + 'svg';
	}


})(window, document);