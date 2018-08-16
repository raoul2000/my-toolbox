"use strict";

var DOMParser      = require('xmldom').DOMParser;


/**
 * Replace XML entities with their values based on the dictionary hash. When an entity is not
 * found in dictionary, the errorHandler function is called with the name of the unresolved entity as
 * argument.
 *
 * Dictionary hash Example :
 * {
 * 		'ENTITY_1' : 'value entity1',
 * 		'ENTITY_2' : 'another value'
 * }
 *
 * @param  {string} str          the XML String to parse
 * @param  {object} dictionary   hash object containing XML entities and their values
 * @param  {function} entityResolverErrorHandler function invoked with the name of a missing entity
 * @return {string}              the XML String with resolved entities
 */
function entityResolver (str, dictionary, entityResolverErrorHandler){
	var reEntity = /&([0-9a-zA-Z_]+);/g;
	var defaultEntity = {
		"quot" : "ENT_QUOT"
	};
	return str
		.split('\n')
		.map(
			function(line) {
				var resultLine  = line,
				    entityValue = '',
				    entityName  = '',
				    match;

				while ( (match = reEntity.exec(line) )) {
					entityName  = match[1];
					if( dictionary.hasOwnProperty(entityName) === false) {
						entityValue = defaultEntity.hasOwnProperty(entityName) ?
								defaultEntity[entityName]
							: entityResolverErrorHandler(entityName);
					} else {
						entityValue = dictionary[entityName];
					}

					resultLine = resultLine.replace(
						new RegExp('&'+entityName+';', 'g'),
						entityValue
					);
				}
				return resultLine;
			}
		)
		.join("\n");
}
exports.entityResolver = entityResolver;

/**
 * Parse an XML string that contains no entity and returns a result object :
 *
 * @param  {string} strXML The XML string to parse
 * @return {object}        xmldom object
 */
function parseNoEntities(strXML) {
  var parseErrors = {
    "warning" : [],
    "error" : [],
    "fatal" : []
  };
  var dom = new DOMParser({
    errorHandler:{
      warning   : function(w){
				parseErrors.warning.push(w);
			},
      error     : function(w){
				parseErrors.error.push(w);
			},
      fatalError: function(w){
				parseErrors.fatal.push(w);
			}
    }
  }).parseFromString(strXML,'text/xml');

  if(parseErrors.fatal.length !== 0 || parseErrors.error.length !== 0 ) {
		// consider both error and fatal as severe
    throw new Error("".concat(
      parseErrors.error.join("\n"),
      parseErrors.fatal.join("\n")
    ));
  } else if( ! dom.documentElement ) {
		// this is because xmldom does not fail to parse a simple string but
		// creates a dom with no documentElement note instead.
		throw new Error("failed to parse");
	}
  return dom;
}
exports.parseNoEntities = parseNoEntities;

/**
 * Parse and returns a Document from the XML string passed as argument.
 * If the XML string contains entities, they are resolved prior to parse
 * using the "entities" hash map.
 *
 * @param  {string} strXML   the XML string to parse
 * @param  {object} entities hash where key are entity name and value is entity value
 * @param  {function} entityResolverErrorHandler entity resolution error handler
 * @return {object}          xmldom object
 */
function parse( strXML , entities, entityResolverErrorHandler) {

    var result = {
      "document": null,
      "success" : true
    };

    if( entities ) {
      var missingEntities = {}; // use only by private error handler

      // prepare Entity Resolver Error Handler
      // If none is provided, use a private one
      var entErrorHandler, isPrivateErrorHandler;
      if(typeof entityResolverErrorHandler === "function" ) {
        isPrivateErrorHandler = false;
        entErrorHandler = entityResolverErrorHandler;
      } else {
        isPrivateErrorHandler = true; // use private error handler
        entErrorHandler = function(missingEntityName){
          missingEntities[missingEntityName] = true;
        };
      }

      // Performing entity resolution. If a custom error handkler has been
      // provided, it may throw an exception to stop the parse process.

      strXML = entityResolver(strXML, entities, entErrorHandler);

			// no custom error handler was provided. If there are missing entities
			// throw exception

      if( isPrivateErrorHandler && Object.keys(missingEntities).length !== 0) {
        // there are unresolved entities !!
        throw new Error("missing entities : " + Object.keys(missingEntities).join(','));
      }
    }
    return parseNoEntities(strXML);
}

exports.parse = parse;
