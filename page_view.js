var eejs = require('ep_etherpad-lite/node/eejs/');

exports.eejsBlock_mySettings = function (hook_name, args, cb) {
  args.content = args.content + eejs.require("ep_page_view/templates/settingsButtons.ejs");
  return cb();
}

