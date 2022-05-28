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
  var defaultSection = 'overview';

  function renderRightSideBar() {
    var rightSideNav = $('#guide-container .right-side-nav');
    rightSideNav.html('<div class="wrapper"><nav class="main-side-nav"></nav></div>');

    $('#guide-container .docs-section h3').each(function(index, el) {
      var element = $(el);
      var id = element.attr('id');
      var text = element.text();

      rightSideNav.find('nav').append('<a class="nav-link" href="#'+ id +'">'+ text +'</a></li>');
    });
  }

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

    $('#guide-container .docs-section').show();
    $('#guide-container .bs-sidenav a').removeClass('active');

    renderRightSideBar();
    clearFilterList();

    if (locationHrefNoHash === currentUri) {
      // the page is already loaded, no need for a transition
      if (hashChange) {
        if (cb) {
          cb();
        }
      } else {
        renderSideBar.call(this, fileName, currentUriAttr, subSection, pageName, cb);
      }
      firstRender = false;
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
        buildSideBar.call(self, 'guide', 'overview');
      }

      renderRightSideBar();
      renderCodeTabs();
      $('#sidebar-filter').keyup(filterSidebar);

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

  function setupMouseUpActions() {
    $(document).mouseup(function(e) {
      var container = $(".filter-container");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        clearFilterList();
      }
    });
  }

  function setupKeyUpActions() {
    if(this.keyupActionsSet) {
      return;
    } else {
      this.keyupActionsSet = true;
    }

    $('body').on('keyup',function(e){
      let active_el;
      switch(e.which) {
        case 38: // up
          active_el = $('#guide-container .filter-list a.keyactive');
          active_el.removeClass('keyactive');
          if (active_el.index() < 0) {
            break;
          } else {
            let prev_el = active_el.parent().prev();
            active_el = prev_el.length > 0 ? prev_el.children().first() : active_el;
          }
          active_el.addClass('keyactive');
          break;
        case 40: // down
          active_el = $('#guide-container .filter-list a.keyactive');
          active_el.removeClass('keyactive');
          if (active_el.index() < 0) {
            active_el = $('#guide-container .filter-list a').first();
          } else {
            let next_el = active_el.parent().next();
            active_el = next_el.length > 0 ? next_el.children().first() : active_el;
          }
          active_el.addClass('keyactive');
          break;
        case 13: // Enter
          active_el = $('#guide-container .filter-list a.keyactive');
          active_el.click();
          break;
        default: return;
      }
      e.preventDefault();
    });
  }

  function renderSideBar(fileName, dataUri, subSection, pageName, cb) {
    var dataSectionUrl = '/guide/' + subSection + '/';
    var sectionElement = $('[data-section-url="'+ dataSectionUrl + '"]');
    sectionElement.addClass('show');

    var parentSectionElement = sectionElement.parents('div.collapse');

    var buttonEl;
    if (parentSectionElement.length > 0) {
      parentSectionElement.addClass('show');
      buttonEl = parentSectionElement.prev();
    } else {
      buttonEl = sectionElement.prev();
    }

    buttonEl.attr('aria-expanded', 'true');

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

      renderRightSideBar();
      renderCodeTabs();
      $('#sidebar-filter').keyup(filterSidebar);

      if (subSection && pageName) {
        var linkElement = $('#doc-sidebar-nav li a[href="'+ dataUri +'"]');
        if (linkElement.length) {
          linkElement.addClass('active');
          var button = linkElement.closest('.collapse').prev();
          button.attr('aria-expanded', 'true');
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

  function renderCodeTabs() {
    let snippets = $('.sample-test');

    for (let i = 0; i < snippets.length; i++) {
      let snippet = $(snippets[i]);

      let javascriptEl = snippet.find('[data-language="javascript"]');
      let typescriptEl = snippet.find('[data-language="typescript"]');

      if (typescriptEl.length > 0) {
        let tabs = $(`<nav class="nav nav-tabs" role="tablist">
                    <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#javascript${i}" type="button" role="tab" aria-controls="javascript" aria-selected="true">JavaScript</button>
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#typescript${i}" type="button" role="tab" aria-controls="typescript" aria-selected="false">TypeScript</button>
                  </nav>`);

        let javascriptElWrapper = $(`<div class="tab-pane show active" id="javascript${i}" role="tabpanel" aria-labelledby="javascript-tab"></div>`);
        let typescriptElWrapper = $(`<div class="tab-pane" id="typescript${i}" role="tabpanel" aria-labelledby="typescript-tab"></div>`);

        javascriptElWrapper.append(javascriptEl);
        typescriptElWrapper.append(typescriptEl);

        let tabContent = $(`<div class="tab-content"></div>`);
        tabContent.append(javascriptElWrapper);
        tabContent.append(typescriptElWrapper);

        snippet.html(tabs);
        snippet.append(tabContent);

        setTimeout(function() {
          Prism.highlightAll();
        }, 100);
      }

    }
  }

  function clearFilterList() {
    $('#sidebar-filter').val('');
    $('.filter-list').empty();
    $('.filter-list').removeClass('d-block');
  }

  function filterSidebar(event) {
    // prevent up, down and enter keys
    if (event.which === 38 || event.which === 40 || event.which === 13) {
      return;
    }

    var niddle = event.target.value;
    if (niddle === '' || niddle === null) {
      clearFilterList();
      return;
    }

    let links = $('#guide-container .bs-sidenav li>a');
    let titles = new Array(links.length);
    for(let i = 0; i < links.length; i++) {
      titles[i] = {title: links[i].innerHTML, el: links[i]};
    }

    let result = fuzzysort.go(niddle, titles, {key:'title', limit: 5});

    let filetered_links = result.map(e => e.obj.el);
    filetered_links = $(filetered_links).clone();
    $('.filter-list').empty()
    $('.filter-list').append(filetered_links);
    filetered_links.wrap("<li></li>");
    $('.filter-list').addClass('d-block');
  }

  function buildSideBar(mainSection, subSection) {
    return;
    // var sidebar = domino.views.sidebar.build(mainSection, subSection);
    // $('#' + mainSection + '-container .bs-sidebar').html(sidebar.content);
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

    setupMouseUpActions();
    setupKeyUpActions();
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
