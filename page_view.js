var eejs = require('ep_etherpad-lite/node/eejs/');
var settings = require('ep_etherpad-lite/node/utils/Settings');
var checked_state = '';

exports.eejsBlock_mySettings = function (hook_name, args, cb) {
  if (settings.ep_page_view_default) checked_state = 'checked';
  args.content = args.content + eejs.require('ep_page_view/templates/page_view_entry.ejs', {checked : checked_state});
  return cb();
}

exports.eejsBlock_styles = function (hook_name, args, cb)
{
  args.content = args.content + '<link href="../static/plugins/ep_page_view/static/css/page_view.css" rel="stylesheet">';
} 

exports.eejsBlock_dd_insert = function (hook_name, args, cb){
  args.content = args.content + eejs.require('ep_page_view/templates/page_view_menu.ejs', {checked : checked_state});
}

exports.eejsBlock_dd_view = function (hook_name, args, cb){
  args.content = args.content + "<li><a href='#' onClick='$(\"#options-pageview\").click();'>Page View</a></li>";
}


