module.exports = `
<div id="modal-scan-tomcat" class="modal fade" tabindex="-1" role="dialog">
modal
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <h2>Scanner</h2>
      <hr/>
      <div v-if="step == 'INIT'">
      </div>
      <div v-else-if="step == 'SCAN_TC_ID'">
      </div>
      <div v-else-if="step == 'SCAN_WEBAPP'">
      </div>
    </div><!-- /.modal-content -->
  </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
`;
