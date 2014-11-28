describe("Page View", function(){
  //create a new pad before each test run
  beforeEach(function(cb){
    helper.newPad(cb);
    this.timeout(60000);
  });

  // Create Pad
   // Disable Page View & Ensure Page View is disabled
     // Enable Page View & Ensure Page View is enabled
       // Ensure Page View is persistant on refresh after enabled

  it("Disable Page View", function(done) {
    this.timeout(60000);
    var chrome$ = helper.padChrome$;
    if(chrome$('#options-pageview').attr("checked")) chrome$('#options-pageview').click();
    var $editorContainer = chrome$("#editorcontainer");

    helper.waitFor(function(){
      return !$editorContainer.hasClass("page_view");
    }).done(function(){
      expect($editorContainer.hasClass("page_view")).to.be(false);
      done();
    });
  });

  it("Enable Page View", function(done) {
    this.timeout(60000);
    var chrome$ = helper.padChrome$;
    if(!chrome$('#options-pageview').attr("checked")) chrome$('#options-pageview').click();
    var $editorContainer = chrome$("#editorcontainer");

    helper.waitFor(function(){
      return $editorContainer.hasClass("page_view");
    }).done(function(){
      expect($editorContainer.hasClass("page_view")).to.be(true);
      done();
    });
  });

  it("Ensure Page View is persistant on refresh after enabled", function(done) {
    this.timeout(60000);
    var chrome$ = helper.padChrome$;
    var $editorContainer = chrome$("#editorcontainer");

    helper.waitFor(function(){
      return $editorContainer.hasClass("page_view");
    }).done(function(){
      expect($editorContainer.hasClass("page_view")).to.be(true);
      done();
    });
  });

});
