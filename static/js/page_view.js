var _, $, jQuery;
var $ = require('ep_etherpad-lite/static/js/rjquery').$;
var _ = require('ep_etherpad-lite/static/js/underscore');
var padcookie = require('ep_etherpad-lite/static/js/pad_cookie').padcookie;

exports.postAceInit = function(hook, context){
  var $outerIframeContents = $('iframe[name="ace_outer"]').contents();
  var $innerIframe = $outerIframeContents.find('iframe');
  var $innerdocbody = $innerIframe.contents().find("#innerdocbody");

  var pv = {

    enable: function() {
      if(clientVars.plugins.plugins && clientVars.plugins.plugins.ep_slideshow && clientVars.plugins.plugins.ep_slideshow.isEnabled) return false;
      $('#editorcontainer, iframe').addClass('page_view');
      $innerIframe.addClass('outerPV');
      $outerIframeContents.find('#outerdocbody').addClass("outerBackground");
      $innerdocbody.addClass('innerPV').css("margin-left","0px");

      $innerdocbody.contents().find('.pageBreak').click(function(e){
        $(this).focusout().blur();
        top.console.log("Can't edit pagebreak Line");
        e.preventDefault();
        return false;
      });

      // $('#editorcontainer').css("top", "15px");
      // var containerTop = $('.toolbar').position().top + $('.toolbar').height() +5;
      // $('#editorcontainerbox').css("top", containerTop);
      $('#ep_page_ruler').show();
      // if line numbers are enabled..
      if($('#options-linenoscheck').is(':checked')) {
        $outerIframeContents.find('#sidediv').addClass("lineNumbersAndPageView");
        $innerdocbody.addClass('innerPVlineNumbers');
      }
      reDrawPageBreaks();
      var inner = $('iframe[name="ace_outer"]').contents().find('iframe[name="ace_inner"]');
      var style = "width:850px;margin-left:-102px;height:40px;background-color:#f7f7f7;margin-top:100px;margin-bottom:100px;border-bottom:1px dotted #aaa";
      inner.contents().find("head").append("<style>.pageBreak{"+style+"}</style>");
      inner.contents().find("head").append("<style>.pageBreakComputed{"+style+"}</style>");
    },

    disable: function() {
      $('#options-pageview').prop("checked", false);
      // console.log("disabling");
      $('#editorcontainer, iframe').removeClass('page_view');
      $innerdocbody.removeClass('innerPV');
      $innerIframe.removeClass('outerPV');
      $innerdocbody.css("margin-left","-100px");
      $outerIframeContents.find('#outerdocbody').removeClass("outerBackground");
      $('#ep_page_ruler').hide();

      if($('#options-linenoscheck').is(':checked')) {
        $outerIframeContents.find('#sidediv').removeClass("lineNumbersAndPageView");
        $innerdocbody.removeClass('innerPVlineNumbers');
      }
      reDrawPageBreaks();
      var inner = $('iframe[name="ace_outer"]').contents().find('iframe[name="ace_inner"]');
      var style = "width:100%;margin-left:0;height:10px;background-color:transparent;margin-top:5px;margin-bottom:5px;border-bottom:none;";
      inner.contents().find("head").append("<style>.pageBreak{"+style+"}</style>");
      inner.contents().find("head").append("<style>.pageBreakComputed{"+style+"}</style>");
    },

    pageBreaksEnable: function(){
      var inner = $('iframe[name="ace_outer"]').contents().find('iframe[name="ace_inner"]');
      inner.contents().find("head").append("<style>.pageBreak{display:block;}</style>");
      inner.contents().find("head").append("<style>.pageBreakComputed{display:block;}</style>");
    },
    pageBreaksDisable: function(){
      var inner = $('iframe[name="ace_outer"]').contents().find('iframe[name="ace_inner"]');
      inner.contents().find("head").append("<style>.pageBreak{display:none;}</style>");
      inner.contents().find("head").append("<style>.pageBreakComputed{display:none;}</style>");
    }
  }

  clientVars.plugins.plugins.ep_page_view.enable = pv.enable;
  clientVars.plugins.plugins.ep_page_view.disable = pv.disable;
  clientVars.plugins.plugins.ep_page_view.pageBreaksEnable = pv.pageBreaksEnable;
  clientVars.plugins.plugins.ep_page_view.pageBreaksDisable = pv.pageBreaksDisable;

  /* init */
  /* from URL param */
  var urlContainspageviewTrue = (getParam("pageview") == "true"); // if the url param is set
  if(urlContainspageviewTrue){
    $('#options-pageview').prop('checked',true);
  }else if (getParam("pageview") == "false"){
    $('#options-pageview').prop('checked',false);
  }

  /* from cookie */
  // page view
  if (padcookie.getPref("page_view")) {
    $('#options-pageview').prop('checked', true);
    // set a value we will refer to later and other plugins will refer to
    clientVars.plugins.plugins.ep_page_view.enabled = true;
  }else if (padcookie.getPref("page_view") == false){
    // only disable PV if cookie is set to disabled it. If cookie is not set, we do nothing
    $('#options-pageview').prop("checked", false);
  }

  if($('#options-pageview').is(':checked')) {
    pv.enable();
    // set a value we will refer to later and other plugins will refer to
    clientVars.plugins.plugins.ep_page_view.enabled = true;
  } else {
    pv.disable();
    // set a value we will refer to later and other plugins will refer to
    clientVars.plugins.plugins.ep_page_view.enabled = false;
  }

  // page breaks
  if (padcookie.getPref("page_breaks")) {
    $('#options-pagebreaks').prop('checked', true);
    pv.pageBreaksEnable();
    // set a value we will refer to later and other plugins will refer to
    clientVars.plugins.plugins.ep_page_view.pageBreaksEnabled = true;
  }else{
    $('#options-pagebreaks').prop("checked", false);
  }
  if($('#options-pagebreaks').is(':checked')) {
    pv.pageBreaksEnable();
    // set a value we will refer to later and other plugins will refer to
    clientVars.plugins.plugins.ep_page_view.pageBreaksEnabled = true;
  } else {
    pv.pageBreaksDisable();
    // set a value we will refer to later and other plugins will refer to
    clientVars.plugins.plugins.ep_page_view.pageBreaksEnabled = false;
  }

  /* on click */
  $('#options-pageview').on('click', function() {
    if($('#options-pageview').is(':checked')) {
      pv.enable();
      padcookie.setPref("page_view", true);
    } else {
      pv.disable();
      padcookie.setPref("page_view", false);
    }
  });
  $('#options-pagebreaks').on('click', function() {
    if($('#options-pagebreaks').is(':checked')) {
      pv.pageBreaksEnable();
      padcookie.setPref("page_breaks", true);
    } else {
      pv.pageBreaksDisable();
      padcookie.setPref("page_breaks", false);
    }
  });
  // line numbers
  $('#options-linenoscheck').on('click', function() {
    if($('#options-linenoscheck').is(':checked') && $('#options-pageview').is(':checked')) {
      $outerIframeContents.find('#sidediv').addClass("lineNumbersAndPageView");
      $innerdocbody.addClass('innerPVlineNumbers');
    } else {
      $outerIframeContents.find('#sidediv').removeClass("lineNumbersAndPageView");
      $innerdocbody.removeClass('innerPVlineNumbers');
    }
  });

  // Bind the event handler to the toolbar buttons
  $('#insertPageBreak').on('click', function(){
    context.ace.callWithAce(function(ace){
      ace.ace_doInsertPageBreak();
    },'insertPageBreak' , true);
  });

  if(!clientVars.plugins.plugins) clientVars.plugins.plugins = {};
};


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

