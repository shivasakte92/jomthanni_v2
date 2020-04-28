// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.routes', 'app.services', 'app.directives','firebase'])
.config(function($ionicConfigProvider) {
    //Added config
    //$ionicConfigProvider.views.maxCache(5);
    $ionicConfigProvider.scrolling.jsScrolling(false);
    $ionicConfigProvider.tabs.position('bottom'); // other values: top
})
.run(function($rootScope,$ionicPlatform,$ionicHistory,$rootScope,sharedUtils) {

    $rootScope.extras = false;

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)

    //FCMPlugin.getToken( successCallback(token), errorCallback(err) );
      //Keep in mind the function will return null if the token has not been established yet.
      // if (typeof FCMPlugin != 'undefined') {
      FCMPlugin.getToken(
          function (token) {
              // alert('Token: ' + token);
              console.log('Token: ' + token);
          },
          function (err) {
              // alert('error retrieving token: ' + token);
              console.log('error retrieving token: ' + err);
          }
      );

      FCMPlugin.onNotification(
          function(data){
              if(data.wasTapped){
      //Notification was received on device tray and tapped by the user.
                  // console.log(JSON.stringify(data));
                  sharedUtils.showAlert(JSON.stringify(data));
                  // alert("Tapped: " +  JSON.stringify(data) );
              }else{
      //Notification was received in foreground. Maybe the user needs to be notified.
                  // alert("Not tapped: " + JSON.stringify(data) );
                  // console.log(JSON.stringify(data));
                  sharedUtils.showAlert(JSON.stringify(data.title));
              }
          },
          function(msg){
              // alert('onNotification callback successfully registered: ' + msg);
              console.log('onNotification callback successfully registered: ' + msg);
          },
          function(err){
              // alert('Error registering onNotification callback: ' + err);
              console.log('Error registering onNotification callback: ' + err);
          }
      );

    // }


    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
       StatusBar.styleLightContent();
       // StatusBar.overlaysWebView(true);
       StatusBar.backgroundColorByHexString("#2e5658");
       // ionic.Platform.fullScreen();
    }

  });

        $ionicPlatform.registerBackButtonAction(function(e){
    if ($rootScope.backButtonPressedOnceToExit) {
      ionic.Platform.exitApp();
    }

    else if ($ionicHistory.backView()) {
      $ionicHistory.goBack();
    }
    else {
      $rootScope.backButtonPressedOnceToExit = true;
      window.plugins.toast.showShortCenter(
        "Press back button again to exit",function(a){},function(b){}
      );
      setTimeout(function(){
        $rootScope.backButtonPressedOnceToExit = false;
      },2000);
    }
    e.preventDefault();
    return false;
  },101);


})
