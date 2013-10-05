var isMobile = $.browser.mobile;

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
  exports.postAceInit = postAceInit;
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
