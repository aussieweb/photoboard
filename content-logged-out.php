<?php

/**
 * content-logged-out.php
 * Template for logged out users.
 */

?>

<div class="row">
	<div class="grid-two-thirds float-center">

		<?php
			// Get logged out user header
			get_template_part( 'header-logged-out', 'Logged Out Header' );
		?>

		<article>
			<header>
				<h2>Login</h2>
			</header>
			<?php echo wpwebapp_form_login(); ?>
		</article>

	</div>
</div>