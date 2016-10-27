/**
 * Script initializations
 */

// Dropdown menus
drop.init({
	selector: '.menu-item-has-children'
});

// Right height
;(function (window, document, undefined) {
	'use strict';
	var albums = document.querySelector( '[data-right-height-content]' );
	if ( !albums ) return;
	imagesLoaded(albums, function () {
		rightHeight.init();
	});
})(window, document);

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