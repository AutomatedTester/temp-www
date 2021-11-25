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
  var sidenavData = {
    '': [],
    expect: [],
    pageobject: [],
    commands: []
  };
  var sidenavReady = false;

  function populateSidenavData(container) {
    Object.keys(sidenavData).forEach(function(key, index) {
      $(container + ' .bs-sidebar li:nth-child(' + (index + 1) + ') ul li').each(function(i, el) {
        var element = el.firstChild;
        var entry = [];

        if (element && element && element.tagName && element.tagName.toLocaleLowerCase() === 'h5') {
          entry.push('h5');
          element = element.firstElementChild || {innerHTML: element.innerHTML};
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
    this.sourcecolor = this.initHelper('sourcecolor');

    if (sidenavReady) {
      return;
    }

    if ($('#apimethod-container').is(':visible')) {
      populateSidenavData('#apimethod-container');
    }

    populateSidenavData('#api-container');
  };

  function api(view_script, scollspy) {
    view_script.$container = '#api-container';

    this.initHelper('transition').render(function() {
      if (scollspy) {
        this.initHelper('bs.scrollspy').render({
          target : '#api-container .bs-sidebar',
          offset : 280,
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
    var sidebar = domino.views.sidebar.build('api', 'commands', function() {
      return sidenavData.commands;
    });
    var data = sidebar.data;

    $('#apimethod-container .bs-sidebar').html(sidebar.content);
    this.initHelper('sidebar').render('#apimethod-container');

    var scrollTarget = '#apimethod-container .bs-sidenav > li:nth-child('+ data.nthChildIndex +')';
    this.initHelper('bs.scrollspy').render({
      target : scrollTarget,
      offset : 85
    });

    window.scrollTo(0, 0);
    domino.views.getSectionData('');

    domino.views.currentView = '$method';
    view_script.$container = '#apimethod-container';
    document.title = (this.$scope && this.$scope.methodName ? this.$scope.methodName + ' | ' : '') + 'API Reference | Nightwatch.js';
    this.transition.render();

    setTimeout(function() {
      if (this.$scope) {
        if ($('ul li[name="'+ this.$scope.methodName +'"]').length > 0) {
          var $top = $('ul li[name="'+ this.$scope.methodName +'"]')[0].offsetTop - 200;
          if ($top > 100) {
            $('#protocol-menu')[0].scrollTop = $top;
          }
        }
      }
    }.bind(this), 100);


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

