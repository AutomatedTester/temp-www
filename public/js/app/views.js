domino.views.currentView = '';
domino.views.metaTagEl = document.getElementsByTagName('meta')[1];
domino.views.metaTagContent = domino.views.metaTagEl.content;

domino.views.metaTagTwitterImg = $('meta[name="twitter:image"]').attr('content');

domino.views.sections = ['index', 'gettingstarted', 'guide', 'about', 'api', 'releases'];
domino.views.__sectionsData__ = {};
function getSectionData(currentView) {
  domino.views.sections.forEach(function(section) {
    if (section !== currentView && !domino.views.__sectionsData__[section]) {
      $.get('/js/app/sections/' + section + '.txt', function(data) {
        domino.views.__sectionsData__[section] = data;
        $('#' + section + '-container').html(data);
        Prism.highlightAll();
      })
    }
  });
}

domino.views.define('index', function(view) {
  this.indexView = function(view_script) {
    if (domino.views.currentView == 'index') {
      return;
    }
    getSectionData('index');
    view_script.no_render = true;
    view_script.$container = '#index-container';
    document.title = 'Nightwatch.js | Node.js powered End-to-End testing framework';

    this.initHelper('transition').render();
    this.initHelper('carbonad').render('#index-container');
    domino.views.currentView = 'index';
    document.documentElement.setAttribute('data-uri', '/');
  };

});

