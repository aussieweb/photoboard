<?php

/**
 * page.php
 * Template for pages (not posts).
 */

get_header(); ?>

<div class="row">
	<div class="grid-two-thirds float-center">

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