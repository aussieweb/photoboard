<?php


	/**
	 * Check if current page is an album
	 * @return boolean Returns true if an album
	 */
	function keel_is_albums() {
		global $post;
		$type = get_post_type( $post );
		if ( is_home() || ( is_archive() && $type === 'post' ) ) return true;
		return false;
	}



	/**
	 * Convert MOVs to MP4s for video player support
	 * @param  string $filename     Sanitized filename
	 * @param  string $filename_raw Raw filename
	 * @return string               Sanitized, converted filename
	 */
	function keel_rename_movs($filename, $filename_raw) {

		// Get info about file
		$info = pathinfo( $filename );

		// Only run if the file is an MOV file
		if ( strtolower( $info['extension'] ) !== 'mov' ) return $filename;

		// Avoid infinite loop
		if ( $info['filename'] . '.mp4' === $filename_raw ) return $filename;

		// Return renamed .mp4 file
		return sanitize_file_name( $info['filename'] . '.mp4' );

	}
	add_filter('sanitize_file_name', 'keel_rename_movs', 10, 2);



	/**
	 * Override the native WordPress [video] shortcode
	 * @param  array  $atts Shortcode attributes
	 * @return string       A link to the video file (processed with JavaScript later)
	 */
	function keel_override_video_shortcode( $atts ) {

		// Merge shortcode attributes
		$srcs = shortcode_atts( array(
			'src' => '',
			'mp4' => '',
			'm4v' => '',
		), $atts );

		// Get the source
		if ( !empty( $srcs['src'] ) ) {
			$src = $srcs['src'];
		} elseif ( !empty( $srcs['mp4'] ) ) {
			$src = $srcs['mp4'];
		} elseif ( !empty( $srcs['m4v'] ) ) {
			$src = $srcs['m4v'];
		} else {
			$src = '';
		}

		return '<p><a href="' . $src . '">' . basename( $src ) . '</a></p>' ;

	}
	add_shortcode( 'video', 'keel_override_video_shortcode' );



	/**
	 * Check if the user has an avatar or not
	 * @param  string  $email The user's email address
	 * @return boolean        If true, the user has an avatar
	 */
	function keel_validate_avatar( $email ) {
		// Craft a potential url and test its headers
		$hash = md5(strtolower(trim($email)));
		$uri = 'http://www.gravatar.com/avatar/' . $hash . '?d=404';
		$headers = @get_headers($uri);
		if (!preg_match("|200|", $headers[0])) {
			return FALSE;
		} else {
			return TRUE;
		}
	}



	/**
	 * Get the thumbnail image for the album
	 */
	function keel_get_album_thumbnail( $post_id ) {
		if ( has_post_thumbnail( $post_id ) ) {
			echo get_the_post_thumbnail( $post_id, 'thumbnail', 'class=img-photo' );
		} else {

			$images = get_children(
				array(
					'post_type'      => 'attachment',
					'post_mime_type' => 'image',
					'post_parent'    => $post_id,
					'posts_per_page' => 1,
				)
			);

			if ( empty( $images ) ) {
				echo '<img height="300" width="300" class="img-photo" src="' . get_template_directory_uri() . '/dist/img/album.jpg">';
				return;
			}

			foreach ($images as $img) {
				$img_thumb = wp_get_attachment_image_src( $img->ID, 'thumbnail' );
			}
			echo '<img class="img-photo" src="' . $img_thumb[0] . '">' ;

		}
	}