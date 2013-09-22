var _ = require('ep_etherpad-lite/static/js/underscore');

var tags = ['pagebreak'];

var collectContentPre = function(hook, context){
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes
  var tagIndex = _.indexOf(tags, tname);

  if(tagIndex >= 0){
    lineAttributes['pagebreak'] = tags[tagIndex];
  }
};

var collectContentPost = function(hook, context){
  var tname = context.tname;
  var state = context.state;
  var lineAttributes = state.lineAttributes
  var tagIndex = _.indexOf(tags, tname);

  if(tagIndex >= 0){
    delete lineAttributes['pagebreak'];
  }
};

exports.collectContentPre = collectContentPre;
exports.collectContentPost = collectContentPost;
