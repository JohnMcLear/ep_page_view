var _, $, jQuery;
var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var _ = require('ep_etherpad-lite/static/js/underscore');

var isMobile = $.browser.mobile;

if (!isMobile) {
  exports.postAceInit = function(hook, context){
    var pv = {
      enable: function() {
        $('#editorcontainer, iframe').addClass('page_view');
        $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").addClass('innerPV');
        $('iframe[name="ace_outer"]').contents().find("iframe").addClass('outerPV');
        $('iframe[name="ace_outer"]').contents().find('#outerdocbody').addClass("outerBackground");
        $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").css("margin-left","0px");
        $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").contents().find('.pageBreak').click(function(e){
          $(this).focusout().blur();
          top.console.log("Can't edit pagebreak Line");
          e.preventDefault();
          return false;
        });
        if($('#options-linenoscheck').is(':checked')){
          $('#options-linenoscheck').click();
          $('#options-linenoscheck').attr("disabled", true);
        }
        $('#editorcontainer').css("top", "15px");
        $('#ep_page_ruler').show();
      },
      disable: function() {
        $('#editorcontainer, iframe').removeClass('page_view');
        $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").removeClass('innerPV');
        $('iframe[name="ace_outer"]').contents().find("iframe").removeClass('outerPV');
        $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").css("margin-left","-100px");
        $('iframe[name="ace_outer"]').contents().find('#outerdocbody').removeClass("outerBackground");
        $('#ep_page_ruler').hide();
        $('#options-linenoscheck').attr("disabled", false);
        var containerTop = $('.toolbar').position().top + $('.toolbar').height() +5;
        $('#editorcontainerbox').css("top", containerTop+"px");
        $('#editorcontainer').css("top", 0);
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
    // Bind the event handler to the toolbar buttons
    $('#insertPageBreak').on('click', function(){
      context.ace.callWithAce(function(ace){
        ace.ace_doInsertPageBreak();
      },'insertPageBreak' , true);
    });
  };
} else {
  $('input#options-pageview').hide();
  $('label[for=options-pageview]').hide();
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

exports.aceEditorCSS = function(hook_name, cb){
  return ["/ep_page_view/static/css/iframe.css"];
} // inner pad CSS


// Our PageBreak attribute will result in a PageBreak:1 class
exports.aceAttribsToClasses = function(hook, context){
  if(context.key == 'pageBreak'){
    return ['pageBreak:' + 1 ];
  }
}

/***
*
* Add the Javascript to Ace inner head, this is for the onClick listener
*
***/
exports.aceDomLineProcessLineAttributes = function(name, context){
  if( context.cls.indexOf("pageBreak") !== -1) { var type="pageBreak"; }
  var tagIndex = context.cls.indexOf(type);
  if (tagIndex !== undefined && type){
    // NOTE THE INLINE CSS IS REQUIRED FOR IT TO WORK WITH PRINTING!   Or is it?
    var modifier = {
      preHtml: '<div class="pageBreak" contentEditable=false style="page-break-after:always;page-break-inside:avoid;-webkit-region-break-inside: avoid;">',
      postHtml: '</div>',
      processedMarker: true
    };
    return [modifier]; // return the modifier
  }

  return []; // or return nothing
};

// Here we convert the class pageBreak into a tag
exports.aceCreateDomLine = function(name, context){
  var cls = context.cls;
  var domline = context.domline;
  var pageBreak = /(?:^| )pageBreak:([A-Za-z0-9]*)/.exec(cls);
  var tagIndex;
  if (pageBreak){
    var modifier = {
      extraOpenTags: '<div class=pageBreak contentEditable=false>',
      extraCloseTags: '</div>',
      cls: cls
    };
    return [modifier];
  }
  return [];
};

function doInsertPageBreak(){
  this.editorInfo.ace_doReturnKey();
  var rep = this.rep;
  var documentAttributeManager = this.documentAttributeManager;
  if (!(rep.selStart && rep.selEnd)){ return; } // only continue if we have some caret position
  var firstLine = rep.selStart[0]; // Get the first line
  var lastLine = Math.max(firstLine, rep.selEnd[0] - ((rep.selEnd[1] === 0) ? 1 : 0)); // Get the last line
  _(_.range(firstLine, lastLine + 1)).each(function(i){ // For each line, either turn on or off task list
    var isPageBreak = documentAttributeManager.getAttributeOnLine(i, 'pageBreak');
    if(!isPageBreak){ // if its already a PageBreak item
      documentAttributeManager.setAttributeOnLine(i, 'pageBreak', 'pageBreak'); // make the line a task list
    }else{
      documentAttributeManager.removeAttributeOnLine(i, 'pageBreak'); // remove the task list from the line
    }
  });
  this.editorInfo.ace_focus();
  this.editorInfo.ace_doReturnKey();
}

// Once ace is initialized, we set ace_doInsertPageBreak and bind it to the context
exports.aceInitialized = function(hook, context){
  var editorInfo = context.editorInfo;
  editorInfo.ace_doInsertPageBreak = _(doInsertPageBreak).bind(context);
}


// Listen for Control Enter and if it is control enter then insert page break
exports.aceKeyEvent = function(hook, callstack, editorInfo, rep, documentAttributeManager, evt){
  var evt = callstack.evt;
  var k = evt.keyCode;
  if(evt.ctrlKey && k == 13 && evt.type == "keyup" ){
    callstack.editorInfo.ace_doInsertPageBreak();
    evt.preventDefault();
    return true;
  }else{
    return;
  }
}

exports.aceEditEvent = function(hook, callstack, editorInfo, rep, documentAttributeManager){
  // If we're not in page view mode just hide all the things
  if($('#options-pageview').is(':checked')) {}else{
    $('.pageBreakComputed').remove();
    return false;
  }

  // Handle redrawing the page
  if(!callstack.callstack.docTextChanged) return;

  var lines = {};
  var yHeight = 922.5; // This is dirty and I feel bad for it..
  var lineNumber = 0;

  var HTMLLines = $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").children("div");
  $('.pageBreakComputed').remove();

 $(HTMLLines).each(function(){ // For each line
    var y = $(this).context.offsetTop;
    var id = $(this)[0].id; // get the id of the link
    var height = $(this).height();

    // How many PX since last break?
    var lastLine = lineNumber-1;
    if(!lines[lastLine]){
      var previousY = 0;
      var pxSinceLastBreak = 0;
    }else{
      var previousY = lines[lastLine].pxSinceLastBreak;
      var pxSinceLastBreak = previousY + height;
    }

    // Does it already have any children with teh class pageBreak?
    var manualBreak = $(this).children().hasClass("pageBreak");

    // If it's a manualBreak then reset pxSinceLastBreak to 0;
    if(manualBreak) pxSinceLastBreak = 0;

    // Should this be a line break?
    var computedBreak = ((pxSinceLastBreak + height) >= yHeight);
    if(computedBreak){
      // console.log(id, "should be a page break");

      // is it already a page break?
      var isAlreadyPageBreak = $(this).find(".pageBreakComputed").length != 0;

      // console.log( "iPB", isAlreadyPageBreak );

      // If it's not already a page break append a page break
      if(!isAlreadyPageBreak)  $(this).append("<div class='pageBreakComputed' contentEditable=false></div>");
      pxSinceLastBreak = 0;
    }

    lines[lineNumber] = {
      pxSinceLastBreak : pxSinceLastBreak,
      manualBreak : manualBreak,
      computedBreak : computedBreak,
      id : id,
      y : y,
      height : height

    }
    lineNumber++;
  });
}