function doRemovePageBreak(){
  // Backspace events means you might want to remove a line break, this stops the text ending up
  // on the same line as the page break..
  var rep = this.rep;
  var documentAttributeManager = this.documentAttributeManager;
  if (!(rep.selStart && rep.selEnd)){ return; } // only continue if we have some caret position
  var firstLine = rep.selStart[0]; // Get the first line
  var line = rep.lines.atIndex(firstLine);

  // If it's actually a page break..
  if(line.lineNode && (line.lineNode.firstChild && line.lineNode.firstChild.className === "pageBreak")){
    documentAttributeManager.removeAttributeOnLine(firstLine, 'pageBreak'); // remove the page break from the line
    // TODO: Control Z can make this kinda break

    // Get the document
    var document = this.editorInfo.ace_getDocument();

    // Update the selection from the rep
    this.editorInfo.ace_updateBrowserSelectionFromRep();

    // Get the current selection
    var myselection = document.getSelection();

    // Get the selections top offset
    var caretOffsetTop = myselection.focusNode.offsetTop;

    // Move to the new Y co-ord to bring the new page into focus
    $('iframe[name="ace_outer"]').contents().find('#outerdocbody').scrollTop(caretOffsetTop-120); // Works in Chrome
    $('iframe[name="ace_outer"]').contents().find('#outerdocbody').parent().scrollTop(caretOffsetTop-120); // Works in Firefox
    // Sighs
  }
}

