var isMobile = require('ep_etherpad-lite/static/js/ace2_common').browser.mobile;

if (!isMobile) {
  var postAceInit = function(hook, context){

    /* Check on Init */
    if($('#options-pageview').attr('checked')) {
      enablePageView();
    } else {
      disablePageView();
    }
   
    /* Check on Click */
    $('#options-pageview').on('click', function(){
      if($('#options-pageview').attr('checked')) {
        enablePageView();
      } else {
        disablePageView();
      }
    });

    function enablePageView(){
      $('#editorcontainer').addClass('page_view');
      $('iframe').addClass('page_view');

    }

    function disablePageView(){
      $('#editorcontainer').removeClass('page_view');
      $('iframe').removeClass('page_view');
    }
  };

  exports.postAceInit = postAceInit;
} else {
  $('input#options-pageview').hide();
  $('label[for=options-pageview]').hide();
}

