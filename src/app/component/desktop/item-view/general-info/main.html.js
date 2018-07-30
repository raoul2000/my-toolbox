module.exports = `
<div>

  <div class="panel panel-default">

    <div class="panel-heading">
      <h3 class="panel-title">
        Properties
        <div id="color-picker" title="set Color"  
          v-bind:style="itemBgColor"
          v-on:click.stop.prevent="openColorPicker()"></div>
      </h3>
    </div>
    
    <ul class="general-info">
      <li>
        <div class="field-name">host</div>
        <div class="field-value">
          <inlineInput
            :initialValue="item.data.ssh.host"
            :valid="validation.host"
            :allowEdit="allowEdit"
            inputType="text"
            valueName="host"
            emptyValue="<em class='text-muted'>???.???.???.???</em>"
            v-on:changeValue="changeSSHValue"/>
        </div>
      </li>
      <li>
        <div class="field-name">username</div>
        <div class="field-value">
          <inlineInput
            :initialValue="item.data.ssh.username"
            :valid="validation.username"
            :allowEdit="allowEdit"
            inputType="text"
            valueName="username"
            emptyValue="<em class='text-muted'>(no username)</em>"
            v-on:changeValue="changeSSHValue"/>
        </div>
      </li>
      <li>
        <div class="field-name">password</div>
        <div class="field-value">
          <inlineInput
            :initialValue="item.data.ssh.password"
            :valid="validation.password"
            :allowEdit="allowEdit"
            inputType="password"
            emptyValue="<em class='text-muted'>(no password)</em>"
            valueName="password"
            v-on:changeValue="changeSSHValue"/>
        </div>
      </li>
      <li>
        <div class="field-name">SSH port</div>
        <div class="field-value">
          <inlineInput
            :initialValue="item.data.ssh.port"
            :valid="validation.port"
            :allowEdit="allowEdit"
            inputType="text"
            valueName="port"
            v-on:changeValue="changeSSHValue"/>
        </div>
      </li>
    </ul>

    <button
      v-bind:disabled="!canTestConnection"
      v-on:click="testConnection" type="button" class="btn btn-default btn-block">
        <i v-show="allowEdit === false" class="fa fa-refresh fa-spin"></i>
        <span v-show="connectionOk !== null">
          <span v-show="connectionOk === true" class="glyphicon glyphicon-ok" aria-hidden="true"></span>
          <span v-show="connectionOk === false" class="glyphicon glyphicon-remove" aria-hidden="true" style="color:red"></span>
        </span>

        &nbsp;Test Connection
    </button>

  </div><!-- end of panel -->

  <!-- modal : (begin)-->
  <div id="color-picker-modal" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">Choose A Color</h4>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-lg-6">
                <p>Choose the color for this item</p>
                <div class="radio"  v-on:click="optionColor = 'auto'">
                  <label >
                    <input type="radio" name="optionColor" id="optionColor1" value="auto" :checked="optionColor == 'auto'">
                     Automatically assign a color based on the folder path
                  </label>
                </div>
                <div class="radio"  v-on:click="optionColor = 'manual'">
                  <label>
                    <input type="radio" name="optionColor" id="optionColor1" value="manual" :checked="optionColor == 'manual'">
                      Let me choose the color
                  </label>
                </div>                
            </div>
            <div class="col-lg-6">
              <div v-if="optionColor == 'manual'">
                <color-picker :value="colors"   @input="updateColorValue"/>
              </div>
            </div>
          </div>
          
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" v-on:click="saveColor()">Save changes</button>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div>
  <!-- modal : (end)-->  
</div>
`;