function doInsertPageBreak(){
  this.editorInfo.ace_doReturnKey();
  var rep = this.rep;
  var documentAttributeManager = this.documentAttributeManager;
  if (!(rep.selStart && rep.selEnd)){ return; } // only continue if we have some caret position
  var firstLine = rep.selStart[0]; // Get the first line
  var lastLine = Math.max(firstLine, rep.selEnd[0] - ((rep.selEnd[1] === 0) ? 1 : 0)); // Get the last line
  _(_.range(firstLine, lastLine + 1)).each(function(i){ // For each line, either turn on or off page break
    var isPageBreak = documentAttributeManager.getAttributeOnLine(i, 'pageBreak');
    if(!isPageBreak){ // if its already a PageBreak item
      documentAttributeManager.setAttributeOnLine(i, 'pageBreak', 'pageBreak'); // make the line a page break
    }else{
      documentAttributeManager.removeAttributeOnLine(i, 'pageBreak'); // remove the page break from the line
    }
  });

  // Get caret focus
  this.editorInfo.ace_focus();

  // Insert a line
  this.editorInfo.ace_doReturnKey();

  // Get the document
  var document = this.editorInfo.ace_getDocument();

  // Update the selection from the rep
  this.editorInfo.ace_updateBrowserSelectionFromRep();

  // Get the current selection
  var myselection = document.getSelection();

  // Get the selections top offset
  var caretOffsetTop = myselection.focusNode.offsetTop;

  // Move to the new Y co-ord to bring the new page into focus
  $('iframe[name="ace_outer"]').contents().find('#outerdocbody').scrollTop(caretOffsetTop-120); // Works in Chrome
  $('iframe[name="ace_outer"]').contents().find('#outerdocbody').parent().scrollTop(caretOffsetTop-120); // Works in Firefox
  // Sighs
}

// Once ace is initialized, we set ace_doInsertPageBreak and bind it to the context
exports.aceInitialized = function(hook, context){
  var editorInfo = context.editorInfo;
  editorInfo.ace_doInsertPageBreak = _(doInsertPageBreak).bind(context);
  editorInfo.ace_doRemovePageBreak = _(doRemovePageBreak).bind(context);
}

// Listen for Control Enter and if it is control enter then insert page break
// Also listen for Up key to see if we need to replace focus at position 0.
exports.aceKeyEvent = function(hook, callstack, editorInfo, rep, documentAttributeManager, evt){
  var evt = callstack.evt;
  var k = evt.keyCode;

  // Control Enter
  // Note: We use keydown here to stop enter -> paste quick events firing a new page
  if(evt.ctrlKey && k == 13 && evt.type == "keydown" ){
    callstack.editorInfo.ace_doInsertPageBreak();
    evt.preventDefault();
    return true;
  }

  // Up arrow so we can handle up arrow at top of document regain focus to 0 offset
  if(k == 38){
    var selStart = callstack.rep.selStart;
    var selEnd = callstack.rep.selEnd;
    if(selStart[0] == 0 && selStart[1] == 0 && selEnd[0] == 0 && selEnd[1] == 0){
      // Move to the new Y co-ord to bring the new page into focus
      var $outerdocbody = $('iframe[name="ace_outer"]').contents().find('#outerdocbody');
      $outerdocbody.scrollTop(0); // Works in Chrome
      $outerdocbody.parent().scrollTop(0); // Works in Firefox
      // Sighs
    }
    return true;
  }

  // Backspace deletes full line above if it is a pagebreak
  if(k == 8 && evt.type == "keyup"){
    callstack.editorInfo.ace_doRemovePageBreak();
  }
  return;
}

