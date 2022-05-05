domino.controllers.define('guide', function($guide) {
  this.indexAction = function() {
  };

  this.sectionAction = function() {
    this.$view.sectionName = this.params.section;
  };

  this.pageAction = function() {
    this.$view.sectionName = this.params.section;
    this.$view.pageName = this.params.pageName;
  };
});

domino.views.define('guide', function(view) {

  var mainSection = 'guide';
  var firstRender = true;
  var defaultSection = 'getting-started';

  function renderGuidePage(view_script, params, cb) {
    view_script.no_render = true;

    var mainSection = 'guide';
    var sectionContainer = $('#'+ mainSection +'-container');
    var docsContainer = sectionContainer.find('.docs-section');
    var subSection = params.sectionName || '';
    var pageName = params.pageName || '';
    var sectionPath = subSection;
    var currentUriAttr = docsContainer.attr('data-page-uri') || '';

    var currentUri = document.location.protocol + '//' + document.location.host + currentUriAttr;
    var innerSectionFromHash;
    var locationHrefNoHash = document.location.href;
    var hashChange = false;

    if (document.location.hash.length > 1) {
      locationHrefNoHash = locationHrefNoHash.substring(0, locationHrefNoHash.indexOf('#'));

      innerSectionFromHash = document.location.hash.substring(1);
      var element = $('#' + innerSectionFromHash);
      $('#guide-container ul li ul li ul li a.nav-link').removeClass('active');

      var linkElement = $('#guide-container a.nav-link[href$="#'+ innerSectionFromHash +'"]');
      linkElement.addClass('active');
      hashChange = !firstRender;

      if (element.length === 1) {
        $([document.documentElement, document.body]).animate({
          scrollTop: element.offset().top - 90
        }, 200);
      }
    }

    var fileName = '/js/app/sections/guide';
    var subSectionPath = '/' + mainSection + '/' + subSection;
    var subSectionTitle;

    domino.views.getSectionData(mainSection);
    firstRender = false;

    if (locationHrefNoHash === currentUri) {
      // the page is already loaded, no need for a transition
      if (hashChange) {
        if (cb) {
          cb();
        }
      } else {
        renderSideBar.call(this, fileName, currentUriAttr, subSection, pageName, cb);
      }

      return;
    }

    if (subSection) {
      subSectionTitle = sectionContainer.find('.bs-sidebar a[href="'+subSectionPath+'/"]').text();
      sectionContainer.find('.page-header h2').text(subSectionTitle);
    }

    // the location.href has changed, update the page-uri attribute
    var newUriAttr = subSectionPath + (pageName ? ('/' + pageName + '.html') : '');
    docsContainer.attr('data-page-uri', newUriAttr);
    if (document.documentElement.getAttribute('data-uri') !== newUriAttr) {
      document.documentElement.setAttribute('data-uri', newUriAttr);
    }

    domino.views.currentView = mainSection + subSection + '/' + pageName;
    window.scrollTo(0, 0);

    var self = this;

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
        buildSideBar.call(self, 'guide', 'getting-started');
      }

      if (subSection && pageName) {
        var linkElement = $('#guide-container .bs-sidenav a[href="'+ newUriAttr +'"]');

        if (linkElement.length) {
          linkElement.addClass('active');
        } else if (newUriAttr.indexOf('.html') > 0) {
          // var linkParts = newUriAttr.split('/');
          // linkParts.pop();
          // linkElement = $('#guide-container .bs-sidenav a[href="'+ (linkParts.join('/')) +'/"]');
          // linkElement.click();
          //
          // var listElementSibling = $('#guide-container .bs-sidenav a[href="'+ (linkParts.join('/')) +'/"]+ul');
          // if (listElementSibling.length) {
          //   listElementSibling.show();
          // }
        }
      }

      self.initHelper('sourcecolor').render();
      if (typeof cb == 'function') {
        cb();
      }
    });
  }

  function renderSideBar(fileName, dataUri, subSection, pageName, cb) {
    if (subSection) {
      fileName += '/' + subSection;
    }

    if (pageName) {
      fileName += '/' + pageName + '.txt';
    } else {
      fileName += '.txt';
    }
    var self = this;

    $.get(fileName, function() {
      buildSideBar.call(self, 'guide', subSection);

      if (subSection && pageName) {
        var linkElement = $('#guide-container .bs-sidenav a[href="'+ dataUri +'"]');
        if (linkElement.length) {
          linkElement.addClass('active');
        } else if (dataUri.indexOf('.html') > 0) {
          var linkParts = dataUri.split('/');
          linkParts.pop();
          linkElement = $('#guide-container .bs-sidenav a[href="'+ (linkParts.join('/')) +'/"]');
          //linkElement.click();

          // var listElementSibling = $('#guide-container .bs-sidenav a[href="'+ (linkParts.join('/')) +'/"]+ul');
          // if (listElementSibling.length) {
          //   listElementSibling.show();
          // }
        }
      }

      //self.initHelper('sourcecolor').render();
      if (typeof cb == 'function') {
        cb();
      }
    });
  }

  function buildSideBar(mainSection, subSection) {
    var sidebar = domino.views.sidebar.build(mainSection, subSection);
    $('#' + mainSection + '-container .bs-sidebar').html(sidebar.content);
  }

  this.init = function(view_script) {
    var subSection = this.$scope && this.$scope.sectionName || defaultSection;
    var subSectionContainer = $('#'+ mainSection +'-container').find('.docs-section');
    var currentUriAttr = subSectionContainer.attr('data-page-uri') || '';

    if (currentUriAttr === '/guide/' || document.location.pathname !== currentUriAttr) {
      $('section[data-page-uri]').hide();
      $('section[data-page-uri^="/guide"]').show();

      buildSideBar.call(this, mainSection, subSection);
    }
  };

  this.pageView = function(view_script) {
    renderGuidePage.call(this, view_script, this.$scope || {});
  };

  this.sectionView = function(view_script) {
    view_script.no_render = true;
    var currentUriAttr = document.documentElement.getAttribute('data-uri');
    var currentUri = document.location.protocol + '//' + document.location.host + currentUriAttr;

    if (document.location.href === currentUri) {
      $('#guide-container .bs-sidenav li.active ul li a:first').click();
    }
  };

  this.indexView = function(view_script) {
    renderGuidePage.call(this, view_script, {
      renderCarbon: false
    }, function() {
      $('#guide-container .bs-sidenav li.active ul li a:first').click();
    });
  };

});

domino.models.provide('guide', function() {
  this.url = '/js/app/guide';
});
