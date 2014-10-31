<?php

/**
 * plugins-in-training.php
 * These will be plugins down the road.
 */


	/**
	 * Get all post images.
	 * @param {String} $id ID of the current post
	 */
	function photoboard_get_post_imgs($id) {

		// Get all images
		$images = get_children(
			array(
				'post_type'      => 'attachment',
				'post_mime_type' => 'image',
				'post_parent'    => $id,
				'posts_per_page' => -1,
			)
		);

		// Generate markup
		if ($images) {
			foreach ($images as $image) {
				$exports .=
					'<div class="margin-bottom">' .
						'<div class="text-center">' .
							'<img class="img-photo" src="' . wp_get_attachment_image_src( $image->ID, 'large' )[0] . '">' .
						'</div>' .
						'<p class="text-muted clearfix">' .
							'<a class="btn btn-secondary float-right" href="' . wp_get_attachment_image_src( $image->ID, 'full' )[0] . '" download>' .
								'<svg class="icon">' .
									'<use xlink:href="#icon-download"></use>' .
								'</svg> ' .
								'Download' .
							'</a>' .
							$image->post_excerpt .
						'</p>' .
					'</div>';
			}
			return $exports;
		}

	}


	/**
	 * Get all post images.
	 * @param {String} $id ID of the current post
	 */
	function photoboard_get_post_vids($id) {

		// Get all videos
		$videos = get_children(
			array(
				'post_type'      => 'attachment',
				'post_mime_type' => 'video',
				'post_parent'    => $id,
				'posts_per_page' => -1,
			)
		);

		// Generate markup
		if ($videos) {
			foreach ($videos as $video) {
				$exports .=
					'<div class="margin-bottom">' .
						'<div class="text-center">' .
							'<video controls preload="auto">'.
								'<source type="video/mp4" src="' . $video->guid . '">' .
								'<div class="flowplayer">' .
									'<source type="video/mp4" src="' . $video->guid . '">' .
								'</div>' .
								'<p><a target="_blank" href="' . $video->guid . '">Download the Video</a></p>' .
							'</video>' .
						'</div>' .
						'<p class="text-muted clearfix">' .
							'<a class="btn btn-secondary float-right" href="' . $video->guid . '" download>' .
								'<svg class="icon">' .
								    '<use xlink:href="#icon-download"></use>' .
								'</svg> ' .
								'Download' .
							'</a>' .
							$video->post_excerpt .
						'</p>' .
					'</div>';
			}
			return $exports;
		}

	}


	/**
	 * Automatically make the first post image the featured thumbnail
	 * @link http://stackoverflow.com/a/15605334
	 * @link https://wordpress.org/plugins/autoset-featured-image/
	 */
	function photoboard_auto_set_featured_thumbnail() {

		// Variables
		global $post;
		$images = get_children(
			array(
				'post_type'      => 'attachment',
				'post_mime_type' => 'image',
				'post_parent'    => $post->ID,
				'posts_per_page' => 1,
			)
		);
		$videos = get_children(
			array(
				'post_type'      => 'attachment',
				'post_mime_type' => 'video',
				'post_parent'    => $id,
				'posts_per_page' => -1,
			)
		);

		// Methods
		if ( $images ) {
			foreach ($images as $attachment_id => $attachment) {
				set_post_thumbnail($post->ID, $attachment_id);
			}
		} elseif ( $videos ) {
			// $video_thumb_id = 0;
			// set_post_thumbnail($post->ID, $video_thumb_id);
		} else {
			// $story_thumb_id = 0;
			// set_post_thumbnail($post->ID, $story_thumb_id);
		}

	}
	add_action('save_post', 'photoboard_auto_set_featured_thumbnail');
	add_action('draft_to_publish', 'photoboard_auto_set_featured_thumbnail');
	add_action('new_to_publish', 'photoboard_auto_set_featured_thumbnail');
	add_action('pending_to_publish', 'photoboard_auto_set_featured_thumbnail');
	add_action('future_to_publish', 'photoboard_auto_set_featured_thumbnail');




	/**
	 * Notify members of new post by email
	 */
	function photoboard_new_post_email() {

		// Variables
		global $post;
		$author = $post->post_author;
		$post_id = $post->ID;
		$users = get_users();
		// $user->user_email

		// Loop through each user
		foreach ($users as $user) {

			// User variables
			$user_id = $user->ID;
			$email = $user->user_email;
			$notifications = get_user_meta($user_id, 'photoboard_get_notifications', 'true');

			// Email variables
			$to = $email;
			$subject = 'New photos on Photoboard: ' . get_the_title( $post_id );
			$message =
				'Someone posted new photos or videos on Photoboard. Click here to view them: ' . get_permalink( $post_id) . "\r\n\r\n" .
				'To stop receiving these emails, visit ' . site_url() . '/notifications' . "\r\n";
			$headers = 'From: Photoboard <notifications@' . site_url() . '>' . "\r\n";

			// Don't send notification to post author
			if ( $user_id === $author ) return;

			// Send email
			if ( $notifications !== 'off' ) {
				wp_mail( $to, $subject, $message, $headers );
			}
		}

	}
	add_action('save_post', 'photoboard_auto_set_featured_thumbnail');
	add_action('draft_to_publish', 'photoboard_auto_set_featured_thumbnail');
	add_action('new_to_publish', 'photoboard_auto_set_featured_thumbnail');
	add_action('pending_to_publish', 'photoboard_auto_set_featured_thumbnail');
	add_action('future_to_publish', 'photoboard_auto_set_featured_thumbnail');




	/**
	 * Create form for users to update notification preferences
	 */
	function photoboard_set_notifications_form() {

		if ( is_user_logged_in() ) {

			// Variables
			global $current_user;
			$user_id = $current_user->ID;
			$alert = stripslashes( photoboard_get_alert_message( 'photoboard_alert', 'photoboard_alert_user_profile' ) );
			$notifications = get_user_meta($user_id, 'photoboard_get_notifications', 'true');
			$checked = ( $notifications !== 'off' ? 'checked' : '');

			$form =
				$alert .
				'<form class="form-photoboard" id="photoboard-form-set-notifications" name="photoboard-form-set-notifications" action="" method="post">' .
					photoboard_form_field_checkbox_plus( 'photoboard-get-notifications', 'Receive email notifications when new photos or videos are posted.', $value = '', $checked ) .
					photoboard_form_field_submit_plus( 'photoboard-set-notifications-submit', 'btn', 'Update Notifications', 'photoboard-set-notifications-process-nonce', 'photoboard-set-notifications-process' ) .
				'</form>';

		} else {
			$form = '<p>' . __( 'You must be logged in to update a profile.', 'photoboard' ) . '</p>';
		}

		return $form;

	}
	add_shortcode( 'photoboard_notifications_form', 'photoboard_set_notifications_form' );




	/**
	 * Process user notification preference updates
	 */
	function photoboard_process_set_notifications_form() {
		if ( isset( $_POST['photoboard-set-notifications-process'] ) ) {
			if ( wp_verify_nonce( $_POST['photoboard-set-notifications-process'], 'photoboard-set-notifications-process-nonce' ) ) {

				// User variables
				global $current_user;
				$user_id = $current_user->ID;
				$referer = esc_url_raw( photoboard_get_url() );

				// Fields
				$field_notifications = $_POST['photoboard-get-notifications'];

				// Alert Messages
				$alert_success = '<div class="alert alert-success">Your notification settings have been updated.</div>';
				$alert_failure = '<div class="alert alert-danger">Sorry, but something went wrong. Please try again.</div>';

				// Update settings
				if ( isset($field_notifications) ) {
					update_user_meta( $user_id, 'photoboard_get_notifications', 'on' );
				} else {
					update_user_meta( $user_id, 'photoboard_get_notifications', 'off' );
				}

				// Reload page
				photoboard_set_alert_message( 'photoboard_alert', 'photoboard_alert_user_profile', $alert_success );
				wp_safe_redirect( $referer, 302 );
				exit;

			} else {
				die( 'Security check' );
			}
		}
	}
	add_action('init', 'photoboard_process_set_notifications_form');