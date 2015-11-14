<?php

/**
 * Template Name: Profile
 * Template for profile pages.
 */

get_header(); ?>

<div class="row">

	<div class="grid-third">
		<?php
			// Get profile navigation
			get_template_part( 'nav-profile', 'Profile Navigation' );
		?>
	</div>

	<div class="grid-two-thirds">

		<?php if (have_posts()) : ?>

			<?php
				// Start the loop
				while (have_posts()) : the_post();
			?>
				<?php
					// Insert the post content
					get_template_part( 'content', 'Post Content' );
				?>
			<?php endwhile; ?>

		<?php endif; ?>

	</div>
</div>

<?php get_footer(); ?>