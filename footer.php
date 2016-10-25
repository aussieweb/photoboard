<?php

/**
 * footer.php
 * Template for footer content.
 */

?>

				<?php if ( keel_is_albums() || is_search() ) : ?>
					</div>
				<?php endif; ?>

			</div><!-- /.container -->
		</main><!-- /#main -->

		<?php
			// Get page layout options
			global $post;
			$page_navs = get_post_meta( $post->ID, 'keel_page_navs', true );
		?>

		<?php if ( empty( $page_navs ) || $page_navs === 'off' ) : ?>
			<footer class="container container-large">

				<hr class="margin-bottom">

				<div class="text-small text-muted">

					<?php get_template_part( 'nav', 'secondary' ); ?>

					<p>
						<?php
							printf( __( 'Made with <3 by Chris and Michelle. Need tech support? %sEmail Chris.%s', 'keel' ), '<a href="mailto:' . antispambot( 'chris@gomakethings.com' ) . '">', '</a>' );
						?>
					</p>

					<?php if ( current_user_can( 'edit_themes' ) ) : ?>
						<p><a href="<?php echo admin_url(); ?>">WP Admin</a></p>
					<?php endif; ?>

				</div>

			</footer>
		<?php endif; ?>

		<?php wp_footer(); ?>

	</body>
</html>