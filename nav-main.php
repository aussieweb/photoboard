<?php

/**
 * nav-main.php
 * Template for site navigation.
 * You may wish to use `wp_nav_menu()` here, or alternatively, hand-code your navigation.
 * http://codex.wordpress.org/Function_Reference/wp_nav_menu
 */

?>


<header class="nav-wrap margin-bottom">
	<nav class="container container-large">
		<a class="logo" href="<?php echo site_url(); ?>/">
			<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 17 17"><path d="M9.031 0L7.437 1.594l1.594 1.594-3.719 4.25H1.593l2.922 2.922-4.516 5.987v.654h.654l5.987-4.516 2.922 2.922v-3.719l4.25-3.719 1.594 1.594L17 7.969 9.031 0zM7.438 9.031L6.375 7.968l3.719-3.719 1.063 1.063-3.719 3.719z"/></svg>
			<span class="icon-description"><?php echo get_bloginfo( 'name' ); ?></span>
		</a>
		<?php if ( is_user_logged_in() && has_nav_menu( 'primary' ) ) : ?>
			<div class="nav-menu" id="nav-menu">
				<?php wp_nav_menu(
					array(
						'theme_location' => 'primary',
						'container'      => false,
						'menu_class'     => 'nav',
						'depth'          => 2,
					)
				); ?>
			</div>
		<?php elseif ( !is_user_logged_in() && has_nav_menu( 'primary_logged_out' ) ) : ?>
			<div class="nav-menu" id="nav-menu">
				<?php wp_nav_menu(
					array(
						'theme_location' => 'primary_logged_out',
						'container'      => false,
						'menu_class'     => 'nav',
						'depth'          => 2,
					)
				); ?>
			</div>
		<?php endif; ?>
	</nav>
</header>