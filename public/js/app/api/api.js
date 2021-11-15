domino.controllers.define('api', function($api, $protocol) {
  this.indexAction = function() {
    //this.$view.methods = $api.getAll();
    //this.$view.api = $protocol.getAll();
  };

  this.expectAction = function() {};
  this.commandsAction = function() {};
  this.pageobjectAction = function() {};

  this.methodAction = function() {
    this.$view.methods = $api.getAll();
    this.$view.api = $protocol.getAll().result(function(data) {
      for (var section in data) {
        var items = data[section];
        for (var i = 0; i < items.length; i++) {
          if (items[i].name.toLowerCase() == this.params.method_name.toLowerCase()) {
            this.$view.method = items[i];
            this.$view.section = section;
            break;
          }
        }
      }
    });

    this.$view.methodName = this.params.method_name;
  };
});

domino.models.provide('api', function() {
  this.url = '/js/app/api/methods.json';
  this.getAll = this.$get(function(model) {
    this.dataType = 'json';
    this._id = 'methods-list';
    this.cacheresult = true;
  });
});

domino.models.provide('protocol', function() {
  this.url = '/js/app/api/output.json';
  this.getAll = this.$get(function(model) {
    this.dataType = 'json';
    this._id = 'protocol-list';
    this.cacheresult = true;
  });
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
    domino.views.getSectionData('api');

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

    if ($('#apimethod-container .container-carbon').length) {
      setTimeout(function() {
        this.sourcecolor.render();
      }.bind(this), 200);
    } else {
      var self = this;
      $('body').on('DOMNodeInserted', '#apimethod-container', function listener(ev) {
        if (ev.target === $('#apimethod-container .jumbotron')[0]) {
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

