<?php

/**
 * nav-page.php
 * Template for older/newer post navigation.
 */

?>

<nav>
	<ul class="list-unstyled padding-top">
		<li>
			<a <?php if (is_page('change-name')) { echo 'class="link-disabled"'; }?> href="<?php echo site_url(); ?>/change-email/">Change your display name</a>
		</li>
		<li>
			<a <?php if (is_page('change-password')) { echo 'class="link-disabled"'; }?> href="<?php echo site_url(); ?>/change-password/">Change your password</a>
		</li>
		<li>
			<a <?php if (is_page('change-email')) { echo 'class="link-disabled"'; }?> href="<?php echo site_url(); ?>/change-email/">Change your email</a>
		</li>
		<li>
			<a href="<?php echo wp_logout_url(); ?>">Logout</a>
		</li>
	</ul>
</nav>