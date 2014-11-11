;(function (window, document, undefined) {

	'use strict';

	// HTML5 video feature detection
	var supports = (typeof(document.createElement('video').canPlayType) != 'undefined');

	// If SVG is supported, add `.svg` class to <html> element
	if ( supports ) {
		document.documentElement.className += (document.documentElement.className ? ' ' : '') + 'html5-video';
	} else {
		loadCSS('//releases.flowplayer.org/5.5.0/skin/minimalist.css');
		loadJS('//code.jquery.com/jquery-1.11.0.min.js');
		loadJS('//releases.flowplayer.org/5.5.0/flowplayer.min.js');
	}


})(window, document);