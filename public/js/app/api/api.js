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
  };

  function api(view_script, scollspy) {
    view_script.$container = '#api-container';

    this.initHelper('transition').render(function() {
      if (scollspy) {
        this.initHelper('sourcecolor').render();
        //this.initHelper('sidebar').render('#api-container');
      }
    }, view_script);
  }

  function expandMenu(container) {
    $('ul.bs-sidenav div.collapse').removeClass('show');
    $('#'+container+'-collapse').prev().attr('aria-expanded', 'true');
    $('#'+container+'-collapse').addClass('show');
  }

  this.expectView = function(view_script) {
    expandMenu('expect');
    domino.views.__runSubSection.call(this, view_script, 'api', 'expect', false);
  };

  this.commandsView = function(view_script) {
    expandMenu('commands');

    domino.views.__runSubSection.call(this, view_script, 'api', 'commands', false);
  };

  this.pageobjectView = function(view_script) {
    expandMenu('pageobject');
    domino.views.__runSubSection.call(this, view_script, 'api', 'pageobject', false);
  };

  this.indexView = function(view_script) {
    domino.views.__runSubSection.call(this, view_script, 'api', '', false);
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

