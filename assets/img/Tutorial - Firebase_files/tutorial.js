/*
* Tutorial Player
*
* Designed to populate a page with content when
* data from a firebase is updated.
*/

var tutorialPlayer = {
  stage: null,
  userToken: null,
  hostname: null,


  /*
  * Initialize Player
  *
  */

  initialize: function() {
    var self = this;

    //REGISTER ELEMENTS
    this.stage = $(document.body);
    this.userToken = window.location.hash.replace(/#/, "");
    this.hostname = window.location.hostname;

    //CREATE FIREBASE REFERENCE
    var dataURL = this.getDataURL();
    var tutRef = new Firebase(dataURL);

    //RENDER ON CHANGE
    tutRef.on("value", function(snapshot) {
      self.render(snapshot.val());
    });
  },


  /*
  * Get Data URL
  *
  * Gets url for staging or production environments
  */

  getDataURL: function() {
    var dataURL = "https://firebase-tutorial.firebaseio.com/popouts/" + this.userToken + "";

    // STAGING URL
    if (this.hostname === "sandbox-testing.firebaseapp.com") {
      dataURL = "https://firebase-tutorial.firebaseio-staging.com/popouts/" + this.userToken + "";
    }

    return dataURL;
  },


  /*
  * Render Page
  *
  * Renders the content from Firebase
  */

  render: function(content) {
    //EMPTY PAGE
    this.stage.empty();

    //CREATE NEW IFRAME APPEND TO STAGE
    var tutIframe = document.createElement("iframe");
    $(tutIframe).addClass("l-stage");
    this.stage.append($(tutIframe));

    //POPULATE WITH DATA
    tutIframe.contentWindow.contents = content;
    tutIframe.src = 'javascript:window["contents"]';
  }
};