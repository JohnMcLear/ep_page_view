var eejs = require('ep_etherpad-lite/node/eejs/');
var Changeset = require("ep_etherpad-lite/static/js/Changeset");
exports.eejsBlock_editbarMenuLeft = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_page_view/templates/editbarButtons.ejs");
  return cb();
}

function getInlineStyle(pageBreak) {
  return "pageBreak: "+pageBreak+";";
}

// line, apool,attribLine,text
exports.getLineHTMLForExport = function (hook, context) {
  var header = _analyzeLine(context.attribLine, context.apool);
  if (header) {
    var inlineStyle = getInlineStyle(header);
    if (context.lineContent[0] === '*') {
      context.lineContent = context.lineContent.substring(1);
    }
    context.lineContent = "<span style='page-break-before: always;page-break-inside: avoid;'>" + context.lineContent + "</span>";
  }
  return true;
}

function _analyzeLine(alineAttrs, apool) {
  var header = null;
  if (alineAttrs) {
    var opIter = Changeset.opIterator(alineAttrs);
    if (opIter.hasNext()) {
      var op = opIter.next();
      header = Changeset.opAttributeValue(op, 'pageBreak', apool);
    }
  }
  return header;
}
