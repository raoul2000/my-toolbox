"use strict";

const config   = require('./config');
const notification   = require('./notification');
const cache = new Map();

/**
 * Create and return HTML for the input password field
 * @return {string} HTML input password
 */
function createHTMLInputPassword() {
  return `<div class="form-group">
							<label for="password" class="control-label">Password</label>
							<input type="password" class="form-control" id="password" name="password" value="" required="true" title="Please enter your password">
					</div>`;
}

/**
 * Create and return the HTML for the input field 'name'
 * @return {string} HTML input text
 */
function createHTMLInputName() {
  return `<div class="form-group">
							<label for="username" class="control-label">Username</label>
							<input type="text" class="form-control" id="username" name="username" value="" required="true" title="Please enter you username">
					</div>`;
}

function createHTMLRememberCheck() {
  let checked = config.store.get('checkSavePwdToSession') === true
    ? "checked"
    : "";

  return `<div class="checkbox">
    <label title="remember until application is closed">
      <input id="chk-save" type="checkbox" ${checked}> Remember for this time
    </label>
  </div>`;
}
/**
 * Create and returns HTML for the form submit button
 * @return {string} HTML button
 */
function createHTMLSubmitButton(){
  return `<button  id="btn-submit" class="btn btn-success">Login</button>`;
}

/**
 * Create and returns HTML for the form CANCEL button
 * @return {string} HTML button
 */
function createHTMLCanceltButton(){
  return `<button  id="btn-cancel" class="btn btn-default">Cancel</button>`;
}

/**
 * List of available fields that can be added dynamically to the form
 */
const fieldCollection = [
  {
    "id"      : "username",
    "builder" : createHTMLInputName
  },
  {
    "id"      : "password",
    "builder" : createHTMLInputPassword
  }
];

/**
 * Validate the field value.
 * This function is also responsible for rendering validation result as a success
 * or error.
 *
 * @param  {string}  inputId field id
 * @param  {string}  value   field value
 * @return {Boolean}         validation result
 */
function isValid(inputId, value) {
  let result = false;
  let formGroup = $(`#generic-modal-body #${inputId}`).parent('.form-group');
  formGroup.removeClass('has-error has-success');
  if( value.length === 0) {
    formGroup.addClass('has-error');
    result = false;
  } else {
    formGroup.addClass('has-success');
    result = true;
  }
  return result;
}

/**
 * Create and show the modal dialog box to get field values.
 * Note that the order in the field ids array drive the form construction.
 *
 * If the user fills all fields and press OK, the returned promise is resolved
 * with the value entered. Otherwise, the returned promise is reject with
 * the value 'canceled-by-user'.
 *
 * @param  {[string]} fieldIds array of field ids from the collection fields
 * @return {Promise}          fields values entered by user
 */
