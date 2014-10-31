<?php

/**
 * footer.php
 * Template for footer content.
 */

?>

		</section><!-- /#main -->

		<footer class="container">

			<hr>

			<p class="text-muted">
				<?php
					// Insert copyright info
					printf( __( 'Copyright &copy; %1$s %2$s. All rights reserved.', 'keel' ), date( 'Y' ), get_bloginfo( 'name' ) );
				?>
			</p>

		</footer>


		<?php wp_footer(); ?>

	</body>
</html>