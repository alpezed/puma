
// Revolution Slider Init 

(function($){
    "use strict";
    
    $(document).ready(function() {
		
		$('.tp-banner').each(function() {
			
			var navType = $(this).data('nav-type') ? $(this).data('nav-type') : 'none';
			var startwidth = $(this).data('start-width') ? $(this).data('start-width') : 1920;
			var startheight = $(this).data('start-height') ? $(this).data('start-height') : 1020;
			var navigationArrows = $(this).data('nav-arrows');
			var fullscreen = $(this).data('fullscreen') ? $(this).data('fullscreen') : 'on';
		
			$(this).revolution({
				delay: 9000,
				startwidth: startwidth,
				startheight: startheight,
				hideThumbs: 10,

				navigationArrows: navigationArrows,
				navigationType: navType,
				navigationStyle: "puma",
				
				spinner: "spinner4",
				
				parallax: "mouse",
				parallaxBgFreeze: "off",
				parallaxLevels: [5,10,15,20,25,30,35,40,45,46,47,48,49,50,51,55],
				
				soloArrowLeftHOffset:60,	 // offset position from aligned position
				soloArrowLeftVOffset:60,	 // offset position from aligned position
				
				soloArrowRightHOffset:60,		// offset position from aligned position
				soloArrowRightVOffset:60,		// offset position from aligned position
				
				autoHeight: "off",
            	forceFullWidth: "off",
				
				fullWidth: "off",
				fullScreen: fullscreen,
				fullScreenOffsetContainer: ".pumaHeader",
			});
			
		});
		
    });
})(jQuery);
