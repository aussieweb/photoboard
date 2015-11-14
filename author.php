<?php

/**
 * author.php
 * Template for content by author.
 */

get_header(); ?>

<?php if ( is_user_logged_in() ) : ?>

	<?php if (have_posts()) : ?>

		<header>
			<h1>
				<?php
					/*
					 * Queue the first post, that way we know what author
					 * we're dealing with (if that is the case).
					 *
					 * We reset this later so we can run the loop properly
					 * with a call to rewind_posts().
					 */
					the_post();
					printf( __( 'All posts by %s', 'twentyfourteen' ), get_the_author() );
				?>
			</h1>
			<?php if ( get_the_author_meta( 'description' ) ) : ?>
				<p><?php the_author_meta( 'description' ); ?></p>
			<?php endif; ?>
		</header>

		<div class="row" data-right-height>

			<?php
				/*
				 * Since we called the_post() above, we need to rewind
				 * the loop back to the beginning that way we can run
				 * the loop properly, in full.
				 */
				rewind_posts();
				while (have_posts()) : the_post();
			?>
				<?php
					// Insert the post content
					get_template_part( 'content', 'Post Content' );
				?>
			<?php endwhile; ?>

		</div>


		<?php
			// Previous/next page navigation
			get_template_part( 'nav-page', 'Page Navigation' );
		?>


	<?php else : ?>
		<?php
			// If no content, include the "No post found" template
			get_template_part( 'no-posts', 'No Posts Template' );
		?>
	<?php endif; ?>

<?php else : ?>

	<?php
		// Get logged out user content
		get_template_part( 'content-logged-out', 'Logged Out Content' );
	?>

<?php endif; ?>

<?php get_footer(); ?>