"use strict";

/**
 * Create and return HTML for the input password field
 * @return {string} HTML input password
 */
function createHTMLInputPassword() {
  return `<div class="form-group">
							<label for="password" class="control-label">Password</label>
							<input type="password" class="form-control" id="password" name="password" value="" required="true" title="Please enter your password">
							<span class="help-block"></span>
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
							<span class="help-block"></span>
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
      .concat(createHTMLSubmitButton())
  );

  // display the modal /////////////////////////////////////////////////////////

  $modal.modal("show");

  // Handle user interaction ///////////////////////////////////////////////////

  return new Promise( (resolve, reject) => {

    $modal.on('hidden.bs.modal', function (e) {
      reject(false);  // operation canceled by user
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
          Object.defineProperty(resultObj, field.id, {
            "value" : field.value
          });
        });
        resolve(resultObj);                               // resolved by resultObj
      }
    });
  });
}

exports.resolveHost = function(itemData) {
  //item.
};

exports.getInfo = function(itemData) {
  if( ! itemData) {
    throw new Error('missing argument : itemData');
  }
/*
  let fieldIds = [];
  if( itemData.ssh.username.length === 0) {
    fieldIds.push('username');
  }
  if( itemData.ssh.password.length === 0) {
    fieldIds.push('password');
  }
*/
  showForm(['username','password'])
  .then(result => {
    console.log(result);
    $('#generic-modal').modal('hide');
  })
  .catch(err => {
    console.error(err);
  });
/*
  if( ! itemData.ssh.host ) {
    console.log('foo');
  }
  return {
    'host' : exports.resolveHost(itemData)
  };*/
};