function showForm(fieldIds) {

  if( ! fieldIds) {
    throw new Error("no fieldIds provided");
  }

  // build the field list //////////////////////////////////////////////////////

  let fields = fieldIds
    .map( id => fieldCollection.find( fRef => fRef.id === id))
    .filter (field => field);

  if( fields.length === 0 ) {
    throw new Error("no fieldIds provided");
  }

  let $modal     = $('#generic-modal');
  let $modalBody = $('#generic-modal-body');

  // create the Form by adding fields to its body //////////////////////////////

  $modalBody.html(
    fields
      .map( field => field.builder())
      .join(' ')
      .concat(
        createHTMLRememberCheck(),
        createHTMLSubmitButton(),
        " ",
        createHTMLCanceltButton()
      )
  );

  // display the modal /////////////////////////////////////////////////////////

  $modal.modal("show");

  // set focus on first input
  $modal.on('shown.bs.modal', function (e) {
    $(this).find("input:visible:first").focus();
  });

  // Handle user interaction ///////////////////////////////////////////////////

  return new Promise( (resolve, reject) => {

    // do not propagate ESC keypress event because it would cause navigation to
    // the desktop page.
    $modal.keyup(function(e) {
         if (e.keyCode == 27) { // escape key maps to keycode `27`
           e.stopPropagation();
           resolve(false);
        }
    });

    $modal.on('hidden.bs.modal', function (e) {
      reject(false);  // operation canceled by user
    });
    $modal.find('#btn-cancel').on('click',function(ev) {  // Cancel form
      resolve(false);
    });

    $modal.find('#btn-submit').on('click',function(ev) {  // submit form
      let validFields = fields
        .map(field => Object.assign( field, {
          "value" : $modal.find(`#${field.id}`).val()     // extract value
        }))
        .map( field => Object.assign(field,{
          "valid" : isValid(field.id, field.value)        // validate value
        }))
        .filter( field => field.valid === true);          // keep only valid

      if( validFields.length === fields.length) {         // all fields are valid
        let resultObj = {};
        validFields.forEach( field => {                   // create result object
          resultObj[field.id] = field.value;
        });
        if( $modal.find('#chk-save:checked').length === 1) {
          // TODO : save those values for the current session
          console.log('save credentials');
          resultObj._save = true;
        } else {
          resultObj._save = false;
        }
        resolve(resultObj);                               // resolved by resultObj
      }
    });
  });
}

function buildCacheKey(sshOptions, fieldId) {
  return `${sshOptions.username}:${fieldId}@${sshOptions.host}`;
}
/**
 * Remove the cached password or do nothing if no password were cached
 * @param  {object} sshOptions the SSH options the password is related to
 * @return {Boolea}            TRUE if the password could be deleted, FALSE
 * if no password was cached
 */
exports.clearCachedPassword = function(sshOptions) {
  return cache.delete(buildCacheKey(sshOptions,"password"));
};

/**
 * Complete the sshOptions object if needed and returns the result.
 * If SSH connection info are missing the user is predented a modal dialog and
 * can enter missing value.
 *
 *  NOTE : initially this function could handle password and username but it has been
 *  decided (by me) that username is mandatory... so the dynamic feature is not
 *  really used. Too bad, it was nice
 *
 * @param  {Object} sshOptions the original SSH options object
 * @return {Promise}            Resolved as the completed SSH option object
 */
exports.getInfo = function(sshOptions) {
  if( ! sshOptions ) {
    return Promise.reject('missing argument : sshOptions');
  }

  if( ! sshOptions.username || sshOptions.username.length === 0) {
    notification.error("username is missing","You must provide a username to be able to continue");
    return Promise.reject('missing argument : sshOptions.username');
  }
  //let usernameKey = "username@".concat(sshOptions.host);
  let passwordKey = buildCacheKey(sshOptions,"password");

  let resultSshOptions = Object.assign({},sshOptions);

  let fieldIds = [];
  /*
  if( sshOptions.username.length === 0) {
    if( cache.has( usernameKey )) {
      resultSshOptions["username"] = cache.get(usernameKey);
    } else {
      fieldIds.push('username');
    }
  } else {
    cache.delete(usernameKey);
  }
  */

  if( sshOptions.password.length === 0) {
    if( cache.has( passwordKey )) {
      resultSshOptions["password"] = cache.get(passwordKey);
    } else {
      fieldIds.push('password');
    }
  } else {
    cache.delete(passwordKey);
  }

  if(fieldIds.length === 0) {
    // all fields are defined
    return Promise.resolve(resultSshOptions);
  } else {
    // some fields have been entered by the user : complete the initial SSH options
    // object and return the result
    return showForm(fieldIds)
    .then(result => {
      $('#generic-modal').modal('hide');
      if( result === false ) {
        return Promise.reject("canceled-by-user");
      } else {
        if(result._save === true) {
          // save the user entered values into the memory cache
          if( result.password ){
            cache.set(passwordKey, result.password);
          }
          /*
          if( result.username ){
            cache.set(usernameKey, result.username);
          }*/
        }
        return Object.assign(resultSshOptions, result);
      }
    });
  }
};
