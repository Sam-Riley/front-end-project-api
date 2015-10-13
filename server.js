(function() {
  'use strict';

  var express    = require('express'),
      bodyParser = require('body-parser'),
      cors       = require('cors');

  var server = express(),
      router = express.Router();

  server.use(bodyParser.json());
  server.use(cors());

  // let's display the readme
  server.get('/', function(req, res) {
    res.send('Main page.');
  });

  var folders  = require('./fixtures/folders.json'),
      files    = require('./fixtures/files.json'),
      key      = '',
      fixtures = {};

  for (key in folders) {
    if (!folders.hasOwnProperty(key)) {
      continue;
    }

    fixtures[key] = folders[key];
    fixtures[key].type = 'folder';
  }

  for (key in files) {
    if (!files.hasOwnProperty(key)) {
      continue;
    }

    fixtures[key] = files[key];
    fixtures[key].type = 'file';
  }

  // REST API ROUTING
  // ----------------

  // ls
  router.route('/ls/:id')

  .get(function(req, res) {
    if (typeof fixtures[req.params.id] === 'undefined') {
      res.status(404).send('That item was not found.');

      return;
    }

    var currentFixture = fixtures[req.params.id];

    // if the item is a folder, return the contents
    if (currentFixture.type === 'folder') {
      var responseItems = {};

      for (key in fixtures) {
        if (!fixtures.hasOwnProperty(key)) {
          continue;
        }

        if (fixtures[key].parent === req.params.id) {
          // formulate a stripped down response, make sure to copy
          var responseFixture = JSON.parse(JSON.stringify(fixtures[key]));;

          responseItems[key] = slimReponse(responseFixture, true);
        }
      }

      res.json({ items: responseItems });
    }

    // if the item is a file, return the filename
    if (currentFixture.type === 'file') {
      res.json({ items: [formatFilename(currentFixture)] });
    }
  });

  // cat
  router.route('/cat/:id')

  .get(function(req, res) {
    if (typeof fixtures[req.params.id] === 'undefined') {
      res.status(404).send('That item was not found.');

      return;
    }

    var currentFixture = fixtures[req.params.id];

    // if the fixture is a folder, return an error
    if (currentFixture.type === 'folder') {
      res.status(400).send(currentFixture.name + ': Is a directory');

      return;
    }

    res.json({ content: currentFixture.content });
  });

  // autocomplete
  router.route('/autocomplete/:text')

  .get(function(req, res) {
    if (!req.params.text) {
      res.status(400).send('You must supply an autocomplete string.');

      return;
    }

    var responseItems = {};

    for (key in fixtures) {
      if (!fixtures.hasOwnProperty(key)) {
        continue;
      }

      var currentFixture = fixtures[key],
          currentName    = formatFilename(currentFixture);

      if (currentName.substr(0, req.params.text.length) == req.params.text) {
        var responseFixture = JSON.parse(JSON.stringify(currentFixture));

        responseFixture.name = currentName;

        responseItems[key] = slimReponse(responseFixture);
      }
    }

    res.json({ items: responseItems });
  });

  // -----------
  // END ROUTING

  // util functions
  var formatFilename = function(item) {
    if (item.type === 'file') {
      return item.name + '.' + item.extension;
    }

    if (item.type === 'folder') {
      return item.name;
    }
  };

  var slimReponse = function(item, generateName) {
    // only generate a name if asked
    if (generateName) {
      item.name = formatFilename(item);
    }

    delete item.parent;
    delete item.extension;
    delete item.content;

    return item;
  }

  server.use('/api', router);
  server.listen(8080);

  console.log('FS Front-End Applicant Project server running on 8080');
})();
