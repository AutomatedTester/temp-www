(function(global) {
  var app = new domino.App({
    throw_exceptions : true,
    views_path : '/js/app/',
    routes: [
      {
        "route" : "/api/:method_name.html",
        "defaults" : {
          "controller" : "api",
          "action"     : "method"
        }
      },

      {
        "route" : "/guide/:section/",
        "defaults" : {
          "controller" : "guide",
          "action"     : "section"
        }
      },

      {
        "route" : "/guide/:section/:pageName.html",
        "defaults" : {
          "controller" : "guide",
          "action"     : "page"
        }
      },

      {
        "route" : "/blog/:articleTitle.html",
        "defaults" : {
          "controller" : "blog",
          "action"     : "page"
        }
      }
    ]
  });

  $(function() {
    app.init();
  });
})(window);
