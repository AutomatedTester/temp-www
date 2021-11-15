const path = require('path');
const marked = require('marked');
const parseMd = require('parse-md').default;
const ejs = require('ejs');
const mkdirp = require('mkdirp');
const Utils = require('./Utils.js');
const fetch = require('isomorphic-fetch');

module.exports = class Parser {
  static get includesPath() {
    return './src/include';
  }

  static get sectionsIncludesPath() {
    return './src/sections';
  }

  static get pagesIncludesPath() {
    return './src/pages';
  }

  constructor({config, buildReleases}) {
    this.sections = config.sections;
    this.docsRepoUrl = config.docsRepoUrl;
    this.nightwatchVersion = config.NIGHTWATCH_VERSION;
    this.outputFolder = path.resolve(config.OUTPUT_FOLDER);
    this.docsPath = config.NIGHTWATCH_DOCS_PATH;
    this.pagesConfig = config.pageSrcFolders;
    this.githubRepo = config.githubRepo;
    this.buildReleases = buildReleases;

    this.output = {
      indexFile: path.join(this.outputFolder, 'index.html'),
      sectionsFolder: path.join(this.outputFolder, 'js/app/sections')
    };

    this.content = {};
  }

  static async loadIncludes(includesPath) {
    const includes = {};
    let files = await Utils.readDir(includesPath);
    files = files.filter(filename => (filename.endsWith('.ejs')));

    const promises = files.map(async filename => {
      const key = filename.split('.')[0];
      const fullPath = path.join(includesPath, filename);

      includes[key] = await Utils.readFile(fullPath);
    });

    await Promise.all(promises);

    return includes;
  }

  readDocsPages(pageSections) {
    return Promise.all(Object.keys(pageSections).map(section => {
      const fileName = pageSections[section];
      const editLink = `${this.docsRepoUrl}edit/master/${fileName}?message=docs%3A%20describe%20your%20change`;

      return Utils.readFile(path.join(this.docsPath, fileName)).then(data => {
        this.content[section] = marked(data.replace(/<body>/g, '&lt;body&gt;'));

        // inserting the suggest edit link
        this.content[section] = this.content[section].replace(/^<(h2|h3)\s([^>]+)>(.+)<\/(h2|h3)>/,
          `<$1 $2>$3 <a title="Suggest edits" class="edit-source" href="${editLink}">Suggest edits</a></$4>`);

        // inserting the surrounding div around h2
        this.content[section] = this.content[section].replace(/^<(h2)\s([^>]+)>(.+)<\/(h2)>/,
          '<div class="page-header"><h2 $2>$3</h2></div>');
      });
    }));
  }

  async getReleases() {
    const url = `https://api.github.com/repos/${this.githubRepo}/releases`;

    const response = await fetch(url);
    this.content['releases'] = await response.json();

    this.content['releases'] = this.content['releases'].map(item => {
      item.body = marked(item.body);

      item.timeAgo = Utils.timeAgo(item.published_at);

      return item;
    }).slice(0, 15);

    console.log('RELEASES', this.content['releases'][0]);
  }

  renderIncludes(includes, secondaryPage = null, data = {}) {
    let rendered = {};
    Object.keys(includes).forEach(key => {
      rendered[key] = ejs.render(includes[key], Object.assign({
        secondaryPage,
        pageImage: 'https://nightwatchjs.org/img/banner.png',
        version : this.nightwatchVersion
      }, data));
    });

    return rendered;
  }

  loadContent() {
    this.loadPagesContent();
    const promises = [
      this.loadIncludes(),
      this.loadSections(),
      this.loadPageTemplates()
    ];

    if (this.buildReleases) {
      promises.push(this.getReleases());
    }

    return Promise.all(promises);
  }

  getObjectKeyDeep(content, namespace, sectionName) {
    if (!sectionName) {
      return content;
    }

    if (namespace.length === 1) {
      const sectionName = namespace[0];
      const section = content[sectionName] = content[sectionName] || {};

      return section;
    }

    let lastContent;
    namespace.forEach((key, index) => {
      if (index === 0) {
        content[key] = content[key] || {};
        lastContent = content[key];
      } else {
        lastContent[key] = lastContent[key] || {};
        lastContent = lastContent[key];
      }
    });

    return lastContent;
  }

  loadPagesContent() {
    this.pagesConfig.forEach(folderName => {
      Utils.readFolderRecursively(path.join(this.docsPath, folderName), [], (dirPath, fileName, namespace) => {
        const fullFilePath = path.join(dirPath, fileName);
        const {itemsList} = this.sections[folderName];
        const items = itemsList ? [] : {};

        this.content[folderName] = this.content[folderName] || items;
        const sectionName = namespace[0];

        //const section = this.content[folderName][sectionName] = this.content[folderName][sectionName] || {};

        const section = this.getObjectKeyDeep(this.content[folderName], namespace, sectionName);
        const namespaceCopy = namespace.slice(0);
        namespaceCopy.unshift(folderName);
        namespaceCopy.push(fileName);

        const editLink = `${this.docsRepoUrl}edit/master/${namespaceCopy.join('/')}?message=docs%3A%20describe%20your%20change`;

        const data = Utils.readFileSync(fullFilePath);
        const sectionFileName = fileName.split('.')[0];

        let {content, metadata} = parseMd(data);
        content = marked(content.replace(/<body>/g, '&lt;body&gt;'));
        // inserting the suggest edit link
        content = content.replace(/^<(h2|h3)\s([^>]+)>(.+)<\/(h2|h3)>/, `<$1 $2>$3 <a title="Suggest edits" class="edit-source" href="${editLink}">Suggest edits</a></$4>`);

        // inserting the surrounding div around h2
        content = content.replace(/^<(h2)\s([^>]+)>(.+)<\/(h2)>/, '<div class="page-header"><h2 $2>$3</h2></div>');

        if (itemsList) {
          section.push({metadata, date: Utils.showDate(metadata.date), link: sectionFileName, content});
        } else {
          section[sectionFileName] = content;
        }

      });
    });

    console.log(this.content)
  }

  loadIncludes() {
    return Parser.loadIncludes(Parser.includesPath)
      .then(values => {
        this.content['_includes_'] = values;
      });
  }

  loadSections() {
    return Parser.loadIncludes(Parser.sectionsIncludesPath)
      .then(values => {
        this.content['_sections_'] = values;
      });
  }

  loadPageTemplates() {
    this.content._pages_ = {};

    const promises = Object.keys(this.sections).map((sectionName) => {
      return new Promise(resolve => {
        const fullPath = `${path.join(Parser.pagesIncludesPath, sectionName)}.html.ejs`;

        Utils.readFile(fullPath)
          .then(data => {
            this.content._pages_[sectionName] = data;

            if (this.sections[sectionName].itemsList) {
              return Utils.readFile(`${path.join(Parser.pagesIncludesPath, sectionName, 'article.html.ejs')}`)
                .then(article_content => {
                  this.content._article_pages_ = this.content._article_pages_ || {};
                  this.content._article_pages_[sectionName] = article_content;

                  return article_content;
                })
            }

            return data;
          })
          .then(data => resolve(data));
      });
    });

    return Promise.all(promises);
  }

  writeSections({apiData}) {
    mkdirp.sync(this.output.sectionsFolder);

    const promises = Object.keys(this.sections).reduce((prev, key) => {
      if (this.content['_sections_'][key]) {
        const fileName = path.join(this.output.sectionsFolder, `${key}.txt`);
        const {pageTitle, title, description} = this.sections[key];

        this.content._includes_ = this.renderIncludes(this.content._includes_, true, {
          pageTitle,
          title,
          section:key,
          pageDescription: description
        });

        this.content['_sections_'][key] = ejs.render(this.content['_sections_'][key], {
          content: this.content,
          version: this.nightwatchVersion,
          pageTitle,
          title,
          api: apiData.output,
          methods: apiData.methods,
          pageDescription: description,
          subPageName: '',
          pageContent: '',
          pageHeader: ''
        });

        prev.push(Utils.writeFile(fileName, this.content['_sections_'][key]));
      }

      return prev;
    }, []);

    return Promise.all(promises);
  }

  writePages() {
    const promises = Object.keys(this.sections).map(async (key) => {
      let outputFolder = this.outputFolder;
      let secondaryPage = false;
      if (key !== 'index') {
        secondaryPage = true;
        outputFolder = path.join(this.outputFolder, key);
        mkdirp.sync(outputFolder);
      }

      const {pageTitle, title, description, subsections, itemsList} = this.sections[key];

      await this.loadIncludes();
      this.content._includes_ = this.renderIncludes(this.content._includes_, secondaryPage, {
        pageTitle,
        title,
        section:key,
        pageDescription: description,
        pageContent: this.content['_sections_'][key],
        subPageName: ''
      });

      const pageTemplateData = this.content['_pages_'][key];

      this.content['_pages_'][key] = ejs.render(pageTemplateData, {
        content: this.content,
        version: this.nightwatchVersion,
        pageTitle,
        title,
        pageDescription: description,
        pageContent: this.content['_sections_'][key],
        subPageName: ''
      });

      const fileName = path.join(outputFolder, 'index.html');
      const promises = [Utils.writeFile(fileName, this.content['_pages_'][key])];

      if (itemsList) {
        const items = this.content[key];
        const pageTemplateData = this.content._article_pages_[key];
        mkdirp.sync(path.join(this.output.sectionsFolder, key));

        items.forEach(article => {
          promises.push(this.writeArticlePage({
            section: key,
            article,
            pageContent: article.content,
            pageTitle: article.metadata.title,
            pageDescription: article.metadata.description,
            pageImage: article.metadata.image,
            pageTemplateData
          }));
        });

        return Promise.all(promises);
      }

      if (Array.isArray(subsections)) {
        subsections.forEach(subName => {
          if (typeof subName == 'string') {
            const subFolder = path.join(outputFolder, subName);
            mkdirp.sync(subFolder);

            const subsectionFile = path.join(subFolder, 'index.html');
            promises.push(Utils.writeFile(subsectionFile, this.content['_pages_'][key]));
          }
        });
      } else if (Utils.isObject(subsections)) {
        Object.keys(subsections).forEach(subName => {
          const content = subsections[subName];
          const subFolder = path.join(outputFolder, subName);
          mkdirp.sync(subFolder);

          const subsectionFile = path.join(subFolder, 'index.html');
          promises.push(Utils.writeFile(subsectionFile, this.content['_pages_'][key]));

          const sectionFolder = path.join(this.output.sectionsFolder, key, subName);
          mkdirp.sync(sectionFolder);
          promises.push(Utils.writeFile(path.join(this.output.sectionsFolder, key, subName + '.txt'), this.content['_sections_'][key]));

          const subPages = content.pages;
          const pageVars = content.vars || {};

          subPages.forEach((subPageName, index, total) => {
            const githubLink = `${this.docsRepoUrl}tree/master/${key}/${subName}/${subPageName}.md`;
            let prevArticle;
            let nextArticle;
            if (index > 0 && index < total.length) {
              // TODO: add automatic prev/next links
            }

            // writing .html file for this page in the main output folder
            const subPageFile = path.join(subFolder, `${subPageName}.html`);
            let pageContent = this.content[key][subName][subPageName];
            pageContent += `<a class="improve-article-bottom" href="${githubLink}" target="_blank">Improve this article</a>`;

            const tplData = Object.assign({
              content: this.content,
              version: this.nightwatchVersion,
              pageTitle,
              title,
              pageDescription: description,
              pageContent,
              subPageName: `${subName}/${subPageName}.html`
            }, pageVars);
            const subpageData = ejs.render(pageTemplateData, tplData);

            promises.push(Utils.writeFile(subPageFile, subpageData));

            // writing .txt file for this section in the /js/app/sections folder

            const subpageDataFile = path.join(this.output.sectionsFolder, key, subName, subPageName) + '.txt';
            promises.push(Utils.writeFile(subpageDataFile, pageContent));
          });
        });
      }

      return Promise.all(promises);
    }, []);

    return Promise.all(promises);
  }

  async start(apiData) {
    const startTime = new Date().getTime();

    await this.writeSections({apiData});
    await this.writePages();

    console.log('DONE');
  }

  async writeArticlePage({section, pageTitle, pageImage, pageDescription, pageContent, article, pageTemplateData, pageVars = {}}) {
    const {link} = article;
    const githubLink = `${this.docsRepoUrl}tree/master/${section}/${link}.md`;
    let commentLink = article.metadata.link_to_discussions;
    if (commentLink) {
      commentLink += '#issue-comment-box';
    }

    pageContent += ``;

    const sectionTplData = this.content._sections_[`_${section}-article_`];

    // re-rendering the includes to update the title and description in head
    await this.loadIncludes();
    this.content._includes_ = this.renderIncludes(this.content._includes_, true, {
      pageTitle: `${pageTitle} | Nightwatch.js Blog`,
      title: pageTitle,
      pageImage,
      section,
      pageDescription
    });

    // pre-render the section article sub-template
    const sectionArticleContent = this.content._sections_[`_${section}-article_`] = ejs.render(sectionTplData, {
      version: this.nightwatchVersion,
      section,
      article,
      pageTitle,
      articleFooter: `<hr/><div class="article-footer"><a class="improve-article-bottom" href="${githubLink}" target="_blank">Improve this article</a>` + (commentLink ?
        `<a class="improve-article-bottom" href="${commentLink}" target="_blank">💬 Write a comment</a></div>`: ''),
      pageDescription,
      pageContent
    });

    const fullArticleContent = Object.assign({
      content: this.content,
      version: this.nightwatchVersion,
      section,
      article,
      link,
      pageTitle,
      pageDescription,
      pageContent,
    }, pageVars);

    const subpageData = ejs.render(pageTemplateData, fullArticleContent);

    // writing .html file for this page in the main output folder
    const articlePageFile = path.join(this.outputFolder, section, `${link}.html`);
    await Utils.writeFile(articlePageFile, subpageData);

    // writing .txt file for this section in the /js/app/sections folder
    const articleDataFile = path.join(this.output.sectionsFolder, section, link) + '.txt';

    // replacing the section template data with un-parsed content so it can be used by the next article
    this.content._sections_[`_${section}-article_`] = sectionTplData;

    return Utils.writeFile(articleDataFile, sectionArticleContent);
  }
};
