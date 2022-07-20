domino.controllers.define('api', function($api, $protocol) {
  this.indexAction = function() {
    //this.$view.methods = $api.getAll();
    //this.$view.api = $protocol.getAll();
  };

  this.expectAction = function() {};
  this.commandsAction = function() {};
  this.pageobjectAction = function() {};

  this.methodAction = function() {

    this.$view.methodName = this.params.method_name;
  };
});

domino.views.define('api', function(view) {
  this.init = function() {
    this.transition = this.initHelper('transition');
    this.sourcecolor = this.initHelper('sourcecolor');

    $('#api-container .bs-sidebar>ul.bs-sidenav').on('show.bs.collapse', function(ev) {
      var sectionUrl = ev.target.getAttribute('data-section-url');
      var state = {};

      try {
        window.history.replaceState(state, "Title", sectionUrl);
        var popStateEvent = new PopStateEvent('popstate', {state: state});
        dispatchEvent(popStateEvent);
      } catch (err) {}

    });

  };

  function renderApiPage(view_script, params, cb) {

    view_script.$container = '#api-container';
    view_script.no_render = true;
    var sectionContainer = $('#api-container');
    var subSection = params.sectionName;
    var fileName = '/js/app/sections/api';
    var docsContainer = sectionContainer.find('.docs-section');
    var subSectionContainer = sectionContainer.find('.docs-section[data-page-uri^="/api/'+ subSection +'"]');

    var expandButton = sectionContainer.find('ul li button[data-bs-target="#' + subSection + '-collapse"]');
    var isMenuExpanded = String(expandButton.attr('aria-expanded'));
    if (isMenuExpanded !== 'true') {
      expandButton.attr('aria-expanded', 'true');
      $('#' + subSection + '-collapse').addClass('show');
    }

    var innerSectionFromHash = document.location.hash.substring(1);
    var element = $('#' + innerSectionFromHash);
    if (element.length === 1) {
      $([document.documentElement, document.body]).animate({
        scrollTop: element.offset().top - 90
      }, 200);
    }
    
    if (subSectionContainer.is(':visible')) {
      return;
    }

    var subSectionPath = subSection === 'index' ? '' : subSection;
    var mainSection = 'api';
    document.title = 'API Reference | Nightwatch.js';

    this.initHelper('transition').render(null, {
      pathname: true,
      fadeIn: false,
      currentSectionPath: '/api/index'
    });

    if (document.documentElement.getAttribute('data-uri') != '/api/' + subSectionPath) {
      document.documentElement.setAttribute('data-uri', '/api/' + subSectionPath);
    }


    docsContainer.attr('data-page-uri', '/api/' + subSection);
    domino.views.getSectionData(mainSection);
    domino.views.currentView = mainSection + subSection;
    window.scrollTo(0, 0);

    var self = this;

    if (subSection) {
      fileName += '/' + subSection;
    }

    var contentElement = $('#api-container .docs-section .page-content');
    fileName += '.txt';

    $.get(fileName, function(data) {
      contentElement.html(data);

      self.initHelper('sourcecolor').render();
      if (typeof cb == 'function') {
        cb();
      }
    });

  }

  function expandMenu(container) {
    $('ul.bs-sidenav div.collapse').removeClass('show');
    $('#'+container+'-collapse').prev().attr('aria-expanded', 'true');
    $('#'+container+'-collapse').addClass('show');
  }

  this.expectView = function(view_script) {
    renderApiPage.call(this, view_script, {
      sectionName: 'expect'
    });
  };

  this.commandsView = function(view_script) {
    renderApiPage.call(this, view_script, {
      sectionName: 'commands'
    });
  };

  this.pageobjectView = function(view_script) {
    renderApiPage.call(this, view_script, {
      sectionName: 'pageobject'
    });
  };

  this.useractionsView = function(view_script) {
    renderApiPage.call(this, view_script, {
      sectionName: 'useractions'
    });
  };

  this.indexView = function(view_script) {
    renderApiPage.call(this, view_script, {
      sectionName: 'index'
    });
  };

  this.ensureView = function(view_script) {
    renderApiPage.call(this, view_script, {
      sectionName: 'ensure'
    });
  };

  this.ensureView = function(view_script) {
    renderApiPage.call(this, view_script, {
      sectionName: 'ensure'
    });
  };

  this.elementView = function(view_script) {
    renderApiPage.call(this, view_script, {
      sectionName: 'element'
    });
  };

  this.programmaticView = function(view_script) {
    renderApiPage.call(this, view_script, {
      sectionName: 'programmatic'
    });
  };

  this.assertView = function(view_script) {
    renderApiPage.call(this, view_script, {
      sectionName: 'assert'
    });
  };

  this.methodView = function(view_script) {
    //this.initHelper('sidebar').render('#apimethod-container');
    expandMenu('commands');

    window.scrollTo(0, 0);
    domino.views.getSectionData('');
    domino.views.currentView = '$method';
    view_script.$container = '#apimethod-container';
    document.title = (this.$scope && this.$scope.methodName ? this.$scope.methodName + ' | ' : '') + 'API Reference | Nightwatch.js';

    this.transition.render();

    var self = this;
    $('body').on('DOMNodeInserted', '#apimethod-container', function listener(ev) {
      if (ev.target === $('#apimethod-container .jumbotron')[0]) {
        self.sourcecolor.render();
        $('body').off('DOMNodeInserted', '#apimethod-container');
      }
    });

    if (this.$scope && this.$scope.method && this.$scope.method.descr) {
      domino.views.metaTagEl.content = this.$scope.method.descr.replace(/<\/?[^>]+(>|$)/g, '') + ' | API Reference - Nightwatch.js';
    }

    if (document.documentElement.getAttribute('data-uri') != '/api/$method') {
      document.documentElement.setAttribute('data-uri', '/api/$method');
    }
  };
});

