<?php

/**
 * content.php
 * Template for post content.
 */

$post_options = keel_get_post_options();

?>

<?php
	/**
	 * Individual Posts
	 */
	if ( is_single() ) :
?>

	<article>

		<header>

			<aside class="text-muted">
				<time datetime="<?php the_time( 'F j, Y' ); ?>" pubdate><?php the_time( 'F j, Y' ); ?></time>
				<?php edit_post_link( __( 'Edit', 'keel' ), ' / ', '' ); ?>
			</aside>

			<h1 class="no-padding-top">
				<?php the_title(); ?>
			</h1>

		</header>


		<div class="clearfix">
			<?php
				// The post content
				the_content();
			?>
		</div>

		<?php
			if ( !empty( $post_options ) && array_key_exists( 'blog_posts_message', $post_options ) && !empty( $post_options['blog_posts_message'] ) ) {
				echo do_shortcode( wpautop( stripslashes( $post_options['blog_posts_message'] ), false ) );
			}
		?>

		<?php
			// Add comments template to blog posts
			comments_template();
		?>

	</article>

<?php
	/**
	 * All Posts
	 */
	else :
?>

	<?php if ( $wp_query->current_post === 0 && !is_archive() && !is_search() ) : ?>
		<div class="grid-full">
			<header <?php if ( $post_options['blog_hide_all_posts_heading'] === 'on' ) { echo 'class="screen-reader"'; } ?>>
				<h1><?php echo $post_options['blog_all_posts_heading']; ?></h1>
			</header>
		</div>
	<?php endif; ?>

	<?php
		if ( $wp_query->current_post === 0 && array_key_exists( 'blog_all_posts_message', $post_options ) && !empty( $post_options['blog_all_posts_message'] ) ) :
	?>
		<div class="grid-full">
			<aside>
				<?php echo do_shortcode( stripslashes( wpautop( $post_options['blog_all_posts_message'], false ) ) ); ?>
			</aside>
		</div>
	<?php endif; ?>

	<article class="grid-dynamic-fourth" data-right-height-content>

		<header>

			<a href="<?php the_permalink(); ?>">

				<figure>
					<?php keel_get_album_thumbnail( $post->ID ); ?>
				</figure>

				<h2 class="h4 no-padding-top no-margin-bottom">
					<?php the_title(); ?>
				</h2>

			</a>

			<aside class="text-muted">
				<p><time datetime="<?php the_time( 'F j, Y' ); ?>" pubdate><?php the_time( 'F j, Y' ); ?></time>
				<?php edit_post_link( __( 'Edit', 'keel' ), ' / ', '' ); ?></p>
			</aside>

		</header>

	</article>

<?php endif; ?>