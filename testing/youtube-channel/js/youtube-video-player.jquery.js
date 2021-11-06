(function($){
	$.youtube_video = function(el, options){
		// To avoid scope issues, use 'base' instead of 'this'
		// to reference this class from internal events and functions.
		var base = this;
		
		// Access to jQuery and DOM versions of element
		// base.$el = $("<div />").appendTo($(el));
		base.$el = $(el);
		base.el = el;
		
		// Add a reverse reference to the DOM object
		base.$el.data("youtube_video", base);
		
		base.init = function(){
			base.options = $.extend({},$.youtube_video.defaultOptions, options);
			base.options_copy = $.extend({},$.youtube_video.defaultOptions, options);
			base.api_key = base.options.api_key;
			base.$el.addClass('yesp');
			base.$logo = [];
			base.type = false;

			if(base.options.playlist !== false) {
				// this is a playlist
				base.id = 'yt_player_'+base.options.playlist.replace(/[^a-z0-9]/ig,'');
				base.type = 'playlist';
			}else if(base.options.channel !== false) {
				// this is a channel
				base.id = 'yt_player_'+base.options.channel.replace(/[^a-z0-9]/ig,'');
				base.type = 'channel';
			}else if(base.options.user !== false) {
				// this is a user
				base.id = 'yt_player_'+base.options.user.replace(/[^a-z0-9]/ig,'');
				base.type = 'user';
			}else if(base.options.videos !== false) {
				// this is a video(s)
				if(typeof(base.options.videos) == 'string') {
					base.options.videos = [base.options.videos];
				}
				base.id = 'yt_player_'+base.options.videos[0].replace(/[^a-z0-9]/ig,'');
				base.type = 'videos';
			}else {
				base.display_error('No playlist/channel/user/videos entered. Set at least 1.', true);
				return;
			}

			if(typeof base.$el.attr('id') !== typeof undefined && base.$el.attr('id') !== false) {
				// we already have an id attr on the $el, so use it
				base.id = base.$el.attr('id');
			}else {
				// use the generated id
				base.$el.attr('id', base.id);
			}

			if(base.options.max_results > 50) {
				base.options.max_results = 50;
			}
			

			// Globals
			base.$controls = [];
			base.$title = null;
			base.$container = base.$el.find('.yesp-container');
			base.youtube = null;
			base.playlist_items = [];
			base.playlist_count = 0;
			base.info = {
				'width': 0,
				'height': 0,
				'duration': 0,
				'current_time': 0,
				'previous_time': 0,
				'volume': base.options.volume,
				'time_drag': false,
				'volume_drag': false,
				'ie': base.detect_ie(),
				'ie_previous_time': 0,
				'touch': base.detect_touch(),
				'youtube_loaded': false,
				'ios': ( navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false ),
				'mobile': ( navigator.userAgent.match(/(Android|webOS|iPad|iPhone|iPod|BlackBerry|Windows Phone)/g) ? true : false ),
				'state': false,
				'index': 0,
				'hover': true,
				'fullscreen': false,
				'idle_time': 0,
				'idle_controls_hidden': false,
				'playlist_shown': true,
				'horizontal_playlist_shown': true,
				'playlist_width': 200,
				'playlist_animating': false,
				'first_play': false,
				'current_video_url': '',
				'next_page_token': false,
				'playlist_i': 0,
				'alternative_api_ready_check': false,
			};

			if(base.info.ios) {
				base.$el.addClass('yesp-ios');
				base.options.volume_control = false;
				base.options_copy.volume_control = false;
			}
			
			if(base.info.mobile) {
				base.options.show_controls_on_load = true;
				base.options.show_controls_on_pause = true;
				base.options.show_controls_on_play = true;

				base.$el.addClass('yesp-mobile');
			}

			if(base.info.ie) {
				// base.options.fullscreen_control = false;
				base.$el.addClass('yesp-ie');
			}

			if(!base.$el[0].requestFullScreen && !base.$el[0].mozRequestFullScreen && !base.$el[0].webkitRequestFullScreen) {
				base.options.fullscreen_control = false;
			}


			base.create_player_element();

			// base.playlist_items = null;
			// base.playlist_count = 0;

			base.init_playlist();

			base.create_controls();
			base.create_title();
			base.create_overlays();
			base.show_controls();
			base.bind_controls();
			
			$(window).on('resize', base.resize);
			base.resize();

			base.init_time_slider();
			base.init_volume_slider();

			base.set_style();

			if(base.options.width !== false) {
				base.$el.css('width', base.options.width);
				base.resize();
			}

			if(!base.options.show_controls_on_load) {
				base.hide_controls();
			}

			if(base.options.playlist_type === 'horizontal') {
				base.hide_playlist(true);
				//base.options.show_playlist = false;

				if(!base.options.show_playlist) {
					base.hide_horizontal_playlist();
				}else {
					base.show_horizontal_playlist();
				}
				
				// base.info.horizontal_playlist_shown = true;
			}else {
				// it's vertical
				base.hide_horizontal_playlist();
				if(!base.options.show_playlist) {
					base.hide_playlist(true);
				}
				// base.info.horizontal_playlist_shown = false;
			}

			document.addEventListener("fullscreenchange", function () {
				if(!document.fullscreen) {
					base.exit_fullscreen();
				}
			}, false);
			 
			document.addEventListener("mozfullscreenchange", function () {
				if(!document.mozFullScreen) {
					base.exit_fullscreen();
				}
			}, false);
			 
			document.addEventListener("webkitfullscreenchange", function () {
				if(!document.webkitIsFullScreen) {
					base.exit_fullscreen();
				}
			}, false);
			 
			document.addEventListener("msfullscreenchange", function () {
				if(!document.msFullscreenElement) {
					base.exit_fullscreen();
				}
			}, false);

			setInterval(function() {
				if(base.info.mobile) {
					return;
				}
				base.info.idle_time += 500;
				if(base.info.fullscreen && base.info.idle_time > 2000) {
					base.info.idle_controls_hidden = true;
					base.hide_controls(true);
				}
			}, 500);

			base.$el.mousemove(function (e) {
				base.info.idle_time = 0;
				if(base.info.idle_controls_hidden && base.info.fullscreen) {
					base.info.idle_controls_hidden = false;
					base.show_controls();
				}
			});

			base.$el.keypress(function (e) {
				base.info.idle_time = 0;
				if(base.info.idle_controls_hidden && base.info.fullscreen) {
					base.info.idle_controls_hidden = false;
					base.show_controls();
				}
			});
		
			if(base.info.touch) {
				base.$el.addClass('yesp-touch');
			}

			setTimeout(function() {
				base.info.alternative_api_ready_check = true;
			}, 1000);

		};

		base.display_error = function(message, remove_player) {
			var $error = base.$el.find('.yesp-error').html('<i class="yesp-icon yesp-icon-warning"></i>'+message).slideDown();
			if($error.length === 0) {
				alert(message);
			}
			if(remove_player === true) {
				base.$el.find('.yesp-video').remove();
				base.$el.find('.yesp-container, .yesp-hp').css('background-image', 'none');
			}
		};

		base.remove_next_page = function() {
			base.info.next_page_token = false;
			base.$el.find('.yesp-next-page').remove();
			base.$el.find('.yesp-hp-next-page').remove();
			base.$el.find('.yesp-hp-videos').css('width', (base.playlist_count)*160);
		};

		base.get_playlist_next = function() {
			if(base.info.next_page_token === false) {
				base.remove_next_page();
				return;
			}
			base.$el.find('.yesp-next-page').html('<i class="yesp-icon yesp-icon-spinner yesp-icon-spin"></i>');
			base.get_playlist(base.info.next_page_token, base.options.playlist);
		};

		base.get_playlist = function(pageToken, playlist) {
			if(typeof(pageToken) === typeof(undefined) || pageToken === false) {
				pageToken = false;
				through_pagination = false;
			}else {
				through_pagination = true;
			}

			var url = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status&maxResults='+base.options.max_results+'&playlistId='+playlist+'&key='+base.options.api_key;

			if(through_pagination === true) {
				url += '&pageToken='+pageToken;
			}

			var r = $.getJSON(url, function(yt) {
				if(typeof(yt.items) !== 'undefined') {
					if(yt.items.length === 0) {
						base.display_error('This playlist is empty.', true);
					}
					var filtered_items = base.create_playlist(through_pagination, yt.items, yt.items.length);

					base.playlist_items = base.playlist_items.concat(filtered_items.items);
					base.playlist_count += filtered_items.count;

					if(base.options.pagination === true) {
						if(typeof(yt.nextPageToken) === typeof(undefined)) {
							base.remove_next_page();
						}else {
							base.info.next_page_token = yt.nextPageToken;
							base.$el.find('.yesp-next-page').html('<i class="yesp-icon yesp-icon-plus"></i>'+base.options.load_more_text).show();
						}
						//base.set_playlist_width(base.info.playlist_width);
					}else {
						base.info.next_page_token = false;
					}

					if(base.playlist_count < 2 && !through_pagination && base.info.next_page_token === false) {
						base.hide_playlist(true);
						base.options.show_playlist = false;

						base.options.playlist_toggle_control = false;
						base.$controls['playlist_toggle'].hide();

						base.options.fwd_bck_control = false;
						base.options_copy.fwd_bck_control = false;
						base.$controls['forward'].hide();
						base.$controls['backward'].hide();

						base.resize();
						if(base.playlist_count === 0) {
							base.display_error('This playlist is empty.', true);
						}
					}

				}else {
					base.display_error('An error occured while retrieving the playlist.', true);
				}
			});

			r.fail(function(data) {
				var error = 'An error occured while retrieving the playlist.';
				if(typeof(data.responseText) !== typeof(undefined)) {
					var message = $.parseJSON(data.responseText);
					if(message.error.code == '404') {
						error = 'The playlist was not found.';
					}else if(message.error.code == '403') {
						error = message.error.message;
					}else if(message.error.code == '400') {
						error = 'The API key you have entered is invalid.';
					}else {
						
						error = 'An error occured while retrieving the playlist.<br /><em>'+message.error.message+'</em>';
					}	
				}
				base.display_error(error, true);
				base.hide_playlist(true);
			});
		};

		base.get_channel = function(type, source) {
			var url = '';
			if(type === 'user') {
				url = 'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&maxResults='+base.options.max_results+'&forUsername='+encodeURIComponent(source)+'&key='+base.api_key;
			}else {
				url = 'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&maxResults='+base.options.max_results+'&id='+source+'&key='+base.api_key;
			}

			$.getJSON(url, function(yt) {
				if(typeof(yt.items) !== undefined && yt.items.length == 1) {
					var upload_playlist = yt.items[0].contentDetails.relatedPlaylists.uploads;
					base.options.playlist = upload_playlist;
					base.get_playlist(false, base.options.playlist);
				}else {
					base.display_error('An error occured while retrieving the channel/user.', true);
				}
			});
		};

		base.get_videos = function(videos) {
			var vid_list = '',
			l = videos.length;

			for(var i = 0; i < l; i++) {
				if(i !== l-1) {
					vid_list += videos[i]+',';
				}else {
					vid_list += videos[i];
				}
			}
			var url = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,status&maxResults='+base.options.max_results+'&id='+vid_list+'&key='+base.api_key;


			$.getJSON(url, function(yt) {
				if(typeof(yt.items) !== 'undefined') {
					// we have results
					// set the video id
					for(var i = 0; i < yt.items.length; i++) {
						yt.items[i].snippet.resourceId = { videoId: yt.items[i].id };
					}
					var filtered_items = base.create_playlist(false, yt.items, yt.items.length);
					
					base.playlist_items = base.playlist_items.concat(filtered_items.items);
					base.playlist_count += filtered_items.count;

					if(base.playlist_count < 2) {
						base.hide_playlist(true);
						base.options.show_playlist = false;

						base.options.playlist_toggle_control = false;
						base.$controls['playlist_toggle'].hide();

						base.options.fwd_bck_control = false;
						base.options_copy.fwd_bck_control = false;
						base.$controls['forward'].hide();
						base.$controls['backward'].hide();

						base.resize();
						if(base.playlist_count === 0) {
							base.display_error('This playlist is empty, or the video\'s were not found.', true);
						}
						
					}
					

				}else {
					base.display_error('An error occured while retrieving the video(s).', true);
				}
			});
			return;
		};

		base.init_playlist = function() {

			if(base.type === 'playlist') {
				base.get_playlist(false, base.options.playlist);
				return;
			}

			if(base.type == 'channel') {
				base.get_channel('channel', base.options.channel);
				return;
			}

			if(base.type == 'user') {
				base.get_channel('user', base.options.user);
				return;
			}

			if(base.type == 'videos') {
				base.get_videos(base.options.videos);
				return;
			}
			
		};
		
		base.create_playlist = function(through_pagination, items, count) {
			if(!through_pagination) {
				base.create_youtube_element();
			}
			
			var i = 0;
			while(typeof(items[i]) !== 'undefined') {
				// Remove 'private' video
				if(items[i].status.privacyStatus == 'private') {
					items.splice(i, 1);
					count--;
					continue;
				}

				// Remove 'deleted' video
				if(typeof(items[i].snippet.thumbnails) == typeof(undefined)) {
					items.splice(i, 1);
					count--;
					continue;
				}
				i++;
			}
			base.options.on_done_loading(items);
			

			for(base.info.playlist_i; base.info.playlist_i < base.playlist_count+count; base.info.playlist_i++) {
				var video = items[base.info.playlist_i-base.playlist_count],
					img_src = '';

				// Order: 16/9 medium, 4/3 medium, 4/3 high, 4/3 default
				if(typeof(video.snippet.thumbnails.medium) !== 'undefined' && video.snippet.thumbnails.medium.width/video.snippet.thumbnails.medium.height == 16/9) {
					img_src = video.snippet.thumbnails.medium.url;
				}else if(typeof(video.snippet.thumbnails.medium) !== 'undefined') {
					img_src = video.snippet.thumbnails.medium.url;
				}else if(typeof(video.snippet.thumbnails.high) !== 'undefined') {
					img_src = video.snippet.thumbnails.high.url;
				}else if(typeof(video.snippet.thumbnails.default) !== 'undefined') {
					img_src = video.snippet.thumbnails.default.url;
				}

				var title = video.snippet.title;

				if (video.snippet.title.length > 85) {
					video.snippet.title = video.snippet.title.substr(0,85)+'...';
				}

				if (video.snippet.channelTitle.length > 20) {
					video.snippet.channelTitle = video.snippet.channelTitle.substr(0,20)+'...';
				}

				// Vertical video
				var $video = $('<div class="yesp-playlist-video" data-playing="0" data-index="'+base.info.playlist_i+'"><img src="'+img_src+'" width="200" /><div class="yesp-playlist-overlay"><div class="yesp-playlist-title">'+video.snippet.title+'</div><div class="yesp-playlist-channel">'+video.snippet.channelTitle+'</div></div><div class="yesp-playlist-current"><i class="yesp-icon yesp-icon-play"></i><span style="font-size: 15px;">'+base.options.now_playing_text+'</span></div></div>');

				$video.click(function(e) {
					e.preventDefault();
					if(!base.options.show_controls_on_play) {
						base.hide_controls();
					}
					
					base.play_video(parseFloat($(this).attr('data-index')));
				});
				if(base.options.show_channel_in_playlist == false) {
					$video.find('.yesp-playlist-channel').remove();
				}
				$video.insertBefore(base.$el.find('.yesp-playlist .yesp-next-page'));
				base.$el.find('.yesp-playlist, .yesp-hp').css('background-image', 'none');

				// Horizontal video
				var video_title = video.snippet.title;

				if(video_title.length > 45) {
					video_title = video.snippet.title.substring(0, 45) + '...';
				}

				var $video_hp = $('<div class="yesp-hp-video" data-playing="0" data-index="'+base.info.playlist_i+'"><img src="'+img_src+'" width="200" /><div class="yesp-hp-overlay"><div class="yesp-hp-title">'+video_title+'</div><div class="yesp-hp-channel">'+video.snippet.channelTitle+'</div></div><div class="yesp-hp-current"><i class="yesp-icon yesp-icon-play"></i><span>'+base.options.now_playing_text+'</span></div></div>');

				$video_hp.click(function(e) {
					e.preventDefault();
					if(!base.options.show_controls_on_play) {
						base.hide_controls();
					}
					
					base.play_video(parseFloat($(this).attr('data-index')));
				});
				if(base.options.show_channel_in_playlist == false) {
					$video_hp.find('.yesp-hp-channel').remove();
				}
				$video_hp.insertBefore(base.$el.find('.yesp-hp .yesp-hp-next-page'));

			}

			base.$el.find('.yesp-hp-videos').css('width', (base.info.playlist_i)*160+50);

			if(through_pagination === false) {
				base.$el.find('.yesp-playlist').perfectScrollbar({
					'suppressScrollX': true
				});

				base.$el.find('.yesp-hp').perfectScrollbar({
					'suppressScrollY': true,
					'useBothWheelAxes': true
				});
				base.resize(false, true);
			}

			if(through_pagination === true) {
				setTimeout(function() {
					base.update_scroll_position(false, Math.floor(base.info.playlist_width/16*9)*(base.playlist_count-count));
				}, 10);
				
				// base.update_scroll_position
			}
			return {
				'items': items,
				'count': count,
			};
			// base.set_playlist_width(100);
			// base.create_youtube_element();
		};

		base.check_youtube_api_ready = function() {
			if(!base.info.alternative_api_ready_check) {
				if(!$('body').hasClass('yesp-youtube-iframe-ready')) {
					return false;
				}
			}else {
				// YT not an object
				if(typeof(YT) !== typeof({})) {
					return false;
				}

				// YT not loaded
				if(YT.loaded == 0) {
					return false;
				}
			}

			// It's loaded!
			return true;
		};
		
		base.create_youtube_element = function() {
			// If youtube isn't ready, try again in 10ms
			if(!base.check_youtube_api_ready()) {
				setTimeout(base.create_youtube_element, 10);
				return;
			}

			if(base.info.youtube_loaded) {
				return;
			}
			base.info.youtube_loaded = true;

			var vars = {
				'controls': 0,
				'showinfo': 0,
				'fullscreen': 0,
				'iv_load_policy': base.options.show_annotations ? 1 : 3,
				'fs': 0,
				// height: 390,
				// width: 640,
				// 'vq': 'hd720', // will force hd video
				'wmode': 'opaque'
			};

			if(base.options.force_hd) {
				vars.vq = 'hd720';
			}

			if(base.options.hide_youtube_logo) {
				vars.modestbranding = 1;
			}

			for(var i in base.options.player_vars) {
				vars[i] = base.options.player_vars[i];
			}

			// Force HTTPS, otherwise it will randomly return errors
			window.YTConfig = {
				'host': 'https://www.youtube.com'
			};

			base.youtube = new YT.Player(base.id+'_yt', {
				// fullscreen: 0,
				// iv_load_policy: 3,
				// fs: 0,
				// videoId: base.playlist_items[0].snippet.resourceId.videoId,
				playerVars: vars,
				events: {
					'onReady': base.youtube_ready,
					'onStateChange': base.youtube_state_change
				}
			});

			

		};

		base.youtube_ready = function() {
			setInterval(base.youtube_player_updates, 500);
			// Load first video
			if(base.playlist_count == 0) {
				return;
			}
			base.play_video(base.options.first_video, !base.options.autoplay, true);
			if(base.options.volume !== false) {
				base.update_volume(0, base.options.volume);
			}
			
			base.$el.find('.yesp-container').hover(function() {
				base.info.hover = true;
				base.show_controls();
			}, function() {
				base.info.hover = false;
				var s = base.youtube.getPlayerState();
				if(base.options.show_controls_on_pause && (s == -1 || s == 0 || s == 2 || s == 5)) {
					// do not hide
				}else if(base.options.show_controls_on_play) {
					// do not hide
				}else {
					base.hide_controls();
				}
				base.hide_share();
			});
		}

		base.youtube_player_updates = function() {
			base.info.current_time = base.youtube.getCurrentTime();

			if(!base.youtube.getCurrentTime()) {
				base.info.current_time = 0;
			}

			base.info.duration = base.youtube.getDuration();

			if(!base.info.duration) {
				return;
			}

			if(base.info.current_time == base.info.previous_time) {
				return;
			}

			base.info.previous_time = base.info.current_time;

			if(base.options.time_indicator == 'full') {
				base.$controls['time'].html(base.format_time(base.info.current_time)+' / '+base.format_time(base.info.duration));
			}else {
				base.$controls['time'].html(base.format_time(base.info.current_time));
			}

			var s = Math.round(base.info.current_time);
			if(s == 0) {
				base.$controls['youtube'].attr('href', base.$controls['youtube'].attr('data-href'));
			}else {
				base.$controls['youtube'].attr('href', base.$controls['youtube'].attr('data-href')+'#t='+s);
			}

			base.info.current_video_url = base.$controls['youtube'].attr('data-href');

			var perc = 100 * base.info.current_time / base.info.duration;
			base.$controls['time_bar_time'].css('width',perc+'%');
			base.$controls['time_bar_buffer'].css('width', base.youtube.getVideoLoadedFraction()*100+'%');

			base.options.on_time_update(base.info.current_time);

		};

		base.youtube_state_change = function(e) {
			var state = e.data;
			if(state == 0) {
				// ended
				if(base.options.continuous) {
					// load next video
					base.forward();
				}else {
					base.play_video(base.info.index, true);
					base.$controls['play'].removeClass('yesp-icon-play').removeClass('yesp-icon-pause').addClass('yesp-icon-undo');
					base.show_controls();
				}
			}else if(state == 1 || state == 3) {
				// playing or buffering
				base.$controls['play'].removeClass('yesp-icon-play').addClass('yesp-icon-pause').removeClass('yesp-icon-undo');
			}else if(state == 2) {
				// paused
				base.$controls['play'].addClass('yesp-icon-play').removeClass('yesp-icon-pause').removeClass('yesp-icon-undo');
			}

			if(!base.info.first_play && state !== -1 && state !== 5) {
				base.info.first_play = true;
			}

			base.youtube_player_updates();
			base.options.on_state_change(state);
		};

		base.create_player_element = function() {
			base.$el.css('width', '100%').addClass('yesp').html('<div class="yesp-container"><div class="yesp-autoposter"><div class="yesp-autoposter-icon"><div></div></div></div><div class="yesp-video-container"><div class="yesp-video" id="'+base.id+'_yt"></div><div class="yesp-error"></div></div></div><div class="yesp-playlist"><div class="yesp-next-page"><i class="yesp-icon yesp-icon-plus"></i>Load More</div></div><div class="yesp-hp"><div class="yesp-hp-videos"><div class="yesp-hp-next-page"><i class="yesp-icon yesp-icon-plus"></i></div></div></div>');
			
			base.$el.find('.yesp-video-container').click(function(e) {
				base.play_pause();
			});

			if(base.options.playlist_type == "horizontal") {
				base.$el.find('.yesp-playlist').remove();
			}

			base.$el.find('.yesp-next-page, .yesp-hp-next-page').click(function(e) {
				base.get_playlist_next();
			});

			base.$el.find('.yesp-autoposter').click(function(e) {
				e.preventDefault();
				base.play();
				//base.$el.find('.yesp-autoposter').hide();
			});

		};

		base.create_controls = function() {
			var $controls = $('<div class="yesp-controls"></div>');

			$controls.html('<div class="yesp-controls-wrapper"><a href="#" class="yesp-play yesp-icon yesp-icon-play"></a><div class="yesp-time">00:00 / 00:00</div><div class="yesp-bar"><div class="yesp-bar-buffer"></div><div class="yesp-bar-time"></div></div><div class="yesp-volume"><a href="#" class="yesp-volume-icon yesp-icon yesp-icon-volume-up" title="Tắt tiếng"></a><div class="yesp-volume-bar"><div class="yesp-volume-amount"></div></div></div><a href="#" class="yesp-share yesp-icon yesp-icon-share-square-o" title="Chia sẽ"></a><a href="#" target="_blank" class="yesp-youtube yesp-icon yesp-icon-youtube-play" title="Xem trong trang Youtube"></a><a href="#" class="yesp-backward yesp-icon yesp-icon-backward" title="Video trước"></a><a href="#" class="yesp-forward yesp-icon yesp-icon-forward" title="Video sau"></a><a href="#" class="yesp-playlist-toggle yesp-icon yesp-icon-align-justify yesp-icon-rotate-180" title="Tắt | Mở danh mục"></a><a href="#" class="yesp-fullscreen yesp-icon yesp-icon-expand" title="Toàn màn hình"></a></div>');

			base.$controls['play'] = $controls.find('.yesp-play');
			base.$controls['time'] = $controls.find('.yesp-time');
			base.$controls['time_bar'] = $controls.find('.yesp-bar');
			base.$controls['time_bar_buffer'] = $controls.find('.yesp-bar-buffer');
			base.$controls['time_bar_time'] = $controls.find('.yesp-bar-time');
			base.$controls['volume'] = $controls.find('.yesp-volume');
			base.$controls['volume_icon'] = $controls.find('.yesp-volume-icon');
			base.$controls['volume_bar'] = $controls.find('.yesp-volume-bar');
			base.$controls['volume_amount'] = $controls.find('.yesp-volume-amount');
			base.$controls['share'] = $controls.find('.yesp-share');
			base.$controls['youtube'] = $controls.find('.yesp-youtube');
			base.$controls['forward'] = $controls.find('.yesp-forward');
			base.$controls['backward'] = $controls.find('.yesp-backward');
			base.$controls['playlist_toggle'] = $controls.find('.yesp-playlist-toggle');
			base.$controls['fullscreen'] = $controls.find('.yesp-fullscreen');

			if(!base.options.play_control) {
				base.$controls['play'].hide();
			}

			if(!base.options.time_indicator) {
				base.$controls['time'].hide();
			}else if(base.options.time_indicator == 'full') {
				base.$controls['time'].addClass('yesp-full-time');
			}

			if(!base.options.volume_control) {
				base.$controls['volume'].hide();
			}

			if(!base.options.share_control) {
				base.$controls['share'].hide();
			}

			if(!base.options.youtube_link_control) {
				base.$controls['youtube'].hide();
			}

			if(!base.options.fwd_bck_control) {
				base.$controls['backward'].hide();
				base.$controls['forward'].hide();
			}

			if(!base.options.fullscreen_control) {
				base.$controls['fullscreen'].hide();
			}

			if(!base.options.playlist_toggle_control) {
				base.$controls['playlist_toggle'].hide();
			}

			$controls.appendTo(this.$el.find('.yesp-container'));

			base.$logo = $('<a href="#" target="_blank" class="yesp-youtube-logo"></a>');

			base.$logo.appendTo(this.$el.find('.yesp-container'));

			if(base.options.hide_youtube_logo || base.info.mobile) {
				base.$logo.hide();
			}


		};

		base.create_title = function() {
			base.$title = $('<div class="yesp-title"></div>');
			base.$title.html('<div class="yesp-title-wrapper"></div>');

			base.$title.appendTo(base.$el.find('.yesp-container'));
		};

		base.update_title = function(title, channel, channel_link) {
			if(base.options.show_channel_in_title) {
				base.$title.find('div.yesp-title-wrapper').html('<a href="'+channel_link+'" target="_blank" class="yesp-subtitle">'+channel+'</a>'+title);
			}else {
				base.$title.find('div.yesp-title-wrapper').html(title);
			}
			
			
		};

		base.create_overlays = function() {

			base.$social = $('<div class="yesp-social" data-show="0"><a href="#" class="yesp-social-button yesp-social-google yesp-icon yesp-icon-google-plus"></a><a href="#" class="yesp-social-button yesp-social-twitter yesp-icon yesp-icon-twitter"></a><a href="#" class="yesp-social-button yesp-social-facebook yesp-icon yesp-icon-facebook"></a></div>')
				.appendTo(base.$el.find('.yesp-container'));

			base.$social.find('.yesp-social-facebook').click(function(e) {
				e.preventDefault();
				base.share_facebook();
			});
			base.$social.find('.yesp-social-twitter').click(function(e) {
				e.preventDefault();
				base.share_twitter();
			});
			base.$social.find('.yesp-social-google').click(function(e) {
				e.preventDefault();
				base.share_google();
			});

		};

		base.share_link = function() {

		},

		base.share_facebook = function() {
			window.open('https://www.facebook.com/sharer/sharer.php?u='+base.share_url(), 'Share on Facebook', "height=450,width=600");
		},

		base.share_twitter = function() {
			window.open('https://twitter.com/home?status='+base.share_url(), 'Share on Twitter', "height=450,width=600");
		},

		base.share_google = function() {
			window.open('https://plus.google.com/share?url='+base.share_url(), 'Share on Google+', "height=450,width=600");
		},

		base.bind_controls = function() {

			base.$controls['play'].click(function(e) {
				e.preventDefault();
				base.play_pause();
			});

			base.$controls['volume_icon'].click(function(e) {
				e.preventDefault();
				if(base.youtube.isMuted()) {
					// unmute
					if(base.info.volume == 0) {
						base.info.volume = base.options.volume;
					}

					base.update_volume(0, base.info.volume);
				}else {
					// mute
					var previous_vol = base.youtube.getVolume()/100;
					base.update_volume(0, 0);
					base.info.volume = previous_vol;
				}
			});

			base.$controls['share'].click(function(e) {
				e.preventDefault();
				base.toggle_share();
			});

			base.$controls['youtube'].click(function(e) {
				base.pause();
			});

			base.$controls['backward'].click(function(e) {
				e.preventDefault();
				base.backward();
			});

			base.$controls['forward'].click(function(e) {
				e.preventDefault();
				base.forward();
			});

			base.$controls['fullscreen'].click(function(e) {
				e.preventDefault();
				if(base.info.fullscreen) {
					// exit fullscreen
					base.exit_fullscreen(true);
				}else {
					// enter fullscreen
					base.enter_fullscreen();
				}
				
			});

			base.$controls['playlist_toggle'].click(function(e) {
				e.preventDefault();
				base.toggle_playlist();
			});

		};

		base.show_controls = function() {

			base.$title.stop().animate({
				'opacity': 1
			}, 250);

			base.$el.find('.yesp-controls').stop().animate({
				'bottom': 0,
				'opacity': 1,
			}, 250);

			if(!base.options.hide_youtube_logo && !base.info.mobile) {
				base.$logo.stop().fadeTo(250, .5, function() {
					base.$logo.css('opacity', '');
				});
			}
		};

		base.hide_controls = function(opacity) {
			// opacity = true;
			if(typeof(opacity) !== 'undefined' && opacity == true) {
				base.$el.find('.yesp-controls').stop().animate({
					'bottom': 0,
					'opacity': 0,
				}, 250);
			}else {
				base.$el.find('.yesp-controls').stop().animate({
					'bottom': -50
				}, 250);
			}

			console.log(base.$el.find('.yesp-youtube-logo').length);
			base.$el.find('.yesp-youtube-logo').stop().fadeTo(250, 0, function() {
				//base.$el.find('.yesp-youtube-logo').css('opacity', '');
			});

			

			// Never hide the title for ios
			if(base.info.ios) {
				return;
			}

			base.$title.stop().animate({
				'opacity': 0
			}, 250);

		};

		

		base.play_pause = function() {
			var state = base.youtube.getPlayerState();
			if(state == 2) {
				// paused
				base.play();
			}else if(state == 0) {
				// stopped
				base.youtube.seekTo(0);
				base.play();
			}else if(state == 5) {
				// cueued
				// base.youtube.seekTo(0);
				base.play();
			}else {
				// playing or buffering
				base.pause();
			}
		};

		base.play = function() {
			base.youtube.playVideo();
			base.$el.find('.yesp-autoposter').hide();
			base.$controls['play'].removeClass('yesp-icon-play').addClass('yesp-icon-pause').removeClass('yesp-icon-undo');
			// base.options.on_play();
		};

		base.pause = function() {
			base.youtube.pauseVideo();
			base.$controls['play'].addClass('yesp-icon-play').removeClass('yesp-icon-pause').removeClass('yesp-icon-undo');
			// base.options.on_pause();
		};

		base.stop = function() {
			base.pause();
			base.youtube.stopVideo();
		};

		base.forward = function() {
			base.info.index++;
			if(base.info.index >= base.playlist_count) {
				base.info.index = 0;
			}
			base.play_video(base.info.index);
		};

		base.backward = function() {
			base.info.index--;
			if(base.info.index < 0) {
				base.info.index = base.playlist_count-1;
			}
			base.play_video(base.info.index);
		};

		base.play_video = function(index, cue, fast_scroll) {
			var video = base.playlist_items[index];
			if(video == undefined) {
				return;
			}
			if(typeof(fast_scroll) === typeof(undefined)) {
				fast_scroll = false;
			}
			if(base.info.mobile && !base.info.first_play) {
				cue = true;
			}
			var title 			= video.snippet.title,
				channel 		= video.snippet.channelTitle,
				channel_link	= 'https://www.youtube.com/channel/'+video.snippet.channelId,
				video_id 		= video.snippet.resourceId.videoId,
				video_link		= 'https://www.youtube.com/watch?v='+video_id;

			base.update_title(title, channel, channel_link);
			if(typeof(cue) == 'undefined' || cue == false) {
				base.youtube.loadVideoById(video_id);
			}else {
				base.youtube.cueVideoById(video_id);
			}

			base.$logo.attr('href', video_link);

			base.$controls['youtube'].attr('href', video_link).attr('data-href', video_link);
			base.info.current_video_url = video_link;

			base.$el.find('.yesp-playlist-video').attr('data-playing', '0');
			base.$el.find('.yesp-playlist-video[data-index='+index+']').attr('data-playing', '1');

			base.$el.find('.yesp-hp-video').attr('data-playing', '0');
			base.$el.find('.yesp-hp-video[data-index='+index+']').attr('data-playing', '1');

			if(base.options.time_indicator == 'full') {
				base.$controls['time'].html('00:00 / 00:00');
			}else {
				base.$controls['time'].html('00:00');
			}
			
			base.$controls['time_bar_time'].css('width', 0);
			base.$controls['time_bar_buffer'].css('width', 0);

			base.info.index = index;

			base.update_scroll_position(fast_scroll);

			if(cue === true && !base.info.mobile) {
				// show hi-res image
				var img_src = false;
				if(typeof(video.snippet.thumbnails.maxres) !== 'undefined') {
					img_src = video.snippet.thumbnails.maxres.url;
				}else if(typeof(video.snippet.thumbnails.high) !== 'undefined') {
					img_src = video.snippet.thumbnails.high.url;
				}else if(typeof(video.snippet.thumbnails.medium) !== 'undefined') {
					img_src = video.snippet.thumbnails.medium.url;
				}else if(typeof(video.snippet.thumbnails.standard) !== 'undefined') {
					img_src = video.snippet.thumbnails.standard.url;
				}else if(typeof(video.snippet.thumbnails.default) !== 'undefined') {
					img_src = video.snippet.thumbnails.default.url;
				}
				if(img_src !== false) {
					base.$el.find('.yesp-autoposter').css('background-image', 'url("'+img_src+'")').show();
				}
				
			}else {
				base.$el.find('.yesp-autoposter').hide();
			}

			base.options.on_load(video.snippet);

		};

		base.update_scroll_position = function(fast, force_scroll) {
			if(base.options.playlist_type === 'horizontal') {
				var scroll_to = 160*base.info.index;
				if(typeof(force_scroll) !== typeof(undefined)) {
					scroll_to = force_scroll;
				}

				if(fast == true) {
					base.$el.find('.yesp-hp').scrollLeft(scroll_to);
					base.$el.find('.yesp-hp').perfectScrollbar('update');
				}else {
					base.$el.find('.yesp-hp').stop().animate({
						scrollLeft: scroll_to
					}, 500, function() {
						base.$el.find('.yesp-hp').perfectScrollbar('update');
					});
				}
				return;
			}
			var scroll_to = Math.floor(base.info.playlist_width/16*9)*base.info.index;
			if(typeof(force_scroll) !== typeof(undefined)) {
				scroll_to = force_scroll;
			}
			if(scroll_to < 0) { scroll_to = 0; }

			var playlist_height = base.$el.find('.yesp-playlist').innerHeight(),
				item_heights = Math.floor(base.info.playlist_width/16*9)*base.playlist_count;

			var max_scroll = item_heights-playlist_height;
			if(base.info.next_page_token) {
				max_scroll += 50;
			}
			if(scroll_to > max_scroll) {
				scroll_to = max_scroll;
			}

			if(fast == true) {
				base.$el.find('.yesp-playlist').scrollTop(scroll_to);
				base.$el.find('.yesp-playlist').perfectScrollbar('update');
			}else {
				base.$el.find('.yesp-playlist').stop().animate({
					scrollTop: scroll_to
				}, 500, function() {
					base.$el.find('.yesp-playlist').perfectScrollbar('update');
				});
			}
		}

		// base.play_video_index = function(index) {
		// 	// var video = base.playlist_items[index];
		// 	base.play_video(index);
		// };

		base.toggle_fullscreen = function() {
			if(base.info.fullscreen) {
				base.exit_fullscreen(true);
			}else {
				base.enter_fullscreen()
			}
		};

		base.enter_fullscreen = function() {

			if(base.info.mobile) {
				
			}

			var requestFullScreen = base.$el.find('.yesp-container')[0].webkitRequestFullScreen || base.$el.find('.yesp-container')[0].requestFullScreen || base.$el.find('.yesp-container')[0].mozRequestFullScreen;
			if(!requestFullScreen) {
				return;
			}

			var w = $(window).width(),
				h = $(window).height();

			base.info.fullscreen = true;

			base.$el.find('.yesp-container, .yesp-container iframe').css({
				'width': '100%',
				'height': '100%'
			});
			base.youtube.setSize(w, h);
			requestFullScreen.bind(base.$el.find('.yesp-container')[0])();
		};

		base.exit_fullscreen = function(exit) {
			if(typeof(exit) !== 'undefined' && exit) {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				}
				else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				}
				else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				}
				else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			}
			base.info.fullscreen = false;
			base.resize();
			// base.show_controls();
		};

		base.toggle_playlist = function() {
			if(base.options.playlist_type === 'horizontal') {
				if(base.info.horizontal_playlist_shown) {
					base.hide_horizontal_playlist();
				}else {
					base.show_horizontal_playlist();
				}
			}else {
				if(base.info.playlist_shown) {
					base.hide_playlist(false);
				}else {
					base.show_playlist(false);
				}
				if(base.options.show_playlist !== 'auto') {
					base.resize();
				}
			}
			
		};

		base.show_playlist = function(fast, resize) {
			if(base.options.playlist_type == 'horizontal') {
				return;
			}
			if(typeof(resize) == typeof(undefined)) {
				resize = true;
			}
			fast = true;
			if(base.info.playlist_animating) {
				return;
			}
			base.info.playlist_animating = true;
			var $p = base.$el.find('.yesp-playlist'),
				w = 0;
 
			base.$el.find('.yesp-icon-list').removeClass('yesp-icon-list').addClass('yesp-icon-align-justify');
 
			if(fast) {
				$p.css('width', base.info.playlist_width);
				base.info.playlist_shown = true;
				base.info.playlist_animating = false;
				if(resize) {
					base.resize(true);
				}
				return;
			}
		};
 
		base.hide_playlist = function(fast, resize) {
			if(typeof(resize) == typeof(undefined)) {
				resize = true;
			}
			fast = true;
			if(base.info.playlist_animating) {
				return;
			}
			base.info.playlist_animating = true;

			var $p = base.$el.find('.yesp-playlist');
 			
 			if(base.options.playlist_type == 'vertical') {
				base.$el.find('.yesp-icon-align-justify').removeClass('yesp-icon-align-justify').addClass('yesp-icon-list');
			}
			
 
			if(fast) {
 
				$p.css('width', 0);
				base.info.playlist_shown = false;
				base.info.playlist_animating = false;
				if(resize) {
					base.resize(true);
				}
				return;
			}
		};

		base.show_horizontal_playlist = function() {
			base.info.horizontal_playlist_shown = true;
			base.$el.find('.yesp-hp').show();
			base.$el.find('.yesp-icon-list').removeClass('yesp-icon-list').addClass('yesp-icon-align-justify');
		};

		base.hide_horizontal_playlist = function() {
			base.info.horizontal_playlist_shown = false;
			base.$el.find('.yesp-hp').hide();
			base.$el.find('.yesp-icon-align-justify').removeClass('yesp-icon-align-justify').addClass('yesp-icon-list');
		};

		base.set_playlist_width = function(width) {
			if(base.info.playlist_shown) {
				base.info.playlist_width = width;
			}

			var height = Math.floor(width/16*9);

			base.$el
				.find('.yesp-playlist').css({
					'width': width
				})
				.find('.yesp-playlist-video').css({
					'width': width,
					'height': height
				});

			base.$el.find('.yesp-playlist .yesp-playlist-current').css('width', width-20);


			if(width <= 100) {

				base.$el.find('.yesp-playlist').addClass('yesp-playlist-simple');
				base.$el.find('.yesp-playlist .yesp-playlist-current').css('width', 10);
			}else {
				base.$el.find('.yesp-playlist').removeClass('yesp-playlist-simple');
			}

		}

		base.resize = function(avoid_playlist, force_update) {

			// when undefined or object (from window.resize)
			if(typeof(avoid_playlist) == typeof(undefined) || typeof(avoid_playlist) == typeof({})) {
				avoid_playlist = false;
			}
			
			var width = base.$el.innerWidth();

			if(base.options.show_playlist == 'auto' && avoid_playlist == false) {
 
				if(width < 660 && (force_update == true || base.info.playlist_width == 200)) {
					base.set_playlist_width(100);
					base.update_scroll_position(true);
				}
				if(width < 500 && (force_update == true || base.info.playlist_shown == true)) {
					base.hide_playlist(false, false);
					base.update_scroll_position(true);
				}
 
				if(width >= 500 && (force_update == true || base.info.playlist_shown == false)) {
					base.show_playlist(false, false);
					base.update_scroll_position(true);
				}
				if(width >= 660 && (force_update == true || base.info.playlist_width == 100)) {
					base.set_playlist_width(200);
					base.update_scroll_position(true);
				}
			}else if(avoid_playlist == false) {
				force_update = true;
				if(width < 660 && (force_update == true || base.info.playlist_width == 200)) {
					base.set_playlist_width(100);
					base.update_scroll_position(true);
				}
 
				if(width >= 660 && (force_update == true || base.info.playlist_width == 100)) {
					base.set_playlist_width(200);
					base.update_scroll_position(true);
				}
 
				if(base.info.playlist_shown == false) {
					base.hide_playlist(true, false);
				}
				
			}

			var controls_width = width - (base.info.playlist_shown ? base.info.playlist_width : 0),
				height = controls_width/16*9;

			if(base.info.fullscreen) {
				width = $(window).width();
				controls_width = width;
				height = $(window).height();
			}

			// if(!base.info.fullscreen) {
				base.$el.find('.yesp-container, .yesp-playlist, .yesp-video').css('height', height);
				base.$el.find('.yesp-container, .yesp-video').css('width', controls_width);

				base.$el.find('.yesp-playlist').perfectScrollbar('update');
				//base.$el.find('.yesp-playlist').css('width', base.info.playlist_width);
			// }

			base.info.width = controls_width;
			base.info.height = height;

			//var height = base.$el.innerHeight();

			var bar_width = controls_width - 20; // Minus the padding

			// Remove options if the width is too small
			if(controls_width < 600) {
				if(base.options.time_indicator == 'full') {
					base.options.time_indicator = true;
					base.$controls['time'].html(base.format_time(base.info.current_time));
					base.$controls['time'].removeClass('yesp-full-time');
				}
			}
			if(controls_width < 530) {
				base.options.fwd_bck_control = false;
				base.options.youtube_link_control = false;
				base.$controls['forward'].hide();
				base.$controls['backward'].hide();
				base.$controls['youtube'].hide();
			}
			if(controls_width < 400) {
				base.options.volume_control = false;
				base.$controls['volume'].hide();
				
			}
			if(controls_width < 300) {
				base.options.time_indicator = false;
				base.$controls['time'].hide();
				
				base.options.share_control = false;
				base.$controls['share'].hide();
			}

			// Add options from when width was too small
			if(controls_width >= 300 && (base.options_copy.time_indicator == true || base.options_copy.time_indicator == 'full')) {
				base.options.time_indicator = true;
				base.$controls['time'].show();
			}
			if(controls_width >= 300 && base.options_copy.share_control == true) {
				base.options.share_control = true;
				base.$controls['share'].show();
			}
			if(controls_width >= 400 && base.options_copy.volume_control == true) {
				base.options.volume_control = true;
				base.$controls['volume'].show();
			}
			if(controls_width >= 530 && base.options_copy.fwd_bck_control == true) {
				base.options.fwd_bck_control = true;
				base.$controls['forward'].show();
				base.$controls['backward'].show();
			}
			if(controls_width >= 530 && base.options_copy.youtube_link_control == true) {
				base.options.youtube_link_control = true;
				base.$controls['youtube'].show();
			}
			if(controls_width >= 600 && base.options_copy.time_indicator == 'full') {
				base.options.time_indicator = 'full';
				base.$controls['time'].html(base.format_time(base.info.current_time)+' / '+base.format_time(base.info.duration));
				base.$controls['time'].addClass('yesp-full-time');
			}
			

			if(base.options.play_control) {
				bar_width -= 30;
			}

			if(base.options.time_indicator) {
				bar_width -= 58;
			}

			if(base.options.time_indicator == 'full') {
				bar_width -= 40;
			}

			if(base.options.volume_control) {
				bar_width -= 110;
			}

			if(base.options.share_control) {
				bar_width -= 30;
			}

			if(base.options.youtube_link_control) {
				bar_width -= 30;
			}

			if(base.options.fwd_bck_control) {
				bar_width -= 60;
			}

			if(base.options.fullscreen_control) {
				bar_width -= 30;
			}

			if(base.options.playlist_toggle_control) {
				bar_width -= 30;
			}

			bar_width -= 18; // Minus the bar's margin;

			base.$controls['time_bar'].css('width', bar_width);

			

		};

		base.init_time_slider = function() {
			base.$controls['time_bar'].on('mousedown', function(e) {
				base.info.time_drag = true;
				base.update_time_slider(e.pageX);
			});
			$(document).on('mouseup', function(e) {
				if(base.info.time_drag) {
					base.info.time_drag = false;
					base.update_time_slider(e.pageX);
				}
			});
			$(document).on('mousemove', function(e) {
				if(base.info.time_drag) {
					base.update_time_slider(e.pageX);
				}
			});
		};

		base.update_time_slider = function(x) {

			if(base.info.duration == 0) {
				return;
			}

			var maxduration = base.info.duration;
			var position = x - base.$controls['time_bar'].offset().left;
			var percentage = 100 * position / base.$controls['time_bar'].width();

			if(percentage > 100) {
				percentage = 100;
			}
			if(percentage < 0) {
				percentage = 0;
			}
			base.$controls['time_bar_time'].css('width',percentage+'%');
			base.youtube.seekTo(maxduration * percentage / 100);

			base.options.on_seek(maxduration * percentage / 100);

		};

		base.init_volume_slider = function() {
			base.$controls['volume_bar'].on('mousedown', function(e) {
				base.info.volume_drag = true;
				base.$controls['volume_icon'].removeClass('yesp-icon-volume-off').addClass('yesp-icon-volume-up');
				base.update_volume(e.pageX);
			});
			$(document).on('mouseup', function(e) {
				if(base.info.volume_drag) {
					base.info.volume_drag = false;
					base.update_volume(e.pageX);
				}
			});
			$(document).on('mousemove', function(e) {
				if(base.info.volume_drag) {
					base.update_volume(e.pageX);
				}
			});
		};

		base.update_volume = function(x, vol) {

			var percentage;

			if(vol) {
				percentage = vol * 100;
			}
			else {
				var position = x - base.$controls['volume_bar'].offset().left;
				percentage = 100 * position / base.$controls['volume_bar'].width();
			}
			
			if(percentage > 100) {
				percentage = 100;
			}
			if(percentage < 0) {
				percentage = 0;
			}
			
			base.$controls['volume_amount'].css('width',percentage+'%');

			base.youtube.setVolume(percentage);

			if(percentage == 0) {
				base.youtube.mute();
			}else if(base.youtube.isMuted()) {
				base.youtube.unMute();
			}

			if(percentage == 0) {
				base.$controls['volume_icon'].addClass('yesp-icon-volume-off').removeClass('yesp-icon-volume-up');
			}else {
				base.$controls['volume_icon'].removeClass('yesp-icon-volume-off').addClass('yesp-icon-volume-up');
			}
			
			base.options.on_volume(percentage/100);
			
		};

		base.toggle_share = function() {
			if(base.$social.attr('show') == '1') {
				base.hide_share();
			}else {
				base.show_share();
			}
		};

		base.show_share = function() {
			base
				.$social.attr('show', '1')
				.stop()
				.animate({
					right: 10
				}, 200);
		};

		base.hide_share = function() {
			base
				.$social.attr('show', '0')
				.stop()
				.animate({
					right: -140
				}, 200);
		};

		base.set_style = function() {
			var $s = $('<style />');

			var default_colors = {
				controls_bg: 		'rgba(0,0,0,.75)',
				buttons: 			'rgba(255,255,255,.5)',
				buttons_hover: 		'rgba(255,255,255,1)',
				buttons_active: 	'rgba(255,255,255,1)',
				time_text: 			'#FFFFFF',
				bar_bg: 			'rgba(255,255,255,.5)',
				buffer: 			'rgba(255,255,255,.25)',
				fill: 				'#FFFFFF',
				video_title: 		'#FFFFFF',
				video_channel: 		'#DFF76D',
				playlist_overlay: 	'rgba(0,0,0,.5)',
				playlist_title: 	'#FFFFFF',
				playlist_channel: 	'#DFF76D',
				scrollbar: 			'#FFFFFF',
				scrollbar_bg: 		'rgba(255,255,255,.25)',
				load_more_bg: 		'#000000',
				load_more_text: 	'#FFFFFF',
			};

			for(key in base.options.colors) {
				default_colors[key] = base.options.colors[key];
			}

			$s.html('#'+base.id+'.yesp .yesp-controls{background:'+default_colors.controls_bg+'!important}#'+base.id+'.yesp .yesp-controls a{color:'+default_colors.buttons+'!important}#'+base.id+'.yesp .yesp-controls a:hover{color:'+default_colors.buttons_hover+'!important}#'+base.id+'.yesp .yesp-controls a:active{color:'+default_colors.buttons_active+'!important}#'+base.id+'.yesp .yesp-time{color:'+default_colors.time_text+'!important}#'+base.id+'.yesp .yesp-bar,#'+base.id+'.yesp .yesp-volume .yesp-volume-bar{background:'+default_colors.bar_bg+'!important}#'+base.id+'.yesp .yesp-bar .yesp-bar-buffer{background:'+default_colors.buffer+'!important}#'+base.id+'.yesp .yesp-bar .yesp-bar-time,#'+base.id+'.yesp .yesp-volume .yesp-volume-bar .yesp-volume-amount{background:'+default_colors.fill+'!important}#'+base.id+'.yesp .yesp-title-wrapper{color:'+default_colors.video_title+'!important}#'+base.id+'.yesp .yesp-title a.yesp-subtitle{border-color:'+default_colors.video_title+'!important}#'+base.id+'.yesp .yesp-title-wrapper a{color:'+default_colors.video_channel+'!important}#'+base.id+'.yesp .yesp-playlist-overlay,#'+base.id+'.yesp .yesp-hp-overlay,#'+base.id+'.yesp .yesp-playlist-current,#'+base.id+'.yesp .yesp-hp-current{background: '+default_colors.playlist_overlay+' !important;}#'+base.id+'.yesp .yesp-playlist-overlay .yesp-playlist-title,#'+base.id+'.yesp .yesp-hp-overlay .yesp-hp-title,#'+base.id+'.yesp .yesp-playlist-current,#'+base.id+'.yesp .yesp-hp-current{color: '+default_colors.playlist_title+' !important;}#'+base.id+'.yesp .yesp-playlist-overlay .yesp-playlist-channel,#'+base.id+'.yesp .yesp-hp-overlay .yesp-hp-channel {color: '+default_colors.playlist_channel+' !important;}#'+base.id+'.yesp .ps-scrollbar-y-rail, #'+base.id+'.yesp .ps-scrollbar-x-rail {background: '+default_colors.scrollbar_bg+' !important;}#'+base.id+'.yesp .ps-scrollbar-y,#'+base.id+'.yesp .ps-scrollbar-x {background: '+default_colors.scrollbar+' !important;}#'+base.id+'.yesp .yesp-next-page,#'+base.id+'.yesp .yesp-hp-next-page {background:'+default_colors.load_more_bg+' !important;color:'+default_colors.load_more_text+' !important;}');
			$s.appendTo('body');
		};

		base.format_time = function(seconds) {
			var m = Math.floor(seconds / 60) < 10 ? "0" + Math.floor(seconds / 60) : Math.floor(seconds / 60),
				s = Math.floor(seconds - (m * 60)) < 10 ? "0" + Math.floor(seconds - (m * 60)) : Math.floor(seconds - (m * 60));
			return m + ":" + s;
		};

		base.cut_text = function(n) {
			return function textCutter(i, text) {
				var short = text.substr(0, n);
				if (/^\S/.test(text.substr(n))) {
					return short.replace(/\s+\S*$/, "");
				}
				return short;
			};
		};

		base.share_url = function() {
			return base.info.current_video_url;
		};

		base.detect_ie = function() {
			var ua = window.navigator.userAgent;
			var msie = ua.indexOf('MSIE ');
			var trident = ua.indexOf('Trident/');

			if (msie > 0) {
				return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
			}

			if (trident > 0) {
				var rv = ua.indexOf('rv:');
				return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
			}

			// other browser
			return false;
		};

		base.detect_touch = function() {
			return !!('ontouchstart' in window) || !!('onmsgesturechange' in window);
		};
		
		// Run initializer
		base.init();
	};
	
	$.youtube_video.defaultOptions = {

		// Options
		playlist: 					false,
		channel: 					false,
		user: 						false,
		videos: 					false,
		api_key: 					'AIzaSyAGTUD6dUBIV_qYkkFnvffWStxtl7S_KIE',
		max_results: 				50,
		pagination: 				true, 				// NEW IN 1.1
		continuous: 				true,
		first_video: 				0,
		show_playlist: 				'auto',
		playlist_type: 				'vertical',
		show_channel_in_playlist: 	true,
		show_channel_in_title: 		true,
		width: 						false,
		show_annotations: 			false,
		now_playing_text: 			'Now Playing',
		load_more_text: 			'Load More', 		// NEW IN 1.1
		force_hd: 					false, 				// NEW IN 1.1
		hide_youtube_logo: 			false,				// NEW IN 1.1
		autoplay: 					false,
		play_control: 				true,
		time_indicator: 			'full',
		volume_control: 			true,
		share_control: 				true,
		fwd_bck_control: 			true,
		youtube_link_control: 		true,
		fullscreen_control: 		true,
		playlist_toggle_control: 	true,
		volume: 					false,
		show_controls_on_load: 		true,
		show_controls_on_pause: 	true,
		show_controls_on_play: 		false,
		player_vars: 				{},
		colors: 					{},

		// Callbacks
		on_load: 			function(snippet) 	{},
		on_done_loading: 	function(videos) 	{},
		on_state_change:	function(state) 	{},
		on_seek: 			function(seconds) 	{},
		on_volume: 			function(volume) 	{},
		on_time_update: 	function(seconds) 	{},

	};


	$.fn.youtube_video = function(options){
		return this.each(function(){
			(new $.youtube_video(this, options));
		});
	};

	// Methods
	
	$.fn.youtube_video_play = function(){
		return this.each(function(){
			(new $.youtube_video_play(this));
		});
	};

	$.youtube_video_play = function(el){
		var $el = $(el),
			base = $el.data("youtube_video");
		base.play();
	};

	$.fn.youtube_video_pause = function(){
		return this.each(function(){
			(new $.youtube_video_pause(this));
		});
	};

	$.youtube_video_pause = function(el){
		var $el = $(el),
			base = $el.data("youtube_video");
		base.pause();
	};

	$.fn.youtube_video_stop = function(){
		return this.each(function(){
			(new $.youtube_video_stop(this));
		});
	};

	$.youtube_video_stop = function(el){
		var $el = $(el),
			base = $el.data("youtube_video");
		base.stop();
	};

	$.fn.youtube_video_seek = function(t){
		return this.each(function(){
			(new $.youtube_video_seek(this, t));
		});
	};

	$.youtube_video_seek = function(el, seconds){
		var $el = $(el),
			base = $el.data("youtube_video");

		var maxduration = base.info.duration,
			percentage = seconds / maxduration * 100;
		base.$controls['time_bar_time'].css('width',percentage+'%');	
		base.youtube.seekTo(maxduration * percentage / 100);
		base.options.on_seek(seconds);
	};

	$.fn.youtube_video_load = function(index){
		return this.each(function(){
			(new $.youtube_video_load(this, index));
		});
	};

	$.youtube_video_load = function(el, index){
		var $el = $(el),
			base = $el.data("youtube_video");

		base.play_video(index);
	};


	$.fn.youtube_video_volume = function(volume){
		return this.each(function(){
			(new $.youtube_video_volume(this, volume));
		});
	};

	$.youtube_video_volume = function(el, volume){
		var $el = $(el),
			base = $el.data("youtube_video");

		base.update_volume(0, volume);
	};

	$.fn.youtube_show_controls = function(){
		return this.each(function(){
			(new $.youtube_show_controls(this));
		});
	};

	$.youtube_show_controls = function(el){
		var $el = $(el),
			base = $el.data("youtube_video");

		base.show_controls();
	};
	
	
})(jQuery);

function onYouTubeIframeAPIReady() {
	jQuery("body").addClass('yesp-youtube-iframe-ready');
}

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
