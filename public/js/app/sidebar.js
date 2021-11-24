domino.views.sidebar = new (function() {
  var __subSections__ = {
    guide: {
      extraContent: [
        '<div class="migrating-guide"><a target="_blank" href="https://github.com/nightwatchjs/nightwatch/wiki/Migrating-to-Nightwatch-1.0">Migrating from v0.9?</a></div>'
      ],
      title: 'Developer Guide',
      content: {
        ////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////
        'getting-started': {
          title: 'Getting Started',
          // link: '',
          nthChildIndex: 1,
          linkTitle: 'Getting Started',
          baseUrl: '/guide/getting-started/',
          sidenavData: [
            ['introduction.html', 'Introduction', [
              ['introduction.html#what-is-nightwatch', 'What Is Nightwatch?'],
              ['introduction.html#theory-of-operation', 'How Does It Work?'],
              ['introduction.html#overview-of-webdriver', 'What is WebDriver?'],
              ['introduction.html#browser-support-table', 'Browser Support'],
              ['introduction.html#nightwatch-selenium-server', 'Nightwatch &amp; Selenium Server']
            ]],
            ['installation.html', 'Installing Nightwatch', [
              ['installation.html#install-node-js', 'Install Node.js'],
              ['installation.html#install-nightwatch', 'Install Nightwatch'],
              ['installation.html#install-webdriver', 'Install Browser Drivers']
            ]],
            ['quickstart.html', 'Quickstart Tutorial']
          ]
        },

        'configuration': {
          title: 'Configuration',
          // link: '',
          nthChildIndex: 1,
          linkTitle: 'Configuration',
          baseUrl: '/guide/configuration/',
          sidenavData: [
            ['overview.html', 'Overview', [
              ['overview.html#nightwatch-json', 'nightwatch.json'],
              ['overview.html#nightwatch-conf-js', 'nightwatch.conf.js']
            ]],

            ['defaults.html', 'Defaults'],

            ['settings.html', 'All Settings', [
              ['settings.html#base-settings', 'Base Settings'],
              ['settings.html#test-runner-settings', 'Test Runner Settings'],
              ['settings.html#test-session-settings', 'Test Session Settings'],
              ['settings.html#filtering-settings', 'Filtering Settings'],
              ['settings.html#output-settings', 'Output Settings'],
              ['settings.html#webdriver-settings', 'WebDriver Settings'],
              ['settings.html#selenium-server-settings', 'Selenium Settings']
            ]]
          ]
        },

        'using-nightwatch': {
          title: '',
          // link: '',
          nthChildIndex: 1,
          linkTitle: 'Using Nightwatch',
          baseUrl: '/guide/using-nightwatch/',
          sidenavData: [
            ['concepts.html', 'Core Concepts', [
              ['concepts.html#defining-test-environments', 'Test Environments'],
              ['concepts.html#using-test-globals', 'Test Globals']
            ]],

            ['finding-and-interacting-with-elements.html', 'Working with DOM Elements', [
              ['finding-and-interacting-with-elements.html#finding-amp-interacting-with-elements', 'Locating Elements'],
              ['finding-and-interacting-with-elements.html#element-properties', 'Element Properties'],
            ]],
            ['using-xpath-selectors.html', 'Using XPath'],
            ['using-test-hooks.html', 'Test Hooks', [
              ['using-test-hooks.html#asynchronous-test-hooks', 'Asynchronous Test Hooks']
            ]],
            ['external-globals.html', 'External Globals', [
              ['external-globals.html#global-test-settings', 'Global Test Settings'],
              ['external-globals.html#global-test-hooks', 'Global Test Hooks'],
              ['external-globals.html#global-reporter', 'Global Reporter']
            ]]
          ]
        },

        'writing-tests': {
          title: 'Writing Tests',
          // link: '',
          nthChildIndex: 1,
          linkTitle: 'Writing Tests',
          baseUrl: '/guide/writing-tests/',
          sidenavData: [
            ['using-exports.html', 'exports interface'],
            ['using-bdd-describe.html', 'describe() interface', [
              ['using-bdd-describe.html#overview', 'Overview'],
              ['using-bdd-describe.html#basic-example', 'Basic Example'],
              ['using-bdd-describe.html#complete-syntax', 'Complete BDD Syntax']
            ]],
            ['using-es6-async.html', 'Using ES6 async/await'],
            ['writing-assertions.html', 'Writing Assertions'],
            ['expect-assertions.html', 'Using .expect() assertions'],
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

        'browser-drivers-setup': {
          title: 'Browser Drivers Specific | ',
          nthChildIndex: 2,
          linkTitle: 'Browser Drivers Specific',
          baseUrl: '/guide/browser-drivers-setup/',
          sidenavData: [
            ['overview.html', 'Overview'],
            ['geckodriver.html', 'GeckoDriver (Firefox)'],
            ['chromedriver.html', 'ChromeDriver'],
            ['edgedriver.html', 'EdgeDriver'],
            ['safaridriver.html', 'SafariDriver']
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

    examples: {
      title: 'Examples',
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
