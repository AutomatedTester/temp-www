$('body').on('click', 'section a[href^="#fn"]', function(e) {
  e.stopPropagation();
});

$('body').on('click', 'section a[href^="#ff"]', function(e) {
  e.stopPropagation();
});

domino.controllers.define('blog', function($guide) {
  this.indexAction = function() {
  };

  this.pageAction = function() {
    this.$view.articleTitle = this.params.articleTitle;
  };
});

domino.views.define('blog', function(view) {

  function renderBlogPage(view_script, params, cb) {
    view_script.no_render = true;

    var mainSection = 'blog';
    var sectionContainer = $('#'+ mainSection +'-container');
    var articleTitle = params.articleTitle || '';
    var locationHref = document.location.href.split('#')[0];

    var currentUriAttr = sectionContainer.attr('data-page-uri') || '';
    var currentUri = document.location.protocol + '//' + document.location.hostname + currentUriAttr;
    domino.views.getSectionData(mainSection);
    domino.views.currentView = mainSection + '/';

    sectionContainer[view_script.action === 'index' ? 'removeClass': 'addClass']('article');
    // the location.href has changed, update the page-uri attribute
    var newUriAttr = '/blog' + (articleTitle ? ('/article') : '');
    if (document.documentElement.getAttribute('data-uri') !== newUriAttr) {
      document.documentElement.setAttribute('data-uri', newUriAttr);
    }

    if (locationHref.charAt(locationHref.length - 1) !== '/') {
      locationHref = locationHref + '/';
    }

    if (currentUri.charAt(currentUri.length - 1) !== '/') {
      currentUri = currentUri + '/';
    }



    if (locationHref === currentUri) {
      // the page is already loaded, no need for a transition
      if (typeof cb == 'function') {
        cb();
      }
      return;
    }

    sectionContainer.attr('data-page-uri', document.location.pathname);

    window.scrollTo(0, 0);

    var self = this;
    var fileName = '/js/app/sections/blog';

    if (articleTitle) {
      fileName += '/' + articleTitle + '.txt';
    } else {
      fileName += '.txt';
    }

    $.get(fileName, function(data) {
      switch (view_script.action) {
        case 'index':
        case 'page':
          $('#'+ mainSection +'-container').html(data);
          break;
      }

      self.initHelper('sourcecolor').render();

      if (typeof cb == 'function') {
        cb();
      }
    });
  }

  function buildSideBar(mainSection, defaultSection) {
    var subSection = this.$scope && this.$scope.sectionName || defaultSection;
    var sidebar = domino.views.sidebar.build(mainSection, subSection);

    $('#' + mainSection + '-container .bs-sidebar').html(sidebar.content);
  }

  this.init = function() {
    $('section[data-page-uri]').hide();
    $('section[data-page-uri^="/blog"]').show();

    //buildSideBar.call(this, 'guide', 'using-nightwatch');
  };

  this.pageView = function(view_script) {
    view_script.action = 'page';
    renderBlogPage.call(this, view_script, this.$scope || {}, function() {

    });
  };

  this.indexView = function(view_script) {
    view_script.action = 'index';

    renderBlogPage.call(this, view_script, {
    });
  };

});

domino.models.provide('blog', function() {
  this.url = '/js/app/blog';
});
