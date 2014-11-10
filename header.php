<?php

/**
 * header.php
 * Template for header content.
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>

	<head>
		<meta charset="<?php bloginfo('charset'); ?>">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title><?php wp_title( '|', true, 'right' ); ?></title>
		<?php if ( is_home () ) : ?><meta name="description" content="<?php bloginfo('description'); ?>"><?php endif; ?>

		<!-- Mobile Screen Resizing -->
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<!-- Icons: place in the root directory -->
		<!-- https://github.com/audreyr/favicon-cheat-sheet -->
		<link rel="shortcut icon" href="<?php echo get_stylesheet_directory_uri(); ?>/dist/img/favicon.ico" />
		<link rel="apple-touch-icon" href="<?php echo get_stylesheet_directory_uri(); ?>/dist/img/favicon-144.png">
		<meta name="msapplication-TileColor" content="#97c331">
		<meta name="msapplication-TileImage" content="<?php echo get_stylesheet_directory_uri(); ?>/dist/img/favicon-ms.png">

		<!-- Feeds & Pings -->
		<link rel="alternate" type="application/rss+xml" title="<?php printf( __( '%s RSS Feed', 'keel' ), get_bloginfo( 'name' ) ); ?>" href="<?php bloginfo( 'rss2_url' ); ?>">
		<link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">

		<!-- Feature dection -->
		<script src="<?php echo get_stylesheet_directory_uri(); ?>/dist/js/detects.js"></script>

		<!-- Stylesheet -->
		<link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri(); ?>/dist/css/main.css">

		<?php wp_head(); ?>

	</head>

	<body>

		<div hidden><?php include_once('dist/svg/icons.svg'); ?></div>

		<!-- Old Browser Warning -->
		<!--[if lt IE 9]>
			<section>
				<p>Did you know that your web browser is a bit old? Some of the content on this site might not work right as a result. <a href="http://whatbrowser.org">Upgrade your browser</a> for a faster, safer, and better web experience.</p>
			</section>
		<![endif]-->

		<!-- Skip link for better accessibility -->
		<a class="screen-reader screen-reader-focusable" href="#main">Skip to main content</a>

		<?php
			// Get site navigation
			get_template_part( 'nav-main', 'Site Navigation' );
		?>

		<section id="main" class="container">