exports.aceEditEvent = function(hook, callstack, editorInfo, rep, documentAttributeManager){
  // This seems a little too often to run
  // If we're not in page view mode just hide all the things
  if($('#options-pageview').is(':checked')) {}else{
    $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").children("div").find('.pageBreakComputed').remove();
    return false;
  }

  // Some more times to drop
  if(callstack.callstack.type == "handleClick" || callstack.callstack.type == "idleWorkTimer" || !callstack.callstack.docTextChanged){
    // console.log("not doing anything so it's all good", callstack);
  }else{
    // console.log("aceEditEvent so redrawing", callstack);
    // Redraw Page Breaks
    reDrawPageBreaks();
  }
}

reDrawPageBreaks = function(){
  // console.log("redrawing");
  var lines = {};
  var yHeight = 922.5; // This is dirty and I feel bad for it..
  var lineNumber = 0;
  var pages = []; // Array of Y px of each page.

  var HTMLLines = $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").children("div");

  // Remove all computed page breaks
  $('iframe[name="ace_outer"]').contents().find('iframe').contents().find("#innerdocbody").children("div").find('.pageBreakComputed').remove();

  $(HTMLLines).each(function(){ // For each line
    var y = $(this).context.offsetTop; // y is the offset of this line
    var id = $(this)[0].id; // get the id of the link
    var height = $(this).height(); // the height of the line

    // How many PX since last break?
    var lastLine = lineNumber-1;

    // Note that this is written like this because I don't trust using y offsets..
    if(!lines[lastLine]){ // if this is the first line..
      // console.log("First line");
      var previousY = 0;
      var pxSinceLastBreak = 0;
    }else{ // we're not processing the first line
      if(lines[lastLine].pxSinceLastBreak == 0){ // if it's the second line..
        // if it's getting the px of the first line..
        var previousY = lines[lastLine].height;
      }else{
        var previousY = lines[lastLine].pxSinceLastBreak;
      }
      var pxSinceLastBreak = previousY + height;
    }

    // Does it already have any children with teh class pageBreak?
    var manualBreak = $(this).children().hasClass("pageBreak");

    // Debug statement for lulz
    // console.log(this, manualBreak); // This bit is fine

    // If it's a manualBreak then reset pxSinceLastBreak to 0;
    if(manualBreak){
      pxSinceLastBreak = 0;
      // console.log("MANUAL pxSinceLastBreak", pxSinceLastBreak, "height", height);
      pages.push(pxSinceLastBreak + height);
    }

    // Should this be a line break?
    var computedBreak = ((pxSinceLastBreak + height) >= yHeight);
    if(computedBreak){
      // console.log(id, "should be a page break");

      // is it already a page break?
      var isAlreadyPageBreak = $(this).find(".pageBreakComputed").length != 0;

      // console.log( "iPB", isAlreadyPageBreak );

      // If it's not already a page break append a page break
      if(!isAlreadyPageBreak){
        // console.log("Adding break as PX since last break is ", pxSinceLastBreak + height);
        $(this).append("<div class='pageBreakComputed' contentEditable=false></div>");
        // console.log("AUTOMATIC pxSinceLastBreak", pxSinceLastBreak, "height", height);
        pages.push(pxSinceLastBreak + height);

      }
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

  // Debuggable object containing all lines status
  // if(lines) console.log("Lines", lines);
  // if(pages) console.log("Pages", pages);

}
