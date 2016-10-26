/*!
 * photoboard v2.1.1: The WordPress theme for Photoboard
 * (c) 2016 Chris Ferdinandi
 * MIT License
 * https://github.com/cferdinandi/photoboard
 * Open Source Credits: https://github.com/ftlabs/fastclick, https://github.com/toddmotto/fluidvids, http://prismjs.com
 */

/**
 * Add download link after each video
 */
;(function (window, document, undefined) {

	'use strict';

	// Get video
	var videos = document.querySelectorAll( 'div.wp-video-shortcode' );

	for ( var i = 0; i < videos.length; i++ ) {

		// Get the video src
		var url = videos[i].querySelector( 'video' );
		if ( !url ) continue;
		videos[i].innerHTML = videos[i].innerHTML + '';

		// Inject download button
		var div = document.createElement('div');
		div.innerHTML = '<p>x</p><p class="margin-bottom-large"><a class="btn float-right" href="' + url.src + '" download><svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 17 17"><path d="M8.5 9.563l4.25-4.25H9.562v-4.25H7.437v4.25H4.249zm3.864-1.739l-1.191 1.191 4.318 1.61-6.99 2.607-6.99-2.607 4.318-1.61-1.191-1.191L.002 9.563v4.25l8.5 3.188 8.5-3.188v-4.25z"/></svg> Download</a></p>';
		videos[i].parentNode.insertBefore( div.childNodes[1], videos[i].nextSibling );

	}

})(window, document);