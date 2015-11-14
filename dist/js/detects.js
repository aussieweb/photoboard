/*!
 * photoboard v1.4.1: Theme for the Photoboard app
 * (c) 2015 Chris Ferdinandi
 * MIT License
 * http://github.com/cferdinandi/photoboard
 */

// ;(function (window, document, undefined) {

// 	'use strict';

// 	// HTML5 video feature detection
// 	var supports = (typeof(document.createElement('video').canPlayType) != 'undefined');

// 	// If SVG is supported, add `.svg` class to <html> element
// 	if ( supports ) {
// 		document.documentElement.className += (document.documentElement.className ? ' ' : '') + 'html5-video';
// 	} else {
// 		loadCSS('//releases.flowplayer.org/5.5.0/skin/minimalist.css');
// 		loadJS('//code.jquery.com/jquery-1.11.0.min.js');
// 		loadJS('//releases.flowplayer.org/5.5.0/flowplayer.min.js');
// 	}


// })(window, document);
;(function (window, document, undefined) {

	'use strict';

	// SVG feature detection
	var supports = !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect;

	// If SVG is supported, add `.svg` class to <html> element
	if ( supports ) {
		document.documentElement.className += (document.documentElement.className ? ' ' : '') + 'svg';
	}


})(window, document);