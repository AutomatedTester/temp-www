# Nightwatchjs.org

### Building instructions

1. Use `versions/2.0` branch for the latest website version
2. Clone `https://github.com/nightwatchjs/nightwatch`
3. Clone `https://github.com/nightwatchjs/nightwatch-docs` and use `versions/2.0` branch
4. rename `.env.example` to `.env` and set the correct paths
5. `npm install`
6. Run one of the following:
- `node build/static.js` (copies the contents of the `public` folder to the configured `OUTPUT_FOLDER` folder)
- `node build/apidocs.js` (builds the content for the API pages from jsdoc comments in the `nightwatch` repository)
- `node build/releases.js` (builds the individual html pages based on the `.md` content from the configured `NIGHTWATCH_DOCS_PATH` and using the `ejs` templates from the `src` folder)

After running the `apidocs.js` script make sure to also run the `static.js` and `releases.js` scripts.

### Adding a new page

1. create the `.md` file inside the `nigthwatch-docs` repo (usually inside the `guide` folder) 
2. edit the `app.conf.json`
3. add the newly created `.md` file  to the corresponding `section.guide` folder/file mapping
4. add the link to the new `.html` page inside `src/sections/guide.ejs`
5. rebuild the project using the commands from step 6. from the previous section