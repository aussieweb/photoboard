<?php

/**
 * content-logged-out.php
 * Template for logged out users.
 */

?>

<div class="row">
	<div class="grid-two-thirds float-center">

		<?php if ( is_page('signup') || is_page('reset-password') ) : ?>

			<header>
				<h1><?php the_title(); ?></h1>
			</header>

			<article>
				<?php the_content( '<p>' . __( 'Read More...', 'keel' ) . '</p>' ); ?>
			</article>

		<?php else : ?>
			<h1>Login</h1>
			<?php echo wpwebapp_form_login(); ?>
		<?php endif; ?>

	</div>
</div>