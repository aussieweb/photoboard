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
					printf( __( 'Made with <3 by Chris and Michelle. Need tech support? %sEmail Chris.%s', 'keel' ), '<a href="mailto:h&#101;l&#108;o&#64;&#103;&#111;&#109;&#97;&#107;ethi&#110;g&#115;&#46;co&#109;">', '</a>' );
				?>
			</p>

			<?php if ( current_user_can( 'edit_themes' ) ) : ?>
				<p><a href="<?php echo admin_url(); ?>">WP Admin</a></p>
			<?php endif; ?>

		</footer>


		<?php wp_footer(); ?>

	</body>
</html>