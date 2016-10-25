/**
 * Add markup and load video JS
 */
;(function (window, document, undefined) {

	'use strict';

	var videos = document.querySelectorAll( 'a[href*=".mov"], a[href*=".MOV"], a[href*=".mp4"], a[href*=".MP4"], a[href*=".m4v"], a[href*=".M4V"]' );
	var directory = document.querySelector( 'meta[name="photoboard-video-js-directory"]' );

	if ( videos.length === 0 || !directory || !directory.content ) return;

	loadCSS(directory.content + 'css/video-js.min.css');
	loadJS(directory.content + 'js/video.min.js', function () {
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
	});

})(window, document);