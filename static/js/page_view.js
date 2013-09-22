var _, $, jQuery;

var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var _ = require('ep_etherpad-lite/static/js/underscore');
var cssFiles = ['ep_page_view/static/css/page_view.css'];

var isMobile = $.browser.mobile;
var page_layout = {};
page_layout.lineObj = {};

// Our pagebreak attribute will result in a pagebreak class
function aceAttribsToClasses(hook, context){
  if(context.key == 'pagebreak'){
    return ['pagebreak'];
  }
}

var aceRegisterBlockElements = function(){
  return ["pagebreak"];
}

// Here we convert the class pagebreak into a tag
var aceDomLineProcessLineAttributes = function(name, context){
  //console.log("process lien attr", context);
  var cls = context.cls;
  var domline = context.domline;
  var alignType = /(?:^| )pagebreak:([A-Za-z0-9]*)/.exec(cls);
  var tagIndex;
  if (alignType){
    var modifier = {
      preHtml: '<p style="width:100%;text-align:right"><span>',
      postHtml: '</span></p>',
      processedMarker: true
    };
    return [modifier];
  }
  return [];
};

if (!isMobile) {
  var postAceInit = function(hook, context){
    var pv = {
      enable: function() {
        $('#editorcontainer, iframe').addClass('page_view');
      },
      disable: function() {
        $('#editorcontainer, iframe').removeClass('page_view');
      }
    }
    /* init */
    if($('#options-pageview').is(':checked')) {
      pv.enable();
    } else {
      pv.disable();
    }
    /* on click */
    $('#options-pageview').on('click', function() {
      if($('#options-pageview').is(':checked')) {
        pv.enable();
      } else {
        pv.disable();
      }
    });
    /* from URL param */
    var urlContainspageviewTrue = (getParam("pageview") == "true"); // if the url param is set
    if(urlContainspageviewTrue){
      $('#options-pageview').attr('checked','checked');
      pv.enable();
    }else if (getParam("pageview") == "false"){
      $('#options-pageview').attr('checked',false);
      pv.disable();
    }
  };
  $("#options-linenoscheck").attr("checked", false);
  exports.postAceInit = postAceInit;
} else {
  $('input#options-pageview').hide();
  $('label[for=options-pageview]').hide();
}

exports.aceEditEvent = function (hook_name, args, cb) {
  if(!args.callstack.docTextChanged) return false; // we should only run this if the pad contents is changed..
  // actually the above isn't true, we will have to redraw pages on pretty much any change :\
   pageLayoutUpdate();
}

function pageLayoutUpdate(){
  // Get the document dimensions in Pixels remembering 1 px = 0.264583333 mm
  // Figure out what line each page should be on
  var lines = $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").children("div");
  var currPage = 1;
  $(lines).each(function(){
    var newY = $(this).context.offsetTop;
    var focusId = this.id; // get the id of the link
    var linePage = pageNumber(newY);

    // Is it a new page?
    if(linePage > currPage){ // New page, need to add line break above this line or so
      currPage = linePage;
      // Add line break above this line
      var newPage = true;
      $(this).addClass("pagebreak");
    }else{
      var newPage = false;
    } 

    // Put together the object, we will refer to this in aceCreateDomLine
    page_layout.lineObj[focusId] = {
      y : newY,
      pageNumber : linePage,
      newPage: newPage
    }
  });
  //console.log(page_layout.lineObj);
  // Draw something that shows a split page, it might be we add a class to a div or so

}

function pageNumber(y){ // Given a Y co-ord provide the page number
  var paperHeight = 297; // temporary 297 is mm height of A4
  var pageNumber = y / 297;
  y = y * 0.264583333; // Number of MM of each pixel
  pageNumber = Math.ceil(pageNumber); // Round up to nearest whole number.. Note Round UP!
  return pageNumber;
}

function getParam(sname){
  var params = location.search.substr(location.search.indexOf("?")+1);
  var sval = "";
  params = params.split("&");
  // split param and value into individual pieces
  for (var i=0; i<params.length; i++)
  {
    temp = params[i].split("=");
    if ( [temp[0]] == sname ) { sval = temp[1]; }
  }
  return sval;
}

exports.aceCreateDomLine = function(name, args){
  //console.log("J", name, args);
  if (args.cls.indexOf('image') > -1) { // If it's an image
    var src;
    cls = args.cls.replace(/(^| )image:(\S+)/g, function(x0, space, image) {
      src = image;
      return space + "image image_" + image;
    });

   return [{
     cls: cls,
     extraOpenTags: '<img src="' + src + '" style="max-width:100%" /><br/>',
     extraCloseTags:''
   }];
  }
}


// Once ace is initialized, we set ace_doInsertalign and bind it to the context
function aceInitialized(hook, context){
  top.pad.changeViewOption('showLineNumbers', false);
  pageLayoutUpdate();
}

function aceEditorCSS(){
  return cssFiles;
};

// Export all hooks
exports.aceRegisterBlockElements = aceRegisterBlockElements;
exports.aceInitialized = aceInitialized;
exports.postAceInit = postAceInit;
exports.aceDomLineProcessLineAttributes = aceDomLineProcessLineAttributes;
exports.aceAttribsToClasses = aceAttribsToClasses;
exports.aceEditorCSS = aceEditorCSS;
