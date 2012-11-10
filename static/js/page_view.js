var postAceInit = function(hook, context){
  /* Check on Init */
  if($('#options-pageview').attr('checked')) {
    enablePageView();
  } else {
    disablePageView();
  }
 
  /* Check on Cilck */
  $('#options-pageview').on('click', function(){
    if($('#options-pageview').attr('checked')) {
      enablePageView();
    } else {
      disablePageView();
    }
  });

  function enablePageView(){
    $('#sidediv').css("border-right", "1px solid #ccc");
    $('#editorcontainer').css("background-color","#f7f7f7");
    $('#editorcontainer').css("text-align","center");
    $('iframe').css("border", "#CCCCCC solid 1px");
    $('iframe').css("position","relative");
    $('iframe').css("border-radius", "5px");
    $('iframe').css("box-shadow", "0 2px 5px #ddd");
    $('iframe').css("width","800px");
    $('iframe').css("top","27px");
    $('iframe').css("bottom","0px");
  }

  function disablePageView(){
    $('iframe').css("border-radius", "0px");
    $('iframe').css("border", "#CCCCCC solid 0px");
    $('iframe').css("box-shadow", "0px 0px 0px 0px #ddd");
    $('#sidediv').css("border-right", "0px solid #ccc");
    $('iframe').css("width","100%");
    $('iframe').css("top","0px");
  }
};

exports.postAceInit = postAceInit;
