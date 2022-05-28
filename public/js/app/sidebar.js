domino.views.sidebar = new (function() {
  var __subSections__ = {
    guide: {
      title: 'Developer Guide',
      content: {
        ////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////
        'overview': {
          title: 'Overview',
          // link: '',
          nthChildIndex: 1,
          linkTitle: 'Overview',
          baseUrl: '/guide/overview/',
          sidenavData: [
            ['what-is-nightwatch.html', 'What is Nightwatch?', [
              ['what-is-nightwatch.html#why-choose-nightwatch', 'Why choose Nightwatch?'],
              ['what-is-nightwatch.html#architecture-overview', 'Architecture overview'],
              ['what-is-nightwatch.html#supported-browsers', 'Supported browsers']
            ]],
            ['whats-new-in-v2.html', 'What’s new in v2.0?'],
          ]
        },

        'quickstarts': {
          title: 'Quickstarts ',
          // link: '',
          nthChildIndex: 1,
          linkTitle: 'Quickstarts',
          baseUrl: '/guide/quickstarts/',
          sidenavData: [
            ['create-and-run-a-nightwatch-test.html', 'Create and run a Nightwatch test', [
              ['create-and-run-a-nightwatch-test.html#install-nightwatch', 'Install Nightwatch'],
              ['create-and-run-a-nightwatch-test.html#install-browser-drivers', 'Install Browser Drivers'],
              ['create-and-run-a-nightwatch-test.html#run-a-demo-test', 'Run a demo test']
            ]],
            ['create-and-run-a-test-with-selenium-server.html', 'Create and run a test with Selenium Server', [
              ['create-and-run-a-test-with-selenium-server.html#install-selenium-server-standalone', 'Install Selenium Server Standalone'],
              ['create-and-run-a-test-with-selenium-server.html#run-a-demo-test', 'Run a demo test']
            ]],
            ['create-and-run-a-test-with-cloud-providers.html', 'Create and run a test with cloud providers', [
              ['create-and-run-a-test-with-cloud-providers.html#using-browser-stack', 'Using BrowserStack'],
              ['create-and-run-a-test-with-cloud-providers.html#using-saucelabs', 'Using Saucelabs'],
              ['create-and-run-a-test-with-cloud-providers.html#using-aws-device-farm', 'Using AWS Device Farm']
            ]]
          ]
        },

        'nightwatch-cli': {
          title: 'Nightwatch CLI Runner | ',
          nthChildIndex: 2,
          linkTitle: 'Nightwatch CLI Runner',
          baseUrl: '/guide/nightwatch-cli/',
          sidenavData: [
            ['command-line-options.html', 'Command-line Options']
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

        'contributing': {
          title: 'Contributing | ',
          nthChildIndex: 2,
          linkTitle: 'Contributing',
          baseUrl: '/guide/contributing/',
          sidenavData: [
            ['index.html', 'Overview'],
            ['styleguide.html', 'Style guide']
          ]
        },

        'tutorials': {
          title: 'Tutorials ',
          // link: '',
          nthChildIndex: 1,
          linkTitle: 'Tutorials',
          baseUrl: '/guide/tutorials/',
          sidenavData: [
            ['learn-how-to-write-complex-user-actions.html', 'Learn how to write complex user actions'],
            ['run-your-tests-in-parallel.html', 'Run your tests in parallel', [
              ['run-your-tests-in-parallel.html#using-test-workers', 'Using test workers'],
              ['run-your-tests-in-parallel.html#using-multiple-browsers', 'Using multiple browsers'],
            ]],
            ['create-and-run-component-tests.html', 'Create and run component tests', [
              ['create-and-run-component-tests.html#for-vue-js-projects', 'for Vue.js projects'],
              ['create-and-run-component-tests.html#for-react-projects', 'for React projects'],
            ]],
            ['learn-how-to-write-custom-commands-and-custom-assertions.html', 'Learn how to write custom commands and custom assertions', [
              ['learn-how-to-write-custom-commands-and-custom-assertions.html#custom-commands', 'Custom commands'],
              ['learn-how-to-write-custom-commands-and-custom-assertions.html#custom-assertions', 'Custom assertions']
            ]],
            ['create-and-run-node-js-unit-integration-tests-with-nightwatch.html', 'Create and run Node.js unit & integration tests with Nightwatch', [
              ['create-and-run-node-js-unit-integration-tests-with-nightwatch.html#add-details-on-how-to-do-api-testing', 'Add details on how to do API testing ']
            ]],
            ['build-a-custom-test-runner-using-the-programmatic-api.html', 'Build a custom test runner using the programmatic API'],
            ['learn-how-to-run-your-tests-on-github-actions.html', 'Learn how to run your tests on Github Actions'],
            ['develop-and-publish-a-nightwatch-plugin.html', 'Develop and publish a Nightwatch plugin'],
            ['cross-browser-testing-at-scale-using-selenium-grid.html', 'Cross-browser testing at scale using Selenium Grid'],
            ['use-nightwatch-with-appium-for-mobile-web-testing.html', 'Use Nightwatch with Appium for mobile web testing'],
            ['learn-how-to-test-web-rtc-applications.html', 'Learn how to test WebRTC applications']
          ]
        },

        'concepts': {
          title: 'Concepts ',
          // link: '',
          nthChildIndex: 1,
          linkTitle: 'Concepts',
          baseUrl: '/guide/concepts/',
          sidenavData: [
            ['what-is-end-to-end-testing.html', 'What is end-to-end testing?'],
            ['introduction-to-selenium-and-webdriver.html', 'Introduction to Selenium and Webdriver'],
            ['test-environments.html', 'Test environments'],
            ['test-globals.html', 'Test globals'],
            ['session-capabilities.html', 'Session capabilities'],
            ['parallel-testing-in-nightwatch.html', 'Parallel testing in Nightwatch', [
              ['parallel-testing-in-nightwatch.html#using-test-workers', 'Using test workers'],
              ['parallel-testing-in-nightwatch.html#using-multiple-environments', 'Using multiple environments'],
            ]],
            ['page-object-model.html', 'Page Object Model', [
              ['page-object-model.html#overview', 'Overview'],
              ['page-object-model.html#elements', 'Elements'],
              ['page-object-model.html#sections', 'Sections'],
              ['page-object-model.html#page-specific-custom-commands', 'Page-specific custom commands'],
            ]],
            ['component-testing.html', 'Component testing', [
              ['component-testing.html#what-is-component-testing', 'What is component testing?'],
              ['component-testing.html#component-testing-in-nightwatch', 'Component testing in Nightwatch'],
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
              ['finding-and-interacting-with-elements.html#relative-locators', 'Relative Locators'],
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
            ]],
            ['running-tests-with-appium.html', 'Testing on Mobile Devices', [
              ['running-tests-with-appium.html#', 'Using Appium']
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
            ['using-bdd-describe.html', 'describe() interface', [
              ['using-bdd-describe.html#overview', 'Overview'],
              ['using-bdd-describe.html#basic-example', 'Basic Example'],
              ['using-bdd-describe.html#complete-syntax', 'Complete BDD Syntax']
            ]],
            ['using-exports.html', 'exports interface'],
            ['using-es6-async.html', 'Using ES6 async/await'],
            ['writing-assertions.html', 'Writing Assertions'],
            ['expect-assertions.html', 'Using .expect() assertions'],
            ['writing-unit-tests.html', 'Writing Unit Tests']
          ]
        },

        'running-tests': {
          title: 'Running Tests | ',
          nthChildIndex: 2,
          linkTitle: 'Running Tests',
          baseUrl: '/guide/running-tests/',
          sidenavData: [
            ['nightwatch-runner.html', 'Nightwatch Runner'],
            ['define-test-environments.html', 'Define Test Environments'],
            ['test-groups.html', 'Test Groups'],
            ['test-tags.html', 'Test Tags'],
            ['parallel-running.html', 'Running in Parallel'],
            ['disabling-tests.html', 'Disabling / Skipping Tests'],
            ['programmatic-api.html', 'Programmatic API']
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

        'reference': {
          title: 'Reference',
          // link: '',
          nthChildIndex: 1,
          linkTitle: 'Reference',
          baseUrl: '/guide/reference/',
          sidenavData: [
            ["complete-bdd-syntax.html", "Complete BDD Syntax"],
            ["test-runner-cli-reference.html", "Test runner CLI Reference"],
            ["settings-reference.html", "Settings Reference"],
          ]
        },

        'resources': {
          title: 'Resources',
          // link: '',
          nthChildIndex: 1,
          linkTitle: 'Resources',
          baseUrl: '/guide/resources/',
          sidenavData: [
            ["list-of-integrations.html", "List of integrations"],
            ["migrating-to-nightwatch-2.html", "Migrating to Nightwatch 2", [
              ["migrating-to-nightwatch-2.html#from-protractor", "From Protractor"],
              ["migrating-to-nightwatch-2.html#from-nightwatch-1-7", "From Nightwatch 1.7"],
            ]],
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
            ['plugin-api.html', 'Plugin API']
          ]
        },

        'third-party-runners': {
          title: 'Using Third-party Test Runners | ',
          nthChildIndex: 2,
          linkTitle: 'Third-party Integrations',
          baseUrl: '/guide/third-party-runners/',
          sidenavData: [
            ['cucumberjs-nightwatch-integration.html', 'CucumberJS Integration', [
              ['cucumberjs-nightwatch-integration.html#configuration', 'Configuration'],
              ['cucumberjs-nightwatch-integration.html#running-tests', 'Running Tests'],
              ['cucumberjs-nightwatch-integration.html#manually-starting-the-webdriver-session', 'Manually Starting the WebDriver Session'],
              ['cucumberjs-nightwatch-integration.html#reporting', 'Reporting']
            ]],
            ['using-mocha.html', 'Using Mocha as a Test Runner', [
              ['using-mocha.html#why-mocha-', 'Why Mocha?'],
              ['using-mocha.html#configuration', 'Configuration'],
              ['using-mocha.html#extended-describe-syntax', 'Extended describe() Syntax'],
              ['using-mocha.html#using-the-mochawesome-reporter', 'Using Mochawesome'],
              ['using-mocha.html#using-mocha-junit-reporter', 'Using mocha-junit-reporter'],
              ['using-mocha.html#using-the-standard-mocha', 'Using the standard Mocha']
            ]]
          ]
        },

        'migrating-to-nightwatch': {
          title: 'Migrating to Nightwatch 2 | ',
          nthChildIndex: 4,
          linkTitle: 'Migrating to Nightwatch 2',
          baseUrl: '/guide/migrating-to-nightwatch/',
          sidenavData: [
            ['from-protractor.html', 'From Protractor'],
            ['from-nightwatch-v1.html', 'From Nightwatch v1.x']
          ]
        }
      }
    },
    api: {
      collapsible: true,
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
          sidenavData: [],
          baseUrl: '/api/expect/'
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
    var collapsible = sections.collapsible;
    var sectionData;
    var sidenavContent;
    var content;

    if (contentFn === false) {
      return {
        data: false,
        title: sections.title,
        content: false
      }
    }

    Object.keys(sections.content).forEach(function(sectionName) {
      sectionData = sections.content[sectionName];
      sidenavContent = [];

      if (subSection === sectionName) {
        if (sectionData.sidenavData.length === 0 && contentFn) {
          sectionData.sidenavData = contentFn();
        }

        if (collapsible) {
          sidenavContent.push('<ul class="btn-toggle-nav">');
        } else {
          sidenavContent.push('<ul class="nav">');
        }


        var baseUrl = sectionData.baseUrl || '';
        for (var i = 0; i < sectionData.sidenavData.length; i++) {
          sidenavContent.push('<li class="nav-item">');

          content = sectionData.sidenavData[i];

          if (content.length === 3 && !Array.isArray(content[2])) {
            if (baseUrl) {
              sidenavContent.push('<h5><a class="nav-link" href="' + baseUrl + content[1] +'">'+ content[2] +'</a></h5>');
            } else {
              sidenavContent.push('<h5>'+ content[2] +'</h5>');
            }

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


      if (collapsible) {
        var active = subSection === sectionName;
        var target = (sectionName || 'index') + '-collapse';

        html.push('<li' + (active ? ' class="active"' : '') + '>' +
          '<button class="btn btn-toggle align-items-center rounded collapsed" ' +
            'data-bs-toggle="collapse" data-bs-target="#'+ target +'" aria-expanded="true">' +
            '<a href="/'+ mainSection +'/' + subsectionLink + (subsectionLink ? '/': '') + '">'+ sectionData.linkTitle +'</a>' +
          '</button>' +

          '<div class="collapse show" id="'+ target +'">' + sidenavContent.join('') + '</div></li>'
        );
      } else {
        html.push('<li' + (subSection === sectionName ? ' class="active"' : '') + '><a href="/'+ mainSection +'/' +
          subsectionLink + (subsectionLink ? '/': '') + '">'+ sectionData.linkTitle +'</a>' +
          sidenavContent.join('') + '</li>');
      }
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
