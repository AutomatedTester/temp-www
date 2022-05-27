
    (function($) {
        "use strict";
        
    
    // --------------------- Add .active class to current navigation based on URL
    var pgurl = window.location.href.substr(window.location.href.lastIndexOf("/")+1);
          $(".doc-sideNav a").each(function(){
          if($(this).attr("href") == pgurl || $(this).attr("href") == '' )
          $(this).addClass("active");
        })

            $(".btn-toggle-nav li a").click(function () {
              if ($(this).hasClass("active")) {
                $(".btn-toggle-nav li a").removeClass("active");
              }
              else {
                $(".btn-toggle-nav li a").removeClass("active");
                $(this).addClass("active");
              }
            });

            if (window.matchMedia('(max-width: 768px)').matches)
            {
                $('ul.nav .btn-toggle-nav li a').click(function () {
                  $('#doc-sidebar-nav').css('display', 'none');
                });

                $('.btn.btn-link').click(function () {
                  $('#doc-sidebar-nav').css('display', 'block');
                });

                $('.navbar-nav .nav-item').click(function () {
                  $('#navbartop').css('display', 'none');
                });

                $('.navbar-toggler').click(function () {
                  $('#navbartop').css('display', 'block');
                });
            }
        
    })(jQuery);