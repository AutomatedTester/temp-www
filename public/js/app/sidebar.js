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

        'browser-drivers': {
          title: 'Browser Drivers',
          // link: '',
          nthChildIndex: 1,
          linkTitle: 'Browser Drivers',
          baseUrl: '/guide/browser-drivers/',
          sidenavData: [
            ['gecko-driver-firefox.html', 'GeckoDriver (Firefox)', [
              ['gecko-driver-firefox.html#installation', 'Installation'],
              ['gecko-driver-firefox.html#cli-reference', 'CLI reference'],
              ['gecko-driver-firefox.html#use-a-specific-firefox-profile', 'Use a specific Firefox profile'],
              ['gecko-driver-firefox.html#use-a-specific-firefox-binary', 'Use a specific Firefox binary'],
            ]],
            ['chrome-driver.html', 'ChromeDriver', [
              ['chrome-driver.html#installation', 'Installation'],
              ['chrome-driver.html#cli-reference', 'CLI reference'],
              ['chrome-driver.html#use-a-specific-chrome-profile', 'Use a specific Chrome profile'],
              ['chrome-driver.html#use-a-specific-chrome-binary', 'Use a specific Chrome binary'],
            ]],
            ['safari-driver.html', 'SafariDriver', [
              ['safari-driver.html#installation', 'Installation'],
              ['safari-driver.html#cli-reference', 'CLI reference'],
            ]],
            ['edge-driver.html', 'EdgeDriver', [
              ['edge-driver.html#installation', 'Installation'],
              ['edge-driver.html#cli-reference', 'CLI reference'],
            ]],
          ]
        },

        'how-to-guides': {
          title: 'How-to guides',
          // link: '',
          nthChildIndex: 1,
          linkTitle: 'How-to guides',
          baseUrl: '/guide/how-to-guides/',
          sidenavData: [
            ['logical', 'Writing tests', [
              ['test-syntax.html', 'Test syntax', [
                ['test-syntax.html#describes', 'describes'],
                ['test-syntax.html#exports', 'exports'],
              ]],
              ['using-es-6-async-await.html', 'Using ES6 async/await'],
              ['using-commands-to-perform-actions.html', 'Using commands to perform actions'],
              ['finding-interacting-with-dom-elements.html', 'Finding & interacting with DOM Elements'],
              ['understanding-element-visibility.html', 'Understanding element visibility'],
              ['adding-assertions.html', 'Adding assertions', [
                ['adding-assertions.html#built-in-assertions', 'Built-in assertions'],
                ['adding-assertions.html#negating-assertions', 'Negating assertions'],
                ['adding-assertions.html#expect-assertions', 'Expect assertions'],
              ]],
              ['using-test-hooks.html', 'Using test hooks'],
              ['using-test-globals.html', 'Using test globals'],
              ['global-test-hooks.html', 'Global test hooks'],
            ]],
            ['logical', 'Running tests', [
              ['using-the-cli-test-runner.html', 'Using the CLI test runner'],
              ['command-line-options.html', 'Command-line options'],
              ['choosing-a-test-runner.html', 'Choosing a test runner', [
                ['choosing-a-test-runner.html#built-in', 'Built-in'],
                ['choosing-a-test-runner.html#mocha', 'Mocha'],
                ['choosing-a-test-runner.html#cucumber-js', 'CucumberJS'],
              ]],
              ['specifying-test-sources.html', 'Specifying test sources'],
              ['skipping-disabling-tests.html', 'Skipping / disabling tests'],
              ['parallel-running.html', 'Parallel running', [
                ['parallel-running.html#with-test-workers', 'With test workers'],
                ['parallel-running.html#cross-browser-testing', 'Cross-browser testing'],
              ]],
              ['controlling-test-failure-behaviour.html', 'Controlling test failure behaviour'],
              ['filtering-by-test-tags.html', 'Filtering by test tags'],
              ['using-with-test-groups.html', 'Using with test groups'],
            ]],
            ['logical', 'Configuration', [
              ['nightwatch-configuration-file.html', 'Nightwatch configuration file'],
              ['defining-test-environments.html', 'Defining test environments'],
              ['using-test-globals-in-your-config.html', 'Using test globals in your config'],
              ['using-env-variables-in-your-config.html', 'Using ENV variables in your config'],
              ['enabling-http-keep-alive.html', 'Enabling HTTP keep-alive'],
              ['setting-up-screenshots-on-test-failure.html', 'Setting up screenshots on test failure'],
              ['customising-test-output.html', 'Customising test output'],
              ['advanced-test-source-filtering.html', 'Advanced test source filtering'],
              ['web-driver-settings.html', 'WebDriver Settings'],
              ['selenium-settings.html', 'Selenium Settings'],
              ['browser-stack-settings.html', 'BrowserStack Settings'],
            ]],
            ['logical', 'Using XPath selectors', [
              ['what-is-x-path.html', 'What is XPath?'],
              ['how-do-find-an-element-by-xpath.html', 'How do find an element by Xpath'],
            ]],
            ['logical', 'Using Nightwatch', [
              ['simulating-complex-user-actions.html', 'Simulating complex user actions'],
              ['taking-screenshots.html', 'Taking screenshots'],
              ['page-loading-strategies.html', 'Page loading strategies'],
              ['working-with-cookies.html', 'Working with cookies'],
              ['working-with-form-elements.html', 'Working with form elements'],
              ['working-with-file-uploads-and-downloads.html', 'Working with file uploads and downloads'],
              ['working-with-shadow-root-elements.html', 'Working with ShadowRoot elements'],
              ['testing-single-sign-on-sso.html', 'Testing Single Sign-on (SSO)'],
            ]],
            ['logical', 'Using third-party test runners', [
              ['cucumber-cli-as-a-test-runner.html', 'Cucumber CLI as a test runner'],
              ['mocha-as-a-test-runner.html', 'Mocha as a test runner'],
              ['jest.html', 'Jest'],
              ['ava.html', 'Ava'],
            ]],
            ['logical', 'Using page objects', [
              ['defining-elements.html', 'Defining Elements'],
              ['defining-sections.html', 'Defining Sections'],
              ['writing-page-specific-commands.html', 'Writing page-specific commands'],
            ]],
            ['logical', 'Extending Nightwatch', [
              ['adding-custom-commands.html', 'Adding custom commands'],
              ['adding-custom-assertions.html', 'Adding custom assertions'],
              ['adding-custom-reporters.html', 'Adding custom reporters'],
              ['adding-plugins.html', 'Adding plugins'],
            ]],
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
      //level 0
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
          // level 1
          content = sectionData.sidenavData[i];
          var logical = content[0] === 'logical';
          var subpath = logical? "" : content[0];
          var dataattr = logical? "data-logical" : "";

          sidenavContent.push('<li class="nav-item" '+ dataattr + '>');
          
          if (content.length === 3 && !Array.isArray(content[2])) {
            if (baseUrl) {
              sidenavContent.push('<h5><a class="nav-link" href="' + baseUrl + content[1] +'">'+ content[2] +'</a></h5>');
            } else {
              sidenavContent.push('<h5>'+ content[2] +'</h5>');
            }

          } else {
            

            sidenavContent.push('<a class="nav-link" href="' + baseUrl +  subpath +'"' + dataattr +' >'+ content[1] + '</a>');

            if (Array.isArray(content[2]) && logical) {
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
