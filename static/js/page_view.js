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
  };
  exports.postAceInit = postAceInit;
} else {
  $('input#options-pageview').hide();
  $('label[for=options-pageview]').hide();
}
