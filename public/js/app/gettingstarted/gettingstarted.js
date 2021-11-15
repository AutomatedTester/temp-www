domino.views.define('gettingstarted', function(view) {
  var __page_data = '';
  function onPageRendered(sectionName) {
    this.initHelper('sourcecolor').render();
    var sidebar = domino.views.sidebar.build('gettingstarted', sectionName);
    var container = $('#gettingstarted-container');

    container.find('.bs-sidebar').html(sidebar.content);
    container.scrollspy('dispose');
    container.scrollspy({target: '#gettingstarted-container .bs-sidebar'});
  }

  function getCurrentHref() {
    var href = document.location.href;
    var hashIndex = href.indexOf('#');

    if (hashIndex === -1) {
      return href;
    }

    return href.substring(0, hashIndex);
  }

  function needsPageData(currentSection) {
    var pathname = document.location.pathname;
    if (pathname.charAt(0) === '/') {
      pathname = pathname.substring(1);
    }
    var sections = pathname.split('/');

    return sections[0] !== currentSection;
  }

  function renderPage(view_script, sectionName) {
    view_script.no_render = true;
    var currentUri = document.location.protocol + '//' + document.location.hostname + (document.documentElement.getAttribute('data-uri') || '');
    var newHref = getCurrentHref();

    if (newHref === currentUri) {
      // the page is already loaded, no need for a transition
      onPageRendered.call(this, sectionName);
      return;
    }

    sectionName = sectionName || '';
    var currentUriAttr = sectionName ? (sectionName + '/') : '';
    var sectionContainer = $('#gettingstarted-container');
    var docsContainer = sectionContainer.find('.docs-section[data-page-uri="/gettingstarted/'+ currentUriAttr +'"]');

    // the location.href has changed, update the page-uri attribute
    var newUriAttr = '/gettingstarted/' + sectionName;
    if (document.documentElement.getAttribute('data-uri') !== newUriAttr) {
      document.documentElement.setAttribute('data-uri', newUriAttr);
    }

    domino.views.currentView = 'gettingstarted' + (sectionName === '' ? '' : ('/' + sectionName))  + '/';
    window.scrollTo(0, 0);

    if (!__page_data && needsPageData('gettingstarted')) {
      var fileName = '/js/app/sections/gettingstarted.txt';
      var self = this;

      $.get(fileName, function(data) {
        __page_data = data;
        $('#gettingstarted-container').html(data);
        onPageRendered.call(self, sectionName);
      });
    } else {
      onPageRendered.call(this, sectionName);
    }

  }

  $('#gettingstarted-container').bind('click', '.bs-sidebar', function(ev) {
    var element = $(ev.target);
    if (element.hasClass('nav-link')) {
      ev.stopPropagation();
    }
  });

  this.installationView = function(view_script) {
    renderPage.call(this, view_script,  'installation');
  };

  this.indexView = function(view_script) {
    renderPage.call(this, view_script, '');
  };

  this.configurationView = function(view_script) {
    renderPage.call(this, view_script, 'configuration');
  };

  this.conceptsView = function(view_script) {
    renderPage.call(this, view_script, 'concepts');
  };

  this['browser-drivers-setupView'] = function(view_script) {
    renderPage.call(this, view_script, 'browser-drivers-setup');
  };
});
