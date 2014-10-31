<?php

/**
 * nav-main.php
 * Template for site navigation.
 * You may wish to use `wp_nav_menu()` here, or alternatively, hand-code your navigation.
 * http://codex.wordpress.org/Function_Reference/wp_nav_menu
 */

?>

<section class="nav-wrap-navbar">
	<nav class="container">
		<a class="logo-navbar" href="<?php echo site_url(); ?>">
			<svg class="icon">
				<use xlink:href="#icon-logo"></use>
			</svg>
			<span class="icon-supporting-text"><?php _e( 'Photoboard', 'keel' ); ?></span>
		</a>
		<div class="nav-menu-navbar" id="nav-menu">
			<?php if ( is_user_logged_in() ) : ?>
				<ul class="nav-navbar">
					<li <?php if (is_front_page() || is_single()) { echo 'class="active"'; }?>>
						<a href="<?php echo site_url(); ?>/">
							<svg class="icon">
								<use xlink:href="#icon-photos"></use>
							</svg>
							<span class="icon-supporting-text"><?php _e( 'Albums', 'keel' ); ?></span>
						</a>
					</li>
					<li <?php if (is_page('notifications')) { echo 'class="active"'; }?>>
						<a href="<?php echo site_url(); ?>/notifications">
							<svg class="icon">
								<use xlink:href="#icon-bell"></use>
							</svg>
							<span class="icon-supporting-text"><?php _e( 'Notifications', 'keel' ); ?></span>
						</a>
					</li>
					<li <?php if (is_page('profile')) { echo 'class="active"'; }?>>
						<a href="<?php echo site_url(); ?>/profile">
							<svg class="icon">
								<use xlink:href="#icon-gear"></use>
							</svg>
							<span class="icon-supporting-text"><?php $current_user = wp_get_current_user(); echo $current_user->user_login; ?></span>
						</a>
					</li>
					<li>
						<a href="<?php echo wp_logout_url(); ?>">
							<svg class="icon">
								<use xlink:href="#icon-logout"></use>
							</svg>
							<span class="icon-supporting-text"><?php _e( 'Logout', 'keel' ); ?></span>
						</a>
					</li>
				</ul>
			<?php else : ?>
				<ul class="nav-navbar">
					<li <?php if (is_page('signup')) { echo 'class="active"'; }?>>
						<a href="<?php echo site_url(); ?>/signup">
							<svg class="icon">
								<use xlink:href="#icon-plus"></use>
							</svg>
							<span class="icon-supporting-text"><?php _e( 'Sign Up', 'keel' ); ?></span>
						</a>
					</li>
					<li <?php if (!is_page('signup') && !is_page('reset-password')) { echo 'class="active"'; }?>>
						<a href="<?php echo site_url(); ?>/">
							<svg class="icon">
								<use xlink:href="#icon-login"></use>
							</svg>
							<span class="icon-supporting-text"><?php _e( 'Login', 'keel' ); ?></span>
						</a>
					</li>
				</ul>
			<?php endif; ?>
		</div>
	</nav>
</section>
<?php if ( is_user_logged_in() && !is_front_page() ) : ?>
	<section class="nav-secondary">
		<nav class="container">
			<strong><a href="<?php echo site_url(); ?>">&larr; Back</a></strong>
		</nav>
	</section>
<?php endif; ?>