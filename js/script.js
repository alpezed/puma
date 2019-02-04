(function($) {
	"use strict";
	
	/*
	 * Preloader
	 */
	$(window).on('load', function() {
		setTimeout(function() {
			$('.puma-preloader').fadeOut('fast', function() {
				$(this).remove();
			});
		}, 1000);
	});
	
    /*
	 * Owl Slider
	 */
	if ( $('.enable-owl-carousel').length > 0 ) {
		
		$('.enable-owl-carousel').each(function() {
			
			var $owl = $(this);
			
			var nav = $owl.data('nav');
			var loop = $owl.data('loop');
			var items = $owl.data('items');
			var dots = $owl.data('dots');
			var min480 = $owl.data('min480');
			var min768 = $owl.data('min768');
			var min992 = $owl.data('min992');
			var min1200 = $owl.data('min1200');
			var margin = $owl.data('margin');
			var animateOut = $owl.data('animate-out');
			var animateIn = $owl.data('animate-in');
			var autoplay = $owl.data('autoplay');
			var center = $owl.data('center') ? $owl.data('center') : false;
			
			var $thumb = $owl.data('thumb');
			
			var status = $('#owlStatus');
			
			var valRefect = $owl.data('owl-reflect');

			$owl.owlCarousel({
				loop: loop,
				margin: margin,
				navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"],
				nav: nav,
				dots: dots,
				center: center,
				items: items,
				animateOut: animateOut,
    			animateIn: animateIn,
				//mouseDrag: false,
				navSpeed:500,
				smartSpeed:350,
				autoplay: autoplay,
				autoplaySpeed: 1000,
				autoplayTimeout: 5000,
				responsive:{
					0:{ items:1 }, 
					465:{ items:min480 }, 
					750:{ items:min768 }, 
					975:{ items:min992 }, 
					1185:{ items:min1200 }
				},
				onTranslate: function (e) {
					var $currentItem = $('.owl-item').eq(e.item.index);
					var $resetElemAnim = $currentItem.find( '.is-animated.animated-in' );

					OwlCarouselresetAnimation($resetElemAnim);
				},
				onTranslated: function(e) {
					$(e.target).find(".owl-item.active [data-src]").each(function(i,v){
						$(valRefect).css("backgroundImage", "url("+$(v).attr("data-src")+")");
					});
					var $currentItem = $('.owl-item').eq(e.item.index);
					var $animateElem = $currentItem.find( '.is-animated' );

					OwlCarouselAnimation( $animateElem );
				},
				onInitialized: function(e) {
					if ( $thumb ) {
						// Enable thumbnail pagination
						$.each($('.owl-item'), function(i) {
							var thumbSrc = $(this).find('.p-testimonial--item').attr('data-thumb-src');
							var paginationLinks = $('.owl-dots .owl-dot');
							$(paginationLinks[i]).css({
								'background': 'url(' + thumbSrc + ')',
								'background-size': 'cover'
							});
						});
						
						this._plugins.navigation._controls.$absolute.prependTo($('.p-testimonial-thumb'));
					}
				}
			});
			
			function UpdateStatus( pos, val ) {
				status.find( pos ).find( '.result' ).text( val );
			}
			
			status.find( '.items' ).text( '0' + $owl.find('.owl-item').length );
			
			$(valRefect).css("backgroundImage", "url("+$owl.find(".owl-item.active [data-src]").attr("data-src")+")");
			
			$owl.on('changed.owl.carousel', function(event) {
				var items     = event.item.count;     // Number of items
				var item      = event.item.index;     // Position of the current item
				
				item = item + 1;
				
				var nexItem = item+1;
				
				if ( items === item ) {
					nexItem = item;
				}
				
				UpdateStatus( '.prevItem', '0' + (item - 1) + '/' + '0' + items );
				UpdateStatus( '.nextItem', '0' + nexItem + '/' + '0' + items );
				
			});
			
			// Go to the next item
			$('.nextItem').click(function() {
				$owl.trigger('next.owl.carousel');
			});
			// Go to the previous item
			$('.prevItem').click(function() {
				$owl.trigger('prev.owl.carousel', [300]);
			});
		});
		
	}
	
	// Fullwidth slider
	if ( $(".boxed-slider").length > 0 ) {
		$(".boxed-slider").each(function() {
			
			var $bxOwl= $(this);
			
			var animateOut = $bxOwl.data('animate-out');
			var animateIn = $bxOwl.data('animate-in');
			
			$(this).owlCarousel({
				animateOut: animateOut, //'slideOutDown',
    			animateIn: animateIn, //'fadeInDown',
				loop: false,
				smartSpeed: 650,
				items: 1,
				dots: false,
				nav: true,
				mouseDrag: false,
				navText: ["<i class='fa fa-angle-left'></i>", "<i class='fa fa-angle-right'></i>"]
			});
			
			// When the translation of the stage starts.
			$bxOwl.on('translate.owl.carousel', function(e) {
				var $currentItem = $(this).find('.owl-item');
				var $resetElemAnim = $currentItem.find( '.is-animated.animated-in' );
				
				console.log($(this));
				
				OwlCarouselresetAnimation($resetElemAnim);
			});

			// When the translation of the stage has finished.
			$bxOwl.on('translated.owl.carousel', function(e) {
				
				var $currentItem = $('.owl-item').eq(e.item.index);
				var $animateElem = $currentItem.find( '.is-animated' );
				
				OwlCarouselAnimation( $animateElem );
				
			});
			
		});
	}
	
	/*
	 * Owl Carousel Animation
	 */
	
	/* Reset animation */
	function OwlCarouselresetAnimation(anim) {
		$(anim).css({
			'opacity':'0',
			'transform':'none',
			'left':'auto',
			'right':'auto'
		}).removeClass('animated-in');	
		
		$(anim).each(function(i) {
			clearTimeout($standAnimatedColTimeout[i]); 
		});
	}
	
	/* Start Animation */
	function OwlCarouselAnimation(anim) {
		/* Animation */
		$(anim).each(function(i) {

			var $that = $(this);
			var $animationEasing = 'easeOutSine';
			var $animationDuration = '650';

			if(!navigator.userAgent.match(/(Android|iPod|iPhone|iPad|BlackBerry|IEMobile|Opera Mini)/)) {

				if($that.attr('data-animation') == 'fade-in-from-left'){
					$standAnimatedColTimeout[i] = setTimeout(function(){ 
						$that.transition({
							'opacity' : 1,
							'x' : '0px'
						},$animationDuration,$animationEasing);
					},$that.attr('data-delay'));
				} else if($that.attr('data-animation') == 'fade-in-from-right'){
					$standAnimatedColTimeout[i] = setTimeout(function(){ 
						$that.transition({
							'opacity' : 1,
							'x' : '0px'
						},$animationDuration,$animationEasing);
					},$that.attr('data-delay'));
				} else if($that.attr('data-animation') == 'fade-in-from-bottom'){
					$standAnimatedColTimeout[i] = setTimeout(function(){ 
						$that.transition({
							'opacity' : 1,
							'y' : '0px'
						},$animationDuration,$animationEasing);
					},$that.attr('data-delay'));
				} else if($that.attr('data-animation') == 'fade-in') {
					$standAnimatedColTimeout[i] = setTimeout(function(){ 
						$that.transition({
							'opacity' : 1
						},$animationDuration,$animationEasing);	
					},$that.attr('data-delay'));
				} else if($that.attr('data-animation') == 'grow-in') {
					$standAnimatedColTimeout[i] = setTimeout(function(){ 
						$that.transition({ scale: 1, 'opacity':1 },$animationDuration,$animationEasing);
					},$that.attr('data-delay'));
				} else if($that.attr('data-animation') == 'flip-in') {
					$standAnimatedColTimeout[i] = setTimeout(function(){ 
						$that.transition({  rotateY: 0, 'opacity':1 },$animationDuration, $animationEasing);
					},$that.attr('data-delay'));
				} else if($that.attr('data-animation') == 'flip-in-vertical') {
					$standAnimatedColTimeout[i] = setTimeout(function(){ 
						$that.transition({  rotateX: 0, y: 0, 'opacity':1 },$animationDuration, $animationEasing);
					},$that.attr('data-delay'));
				}

				$that.addClass('animated-in');

			}
		});
	}
	
    // Fullscreen
	function fullscreen_wrap_init() {
		if( $('.fullscreen-wrap').length > 0 ) {
			if ( $('#header-outer').hasClass( 'nav-sticky' ) ) {
				$('.fullscreen-wrap').height( $(window).height() );
			} else {
				$('.fullscreen-wrap').height( $(window).height() - $('#header-outer').outerHeight() );
			}
			
			$(".owl-carousel").trigger('refresh.owl.carousel',[0]);
		}
	}
	fullscreen_wrap_init();
	
	// Wrap header if the header is not sticky menu
	if ( $('#header-outer').hasClass( 'nav-static' ) ) {
		$('#header-outer').wrapAll('<div class="pumaHeader"/>');
	}
	$('.pumaHeader').height( $('#header-outer').outerHeight() );
	
	// Height 100%
	function puma_full_height_init() {
		if( $('.puma-height-full').length > 0 ) {
			if ( $('#header-outer').hasClass( 'nav-sticky' ) ) {
				$(".puma-height-full").height( $(window).height() );
			} else {
				$(".puma-height-full").height( $(window).height() - $('#header-outer').outerHeight() );
			}
			
			$(".puma-height-full").each(function() {
				$(this).height($(this).parent().first().height());
			});
		}
	}
	puma_full_height_init();
	
	// Background Image
	if( $('.section-img').length > 0 || $('.bg-img').length > 0 ) {
		$('.section-img, .bg-img').each(function() {
			if ( $(this).data('background') ) {
				$(this).css( 'backgroundImage', 'url('+$(this).data('background')+')' );
			}
		});
	}
	
	// Resize form on fullscreen section
	function resizeFormBox() {
		if ( $('.fullscreen-wrap .puma-form-box').length > 0 ) {
			if ( $(window).height() <= 768 ) {
				$('.fullscreen-wrap .puma-form-box').css('margin-right', 0);
				$('.fullscreen-wrap .puma-form-box').stop(true).transition({ scale: 0.75 },700,'easeInOutCubic');
			}
		}
	}
	resizeFormBox();
	
	// Enable parallax scroll
	if ( $('.parallax[data-parallax="yes"]') ) {
		$('.parallax[data-parallax="yes"]').each(function() {
			$(this).parallax("50%", 0.4);
		});
	}
	
	// Parallax mouse move
	if ( $('#app-mb-imgs').length > 0 ) {
		var scene = $('#app-mb-imgs').get(0);
		var parallax = new Parallax(scene);
	}
	
	// Progress
	if ( $('.progress-block-group').length > 0 ) {
		$('.progress-block-group').each(function() {
			var $that = $(this);
			$that.waypoint(function() {
				var progress = $that.find('.progress-bar');
				progress.each(function() {
					$(this).css( 'width', $(this).attr('aria-valuenow') + '%' );
				});
			}, {
				triggerOnce: true,
				offset: 'bottom-in-view'
			});
		});
	}
	
    // Chart
	if ($('body').length) {
	    $(window).on('scroll', function() {
	        $('.chart--lists').waypoint(function() {
	            $('.chart').each(function() {
	                chart();
	            });
	        }, {
	            offset: '80%'
	        });
	    });
	}

	function chart() {
		
		var trackColor = ($(this).data('track-color')) ? $(this).data('track-color') : '#eeeeee';
		//var barColor = $(this).data('bar-color');
		var lineWidth = ($(this).data('line-width')) ? $(this).data('line-width') : 10;
		var size = ($(this).data('size')) ? $(this).data('size') : 180;
		
	    $('.chart').easyPieChart({
	        scaleColor: false,
			trackColor: trackColor,
			barColor: function(percent) {
			    var ctx = this.renderer.getCtx();
			    var canvas = this.renderer.getCanvas();
			    var gradient = ctx.createLinearGradient(0,0,10,35);
			        gradient.addColorStop(1, "#1a237e");
			        gradient.addColorStop(0, "#45deb0");
			    return gradient;
			},
			lineWidth: lineWidth,
			size: size,
			animate: 5000,
			onStep: function(from, to, percent) {
				this.el.children[0].innerHTML = Math.round(percent);
			}
	    });
		
	}
	
	// Youtube/Vimeo Video Popup
	if ( $('.yt-popup').length > 0 ) {
		$('.yt-popup').each(function() {
			$(this).YouTubePopUp();
		});
	}
	
	/* Header Search Trigger */
	$(document).on('click', '.header-search-icon a, .puma-search-icon', function() {
		if ( ! $('#header-search').hasClass('open-search') ) {
			$('#search-overlay-bg').fadeIn('fast', function() {
				$('#header-search').addClass('open-search');
			});
		}
		return false;
	});
	
	$(document).on('click', '.search-close-icon, #search-overlay-bg', function() {
		$('#header-search').removeClass('open-search');
		$('#search-overlay-bg').delay(250).fadeOut('fast');
	});
	
	//click triggered
	$(document).on('click', '.toggle-menu-button.closed', function() {
		
		if ( $(this).attr( 'data-has-target' ) === 'true' ) {
			
			var target = $(this).attr( 'data-target' );
			
			$(target).stop(true).transition({ x: '0px' },500,'easeInOutCubic');
			
			$('.fullscreen-wrap, #project-split').stop(true).transition({ x: '275px' },500,'easeInOutCubic');
			
		} else {
			
			if ( $('#slide-out-menu-area').hasClass( 'puma-slide-out-menu' ) ) {
			
				$('#header-outer .toggle-menu-button:not(.toggle-menu-button-mobile)').stop(true).transition({ x: '-280px' },700,'easeInOutCubic');
				
				$('#header-outer .toggle-menu-button-mobile').stop(true).transition({ x: '-325px', y: '-50%' },700,'easeInOutCubic');

				$('#header-outer[data-has-menu="false"] .toggle-menu-button').find('.menu-toggle-text').transition({ opacity: 0 });

				$('#slide-out-menu-area').stop(true).transition({ x: '0px' },700,'easeInOutCubic').addClass('open');	

			} else if ( $('#slide-out-menu-area').hasClass( 'puma-content-push-from-right' ) ) {

				$('#header-outer').addClass('frontzI'); 

				$('.fullscreen-wrap, main.wrapper, .fullscreen-container, #header-outer').stop(true).transition({ x: '-340px' },700,'easeInOutCubic');

				if ( !navigator.userAgent.match(/(Android|iPod|iPhone|iPad|BlackBerry|IEMobile|Opera Mini)/) || $(window).width() <= 480 ) {
					$('#header-outer:not([data-menu-format="centered-logo"]) .col-md-3 #logo').stop(true).transition({ x: '-200px' },700,'easeInOutCubic');
				}
				
				$('#header-outer .toggle-menu-button:not(.toggle-menu-button-mobile)').stop(true).transition({ x: '85px' },700,'easeInOutCubic');
				
				//$('#header-outer .toggle-menu-button-mobile').stop(true).transition({ x: '-325px', y: '-50%' },700,'easeInOutCubic');
				
				$('#header-outer:not([data-menu-format="centered-logo"]) #logo, #header-outer[data-toggle-menu-pos="left"] .toggle-menu-button:not(.toggle-menu-button-mobile)').stop(true).transition({ x: '340px' },700,'easeInOutCubic');

				$('#header-outer[data-has-menu="false"] .toggle-menu-button').find('.menu-toggle-text').transition({ opacity: 0 });

				$('#slide-out-menu-area').stop(true).transition({ x: '0px' },700,'easeInOutCubic').addClass('open');	

			} else if ( $('#slide-out-menu-area').hasClass( 'fullscreen' ) ) {
				$('#slide-out-menu-area.fullscreen').fadeIn('normal', function() {
					$(this).addClass('open');
				});
				$('#slide-out-menu-area-bg').addClass('open');
				$('#header-outer').addClass('dark-slide');
			}

			$(this).removeClass('closed').addClass('open');
			$('body').addClass('menu-open');
			
			$('#header-outer[data-menu-format="centered-logo"] .col-md-3 #logo').stop(true).transition({
				'opacity' : 0
			},700,'easeInOutCubic');

			//fade In BG Overlay
			$('#slide-out-menu-area-bg').css({'height':'100%','width':'100%'}).stop(true).transition({
				'opacity' : 1
			},700,'easeInOutCubic');
			
		}
		
		return false;
	});
	
	$(document).on('click', '.toggle-menu-button.open, #slide-out-menu-area-bg, .puma-close-btn', function() {
		
		if ( $(this).attr( 'data-has-target' ) === 'true' ) {
			
			var target = $(this).attr( 'data-target' );
			
			$('#puma-split-menu').stop(true).transition({ x: '-100%' },500,'easeInOutCubic');
			
			$('.fullscreen-wrap, #project-split').stop(true).transition({ x: '0' },500,'easeInOutCubic');
			
		} else {
			
			if ( $('#slide-out-menu-area').hasClass( 'puma-slide-out-menu' ) ) {
			
				$('#header-outer .toggle-menu-button').stop(true).transition({ x: '0px' },700,'easeInOutCubic');
				
				$('#header-outer[data-has-menu="false"] .toggle-menu-button').find('.menu-toggle-text').transition({ opacity: 1 });

				$('#slide-out-menu-area').stop(true).transition({ x: '360px' },700,'easeInOutCubic').removeClass('open');

			} else if ( $('#slide-out-menu-area').hasClass( 'puma-content-push-from-right' ) ) {

				$('#header-outer').removeClass('frontzI'); 

				$('.fullscreen-wrap, main.wrapper, .fullscreen-container, #header-outer').stop(true).transition({ x: '0px' },700,'easeInOutCubic');
				
				if ( !navigator.userAgent.match(/(Android|iPod|iPhone|iPad|BlackBerry|IEMobile|Opera Mini)/) || $(window).width() <= 480 ) {
					$('#header-outer .col-md-3 #logo').css('transform', 'none');
				}
				
				$('#header-outer .toggle-menu-button:not(.toggle-menu-button-mobile)').stop(true).transition({ x: '0' },700,'easeInOutCubic');
				
				//$('#header-outer .toggle-menu-button').stop(true).transition({ x: '0px' },700,'easeInOutCubic');
				
				$('#header-outer #logo, #header-outer[data-toggle-menu-pos="left"] .toggle-menu-button:not(.toggle-menu-button-mobile)').stop(true).transition({ x: '0' },700,'easeInOutCubic');

				$('#header-outer[data-has-menu="false"] .toggle-menu-button').find('.menu-toggle-text').transition({ opacity: 1 });

				$('#slide-out-menu-area').stop(true).transition({ x: '360px' },700,'easeInOutCubic').removeClass('open');

			} else if ( $('#slide-out-menu-area').hasClass( 'fullscreen' ) ) {
				$('#slide-out-menu-area.fullscreen').delay(100).removeClass('open').fadeOut('slow');
				$('#slide-out-menu-area-bg').removeClass('open');
				$('#header-outer').removeClass('dark-slide');
			}

			$('.toggle-menu-button').removeClass('open').addClass('closed');
			$('body').removeClass('menu-open');
			
			$('#header-outer[data-menu-format="centered-logo"] .col-md-3 #logo').stop(true).transition({
				'opacity' : 1
			},700,'easeInOutCubic');

			//fade Out BG Overlay
			$('#slide-out-menu-area-bg').stop(true).transition({
				'opacity' : 0
			},700,'easeInOutCubic',function() {
				$(this).css({'height':'1px','width':'1px'});
			});

		}
		
		return false;
		
	});
	
	function autoHeightBlogMetro() {
		var contentLg = $('.blog-metro .post.large'),
			content = $('.blog-metro .post:not(.large)'),
			winWidth = $(window).width();
		
		/*contentLg.css({
			width: Math.ceil( winWidth / 2 )
		});

		content.css({
			width: Math.ceil( winWidth / 4 )
		});*/
		
		contentLg.find('.content').css({
			height: contentLg.width()
		});

		$('.blog-metro .post:not(.large) .content').css({
			height: contentLg.find('.content').width() / 2
		});
	}
	autoHeightBlogMetro();

	// Magnific
	if ( $('.galleries').length > 0 ) {
		$('.galleries').each(function() {
			$(this).magnificPopup({
				type:'image',
				delegate: 'a.magnific',
				mainClass: 'mfp-zoom-in',
				fixedContentPos: false,
				callbacks: {
					elementParse: function(item) {
						if($(item.el.context).is('[href]') && $(item.el.context).attr('href').indexOf('iframe=true') != -1) {
							 item.type = 'iframe';
						} else {
							 item.type = 'image';
						}
					},

					imageLoadComplete: function()  {	
						var $that = this;
						setTimeout( function() { $that.wrap.addClass('mfp-image-loaded'); }, 10);
					},

					beforeOpen: function() {
					   this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
					},

					open: function() {

						$.magnificPopup.instance.next = function() {
							var $that = this;

							this.wrap.removeClass('mfp-image-loaded');
							setTimeout( function() { $.magnificPopup.proto.next.call($that); }, 100);
						}

						$.magnificPopup.instance.prev = function() {
							var $that = this;

							this.wrap.removeClass('mfp-image-loaded');
							setTimeout( function() { $.magnificPopup.proto.prev.call($that); }, 100);
						}

					}
				},
				removalDelay: 400, 
				gallery: {
					enabled:true
				}
			});
		});
	}

	// Isotope
	if ($('.p-isotope').length > 0) {

        var $container = $('.p-isotope-grid');

        // init Isotope
        var $grid = $('.grid').isotope({
            itemSelector: '.grid-item',
            percentPosition: true,
            masonry: {
                columnWidth: '.grid-sizer'
            }
        });
        // layout Isotope after each image loads
        $grid.imagesLoaded().progress(function() {
            $grid.isotope('layout');
        });

        // filter items when filter link is clicked
        $('.p-isotope-filter a').on('click', function() {
            var selector = $(this).attr('data-filter');
            $container.isotope({
                filter: selector
            });
            return false;
        });

        $('.p-isotope-filter a').on('click', function() {
            $('.p-isotope-filter').find('.active').removeClass('active');
            $(this).addClass('active');
        });
		
    }

   	// Sticky nav
	$(window).scroll(function() {
		var windowScroll = $(window).scrollTop();
		if ( windowScroll > 0 ) {
			$('body').addClass('nav-scrolling');
			$('#header-outer.nav-static').addClass('nav-sticky');
			$('#header-outer[data-has-topbar="true"] > .top-bar').slideUp(200);
			$('#header-outer[data-has-topbar="true"] > [class*="container"]').addClass('ht-pd');
		} else {
			$('body').removeClass('nav-scrolling');
			$('#header-outer.nav-static').removeClass('nav-sticky');
			$('#header-outer[data-has-topbar="true"] > .top-bar').slideDown(200);
			$('#header-outer[data-has-topbar="true"] > [class*="container"]').removeClass('ht-pd');
		}
	});

	// Price Filter
	if ( $( ".price_slider" ).length > 0 ) {
		$( ".price_slider" ).slider({
			range: true,
			min: 0,
			max: 60,
			values: [ 10, 50 ],
			slide: function( event, ui ) {
				$( ".price_label" ).find('.from').html( "$" + ui.values[0] );
				$( ".price_label" ).find('.to').html( "$" + ui.values[1] );
			}
		});
		$( ".price_label" ).find('.from').html( "$" + $( ".price_slider" ).slider( "values", 0 ) );
		$( ".price_label" ).find('.to').html( "$" + $( ".price_slider" ).slider( "values", 1 ) );
	}
	
	// Video Player
	if ( $('.video-cover').length > 0 ) {
		$('.video-cover').each(function(i, el) {
			
			var $that = $(this);
			
			var background_img_holder_div = $(el).children('.background-image-holder');
			var video_img_holder = background_img_holder_div.find('img');
			var video_img_holder_url = video_img_holder.attr('src');
			
			var video = $(el).find('iframe');
				
			if ( video_img_holder.length > 0 ) {
				background_img_holder_div.css( {
					'background-image': 'url('+video_img_holder_url+')',
					'opacity': 1
				} );
			}
			$(el).on('click', ' .play-btn a', function() {
				
				if ( $that.data('video') !== 'popup' ) {
					video.attr( 'src', video.data('src') + '?rel=0&amp;showinfo=0&autoplay=1' );
					$(el).addClass('reveal-video');
					return false;
				}
				
			});
			
		});
	}
	
	// Fullpage
	var $standAnimatedColTimeout = [];
	var $fullscreenSelector = '';
	var $disableFPonMobile = ($('#puma_fullscreen-page[data-mobile-disable]').length > 0) ? $('#puma_fullscreen-page').attr('data-mobile-disable') : 'off';
	var $onMobileBrowser = navigator.userAgent.match(/(Android|iPod|iPhone|iPad|BlackBerry|IEMobile|Opera Mini)/);

	if(!$onMobileBrowser) { $disableFPonMobile = 'off'; }
	
	if( $('#puma_fullscreen-page').length > 0 && $disableFPonMobile != 'on' ) {
		
		function setFPNavColoring(index,direction) {

			if ( $('#puma_fullscreen-page').data('scrollbar') != true ) {
					if( $('#puma_fullscreen-page > .section:nth-child('+index+')').find('.puma-fp-content.light').length > 0 ) {
					$('#fp-nav').addClass('light-controls');

					if(direction == 'up')
						$('#header-outer.dark-slide').removeClass('dark-slide');
					else
						setTimeout(function(){ $('#header-outer.dark-slide').removeClass('dark-slide'); },520);
				} else {
					$('#fp-nav.light-controls').removeClass('light-controls');

					if(direction == 'up')
						$('#header-outer').addClass('dark-slide');
					else
						setTimeout(function() { $('#header-outer').addClass('dark-slide'); },520);
				}
			} else {
				$('#header-outer').addClass('dark-logo');
			}

		}
		
		var $names = [];

		function setFPNames() {
			$names = [];
			$('#puma_fullscreen-page > .section').each(function(i) {
				//name checks
				if( $(this).attr('data-name') != undefined && $(this).attr('data-name').length ) {
					$names.push($(this).attr('data-name'));
				} else {
					$names.push(' ');
				}

			});
		}
		setFPNames();

		function PumaFPinit() {

			$fullscreenSelector = '.section.active ';

			$('#puma_fullscreen-page').each(function(i) {

				var $fpPuma = $(this);

				var slideNav = $fpPuma.data('slide-nav'),
					scrollBar = $fpPuma.data('scrollbar'),
					autoScrolling = $fpPuma.data('auto-scroll'),
					navigation = $fpPuma.data('nav'),
					scrollOverflow = $fpPuma.data('scroll-overflow');

				$fpPuma.fullpage({
					sectionSelector: '.section',
					slidesNavigation: slideNav,
					slideSelector: '.slide',
					scrollBar: scrollBar,
					autoScrolling: autoScrolling,
					fitToSection: false,
					navigation: navigation,
					scrollingSpeed: 1500,
					easingcss3: 'cubic-bezier(0.23, 1, 0.32, 1)',
					scrollOverflow: scrollOverflow,
					navigationPosition: 'right',
					navigationTooltips: $names,
					afterLoad: function(anchorLink, index, slideAnchor, slideIndex) {
						$('.section:not(:nth-child('+index+')) .fp-scrollable').each(function() {
							var scrollable = $(this).data('iscrollInstance');
							scrollable.scrollTo(0,0);
						});

						var $sectionRow_id = $('#puma_fullscreen-page > .section:nth-child('+index+')').attr('id');

						if ( $sectionRow_id && $('#puma_fullscreen-page > .section:nth-child('+index+')').length > 0 ) {
							waypoints();
							if(!navigator.userAgent.match(/(Android|iPod|iPhone|iPad|BlackBerry|IEMobile|Opera Mini)/)) {
								resetWaypoints();
								Waypoint.destroyAll();
							}
						}
					},
					onLeave: function(index, nextIndex, direction) { 
						setFPNavColoring(nextIndex, direction);
					},
					afterSlideLoad (anchorLink, index, slideAnchor, slideIndex) {
						waypoints();
					},
					onSlideLeave: function(anchorLink, index, slideIndex, direction, nextSlideIndex) {
						resetWaypoints();
					}
				});
			});


		}
		
		if ( $('#puma_fullscreen-page').length > 0 ) {
			PumaFPinit();
		}

		if($('#puma_fullscreen-page').length > 0) {
			if($('#fp-nav.tooltip_alt').length == 0) setFPNavColoring(1,'na');
		}
	
	} else if($('#puma_fullscreen-page').length > 0 && $disableFPonMobile == 'on' || $().fullpage && $disableFPonMobile == 'on') {
		//remove markup
		$('html,body').css({'height':'auto','overflow-y':'auto'});
	}
	
	function resetWaypoints() {
		//$('.is-animated.animated-in, [class*="col-"].is-animated.animated-in').css({'transition':'none'});
		
		//$('.is-animated.animated-in, [class*="col-"].is-animated.animated-in').animate({'transition':'none'}, 1000);
		
		$('img.img-with-animation.animated-in').css({'opacity':'0','transform':'none'}).removeClass('animated-in');
		
		$('.is-animated.animated-in, [class*="col-"].is-animated.animated-in').css({'opacity':'0','transform':'none','left':'auto','right':'auto'}).removeClass('animated-in');	
		
		$('.is-animated, [class*="col-"].is-animated, div.is-animated').each(function(i) {
			//clear previous timeout (needed for fullscreen rows)
			clearTimeout($standAnimatedColTimeout[i]); 
		});
	}
	
	function cascadingImageBGSizing() {
		$('.puma_cascading-images').each(function() {
			
			//handle max width for cascading images in equal height columns
			/*if($(this).parents('.vc_row-o-equal-height').length > 0 && $(this).parents('.wpb_column').length > 0) 
				$(this).css('max-width',$(this).parents('.wpb_column').width());*/

			//set size for layers with no images
			$(this).find('.bg-color').each(function() {
				var $bgColorHeight = 0;
				var $bgColorWidth = 0;
				if($(this).parent().find('.img-wrap').length == 0) {
					var $firstSibling = $(this).parents('.cascading-image').siblings('.cascading-image[data-has-img="true"]').first();

					$firstSibling.css({'position':'relative', 'visiblity':'hidden'});
					$bgColorHeight = $firstSibling.find('.img-wrap').height();
					$bgColorWidth = $firstSibling.find('.img-wrap').width();
					if($firstSibling.index() == 0) {
						$firstSibling.css({'visiblity':'visible'});
					} else {
						$firstSibling.css({'position':'absolute', 'visiblity':'visible'});
					}
				} else {
					$bgColorHeight = $(this).parent().find('.img-wrap').height();
					$bgColorWidth = $(this).parent().find('.img-wrap').width();
				}

				$(this).css({'height': $bgColorHeight / 2,'width': $bgColorWidth / 2 });
			});
		});
	}
	cascadingImageBGSizing();
	
	/*
	 * Special Food Menu
	 */
	function specialFoodMenu() {
		var $foodItemOffsetPos = ($('#puma_fullscreen-page').length > 0) ? '100%' : '80%';
		$($fullscreenSelector+'.puma-food-menu-item').parent().each(function(i) {
			var $that = $(this);
			var waypoint = new Waypoint({
				element: $that,
				handler: function(direction) {
					
					$that.find('.puma-food-menu-item').each(function(i){

						var $that = $(this);

						setTimeout(function(){
							$that.addClass('animated-in');
						},i*150);

					});

					waypoint.destroy();
					
				},
				offset: $foodItemOffsetPos
			});
		});
	}
	
	/*
	 * Portfolio Animation
	 */
	function pumaPortfolioAnimate() {
		$($fullscreenSelector+'.p-isotope').each(function(i) {
			
			$(this).find('.grid-item').each(function(i){

				var $that = $(this);

				//not already visible
				var waypoint = new Waypoint({
					element: $that,
					handler: function(direction) {

						if($that.hasClass('animated-in')) { 
							 waypoint.destroy();
							 return;
						}
						
						var $portfolioAnimationDelay = 100;

						setTimeout(function(){
							$that.addClass("animated-in");
						},$portfolioAnimationDelay * $that.attr('data-delay-amount'));

						waypoint.destroy();
						
					},
					offset: '100%'

				}); //waypoint

			}); //each
			
		});
	}
	
	/*
	 * Puma Animation
	 */
	function pumaAnimations() {
		
		var $animOffsetPos = ($('#puma_fullscreen-page').length > 0) ? '200%' : '88%';
		
		/* Image Animation */
		$($fullscreenSelector+'img.img-with-animation').each(function() {
		
			var $that = $(this);
			var $animationEasing = 'easeOutSine';
			var $animationDuration = '650';

			var waypoint = new Waypoint({
				element: $that,
				 handler: function(direction) {
					 
					if($that.hasClass('animated-in')) { 
						 waypoint.destroy();
						return;
					}
					 
					 if(!navigator.userAgent.match(/(Android|iPod|iPhone|iPad|BlackBerry|IEMobile|Opera Mini)/)) {
						
						if($that.attr('data-animation') == 'fade-in-from-left'){
							$that.delay($that.attr('data-delay')).transition({
								'opacity' : 1,
								'x' : '0px'
							},$animationDuration, $animationEasing);
						} else if($that.attr('data-animation') == 'fade-in-from-right'){
							$that.delay($that.attr('data-delay')).transition({
								'opacity' : 1,
								'x' : '0px'
							},$animationDuration, $animationEasing);
						} else if($that.attr('data-animation') == 'fade-in-from-bottom'){
							$that.delay($that.attr('data-delay')).transition({
								'opacity' : 1,
								'y' : '0px'
							},$animationDuration, $animationEasing);
						} else if($that.attr('data-animation') == 'fade-in') {
							$that.delay($that.attr('data-delay')).transition({
								'opacity' : 1
							},$animationDuration, $animationEasing);	
						} else if($that.attr('data-animation') == 'grow-in') {
							setTimeout(function(){ 
								$that.transition({ scale: 1, 'opacity':1 },$animationDuration,$animationEasing);
							},$that.attr('data-delay'));
						}
						else if($that.attr('data-animation') == 'flip-in') {
							setTimeout(function(){ 
								$that.transition({  rotateY: 0, 'opacity':1 },$animationDuration, $animationEasing);
							},$that.attr('data-delay'));
						}
						else if($that.attr('data-animation') == 'flip-in-vertical') {
							setTimeout(function(){ 
								$that.transition({  rotateX: 0, 'opacity':1 },$animationDuration, $animationEasing);
							},$that.attr('data-delay'));
						}

						$that.addClass('animated-in');
					}
					waypoint.destroy();

				  },
				  offset: $animOffsetPos
			});



		});
		
		/* Cascading Image Animation */
		$($fullscreenSelector+'.puma_cascading-images').each(function() {
			
			var $that = $(this);
			var $animationEasing = 'easeOutSine';
			var $animationDuration = '1650';
			var $animationDelay = ($(this).is('[data-animation-timing]')) ? $(this).attr('data-animation-timing') : 400;
			$animationDelay = parseInt($animationDelay);
			
			var waypoint = new Waypoint({
				element: $that,
				 handler: function(direction) {

				 	if(!navigator.userAgent.match(/(Android|iPod|iPhone|iPad|BlackBerry|IEMobile|Opera Mini)/)) {
						
						$that.find('.cascading-image').each(function(i) {

							var $that2 = $(this);

							if($that2.attr('data-animation') == 'flip-in' || $that2.attr('data-animation') == 'flip-in-vertical') {
								setTimeout(function(){
									$that2.find('.inner-wrap').css({
										'opacity' : 1,
										'transform' : 'rotate(0deg) translateZ(0px)'
									});
								}, i* $animationDelay);
							} else {
								setTimeout(function(){
									$that2.find('.inner-wrap').css({
										'opacity' : 1,
										'transform' : 'translateX(0px) translateY(0px) scale(1,1) translateZ(0px)'
									});
								}, i* $animationDelay);
							}


						});

						$that.addClass('animated-in');
						
					}
					 
					waypoint.destroy();

				  },
				  offset: $animOffsetPos
			});

		});
		
		/* Animation */
		$($fullscreenSelector+'.is-animated').each(function(i) {
			
			var $that = $(this);
			var $animationEasing = 'easeOutSine';
			var $animationDuration = '650';
			
			var waypoint = new 	Waypoint({
				element: $that,
				handler: function(direction) {
					
					if($that.hasClass('animated-in')) { 
						waypoint.destroy();
						return;
					}
					
					if(!navigator.userAgent.match(/(Android|iPod|iPhone|iPad|BlackBerry|IEMobile|Opera Mini)/)) {

						if($that.attr('data-animation') == 'fade-in-from-left'){
							$standAnimatedColTimeout[i] = setTimeout(function(){ 
								$that.transition({
									'opacity' : 1,
									'x' : '0px'
								},$animationDuration,$animationEasing);
							},$that.attr('data-delay'));
						} else if($that.attr('data-animation') == 'fade-in-from-right'){
							$standAnimatedColTimeout[i] = setTimeout(function(){ 
								$that.transition({
									'opacity' : 1,
									'x' : '0px'
								},$animationDuration,$animationEasing);
							},$that.attr('data-delay'));
						} else if($that.attr('data-animation') == 'fade-in-from-bottom'){
							$standAnimatedColTimeout[i] = setTimeout(function(){ 
								$that.transition({
									'opacity' : 1,
									'y' : '0px'
								},$animationDuration,$animationEasing);
							},$that.attr('data-delay'));
						} else if($that.attr('data-animation') == 'fade-in') {
							$standAnimatedColTimeout[i] = setTimeout(function(){ 
								$that.transition({
									'opacity' : 1
								},$animationDuration,$animationEasing);	
							},$that.attr('data-delay'));
						} else if($that.attr('data-animation') == 'grow-in') {
							$standAnimatedColTimeout[i] = setTimeout(function(){ 
								$that.transition({ scale: 1, 'opacity':1 },$animationDuration,$animationEasing);
							},$that.attr('data-delay'));
						} else if($that.attr('data-animation') == 'flip-in') {
							$standAnimatedColTimeout[i] = setTimeout(function(){ 
								$that.transition({  rotateY: 0, 'opacity':1 },$animationDuration, $animationEasing);
							},$that.attr('data-delay'));
						} else if($that.attr('data-animation') == 'flip-in-vertical') {
							$standAnimatedColTimeout[i] = setTimeout(function(){ 
								$that.transition({  rotateX: 0, y: 0, 'opacity':1 },$animationDuration, $animationEasing);
							},$that.attr('data-delay'));
						}

						$that.addClass('animated-in');
					
					}

					waypoint.destroy();

			  },
			  offset: $animOffsetPos
			});
		});
	
	}

	function waypoints() {
		pumaAnimations();
		specialFoodMenu();
		//pumaPortfolioAnimate();
	}
	waypoints();
	
	// Window Resize
	$(window).resize(function() {
		fullscreen_wrap_init();
		puma_full_height_init();
		resizeFormBox();
		autoHeightBlogMetro();
		cascadingImageBGSizing();
	});
	
	var $winTop,
		scroll = $('#scroll'),
		$winHeight = $(window).height(),
		$docHeight = $(document).height();
	
	// Mouse Icon Click
	$(document).on('click', '.scroll-downs', function() {
		var $that = $(this);
		$('html, body').animate({ scrollTop: $winHeight - $('#header-outer').height() }, 800);
		return false;
	});
	
	// Page Scroll
	if ( $('#scroll').length > 0 ) {
		
		var $footerTop = $('#p-stream-footer').offset().top
		
		$(window).on('scroll', function() {
			
		 	$winTop = $(window).scrollTop();
			
			if ( $winTop + $winHeight >= $footerTop ) {
				scroll.removeClass('scroll-down').addClass('scroll-up text-white');
				$('.puma-floating-text, .puma-share-stream').fadeOut();
			} else {
				scroll.removeClass('scroll-up text-white').addClass('scroll-down');
				$('.puma-floating-text, .puma-share-stream').fadeIn();
			}
			
		});
		
		$(document).on('click', '#scroll', function() {
			
			var $that = $(this);
			
			if ( $(this).hasClass('scroll-down') ) {
				
				$('html, body').animate({ scrollTop: $winHeight + $docHeight }, 1500, function() {
					$that.removeClass('scroll-down').addClass('scroll-up');
				});
				
			} else if( $(this).hasClass('scroll-up') ) {
				
				$('html, body').animate({ scrollTop: 0 }, 1500, function() {
					$that.removeClass('scroll-up').addClass('scroll-down');
				});
				
			}
			
			return false;
		});
	}
	
	// Custom Scrollbar
	var $customScrollbar = $('#puma-split-menu .puma-split-menu-col .puma-navigation-container');
	if( $customScrollbar.length > 0 ) {
		$customScrollbar.mCustomScrollbar({
			scrollInertia: 120
		});
	}
	
	// Datepicker
	if ( $('.b-date').length > 0 ) {
		$('.b-date').datepicker();
	}
	
	/*
	 * Menu
	 */
	
	var dropMenuToggle = $('.puma-navigation li').has('ul.puma-submenu').children('a');
	dropMenuToggle.on('click', function() {
		dropMenuToggle.not(this).closest('li').find('ul').slideUp(200);
		$(this).closest('li').children('ul').slideToggle(200);
		return false;
	});
	
	if ( $( '#dl-menu' ).length > 0 ) {
		$( '#dl-menu' ).dlmenu();
	}
	
})(jQuery);