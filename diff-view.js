"use strict";

var value, dv, panes = 2, highlight = true, connect = null, collapse = false;

function initUI(leftContent,rightContent) {
  if (value == null) return;
  var target = document.getElementById("diff-view");
  target.innerHTML = "";

  dv = CodeMirror.MergeView(target, {
    value: rightContent, // target
    orig: null,
    origLeft: leftContent,  // source
    lineNumbers: true,
    mode: "text/html",
    highlightDifferences: highlight,
    connect: connect,
    collapseIdentical: collapse
  });
}

function toggleDifferences() {
  dv.setShowDifferences(highlight = !highlight);
}


function mergeViewHeight(mergeView) {
  function editorHeight(editor) {
    if (!editor) return 0;
    return editor.getScrollInfo().height;
  }
  return Math.max(editorHeight(mergeView.leftOriginal()),
                  editorHeight(mergeView.editor()),
                  editorHeight(mergeView.rightOriginal()));
}

function resize(mergeView) {
  var height = mergeViewHeight(mergeView);
  for(;;) {
    if (mergeView.leftOriginal())
      mergeView.leftOriginal().setSize(null, height);
    mergeView.editor().setSize(null, height);
    if (mergeView.rightOriginal())
      mergeView.rightOriginal().setSize(null, height);

    var newHeight = mergeViewHeight(mergeView);
    if (newHeight >= height) break;
    else height = newHeight;
  }
  mergeView.wrap.style.height = height + "px";
}
