domino.views.sidebar = new (function() {
  var __subSections__ = {
    gettingstarted: {
      title: 'Getting Started',
      extraContent: [
        '<div class="migrating-guide"><a target="_blank" href="https://github.com/nightwatchjs/nightwatch/wiki/Migrating-to-Nightwatch-1.0">Migrating from v0.9?</a></div>'
      ],
      content: {
        '': {
          title: '',
          nthChildIndex: 1,
          linkTitle: 'Overview',
          sidenavData: [
            ['#what-is-nightwatch-', 'What is Nightwatch?'],
            ['#overview-of-webdriver', 'Overview of WebDriver'],
            ['#theory-of-operation', 'Theory of Operation'],
            ['#nightwatch-selenium-server', 'Nightwatch &amp; Selenium Server']
          ]
        },

        'installation': {
          title: 'Installation | ',
          linkTitle: 'Installation',
          nthChildIndex: 2,
          sidenavData: [
            ['#install-node-js', 'Install Node.js'],
            ['#install-nightwatch', 'Install Nightwatch'],
            ['#install-webdriver', 'Install WebDriver', [
              ['#install-geckodriver', 'GeckoDriver'],
              ['#install-chromedriver', 'ChromeDriver'],
              ['#install-microsoftedge', 'Microsoft Edge Driver'],
              ['#install-safaridriver', 'SafariDriver']
            ]],
            ['#install-selenium-server', 'Install Selenium Server']
          ]
        },

        'configuration': {
          title: 'Configuration | ',
          linkTitle: 'Configuration',
          nthChildIndex: 3,
          sidenavData: [
            ['#nightwatch-json', 'nightwatch.json'],
            ['#base-settings', 'Base Settings'],
            ['#extended-settings', 'Extended Settings', [
              ['#test-runner-settings', 'Test Runner Settings'],
              ['#test-session-settings', 'Test Session Settings'],
              ['#filtering-settings', 'Filtering Settings'],
              ['#output-settings', 'Output Settings']
            ]],
            ['#webdriver-settings', 'WebDriver Settings'],
            ['#selenium-server-settings', 'Selenium Settings']
          ]
        },

        'concepts': {
          title: 'Concepts | ',
          linkTitle: 'Concepts',
          nthChildIndex: 4,
          sidenavData: [
            ['#defining-test-environments', 'Test Environments'],
            ['#using-test-globals', 'Globals']
          ]
        },

        'browser-drivers-setup': {
          title: 'Browser Drivers Setup | ',
          linkTitle: 'Browser Drivers Setup',
          nthChildIndex: 5,
          sidenavData: [
            ['#geckodriver', 'GeckoDriver (Firefox)'],
            ['#chromedriver', 'ChromeDriver'],
            ['#microsoft-webdriver', 'Edge Driver']
          ]
        }
      }
    },
    guide: {
      title: 'Developer Guide',
      content: {
        'using-nightwatch': {
          title: '',
          // link: '',
          nthChildIndex: 1,
          linkTitle: 'Using Nightwatch',
          baseUrl: '/guide/using-nightwatch/',
          sidenavData: [
            ['writing-tests.html', 'Writing Tests'],
            ['using-bdd-describe.html', 'Using BDD describe'],
            ['using-es6-async.html', 'Using ES6 async/await'],
            ['finding-and-interacting-with-elements.html', 'Finding &amp; Interacting with Elements'],
            ['writing-assertions.html', 'Writing Assertions'],
            ['expect-assertions.html', 'Using Expect Assertions'],
            ['using-xpath-selectors.html', 'Using XPath'],
            ['using-test-hooks.html', 'Test Hooks'],
            ['external-globals.html', 'External Globals']
          ]
        },

        'running-tests': {
          title: 'Running Tests | ',
          nthChildIndex: 2,
          linkTitle: 'Running Tests',
          baseUrl: '/guide/running-tests/',
          sidenavData: [
            ['nightwatch-runner.html', 'Nightwatch Runner'],
            ['command-line-options.html', 'Command-line Options'],
            ['test-environments.html', 'Test Environments'],
            ['test-groups.html', 'Test Groups'],
            ['test-tags.html', 'Test Tags'],
            ['parallel-running.html', 'Running in Parallel'],
            ['disabling-tests.html', 'Disabling / Skipping Tests'],
            ['programmatic-api.html', 'Programmatic API'],
            ['using-mocha.html', 'Using Mocha']
          ]
        },

        'extending-nightwatch': {
          title: 'Extending Nightwatch | ',
          nthChildIndex: 3,
          linkTitle: 'Extending Nightwatch',
          baseUrl: '/guide/extending-nightwatch/',
          sidenavData: [
            ['custom-commands.html', 'Custom commands'],
            ['custom-assertions.html', 'Custom assertions'],
            ['custom-reporter.html', 'Custom reporter'],
            ['using-with-selenium-webdriver.html', 'Using with selenium-webdriver'],
            ['using-with-webdriverio.html', 'Using with WebdriverIO']
          ]
        },

        'working-with-page-objects': {
          title: 'Working with Page Objects | ',
          nthChildIndex: 4,
          baseUrl: '/guide/working-with-page-objects/',
          linkTitle: 'Working with Page Objects',
          sidenavData: [
            ['using-page-objects.html', 'Using Page Objects'],
            ['defining-elements.html', 'Defining Elements'],
            ['defining-sections.html', 'Defining Sections'],
            ['writing-commands.html', 'Page-specific Custom Commands']
          ]
        },

        'unit-testing-with-nightwatch': {
          title: 'Unit Testing with Nightwatch | ',
          nthChildIndex: 4,
          linkTitle: 'Unit Testing with Nightwatch',
          baseUrl: '/guide/unit-testing-with-nightwatch/',
          sidenavData: [
            ['writing-unit-tests.html', 'Writing Unit Tests']
          ]
        }
      }
    },
    api: {
      title: 'API Reference',
      content: {
        '': {
          title: '',
          nthChildIndex: 1,
          linkTitle: 'Assert',
          sidenavData: []
        },
        'expect': {
          title: 'Expect | ',
          nthChildIndex: 2,
          linkTitle: 'Expect',
          sidenavData: []
        },
        'pageobject': {
          title: 'Page Object | ',
          nthChildIndex: 3,
          linkTitle: 'Page Object',
          sidenavData: []
        },
        'commands': {
          title: 'API Commands | ',
          nthChildIndex: 4,
          linkTitle: 'API Commands',
          sidenavData: []
        }
      }
    },

    about: {
      title: 'About',
      content: {
        '': {
          title: '',
          nthChildIndex: 1,
          linkTitle: 'About Nightwatch',
          sidenavData: [
            ['#motivation', 'Motivation'],
            ['#roadmap', 'Roadmap'],
            ['#the-team', 'The Team']
          ]
        },

        'contribute': {
          title: 'Contributing | ',
          nthChildIndex: 2,
          linkTitle: 'Contributing',
          sidenavData: [
            // ['#contributing-guidelines', 'Contributing Guidelines'],
            // ['#writing-docs', 'Writing Docs &amp; Examples'],
            // ['#become-a-contributor', 'Become a Contributor']
          ]
        },

        'community': {
          title: 'Community Resources | ',
          nthChildIndex: 3,
          linkTitle: 'Community Resources',
          sidenavData: [
            ['#community-assistance', 'Getting Assistance'],
            ['#community-articles', 'Articles & Guides'],
            ['#community-projects', 'Open-source Projects']
          ]
        }
      }
    }
  };

  this.build = function(mainSection, subSection, contentFn) {
    var html = ['<ul class="nav bs-sidenav">'];

    var sections = __subSections__[mainSection];
    var sectionData;
    var sidenavContent;
    var content;

    Object.keys(sections.content).forEach(function(sectionName) {
      sectionData = sections.content[sectionName];
      sidenavContent = [];

      if (subSection === sectionName) {
        if (sectionData.sidenavData.length === 0 && contentFn) {
          sectionData.sidenavData = contentFn();
        }

        sidenavContent.push('<ul class="nav">');
        var baseUrl = sectionData.baseUrl || '';
        for (var i = 0; i < sectionData.sidenavData.length; i++) {
          sidenavContent.push('<li class="nav-item">');

          content = sectionData.sidenavData[i];

          if (content.length === 3 && !Array.isArray(content[2])) {
            sidenavContent.push('<h5><a class="nav-link" href="' + baseUrl + content[1] +'">'+ content[2] +'</a></h5>');
          } else {
            sidenavContent.push('<a class="nav-link" href="' + baseUrl +  content[0] +'">'+ content[1] + '</a>');

            if (Array.isArray(content[2])) {
              sidenavContent.push('<ul class="nav">');

              content[2].forEach(function(data) {
                sidenavContent.push('<li class="nav-item"><a class="nav-link" href="' + baseUrl +  data[0] +'">'+ data[1] +'</a></li>');
              });

              sidenavContent.push('</ul>');
            }
          }

          sidenavContent.push('</li>');
        }
        sidenavContent.push('</ul>');
      } else {
        sidenavContent = [];
      }

      var subsectionLink = typeof sectionData.link == 'undefined' ? sectionName : sectionData.link;
      html.push('<li' + (subSection === sectionName ? ' class="active"' : '') + '><a href="/'+ mainSection +'/' +
        subsectionLink + (subsectionLink ? '/': '') + '">'+ sectionData.linkTitle +'</a>' +
        sidenavContent.join('') + '</li>');
    });

    if (Array.isArray(sections.extraContent)) {
      Array.prototype.push.apply(html, sections.extraContent);
    }

    html.push('</ul>');

    return {
      data: sections.content[subSection],
      title: sections.title,
      content: html.join('')
    }
  };

})();
