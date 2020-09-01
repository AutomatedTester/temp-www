domino.controllers.define('guide', function($guide) {
  this.indexAction = function() {
    console.log('INDEX ACTION', this.params)
  };

  this.sectionAction = function() {
    console.log('SECTION ACTION', this.params)

    this.$view.sectionName = this.params.section;
  };

  this.pageAction = function() {
    console.log('PAGE ACTION', this.params)
    this.$view.sectionName = this.params.section;
    this.$view.pageName = this.params.pageName;
  };
});

domino.views.define('guide', function(view) {

  function renderGuidePage(view_script, params, cb) {
    view_script.no_render = true;

    var renderCarbon = params.renderCarbon || typeof params.renderCarbon == 'undefined';
    var mainSection = 'guide';
    var sectionContainer = $('#'+ mainSection +'-container');
    var docsContainer = sectionContainer.find('.docs-section');
    var subSection = params.sectionName || '';
    var pageName = params.pageName || '';
    var sectionPath = subSection;
    var currentUriAttr = docsContainer.attr('data-page-uri') || '';

    var currentUri = document.location.protocol + '//' + document.location.hostname + currentUriAttr;

    if (sectionPath !== '') {
      sectionPath = '/' + sectionPath + '/';
    }

    domino.views.getSectionData(mainSection);

    if (document.location.href === currentUri) {
      // the page is already loaded, no need for a transition
      if (typeof cb == 'function') {
        cb();
      }
      return;
    }

    console.warn('currentUri', currentUri);

    var subSectionPath = '/' + mainSection + '/' + subSection;
    var subSectionTitle;

    if (subSection) {
      subSectionTitle = sectionContainer.find('.bs-sidebar a[href="'+subSectionPath+'/"]').text();
      sectionContainer.find('.page-header h2').text(subSectionTitle);
    }

    // else {
    //   subSectionTitle = sectionContainer.find('.bs-sidebar > ul > li > a').eq(0).text();
    //   sectionContainer.find('.page-header h2').text(subSectionTitle);
    // }

    // the location.href has changed, update the page-uri attribute
    var newUriAttr = subSectionPath + (pageName ? ('/' + pageName + '.html') : '');
    docsContainer.attr('data-page-uri', newUriAttr);
    if (document.documentElement.getAttribute('data-uri') !== newUriAttr) {
      document.documentElement.setAttribute('data-uri', newUriAttr);
    }

    domino.views.currentView = mainSection + subSection + '/' + pageName;
    window.scrollTo(0, 0);

    //getSectionData(mainSection);

    // this.transition.render('#guide-container', {
    //   currentSectionPath: '/guide' + subSection + (pageName ? ('/' + pageName + '.html'): '')
    // });

    if (renderCarbon) {
      this.initHelper('carbonad').render('#guide-container');
    }

    var self = this;
    var fileName = '/js/app/sections/guide';

    if (subSection) {
      fileName += '/' + subSection;
    }

    if (pageName) {
      fileName += '/' + pageName + '.txt';
    } else {
      fileName += '.txt';
    }

    $.get(fileName, function(data) {
      if (subSection) {
        $('#guide-container .docs-section .page-content').html(data);
      } else {
        $('#guide-container').html(data);
        buildSideBar.call(self, 'guide', 'using-nightwatch');
      }

      if (subSection && pageName) {
        $('#guide-container .bs-sidenav a[href="'+ newUriAttr +'"]').addClass('active');
      }

      self.initHelper('sourcecolor').render();
      if (typeof cb == 'function') {
        cb();
      }
      //self.initHelper('sidebar').render('#guide-container');
    });
  }

  function buildSideBar(mainSection, defaultSection) {
    var subSection = this.$scope && this.$scope.sectionName || defaultSection;
    var sidebar = domino.views.sidebar.build(mainSection, subSection);

    $('#' + mainSection + '-container .bs-sidebar').html(sidebar.content);
  }

  this.init = function() {
    $('section[data-page-uri]').hide();
    $('section[data-page-uri^="/guide"]').show();

    buildSideBar.call(this, 'guide', 'using-nightwatch');
  };

  this.pageView = function(view_script) {
    renderGuidePage.call(this, view_script, this.$scope || {});
  };

  this.sectionView = function(view_script) {
    view_script.no_render = true;

    console.log('SECTION VIEW', this.$scope)

    var currentUriAttr = document.documentElement.getAttribute('data-uri');
    var currentUri = document.location.protocol + '//' + document.location.hostname + currentUriAttr;

    if (document.location.href === currentUri) {
      $('#guide-container .bs-sidenav li.active ul li a:first').click();
    }
  };

  this.indexView = function(view_script) {
    console.log('INDEX VIEW', this.$scope)

    renderGuidePage.call(this, view_script, {
      renderCarbon: false
    }, function() {
      $('#guide-container .bs-sidenav li.active ul li a:first').click();
    });

    return;

    var mainSection = 'guide';
    var subSection = '';
    var sectionPath = subSection;
    if (sectionPath !== '') {
      sectionPath = '/' + sectionPath;
    }

    if (domino.views.currentView == mainSection + sectionPath) {
      return;
    }

    window.scrollTo(0, 0);
    getSectionData(mainSection);

    var sidebar = domino.views.sidebar.build(mainSection, subSection);
    view_script.$container = '#'+ mainSection +'-container';
    view_script.no_render = true;
    document.title = sidebar.title + ' | Nightwatch.js';

    this.initHelper('transition').render(null, {
      pathname: '/' + mainSection,
      fadeIn: false,
      currentSectionPath: '/' + mainSection
    });

    $('#' + mainSection + '-container .bs-sidebar').html(sidebar.content);
    this.initHelper('carbonad').render('#' + mainSection + '-container');

    domino.views.currentView = mainSection + sectionPath;
    if (document.documentElement.getAttribute('data-uri') != '/' + mainSection + sectionPath) {
      document.documentElement.setAttribute('data-uri', '/' + mainSection + sectionPath);
    }
  };

});

domino.models.provide('guide', function() {
  this.url = '/js/app/guide';
});
