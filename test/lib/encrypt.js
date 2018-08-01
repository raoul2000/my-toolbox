"use strict";

const fs = require('fs'),
  lib = require('../../src/app/lib/lib'),
  assert = require('chai').assert;
const path = require('path');


describe('encrypt', function(done) {
  
    it('encrypt a value', function(done) {
      let result = lib.encrypt.encrypt("some text");
      assert.equal(result.split(':').length,3);
      done();
    });

    it('2 encryption of the same string produce different result', function(done) {
        let result1 = lib.encrypt.encrypt("some text");
        let result2 = lib.encrypt.encrypt("some text");
        console.log(result1);
        console.log(result2);
        assert.isTrue(result1 != result2);
        done();
      });    

    it('does not decrypt a value not recognized as encrypted', function(done) {
      let result = lib.encrypt.decrypt("some text");
      assert.equal(result,"some text");
      done();
    });

    it('decrypt a value', function(done) {
      let result = lib.encrypt.decrypt("crypt:701d139fc56697c4f6f1615ed813dc6a:e00b26473f8aad53cd");
      assert.equal(result,"some text");
      done();
    });  
});
