(function(global) {
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
              ['#install-microsoftedge', 'Microsoft Webdriver'],
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
            ['#microsoft-webdriver', 'Microsoft WebDriver']
          ]
        }
      }
    },
    guide: {
      title: 'Developer Guide',
      content: {
        '': {
          title: '',
          nthChildIndex: 1,
          linkTitle: 'Using Nightwatch',
          sidenavData: [
            ['#writing-tests', 'Writing Tests'],
            ['#finding-amp-interacting-with-elements', 'Finding &amp; Interacting with Elements'],
            ['#writing-assertions', 'Writing Assertions'],
            ['#using-bdd-describe-beta-', 'Using BDD describe'],
            ['#using-es6-async-await-beta-', 'Using ES6 Async/Await'],
            ['#using-xpath-selectors', 'Using Xpath'],
            ['#expect-assertions', 'BDD Expect Assertions'],
            ['#using-before-each-and-after-each-hooks', 'Test Hooks'],
            ['#asynchronous-before-each-and-after-each-', 'Asynchronous Test Hooks'],
            ['#external-globals', 'External Globals']
          ]
        },

        'running-tests': {
          title: 'Running Tests | ',
          nthChildIndex: 2,
          linkTitle: 'Running Tests',
          sidenavData: [
            ['#nightwatch-runner', 'Nightwatch Runner'],
            ['#command-line-options', 'Command-line Options'],
            ['#test-environments', 'Test Environments'],
            ['#test-groups', 'Test Groups'],
            ['#test-tags', 'Test Tags'],
            ['#disabling-tests', 'Disabling Tests'],
            ['#parallel-running', 'Parallel Running'],
            ['#using-mocha', 'Using Mocha'],
            ['#programmatic-api', 'Programmatic API']
          ]
        },

        'extending-nightwatch': {
          title: 'Extending Nightwatch | ',
          nthChildIndex: 3,
          linkTitle: 'Extending Nightwatch',
          sidenavData: [
            ['#writing-custom-commands', 'Custom commands'],
            ['#writing-custom-assertions', 'Custom assertions'],
            ['#custom-reporter', 'Custom reporter']
          ]
        },

        'working-with-page-objects': {
          title: 'Working with Page Objects | ',
          nthChildIndex: 4,
          linkTitle: 'Working with Page Objects',
          sidenavData: [
            ['#using-page-objects', 'Using Page Objects'],
            ['#defining-elements', 'Defining Elements'],
            ['#element-properties', 'Element Properties'],
            ['#defining-sections', 'Defining Sections'],
            ['#writing-commands', 'Writing Commands']
          ]
        },

        'unit-testing-with-nightwatch': {
          title: 'Unit Testing | ',
          nthChildIndex: 4,
          linkTitle: 'Unit Testing',
          sidenavData: [
            ['#writing-unit-tests', 'Writing Unit Tests'],
            ['#asynchronous-unit-tests', 'Asynchronous Tests'],
            ['#using-a-combined-configuration', 'Using a Combined Configuration'],
            ['#code-coverage', 'Code Coverage']
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
            ['#support-us', 'Support Nightwatch'],
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

  domino.views.__buildSidebar = function(mainSection, subSection, contentFn) {
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

        for (var i = 0; i < sectionData.sidenavData.length; i++) {
          sidenavContent.push('<li>');

          content = sectionData.sidenavData[i];

          if (content.length === 3 && !Array.isArray(content[2])) {
            sidenavContent.push('<h5><a href="' + content[1] +'">'+ content[2] +'</a></h5>');
          } else {
            sidenavContent.push('<a href="' + content[0] +'">'+ content[1] + '</a>');

            if (Array.isArray(content[2])) {
              sidenavContent.push('<ul class="nav">');

              content[2].forEach(function(data) {
                sidenavContent.push('<li><a href="' + data[0] +'">'+ data[1] +'</a></li>');
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

      html.push('<li' + (subSection === sectionName ? ' class="active"' : '') + '><a href="/'+ mainSection +'/' +
        sectionName + (sectionName ? '/': '') + '">'+ sectionData.linkTitle +'</a>' +
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

  var app = new domino.App({
    throw_exceptions : true,
    views_path : '/js/app/',
    routes : [
      {
        "route" : "/api/:method_name.html",
        "defaults" : {
          "controller" : "api",
          "action"     : "method"
        }
      }

    ]
  });

  $(function() {
    app.init();
  });
})(window);
