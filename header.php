<?php

/**
 * header.php
 * Template for header content.
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?> class="<?php if ( isset($_COOKIE['fontsLoaded']) && $_COOKIE['fontsLoaded'] === 'true' ) { echo 'fonts-loaded'; } ?> <?php if ( current_user_can( 'edit_themes' ) ) { echo 'user-is-admin'; } ?>">

	<head>
		<meta charset="<?php bloginfo('charset'); ?>">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title><?php wp_title( '|', true, 'right' ); ?></title>
		<?php if ( is_home () ) : ?><meta name="description" content="<?php bloginfo('description'); ?>"><?php endif; ?>

		<!-- Mobile Screen Resizing -->
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!-- Icons: place in the root directory -->
		<!-- https://github.com/audreyr/favicon-cheat-sheet -->
		<link rel="apple-touch-icon" href="<?php echo get_stylesheet_directory_uri(); ?>/dist/img/favicon-144.png">
		<meta name="msapplication-TileColor" content="#93b84c">
		<meta name="msapplication-TileImage" content="<?php echo get_stylesheet_directory_uri(); ?>/dist/img/favicon-ms.png">
		<link rel="shortcut icon" href="<?php echo get_stylesheet_directory_uri(); ?>/dist/img/favicon.ico">
		<link rel="icon" sizes="16x16 32x32" href="<?php echo get_stylesheet_directory_uri(); ?>/dist/img/favicon.ico">

		<!-- Theme info -->
		<meta name="photoboard-version" content="<?php $keel_theme = wp_get_theme(); echo $keel_theme->get( 'Version' ); ?>">
		<meta name="photoboard-video-js-directory" content="<?php echo get_template_directory_uri() . '/dist/'; ?>">

		<?php wp_head(); ?>

	</head>

	<?php
		// Get page layout options
		global $post;
		$page_navs = get_post_meta( $post->ID, 'keel_page_navs', true );
	?>

	<body <?php body_class(); ?>>

		<!-- Old Browser Warning -->
		<!--[if lt IE 9]>
			<aside class="container">
				<p>Did you know that your web browser is a bit old? Some of the content on this site might not work right as a result. <a href="http://whatbrowser.org">Upgrade your browser</a> for a faster, safer, and better web experience.</p>
			</aside>
		<![endif]-->

		<?php
			// a11y enhancements
			if ( empty( $page_navs ) || $page_navs === 'off' ) {
				get_template_part( 'nav', 'accessibility' );
			}
		?>

		<?php
			// Get site navigation
			if ( empty( $page_navs ) || $page_navs === 'off' ) {
				get_template_part( 'nav', 'main' );
			}
		?>

		<main class="tabindex" id="main" tabindex="-1">

			<div class="container <?php if ( keel_is_albums() || is_search() ) { echo 'container-large'; } ?>">

				<?php if ( keel_is_albums() || is_search() ) : ?>
					<div class="row" data-right-height>
				<?php endif; ?>