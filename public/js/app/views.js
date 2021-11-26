domino.views.currentView = '';
domino.views.metaTagEl = document.getElementsByTagName('meta')[1];
domino.views.metaTagContent = domino.views.metaTagEl.content;

domino.views.metaTagTwitterImg = $('meta[name="twitter:image"]').attr('content');

domino.views.sections = ['index', 'about', 'api', 'releases', 'guide', 'blog'];
domino.views.__sectionsData__ = {};

domino.views.getSectionData = function(currentView) {
  domino.views.sections.forEach(function(section) {
    if (section !== currentView && !domino.views.__sectionsData__[section]) {
      $.get('/js/app/sections/' + section + '.txt', function(data) {
        domino.views.__sectionsData__[section] = data;
        $('#' + section + '-container').html(data);

        setTimeout(function() {
          Prism.highlightAll();
        }, 0);
      });
    }
  });
};

domino.views.define('index', function(view) {
  this.indexView = function(view_script) {
    if (domino.views.currentView == 'index') {
      return;
    }

    var videoContainer = $('#video-container');
    window.setTimeout(function() {
      if (videoContainer.is(':empty')) {
        videoContainer.html('<iframe src="https://player.vimeo.com/video/376838936?loop=1&byline=0&portrait=0&title=0" ' +
          'style="width:100%;height:560px" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>');
      }
    }, 500);

    domino.views.getSectionData('index');
    view_script.no_render = true;
    view_script.$container = '#index-container';
    document.title = 'Nightwatch.js | Node.js powered End-to-End testing framework';

    this.initHelper('transition').render();
    domino.views.currentView = 'index';
    document.documentElement.setAttribute('data-uri', '/');
  };

});

$('[data-page-uri="/gettingstarted/installation"] table').on('click', 'a', function(ev) {
  ev.stopPropagation();
});

domino.views.__runSubSection = function(view_script, mainSection, subSection, contentFn) {
  var sectionPath = subSection;
  if (sectionPath !== '') {
    sectionPath = '/' + sectionPath;
  }

  if (domino.views.currentView == mainSection + sectionPath) {
    return;
  }

  window.scrollTo(0, 0);
  domino.views.getSectionData(mainSection);

  var sidebar = domino.views.sidebar.build(mainSection, subSection, contentFn);
  var data = sidebar.data;

  view_script.$container = '#'+ mainSection +'-container';
  view_script.no_render = true;
  document.title = sidebar.title + ' | Nightwatch.js';

  this.initHelper('transition').render(null, {
    pathname: '/' + mainSection,
    fadeIn: false,
    currentSectionPath: '/' + mainSection
  });

  $('#' + mainSection + '-container .bs-sidebar').html(sidebar.content);

  var scrollTarget = '#'+ mainSection + '-container .bs-sidenav > li:nth-child('+ data.nthChildIndex +')';

  this.initHelper('bs.scrollspy').render({
    target : scrollTarget,
    offset : 85
  });

  this.initHelper('sidebar').render('#' + mainSection + '-container');

  domino.views.currentView = mainSection + sectionPath;
  if (document.documentElement.getAttribute('data-uri') != '/' + mainSection + sectionPath) {
    document.documentElement.setAttribute('data-uri', '/' + mainSection + sectionPath);
  }
};

domino.views.define('about', function(view) {
  this.contributeView = function(view_script) {
    domino.views.__runSubSection.call(this, view_script,  'about', 'contribute');
  };

  this.indexView = function(view_script) {
    domino.views.__runSubSection.call(this, view_script, 'about', '');
  };

  this.communityView = function(view_script) {
    domino.views.__runSubSection.call(this, view_script, 'about', 'community');
  };

});

domino.views.define('releases', function(view) {

  this.init = function() {};

  this.indexView = function(view_script) {
    if (domino.views.currentView == 'releases') {
      return;
    }
    domino.views.getSectionData('releases');
    view_script.$container = '#releases-container';
    view_script.no_render = true;
    document.title = 'Releases | Nightwatch.js';

    this.initHelper('transition').render();
    this.initHelper('bs.scrollspy').render({
      target : '#releases-container .bs-sidebar',
      offset : 50
    });

    this.initHelper('sidebar').render('#releases-container');

    domino.views.currentView = 'releases';
    if (document.documentElement.getAttribute('data-uri') != '/releases') {
      document.documentElement.setAttribute('data-uri', '/releases');
    }
  };

});

domino.viewhelpers.define('sidebar', function() {

  this.init = function() {
    this.sideBar = null;
  };

  this.render = function(container) {
  };

});

domino.viewhelpers.define('bs.scrollspy', function() {
  this.init = function(element) {
    element = element || $(document.body);
    if (!(element instanceof jQuery)) {
      element = $(element);
    }
    this.spyElem = element;
  };

  this.render = function(opts) {
    if (this.spyElem.data('bs.scrollspy')) {
      $(opts.target).off('click');
      this.spyElem.data('bs.scrollspy', null);
    }

    $(opts.target).on('click', 'a', function(ev) {
      ev.stopPropagation();
    });

    this.spyElem.scrollspy(opts);
  };
});


domino.viewhelpers.define('sourcecolor', function() {
  this.render = function(element) {
    setTimeout(function() {
      Prism.highlightAll();
    }, 0);
  };
});

domino.viewhelpers.define('transition', function() {
  this.render = function(callback, opts) {
    var pathname = location.pathname;
    var currentSectionPath = '/';

    opts = opts || {};
    if (opts.pathname && opts.currentSectionPath) {
      currentSectionPath = opts.currentSectionPath;
    } else if (pathname !== '/') {
      var parts = pathname.split('/');
      parts.shift();
      parts = parts.map(function(a){
        return a.replace(/.+\.html$/,'$method')
      }).reduce(function(prev, val) {
        if (val) {
          prev.push(val);
        }
        return prev;
      }, []);

      currentSectionPath = '/' + parts.join('/');
    }

    var $view = this.view;
    var currentSection = $('section[data-page-uri]:visible');
    var element = $('section[data-page-uri="'+ currentSectionPath +'"]');

    if (currentSection.get(0) === element.get(0)) {
      if (typeof callback == 'function') {
        opts.render = function renderModified() {
          callback.call($view);
        };
      }
      return;
    }

    currentSection.hide();
    window.scrollTo(0, 0);
    if (opts.fadeIn || typeof opts.fadeIn == 'undefined') {
      element.fadeIn('normal', function() {
        if (typeof callback == 'function') {
          return callback.call($view);
        }
      });
    } else {
      element.show();
      if (callback) {
        callback.call($view);
      }
    }

  };
});

let scrollpos = window.scrollY;
const header = document.querySelector('nav');
const headerHeight = 70;

$('#bd-versions').on('click', function(e) {
  e.preventDefault();
});
$('a.local-nav').on('click', function(e) {
  e.stopPropagation();
});


$('.survey-banner-beta button.close').on('click', function() {
  if (window.localStorage) {
    window.localStorage.setItem('v2-beta-banner-shown', '1');
    $('body').removeClass('banner-visible');
  }
});

window.addEventListener('scroll', function() {
  scrollpos = window.scrollY;

  if (scrollpos >= headerHeight) {
    document.body.classList.add('navbar-visible');
  } else {
    document.body.classList.remove('navbar-visible');
  }
});
