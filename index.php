<?php

/**
 * index.php
 * Template for the page that displays all of your posts.
 */

get_header(); ?>


<?php if ( is_user_logged_in() ) : ?>

	<?php if (have_posts()) : ?>

		<h1>Albums</h1>

		<div class="row" data-right-height>

			<?php
				// Start the loop
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