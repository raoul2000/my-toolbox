"use strict";

var artefact = require('../../src/app/component/deploy/lib/artefact'),
  fs = require('fs'),
  assert = require('chai').assert;
const path = require('path');

var config = {};

describe('artefact (1)', function(done) {
  this.timeout(5000);

  before(function() {
    //config = JSON.parse(fs.readFileSync(__dirname + "/../config.json", "utf-8" ));
  });

  it('successfully build aretefact list from local folder', function(done) {

    artefact.buildListFromLocalFolder(__dirname + '/../data/nexus/artefact')
      .then(function(result) {
        console.log(result);
        assert.deepEqual(result, [{
            metaFilename: 'dummy.war.meta',
            dataFilename: 'dummy.war',
            metadata: {
              installFolder: 'symlink-x.x.x',
              symlink: 'symlink',
              version: 'x.x.x'
            }
          },
          {
            metaFilename: 'file-2.war.meta',
            dataFilename: 'file-2.war',
            metadata: {
              installFolder: 'm1-undefined',
              symlink: 'm1',
              version: '2'
            }
          },
          {
            metaFilename: 'file.war.meta',
            dataFilename: 'file.war',
            metadata: {
              moduleId: 'm1',
              version: '2.3.19',
              symlink: 'm1',
              installFolder: 'm1-2.3.19'
            }
          }
        ]);
        done();
      })
			.catch(err => done(err));
  });
});
