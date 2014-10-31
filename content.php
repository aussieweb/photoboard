<?php

/**
 * content.php
 * Template for post and page content.
 */

?>

<article <?php if ( !is_singular() ) { echo 'class="grid-dynamic" data-right-height-content'; } ?>>

	<header>
		<?php
			/**
			 * Headers
			 * Unlinked h1 for pages and invidual blog posts.
			 * Linked h1 for collections of posts.
			 */
		?>
		<?php if ( is_single() ) : ?>
			<h1 class="no-margin-bottom"><?php the_title(); ?></h1>
		<?php elseif ( is_page() ) : ?>
			<?php if ( !is_page_template( 'page-plain.php' ) ) : ?>
				<h1><?php the_title(); ?></h1>
			<?php endif; ?>
		<?php else : ?>
			<a href="<?php the_permalink(); ?>">
				<?php if ( !is_singular() ) : ?>
					<figure>
						<?php the_post_thumbnail( 'thumbnail', 'class=img-photo' ); ?>
					</figure>
				<?php endif; ?>
				<h1 class="no-margin-bottom <?php if ( !is_singular() ) { echo 'h4'; } ?>"><?php the_title(); ?></h1>
			</a>
		<?php endif; ?>

		<?php
			/**
			 * Add meta data for blog posts.
			 * 1. Published date
			 * 2. Author
			 * 3. Number of comments
			 * 4. Quick edit link
			 */
			if ( !is_page() ) :
		?>
			<aside>
				<p class="text-muted <?php if ( !is_singular() ) { echo 'text-small'; } ?>">
					<time datetime="<?php the_time( 'Y-m-d' ); ?>" pubdate><?php the_time( 'F j, Y' ) ?></time>
					<?php edit_post_link( __( 'Edit', 'keel' ), ' / ', '' ); ?>
				</p>
			</aside>
		<?php endif; ?>
	</header>

	<?php
		// The page or post content
		if ( is_singular() ) :
	?>

		<div class="clearfix">

			<?php if ( is_single() ) : ?>
				<a class="btn float-right" href="#">
					<svg class="icon">
						<use xlink:href="#icon-download"></use>
					</svg>
					<span class="supporting-text">Download</span> All
				</a>
			<?php endif; ?>
			<?php the_content( '<p>' . __( 'Read More...', 'keel' ) . '</p>' ); ?>
		</div>
		<?php echo photoboard_get_post_imgs($post->ID); ?>
		<?php echo photoboard_get_post_vids($post->ID); ?>

	<?php endif; ?>

	<?php if ( is_page() ) : ?>
		<?php
			// Add link to edit pages
			edit_post_link( __( 'Edit', 'keel' ), '<p>', '</p>' );
		?>
	<?php endif; ?>

	<?php if ( is_single() ) : ?>
		<?php
			// Add comments template to blog posts
			comments_template();
		?>
	<?php endif; ?>


</article>