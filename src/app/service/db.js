"use strict";


var testdb = {

};

function getRootNodes() {
  return [
    { name : "customer 1"},
    { name : "customer 2"},
    { name : "customer 3"}
  ];
}

exports.getCustomerList = getRootNodes;

exports.getChildren = function() {
  return {
    "customer 1" : [
      { name : "project 1"},
    ]
  };
};