$('.carbonad').on('click', 'a', function(ev) {
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
  getSectionData(mainSection);
  var sidebar = domino.views.__buildSidebar(mainSection, subSection, contentFn);
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
  this.initHelper('carbonad').render('#' + mainSection + '-container');

  domino.views.currentView = mainSection + sectionPath;
  if (document.documentElement.getAttribute('data-uri') != '/' + mainSection + sectionPath) {
    document.documentElement.setAttribute('data-uri', '/' + mainSection + sectionPath);
  }
};

domino.views.define('gettingstarted', function(view) {
  this.installationView = function(view_script) {
    domino.views.__runSubSection.call(this, view_script,  'gettingstarted', 'installation');
  };

  this.indexView = function(view_script) {
    domino.views.__runSubSection.call(this, view_script, 'gettingstarted', '');
  };

  this.configurationView = function(view_script) {
    domino.views.__runSubSection.call(this, view_script, 'gettingstarted', 'configuration');
  };

  this['browser-drivers-setupView'] = function(view_script) {
    domino.views.__runSubSection.call(this, view_script, 'gettingstarted', 'browser-drivers-setup');
  };
});

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

domino.views.define('guide', function(view) {

  this.init = function() {};

  this['running-testsView'] = function(view_script) {
    domino.views.__runSubSection.call(this, view_script, 'guide', 'running-tests');
  };

  this['extending-nightwatchView'] = function(view_script) {
    domino.views.__runSubSection.call(this, view_script, 'guide', 'extending-nightwatch');
  };

  this['working-with-page-objectsView'] = function(view_script) {
    domino.views.__runSubSection.call(this, view_script, 'guide', 'working-with-page-objects');
  };

  this['unit-testing-with-nightwatchView'] = function(view_script) {
    domino.views.__runSubSection.call(this, view_script, 'guide', 'unit-testing-with-nightwatch');
  };

  this.indexView = function(view_script) {
    domino.views.__runSubSection.call(this, view_script, 'guide', '');
  };

});

domino.views.define('api', function(view) {
  var sidenavData = {
    '': [],
    expect: [],
    pageobject: [],
    commands: []
  };
  var sidenavReady = false;

  function populateSidenavData() {
    Object.keys(sidenavData).forEach(function(key, index) {
      $('#api-container .bs-sidebar li:nth-child(' + (index + 1) + ') ul li').each(function(i, el) {
        var element = el.firstChild;
        var entry = [];

        if (element && element && element.tagName && element.tagName.toLocaleLowerCase() === 'h5') {
          entry.push('h5');
          element = element.firstChild;
        }

        var link = element.href || '';
        if (link) {
          link = link.substring(element.href.indexOf('#'));
        }
        entry.push(link, element.innerHTML);
        sidenavData[key].push(entry);
      });
    });
    sidenavReady = true;
  }

  this.init = function() {
    this.transition = this.initHelper('transition');
    this.carbonAds = this.initHelper('carbonad');
    this.sourcecolor = this.initHelper('sourcecolor');

    if (!sidenavReady) populateSidenavData();
  };

  function api(view_script, scollspy) {
    view_script.$container = '#api-container';

    this.initHelper('transition').render(function() {
      if (scollspy) {
        this.initHelper('bs.scrollspy').render({
          target : '#api-container .bs-sidebar',
          offset : 580,
          spyAttribute : 'data-spy'
        });

        this.initHelper('sourcecolor').render();
        this.initHelper('sidebar').render('#api-container');
      }
    }, view_script);
  }

  this.expectView = function(view_script) {
    domino.views.__runSubSection.call(this, view_script, 'api', 'expect', function() {
      return sidenavData.expect;
    });
  };

  this.commandsView = function(view_script) {
    domino.views.__runSubSection.call(this, view_script, 'api', 'commands', function() {
      return sidenavData.commands;
    });
  };

  this.pageobjectView = function(view_script) {
    domino.views.__runSubSection.call(this, view_script, 'api', 'pageobject', function() {
      return sidenavData.pageobject;
    });
  };

  this.indexView = function(view_script) {
    domino.views.__runSubSection.call(this, view_script, 'api', '', function() {
      return sidenavData[''];
    });
  };

  this.methodView = function(view_script) {
    window.scrollTo(0, 0);
    getSectionData('api');

    domino.views.currentView = '$method';
    view_script.$container = '#apimethod-container';
    document.title = (this.$scope && this.$scope.methodName ? this.$scope.methodName + ' | ' : '') + 'API Reference | Nightwatch.js';
    this.transition.render();

    setTimeout(function() {
      if ($('ul li[name="'+ this.$scope.methodName +'"]').length > 0) {
        var $top = $('ul li[name="'+ this.$scope.methodName +'"]')[0].offsetTop - 90;
        if ($top > 100) {
          $('#protocol-menu')[0].scrollTop = $top;
        }
      }
    }.bind(this), 100);

    if ($('#apimethod-container .carbonad').length) {
      setTimeout(function() {
        this.sourcecolor.render();
        this.carbonAds.render('#apimethod-container');
      }.bind(this), 200);
    } else {
      var self = this;
      $('body').on('DOMNodeInserted', '#apimethod-container', function listener(ev) {
        if (ev.target === $('#apimethod-container .jumbotron')[0]) {
          self.carbonAds.render('#apimethod-container');
          self.sourcecolor.render();
          $('body').off('DOMNodeInserted', '#apimethod-container');
        }
      });
    }

    if (this.$scope.method && this.$scope.method.descr) {
      domino.views.metaTagEl.content = this.$scope.method.descr.replace(/<\/?[^>]+(>|$)/g, '') + ' | API Reference - Nightwatch.js';
    }

    if (document.documentElement.getAttribute('data-uri') != '/api/$method') {
      document.documentElement.setAttribute('data-uri', '/api/$method');
    }
  };
});

domino.views.define('releases', function(view) {

  this.init = function() {};

  this.indexView = function(view_script) {
    if (domino.views.currentView == 'releases') {
      return;
    }
    getSectionData('releases');
    view_script.$container = '#releases-container';
    view_script.no_render = true;
    document.title = 'Releases | Nightwatch.js';

    this.initHelper('transition').render();
    this.initHelper('bs.scrollspy').render({
      target : '#releases-container .bs-sidebar',
      offset : 50
    });

    this.initHelper('sidebar').render('#releases-container');
    this.initHelper('carbonad').render('#releases-container');
    domino.views.currentView = 'releases';
    if (document.documentElement.getAttribute('data-uri') != '/releases') {
      document.documentElement.setAttribute('data-uri', '/releases');
    }
  };

});

domino.views.define('contact', function(view) {

  this.indexView = function(view_script) {
    if (domino.views.currentView == 'contact') {
      return;
    }
    getSectionData('contact');
    window.scrollTo(0, 0);
    view_script.$container = '#contact-container';
    view_script.no_render = true;
    document.title = 'Contact | Nightwatch.js';
    domino.views.metaTagEl.content = 'Contact - ' + domino.views.metaTagContent;
    this.initHelper('transition').render();
    this.initHelper('carbonad').render('#contact-container');
    domino.views.currentView = 'contact';
    if (document.documentElement.getAttribute('data-uri') != '/contact') {
      document.documentElement.setAttribute('data-uri', '/contact');
    }
  };

});

domino.viewhelpers.define('sidebar', function() {

  this.init = function() {
    this.sideBar = null;
  };

  this.render = function(container) {
    this.sideBar = $(container).find('.bs-sidebar');
    this.sideBar.affix({
      offset: {
        top: 280,
        bottom: 330
      }
    });
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

domino.viewhelpers.define('carbonad', function() {

  this.render = function(selector) {
    try {
      $('.carbonad').html('');
      $('#_carbonads_projs').remove();

      $('link').eq(5).nextAll('script').each(function() {
        if (this.src.indexOf('twitter.com') === -1) {
          $(this).remove();
        }
      })

      var carbonAd = document.createElement('script');
      carbonAd.async = true;
      carbonAd.setAttribute('type', 'text/javascript');
      carbonAd.setAttribute('id', '_carbonads_js');
    } catch (err) {

    }


    setTimeout(function() {
      carbonAd.setAttribute('src', 'https://cdn.carbonads.com/carbon.js?zoneid=1673&serve=C6AILKT&placement=nightwatchjsorg');
      carbonAd.setAttribute('crossorigin', 'anonymous');
      $(selector + ' .carbonad').append(carbonAd);
    }.bind(this), 0);
  };
});

domino.viewhelpers.define('transition', function() {
  this.render = function(callback, opts) {
    var pathname = location.pathname;
    var currentSectionPath = '/';

    opts = opts || {};
    if (opts.pathname && opts.currentSectionPath) {
      pathname = opts.pathname;
      currentSectionPath = opts.currentSectionPath;
    } else if (pathname != '/') {
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

      pathname = '/' + parts[0];
      currentSectionPath = '/' + parts.join('/');
    }

    var currentMenuItem = $('.navbar ul li.active');
    var activeMenuItem = $('.navbar ul li a[href="'+ pathname +'"]').parent();
    if (currentMenuItem !== activeMenuItem) {
      currentMenuItem.removeClass('active');
      activeMenuItem.addClass('active');
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
      if (callback) callback.call($view);
    }

  };
});

let scrollpos = window.scrollY;
const header = document.querySelector('nav');
const headerHeight = 70;

window.addEventListener('scroll', function() {
  scrollpos = window.scrollY;

  if (scrollpos >= headerHeight) {
    document.body.classList.add('navbar-visible');
  } else {
    document.body.classList.remove('navbar-visible');
  }
});
