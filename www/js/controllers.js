angular.module('app.controllers', ['ionic', 'ngCordova'])

.controller('loginCtrl', function($scope,$rootScope,$ionicHistory,sharedUtils,$state,$ionicSideMenuDelegate) {
  sharedUtils.hideLoading();
$rootScope.extras = false;  // For hiding the side bar and nav icon

// When the user logs out and reaches login page,
// we clear all the history and cache to prevent back link
$scope.$on('$ionicView.enter', function(ev) {
  if(ev.targetScope !== $scope){
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
  }
});

//Check if user already logged in
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

    var defaultAuth = firebase.auth();
    // console.log(defaultAuth);

    $ionicHistory.nextViewOptions({
      historyRoot: true
    });
// $ionicSideMenuDelegate.canDragContent(true);  // Sets up the sideMenu dragable
$rootScope.extras = true;
sharedUtils.hideLoading();
$state.go('menu2', {}, {location: "replace"});

}
});

$scope.facebookSignIn = function() {
  sharedUtils.showLoading();
  facebookConnectPlugin.getLoginStatus(function(success){
    if(success.status === 'connected'){
// The user is logged in and has authenticated your app, and response.authResponse supplies
// the user's ID, a valid access token, a signed request, and the time the access token
// and signed request each expire

var credential = firebase.auth.FacebookAuthProvider.credential(success.authResponse.accessToken);
firebase.auth().signInWithCredential(credential).then(function(result) {
// This gives you a Facebook Access Token. You can use it to access the Facebook API.
var token = result;
sharedUtils.hideLoading();
sharedUtils.showAlert("Login Success!","You have logged in with you Facebook ID");
$state.go('menu2', {}, {location: "replace"});
// The signed-in user info.
var user = result.user;
// ...
}).catch(function(error) {
// Handle Errors here.
var errorCode = error.code;
var errorMessage = error.message;
// The email of the user's account used.
var email = error.email;
// The firebase.auth.AuthCredential type that was used.
var credential = error.credential;
// ...
});

} else {       
// If (success.status === 'not_authorized') the user is logged in to Facebook,
// but has not authenticated your app
// Else the person is not logged into Facebook,
// so we're not sure if they are logged into this app or not.
// Ask the permissions you need. You can learn more about
// FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4

var fbLoginSuccess = function(response) {

  var credential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);
  firebase.auth().signInWithCredential(credential).then(function(result) {
// This gives you a Facebook Access Token. You can use it to access the Facebook API.
var token = result;
sharedUtils.hideLoading();
sharedUtils.showAlert("Login Success!","You have logged in with you Facebook ID");
$state.go('menu2', {}, {location: "replace"});
// The signed-in user info.
var user = result.user;
// ...
}).catch(function(error) {
// Handle Errors here.
var errorCode = error.code;
var errorMessage = error.message;
// The email of the user's account used.
var email = error.email;
// The firebase.auth.AuthCredential type that was used.
var credential = error.credential;
// ...
});

if (!response.authResponse){
  fbLoginError("Cannot find the authResponse");
  return;
}

var authResponse = response.authResponse;

}

// This is the fail callback from the login method
var fbLoginError = function(error){
  sharedUtils.hideLoading();
  sharedUtils.showAlert("Login Failed!","Please make sure you have logged into your FB app");
}

facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
}
});
};

$scope.loginEmail = function(formName,cred) {

if(formName.$valid || formName==null) {  // Check if the form data is valid or not

  sharedUtils.showLoading();
//Email
firebase.auth().signInWithEmailAndPassword(cred.email,cred.password).then(function(result) {
// You dont need to save the users session as firebase handles it
// You only need to :
// 1. clear the login page history from the history stack so that you cant come back
// 2. Set rootScope.extra;
// 3. Turn off the loading
// 4. Got to menu page
// console.log(result);
$ionicHistory.nextViewOptions({
  historyRoot: true
});
$rootScope.extras = true;
// sharedUtils.hideLoading();
$state.go('menu2', {}, {location: "replace"});

},
function(error) {
  // console.log("Here");
  var errorCode = error.code;
  var errorMessage = error.message;
  // console.log(errorCode);
  // console.log(errorMessage);
  sharedUtils.hideLoading();
  sharedUtils.showAlert("Please note","Authentication Error");
}
);

}else{
  sharedUtils.hideLoading();
  sharedUtils.showAlert("Please note","Entered data is not valid");
}

};

$scope.signinEmail = function() {

  $state.go('signup', {}, {location: "replace"});

};

$scope.exploreMenu = function() {

  $ionicHistory.nextViewOptions({
    historyRoot: true
  });
  $rootScope.extras = true;
// sharedUtils.hideLoading();
$state.go('menu2', {}, {location: "replace"});

};

$scope.loginFb = function(){
//Facebook Login
};

$scope.loginGmail = function(){
//Gmail Login
};

})

//-------------------------------------------------------------------------------------------------------------------------------------

.controller('signupCtrl', function($scope,$rootScope,sharedUtils,$ionicSideMenuDelegate,
  $state,fireBaseData,$ionicHistory) {
$rootScope.extras = false; // For hiding the side bar and nav icon

$scope.signupEmail = function (formName, cred) {

if (formName.$valid) {  // Check if the form data is valid or not

  sharedUtils.showLoading();

//Main Firebase Authentication part
firebase.auth().createUserWithEmailAndPassword(cred.email, cred.password).then(function (result) {

  result.user.updateProfile({
    displayName: cred.name
  })
//Add phone number to the user table
firebase.database().ref('users').child(result.user.uid).set({
  user_name: cred.name,
  user_mail: cred.email
});

//Registered OK
$ionicHistory.nextViewOptions({
  historyRoot: true
});
// $ionicSideMenuDelegate.canDragContent(true);  // Sets up the sideMenu dragable
$rootScope.extras = true;
sharedUtils.hideLoading();
$state.go('menu2', {}, {location: "replace"});

}, function (error) {
  sharedUtils.hideLoading();
  sharedUtils.showAlert("Please note","Sign up Error");
});

}else{
  sharedUtils.showAlert("Please note","Entered data is not valid");
}

}

$scope.exploreMenu = function() {

  $ionicHistory.nextViewOptions({
    historyRoot: true
  });
  $rootScope.extras = true;
// sharedUtils.hideLoading();
$state.go('menu2', {}, {location: "replace"});

};

})

//-------------------------------------------------------------------------------------------------------------------------------------

.controller('menu2Ctrl', function($scope,$rootScope,$ionicSideMenuDelegate,fireBaseData,$state,
  $ionicHistory,$firebaseArray,sharedCartService,sharedUtils, $ionicModal, $timeout, $stateParams, $ionicSlideBoxDelegate, $ionicPopup) {

  var total_qty=0;
  var restriction_qty=0;

sharedUtils.showLoading();

// On Loggin in to menu page, the sideMenu drag state is set to true
// $ionicSideMenuDelegate.canDragContent(false);
$rootScope.extras=true;

// When user visits A-> B -> C -> A and clicks back, he will close the app instead of back linking
$scope.$on('$ionicView.enter', function(ev) {
  if(ev.targetScope !== $scope){
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
  }
});

var currentUser;

//Check if user already logged in
firebase.auth().onAuthStateChanged(function(user) {

  var user_token = firebase.auth().currentUser.uid;

  // sharedUtils.showLoading();
  if (user) {
$scope.user_info=user; //Saves data to user_info
currentUser=user;

firebase.database().ref('cart').child(user.uid).on('value', function(_snapshot){

  total_qty=0;
  restriction_qty=0;

          _snapshot.forEach(function (childSnapshot){
              var element = childSnapshot.val();
              // element.id = childSnapshot.key;
              total_qty += element.item_qty;
              // result.push(element);
              if(element.restriction == 'yes'){

                restriction_qty += element.item_qty;

              }
            });

        });

function orderAgain(){
  firebase.database().ref('completedOrders').child(user.uid).on('value', function(_snapshot){

    var result = [];

    _snapshot.forEach(function (childSnapshot){
      var index;

      childSnapshot.forEach(function (childSnapshot2){
        var element = childSnapshot2.val();
        result.push(element);

      })
    });

    var uniq = {}
    var arrFiltered = result.filter(obj => !uniq[obj.item_name] && (uniq[obj.item_name] = true));

    $scope.orderAgain = arrFiltered.reverse();

    // $timeout(function(){
    //   $scope.orderAgain = arrFiltered.reverse();
    //   $state.transitionTo($state.current, $stateParams, {
    //     reload: true,
    //     inherit: false,
    //     notify: true
    //   });
    //   // sharedUtils.hideLoading();
    // }, 1000);

  });
}

orderAgain();

}else {

  $scope.user_info = null;

}
});

$scope.loadMenu = function() {

  $scope.menu=$firebaseArray(fireBaseData.refMenu());

  firebase.database().ref('promotions').on('value', function(_snapshot){

    var result = [];

    _snapshot.forEach(function (childSnapshot){
      var element = childSnapshot.val();
      element.id = childSnapshot.key;
      result.push(element);
    });

      $scope.promotions = result;
      $ionicSlideBoxDelegate.update();
      $ionicSlideBoxDelegate.loop(true)

    // $timeout(function(){
    //   $scope.promotions = result;
    //   // console.log($scope.promotions);
    //   $ionicSlideBoxDelegate.update();
    //   $ionicSlideBoxDelegate.loop(true)
    //   $state.transitionTo($state.current, $stateParams, {
    //     reload: true,
    //     inherit: false,
    //     notify: true
    //   });
    //   // sharedUtils.hideLoading();
    // }, 1000);

  });

}

function loadPopularItems(){
  firebase.database().ref('popularItems').on('value', function(_snapshot){

    var result = [];

    _snapshot.forEach(function (childSnapshot){
      var element = childSnapshot.val();
      element.id = childSnapshot.key;
      result.push(element);
    });

    $scope.popularItems = result;

    // $timeout(function(){
    //   $scope.popularItems = result;
    //   $state.transitionTo($state.current, $stateParams, {
    //     reload: true,
    //     inherit: false,
    //     notify: true
    //   });
    //   // sharedUtils.hideLoading();
    // }, 1000);

  });
}

loadPopularItems();

function loadAnnouncements(){
  firebase.database().ref('announcements').on('value', function(_snapshot){

    announcements = [];

    _snapshot.forEach(function (childSnapshot){
      var element = childSnapshot.val();
      element.id = childSnapshot.key;
      announcements.push(element);
    });

    $scope.announcements = announcements;

    // $timeout(function(){
    //   $scope.announcements = announcements;
    //   $state.transitionTo($state.current, $stateParams, {
    //     reload: true,
    //     inherit: false,
    //     notify: true
    //   });
    //   sharedUtils.hideLoading();
    // }, 1000);

    sharedUtils.hideLoading();

  });
}

loadAnnouncements();

    //Add to Cart
    $scope.addToCart = function(item) {
      //check if item is already added or not
      firebase.database().ref('cart').child(currentUser.uid).once("value", function(snapshot) {

    if(item.category=='Tobacco'||item.category=='Others'||item.category=='Accessories'){

      if( snapshot.hasChild(item.id) == true ){

          //if item is already in the cart
          var currentQty = snapshot.child(item.id).val().item_qty;

          firebase.database().ref('cart/').child(currentUser.uid).child(item.id).update({   // update
            item_qty : currentQty+1,
            item_total_price: (item.price*(currentQty+1))
          });

        }else{

          var alertPopup = $ionicPopup.alert({
             title: 'Item Added!',
             template: 'You can view them in your cart'
           });
           alertPopup.then(function(res) {
           });

          //if item is new in the cart
          firebase.database().ref('cart/').child(currentUser.uid).child(item.id).set({    // set
            item_name: item.item_name,
            item_image: item.URL,
            item_price: item.price,
            item_qty: 1,
            item_total_price: (item.price*1),
            category: item.category,
            user: firebase.auth().currentUser.email
          });
          
        }

    }else{

      if(restriction_qty<=2){

        if( snapshot.hasChild(item.id) == true ){

          //if item is already in the cart
          var currentQty = snapshot.child(item.id).val().item_qty;

          firebase.database().ref('cart/').child(currentUser.uid).child(item.id).update({   // update
            item_qty : currentQty+1,
            item_total_price: (item.price*(currentQty+1))
          });

        }else{

          var alertPopup = $ionicPopup.alert({
             title: 'Item Added!',
             template: 'You can view them in your cart'
           });
           alertPopup.then(function(res) {
           });

          //if item is new in the cart
          firebase.database().ref('cart/').child(currentUser.uid).child(item.id).set({    // set
            item_name: item.item_name,
            item_image: item.URL,
            item_price: item.price,
            item_qty: 1,
            item_total_price: (item.price*1),
            category: item.category,
            restriction: 'yes',
            user: firebase.auth().currentUser.email
          });

        }

      }else{
          var alertPopup = $ionicPopup.alert({
             title: 'Maximum item limit!',
             template: 'You have reached the maximum item limit for Spirit, Wine and Beer'
           });
           alertPopup.then(function(res) {
           });
      }

        }

      });
    };

})

//-------------------------------------------------------------------------------------------------------------------------------------

.controller('offersCtrl', function($scope,$rootScope) {
//We initialise it on all the Main Controllers because, $rootScope.extra has default value false
// So if you happen to refresh the Offer page, you will get $rootScope.extra = false
//We need $ionicSideMenuDelegate.canDragContent(true) only on the menu, ie after login page
$rootScope.extras=true;

})

//-------------------------------------------------------------------------------------------------------------------------------------

.controller('indexCtrl', function($scope,$rootScope,sharedUtils,$ionicHistory,$state,$ionicSideMenuDelegate,sharedCartService,$timeout) {
//Check if user already logged in
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
$scope.user_info=user; //Saves data to user_info

//Only when the user is logged in, the cart qty is shown
//Else it will show unwanted console error till we get the user object
$scope.get_total= function() {
  var total_qty=0;
  // console.log(sharedCartService.cart_items);

  // result = [];
  firebase.database().ref('cart').child(user.uid).on('value', function(_snapshot){

          _snapshot.forEach(function (childSnapshot){
              var element = childSnapshot.val();
              // element.id = childSnapshot.key;
              total_qty += element.item_qty;
              // result.push(element);
            });

        });

  // if(sharedCartService.cart_items !== undefined){
    
  // }

  // console.log(result);

//   if(sharedCartService.cart_items !== undefined){
//   for (var i = 0; i < sharedCartService.cart_items.length; i++) {
//     total_qty += sharedCartService.cart_items[i].item_qty;
//   }
// }
  return total_qty;
};

if ($scope.user_info.photoURL !== null){
  $scope.avatar = $scope.user_info.photoURL+"?type=large";
}else{
  $scope.avatar = "img/avatar.jpg";
}

}
else {

  $state.go('login', {}, {location: "replace"});

}
});

$scope.logout=function(){

  sharedUtils.showLoading();

// Main Firebase logout
firebase.auth().signOut().then(function() {

  facebookConnectPlugin.logout(function(){
  },
  function(fail){
    sharedUtils.hideLoading();
  });

  $ionicHistory.clearHistory();
  $ionicHistory.clearCache();

$ionicSideMenuDelegate.toggleLeft(); //To close the side bar
// $ionicSideMenuDelegate.canDragContent(false);  // To remove the sidemenu white space

$ionicHistory.nextViewOptions({
  historyRoot: true
});


$rootScope.extras = false;
sharedUtils.hideLoading();
$state.go('login', {}, {location: "replace"});

}, function(error) {
  sharedUtils.showAlert("Error","Logout Failed")
});

$timeout(function () {
  $ionicHistory.clearCache();
  $ionicHistory.clearHistory();
}, 1500)

}

})

//-------------------------------------------------------------------------------------------------------------------------------------

.controller('myCartCtrl', function($scope,$rootScope,$state,sharedCartService,sharedUtils,$timeout,$stateParams,$ionicPopup) {

  $rootScope.extras=true;
  var restriction_qty=0;

//Check if user already logged in
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
      // $scope.cart=sharedCartService.cart_items;
      firebase.database().ref('cart').child(user.uid).on('value', function(_snapshot){

          $scope.total_qty=0;
          $scope.total_amount=0;
          restriction_qty=0;
          result = [];

          _snapshot.forEach(function (childSnapshot){
            var element = childSnapshot.val();
            element.id = childSnapshot.key;
            $scope.total_qty += element.item_qty;
            $scope.total_amount += (element.item_qty * element.item_price);
            result.push(element);
            if(element.restriction == 'yes'){

                restriction_qty += element.item_qty;

              }
          });

            $scope.cart = result;

        });

  }else{

    }

});

$scope.removeFromCart=function(c_id){
  // console.log(c_id);
  sharedCartService.drop(c_id);
};

$scope.inc=function(item){
    if(item.category=='Tobacco'||item.category=='Others'||item.category=='Accessories'){
      sharedCartService.increment(item.id);
  }else{

    if(restriction_qty<=2){
  sharedCartService.increment(item.id);
  }else{
          var alertPopup = $ionicPopup.alert({
             title: 'Maximum item limit!',
             template: 'You have reached the maximum item limit for Spirit, Wine and Beer'
           });
           alertPopup.then(function(res) {
           });
      }

  }
  // console.log(c_id);
  
};

$scope.dec=function(c_id){
  sharedCartService.decrement(c_id);
};

$scope.checkout=function(){


  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {

      if ($scope.total_amount+10>=50){

        $state.go('checkout', {}, {location: "replace"});

      }else{
        sharedUtils.showAlert("Please note","Minimum order limit is RM50");
      }

    }else{

      sharedUtils.showAlert("Please note","You are required to sign up or login first!");
      $state.go('login', {}, {location: "replace"});

    }

  });
};

})

//-------------------------------------------------------------------------------------------------------------------------------------

.controller('lastOrdersCtrl', function($scope,$rootScope,fireBaseData,sharedUtils,$state,$stateParams,$timeout) {

  $rootScope.extras = true;
  sharedUtils.showLoading();
//Check if user already logged in
firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    $scope.user_info = user;

    function loadData(){
      firebase.database().ref('orders').child(user.uid).on('value', function(_snapshot){

        var result = [];

        _snapshot.forEach(function (childSnapshot){
          var element = childSnapshot.val();
          var total_price = 10;
          var time;

          firebase.database().ref('orders').child(user.uid).child(childSnapshot.key).on('value', function(_snapshot2){
            _snapshot2.forEach(function (childSnapshot2){
              var price = childSnapshot2.val().price;
              total_price = parseInt(total_price)+(parseInt(price)*parseInt(childSnapshot2.val().item_qty));
              time = childSnapshot2.val().time;
            })

          })
          result.push({ id: childSnapshot.key, total_price: total_price, time: time});

        });

        $timeout(function(){
          $scope.assetCollection = result.reverse();
          $state.transitionTo($state.current, $stateParams, {
            reload: true,
            inherit: false,
            notify: true
          });
          sharedUtils.hideLoading();
        }, 1000);

      });
    }

    loadData();

    function loadPastOrders(){
      firebase.database().ref('completedOrders').child(user.uid).on('value', function(_snapshot){

        var result = [];

        _snapshot.forEach(function (childSnapshot){
          var element = childSnapshot.val();
          var total_price = 10;
          var time;

          firebase.database().ref('completedOrders').child(user.uid).child(childSnapshot.key).on('value', function(_snapshot2){
            _snapshot2.forEach(function (childSnapshot2){
              var price = childSnapshot2.val().price;
              total_price = parseInt(total_price)+(parseInt(price)*parseInt(childSnapshot2.val().item_qty));
              time = childSnapshot2.val().time;
            })

          })
          result.push({ id: childSnapshot.key, total_price: total_price, time: time});

        });

        $timeout(function(){
          $scope.pastOrders = result.reverse();
          $state.transitionTo($state.current, $stateParams, {
            reload: true,
            inherit: false,
            notify: true
          });
          sharedUtils.hideLoading();
        }, 1000);

      });
    }

    loadPastOrders();

  }
});

$scope.viewOrder = function(id){
  $state.go('viewOrder', {"id":id}, {location: "replace"});
}

$scope.viewPastOrder = function(id){
  $state.go('viewPastOrder', {"id":id}, {location: "replace"});
}

})

//-------------------------------------------------------------------------------------------------------------------------------------

.controller('favouriteCtrl', ['$scope', '$rootScope', '$http', function($scope,$rootScope,$http) {

}])

//-------------------------------------------------------------------------------------------------------------------------------------

.controller('viewOrderCtrl', function($scope,$rootScope,$http,sharedUtils,$state,$stateParams,$timeout) {

  $rootScope.extras = true;
  sharedUtils.showLoading();
  var id = $stateParams.id;

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      $scope.user_info = user;

      function loadData(){
        firebase.database().ref('orders').child(user.uid).child(id).on('value', function(_snapshot){

          result = [];

          _snapshot.forEach(function (childSnapshot){
            var element = childSnapshot.val();
            element.id = childSnapshot.key;
            result.push(element);
          });

          $timeout(function(){
            $scope.assetCollection = result;
            $state.transitionTo($state.current, $stateParams, {
              reload: true,
              inherit: false,
              notify: true
            });
            sharedUtils.hideLoading();
          }, 1000);

        });
      }

      loadData();

    }

  });

})

//-------------------------------------------------------------------------------------------------------------------------------------

.controller('viewPastOrderCtrl', function($scope,$rootScope,$http,sharedUtils,$state,$stateParams,$timeout) {

  $rootScope.extras = true;
  sharedUtils.showLoading();
  var id = $stateParams.id;

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      $scope.user_info = user;

      function loadpastOrderData(){
        firebase.database().ref('completedOrders').child(user.uid).child(id).on('value', function(_snapshot){

          result = [];

          _snapshot.forEach(function (childSnapshot){
            var element = childSnapshot.val();
            element.id = childSnapshot.key;
            result.push(element);
          });

          $timeout(function(){
            $scope.pastOrderData = result;
            $state.transitionTo($state.current, $stateParams, {
              reload: true,
              inherit: false,
              notify: true
            });
            sharedUtils.hideLoading();
          }, 1000);

        });
      }

      loadpastOrderData();

    }

  });

})

//-------------------------------------------------------------------------------------------------------------------------------------

.controller('settingsCtrl', function($scope,$rootScope,fireBaseData,$firebaseObject,
  $ionicPopup,$state,$window,$firebaseArray,
  sharedUtils) {
//Bugs are most prevailing here
$rootScope.extras=true;

//Shows loading bar
sharedUtils.showLoading();

//Check if user already logged in
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

//Accessing an array of objects using firebaseObject, does not give you the $id , so use firebase array to get $id
// $scope.addresses= $firebaseArray(fireBaseData.refUser().child(user.uid).child("address"));

// firebaseObject is good for accessing single objects for eg:- telephone. Don't use it for array of objects
// $scope.user_extras= $firebaseObject(fireBaseData.refUser().child(user.uid));

$scope.user_info=user; //Saves data to user_info
//NOTE: $scope.user_info is not writable ie you can't use it inside ng-model of <input>

//You have to create a local variable for storing emails
$scope.data_editable={};
$scope.data_editable.email=$scope.user_info.email;  // For editing store it in local variable
$scope.data_editable.password="";

$scope.$apply();

sharedUtils.hideLoading();

}else {

  sharedUtils.hideLoading();

  sharedUtils.showAlert("Please note","You re required to sign up or login first!");
  $state.go('login', {}, {location: "replace"});

// $rootScope.extras = false;

}

});

$scope.addManipulation = function(edit_val) {  // Takes care of address add and edit ie Address Manipulator

  if(edit_val!=null) {
$scope.data = edit_val; // For editing address
var title="Edit Address";
var sub_title="Edit your address";
}
else {
$scope.data = {};    // For adding new address
var title="Add Address";
var sub_title="Add your new address";
}
// An elaborate, custom popup
var addressPopup = $ionicPopup.show({
  template: '<input type="text"   placeholder="Nick Name"  ng-model="data.nickname"> <br/> ' +
  '<input type="text"   placeholder="Address" ng-model="data.address"> <br/> ' +
  '<input type="number" placeholder="Pincode" ng-model="data.pin"> <br/> ' +
  '<input type="number" placeholder="Phone" ng-model="data.phone">',
  title: title,
  subTitle: sub_title,
  scope: $scope,
  buttons: [
  { text: 'Close' },
  {
    text: '<b>Save</b>',
    type: 'button-positive',
    onTap: function(e) {
      if (!$scope.data.nickname || !$scope.data.address || !$scope.data.pin || !$scope.data.phone ) {
e.preventDefault(); //don't allow the user to close unless he enters full details
} else {
  return $scope.data;
}
}
}
]
});

addressPopup.then(function(res) {

  if(edit_val!=null) {
//Update  address
if(res!=null){ // res ==null  => close
fireBaseData.refUser().child($scope.user_info.uid).child("address").child(edit_val.$id).update({    // set
  nickname: res.nickname,
  address: res.address,
  pin: res.pin,
  phone: res.phone
});
}
}else{
//Add new address
fireBaseData.refUser().child($scope.user_info.uid).child("address").push({    // set
  nickname: res.nickname,
  address: res.address,
  pin: res.pin,
  phone: res.phone
});
}

});

};

// A confirm dialog for deleting address
$scope.deleteAddress = function(del_id) {
  var confirmPopup = $ionicPopup.confirm({
    title: 'Delete Address',
    template: 'Are you sure you want to delete this address',
    buttons: [
    { text: 'No' , type: 'button-stable' },
    { text: 'Yes', type: 'button-assertive' , onTap: function(){return del_id;} }
    ]
  });

  confirmPopup.then(function(res) {
    if(res) {
      fireBaseData.refUser().child($scope.user_info.uid).child("address").child(res).remove();
    }
  });
};

$scope.save= function (extras,editable) {
//1. Edit Telephone doesnt show popup 2. Using extras and editable  // Bugs
// if(extras.telephone!="" && extras.telephone!=null ){
// //Update  Telephone
// fireBaseData.refUser().child($scope.user_info.uid).update({    // set
//   telephone: extras.telephone
// });
// }

//Edit Password
if(editable.password!="" && editable.password!=null  ){
//Update Password in UserAuthentication Table
firebase.auth().currentUser.updatePassword(editable.password).then(function(ok) {}, function(error) {console.log(error)});
sharedUtils.showAlert("Account","Password Updated");
}

//Edit Email
if(editable.email!="" && editable.email!=null  && editable.email!=$scope.user_info.email){

//Update Email/Username in UserAuthentication Table
firebase.auth().currentUser.updateEmail(editable.email).then(function(ok) {
  $window.location.reload(true);
//sharedUtils.showAlert("Account","Email Updated");
}, function(error) {
  sharedUtils.showAlert("ERROR",error);
});
}

};

$scope.cancel=function(){
// Simple Reload
$window.location.reload(true);
}

})

//-------------------------------------------------------------------------------------------------------------------------------------

.controller('supportCtrl', function($scope,$rootScope) {

  $rootScope.extras=true;

  $scope.mail = function(){
    window.location.href = 'mailto:jomthanni@gmail.com?Subject=Hello%20again';
  }

  $scope.call = function(){
    window.location.href = 'tel:+60173824465';
  }

})

//-------------------------------------------------------------------------------------------------------------------------------------

.controller('forgotPasswordCtrl', function($scope,$rootScope) {
  $rootScope.extras=false;
})

//-------------------------------------------------------------------------------------------------------------------------------------

.controller('checkoutCtrl', function($scope,$rootScope,sharedUtils,$state,$stateParams,$firebaseArray,
  $ionicHistory,fireBaseData, $ionicPopup,sharedCartService,$http,$timeout) {

  $rootScope.extras=true;

  var shop_open = firebase.database().ref('shop').child('mode');
  shop_open.on('value', function(snapshot) {
    shop_open = snapshot.node_.value_;
  });

  var defaultPostCode;

//Check if user already logged in
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // $scope.addresses= $firebaseArray( fireBaseData.refUser().child(user.uid).child("address") );
    // $scope.phone= $firebaseArray( fireBaseData.refUser().child(user.uid).child("phone") );
    // $scope.user_postcode= $firebaseArray( fireBaseData.refUser().child(user.uid).child("postcode") );
    $scope.user_info=user;
    // postCode = $firebaseArray( fireBaseData.refPostcodes() );

    firebase.database().ref('users').child(user.uid).child("address").on('value', function(_snapshot){

          addresses = [];

          _snapshot.forEach(function (childSnapshot){
            var element = childSnapshot.val();
            // console.log(element);
            element.id = childSnapshot.key;
            addresses.push(element);
            // console.log(addresses)
            
          });

          $scope.addresses = addresses;

        });

    firebase.database().ref('users').child(user.uid).child("phone").on('value', function(_snapshot){

          phone_numbers = [];

          _snapshot.forEach(function (childSnapshot){
            var element = childSnapshot.val();
            element.id = childSnapshot.key;
            phone_numbers.push(element);
          });

          $scope.phone = phone_numbers;

        });

    firebase.database().ref('users').child(user.uid).child("postcode").on('value', function(_snapshot){

          result = [];

          _snapshot.forEach(function (childSnapshot){
            var element = childSnapshot.val();
            element.id = childSnapshot.key;
            result.push(element);
          });

          $scope.user_postcode = result;

        });

    firebase.database().ref('postcodes').on('value', function(_snapshot){

          postCode = [];

          _snapshot.forEach(function (childSnapshot){
            var element = childSnapshot.val();
            element.id = childSnapshot.key;
            postCode.push(element);
            // console.log(postCode);
          });

          defaultPostCode = postCode;

        });
  }
});

$scope.payments = [
// {id: 'credit/debit_card', name: 'Credit/Debit Card'},
{id: 'COD', name: 'Cash on delivery'}
];

$scope.pay=function(address,payment,phone){
  if(address==null || payment==null || phone==null){
//Check if the checkboxes are selected ?
sharedUtils.showAlert("Error","Please choose from the Address, Phone and Payment Modes.")
}
else {

  if(shop_open == 'open'){

    var confirmPopup = $ionicPopup.confirm({
      title: 'Order Confirmation',
      template: 'Do you want to submit your order?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        for(var i=0; i < defaultPostCode.length; i++){
          if(defaultPostCode[i].postcode == address.postcode){
            sharedUtils.showLoading();

            var newOrderRef = firebase.database().ref('orders').child($scope.user_info.uid).push();
            // console.log(newOrderRef.key);
            var newOrderKey = newOrderRef.key;
            var timestamp = new Date().getTime();
            var total_price = 0;
         // var newOrderRef2 = newOrderRef.push();

    // firebase.database().ref('cart').child(user.uid).on('value', function(_snapshot){

    //       _snapshot.forEach(function (childSnapshot){
    //           var element = childSnapshot.val();
    //           // element.id = childSnapshot.key;
    //           total_qty += element.item_qty;
    //           // result.push(element);
    //         });

    //     });

    for (var i = 0; i < Object.keys(sharedCartService.cart_items).length; i++) {
    //Add cart item to order table
    // fireBaseData.refOrder().child($scope.user_info.uid).push({
      // console.log(sharedCartService.cart_items[i]);
        newOrderRef.push({

      //Product data is hardcoded for simplicity
      item_name: sharedCartService.cart_items[i].item_name,
      URL: sharedCartService.cart_items[i].item_image,
      id: sharedCartService.cart_items[i].id,
      price: sharedCartService.cart_items[i].item_price,
      time: timestamp,
      category: sharedCartService.cart_items[i].category,
      parentKey: newOrderKey,

      //item data
      item_qty: sharedCartService.cart_items[i].item_qty,

      //Order data
      user_id: $scope.user_info.uid,
      user_address: address.address,
      user_phone: phone,
      user_name:firebase.auth().currentUser.email,
      status: "Queued"
      });

      total_price = total_price+(sharedCartService.cart_items[i].item_price*sharedCartService.cart_items[i].item_qty);

    }

firebase.database().ref('orderNotification').push({    // set
  orderID: newOrderKey
});

//Remove users cart
firebase.database().ref('cart').child($scope.user_info.uid).remove();

sharedUtils.showAlert("Info", "Order successfull, your orders will be delivered within 2 hours!");

// Go to past order page
$ionicHistory.nextViewOptions({
  historyRoot: true
});
sharedUtils.hideLoading();
$state.go('lastOrders', {}, {location: "replace", reload: true});

// $state.go('paymentCard', {"address":address.address,"payment":payment,"phone":phone}, {location: "replace"});
return;
}else{

}
}
sharedUtils.showAlert("We are sorry to inform that delivery is currently not available for the selected location","Please choose a different location or stay tuned in for delivery availability for this location.")

}


});

  }else{
    sharedUtils.showAlert("We are sorry to inform that delivery is closed for now.")
  }

}

}

$scope.chooseLocation = function() {

  $state.go('offers', {}, {location: "replace"});

}


$scope.addManipulation = function(edit_val) {  // Takes care of address add and edit ie Address Manipulator


  if(edit_val!=null) {
$scope.data = edit_val; // For editing address
var title="Edit Address";
var sub_title="Edit your address";
}
else {
$scope.data = {};    // For adding new address
var title="Add number";
var sub_title="Add a new number";
}
// An elaborate, custom popup
var addressPopup = $ionicPopup.show({
  template:
// template: '<input type="text"   placeholder="Nick Name"  ng-model="data.nickname"> <br/> ' +
// '<input type="text"   placeholder="Address" ng-model="data.address"> <br/> ' +
// '<input type="number" placeholder="Pincode" ng-model="data.pin"> <br/> ' +
// '<a>+601</a>' +
'<input type="number" placeholder="Phone (eg:60123456789)" ng-model="data.phone">',
title: title,
subTitle: sub_title,
scope: $scope,
buttons: [
{ text: 'Close' },
{
  text: '<b>Save</b>',
  type: 'button-positive',
  onTap: function(e) {
    if (!$scope.data.phone ) {
e.preventDefault(); //don't allow the user to close unless he enters full details
} else {
  return $scope.data;
}
}
}
]
});

addressPopup.then(function(res) {

  if(edit_val!=null) {
//Update  address
firebase.database().ref('users').child($scope.user_info.uid).child("phone").child(edit_val.$id).update({    // set
// nickname: res.nickname,
// address: res.address,
// pin: res.pin,
phone: res.phone
});
}else{
//Add new address
firebase.database().ref('users').child($scope.user_info.uid).child("phone").push({    // set
// nickname: res.nickname,
// address: res.address,
// pin: res.pin,
phone: res.phone
});
}

});

};

})

//-------------------------------------------------------------------------------------------------------------------------------------

.controller('MapCtrl', function($scope, $state, $cordovaGeolocation, $rootScope, fireBaseData, $firebaseObject,
  $ionicPopup, $window, $firebaseArray, sharedUtils,$timeout,$stateParams) {

  sharedUtils.showAlert("Info", "Move the marker to your location");

  firebase.auth().onAuthStateChanged(function(user) {

    if (user) {

      firebase.database().ref('users').child(user.uid).child("address").on('value', function(_snapshot){

          result = [];

          _snapshot.forEach(function (childSnapshot){
            var element = childSnapshot.val();
            element.id = childSnapshot.key;
            result.push(element);
          });

          $timeout(function(){

            $scope.addresses = result;

            $state.transitionTo($state.current, $stateParams, {
              reload: true,
              inherit: false,
              notify: true
            });
            // sharedUtils.hideLoading();
          }, 1000);
        });

      // $scope.addresses= $firebaseArray(fireBaseData.refUser().child(user.uid).child("address"));

    }else{

    }

  });

  if (window.cordova) {
    cordova.plugins.diagnostic.isGpsLocationEnabled(
      function(e) {
        if (e){
// alert("location on")

}
else {
  alert("Location is not turned ON");
  cordova.plugins.diagnostic.switchToLocationSettings();
}
},
function(e) {
  alert('Error ' + e);
}
);
  }

  var options = {timeout: 10000, enableHighAccuracy: true};
  var latLng;
  var finalLat;
  var finalLng;
  var add;
  var zipcode;

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var lat  = position.coords.latitude
    var long = position.coords.longitude

var geocoder  = new google.maps.Geocoder();             // create a geocoder object
// var location  = new google.maps.LatLng(evt.latLng.lat().toFixed(3), evt.latLng.lng().toFixed(3));    // turn coordinates into an object
geocoder.geocode({'latLng': latLng}, function (results, status) {
if(status == google.maps.GeocoderStatus.OK) {           // if geocode success
add=results[0].formatted_address;         // if address found, pass to processing function
for(var i=0; i < results.length; i++){
  for(var j=0;j < results[i].address_components.length; j++){
    for(var k=0; k < results[i].address_components[j].types.length; k++){
      if(results[i].address_components[j].types[k] == "postal_code"){
        zipcode = results[i].address_components[j].short_name;
      }
    }
  }
}

document.getElementById('current').innerHTML = add;

}
})

var mapOptions = {
  center: latLng,
  zoom: 15,
  mapTypeId: google.maps.MapTypeId.ROADMAP
};

$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

google.maps.event.addListenerOnce($scope.map, 'idle', function(){

  var marker = new google.maps.Marker({
    map: $scope.map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: latLng
  });

  var infoWindow = new google.maps.InfoWindow({
    content: "Here I am!"
  });

  google.maps.event.addListener(marker, 'click', function () {
    infoWindow.open($scope.map, marker);
  });

  google.maps.event.addListener(marker, 'dragend', function (evt) {

var geocoder  = new google.maps.Geocoder();             // create a geocoder object
var location  = new google.maps.LatLng(evt.latLng.lat().toFixed(3), evt.latLng.lng().toFixed(3));    // turn coordinates into an object
geocoder.geocode({'latLng': location}, function (results, status) {
if(status == google.maps.GeocoderStatus.OK) {           // if geocode success
add=results[0].formatted_address;         // if address found, pass to processing function
for(var i=0; i < results.length; i++){
  for(var j=0;j < results[i].address_components.length; j++){
    for(var k=0; k < results[i].address_components[j].types.length; k++){
      if(results[i].address_components[j].types[k] == "postal_code"){
        zipcode = results[i].address_components[j].short_name;
      }
    }
  }
}

document.getElementById('current').innerHTML = add;
document.write(add);

}
})

// document.getElementById('current').innerHTML = '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>';
finalLat = evt.latLng.lat().toFixed(3);
});

  google.maps.event.addListener(marker, 'dragstart', function (evt) {
// document.getElementById('current').innerHTML = '<p>Currently dragging marker...</p>';
finalLng = evt.latLng.lng().toFixed(3);
});

});

}, function(error){

});

  $scope.confirmLocation = function(current) {

firebase.database().ref('users').child($scope.user_info.uid).child("address").push({    // set

  address: add,
  postcode: zipcode

});

$state.go('checkout', {}, {location: "replace"});

}

})

//-------------------------------------------------------------------------------------------------------------------------------------

.controller('spiritsCtrl', function($scope,$rootScope,$ionicSideMenuDelegate,fireBaseData,$state,
  $ionicHistory,$firebaseArray,sharedCartService,sharedUtils, $ionicModal, $ionicPopup) {

  var total_qty=0;
  var restriction_qty=0;
  // console.log(sharedCartService.cart_items);

  // result = [];
  

  sharedUtils.showLoading();
//Check if user already logged in
var currentUser;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
$scope.user_info=user; //Saves data to user_info
currentUser = user;

firebase.database().ref('cart').child(user.uid).on('value', function(_snapshot){

  total_qty=0;
  restriction_qty=0;

          _snapshot.forEach(function (childSnapshot){
              var element = childSnapshot.val();
              // element.id = childSnapshot.key;
              total_qty += element.item_qty;
              // result.push(element);
              if(element.restriction == 'yes'){

                restriction_qty += element.item_qty;

              }
            });

        });
}else {

}
});

// On Loggin in to menu page, the sideMenu drag state is set to true
// $ionicSideMenuDelegate.canDragContent(true);
$rootScope.extras=true;

// When user visits A-> B -> C -> A and clicks back, he will close the app instead of back linking
$scope.$on('$ionicView.enter', function(ev) {
  if(ev.targetScope !== $scope){
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
  }
});

$scope.loadMenu = function() {

  $scope.menu=$firebaseArray(fireBaseData.refMenuSpirits());

  firebase.database().ref('menu/spirits').on('value', function(_snapshot){

    var result = [];

    _snapshot.forEach(function (childSnapshot){
      var element = childSnapshot.val();
      element.id = childSnapshot.key;
      result.push(element);
    });

    var len = result.length;
    var mid = len / 2;
    $scope.left  = result.slice(0, mid+1);
    $scope.right = result.slice(mid+1, len);

    sharedUtils.hideLoading();

  });

}

$scope.showProductInfo=function (id) {

};
// $scope.addToCart=function(item){

//   firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       sharedCartService.add(item);
//     }else {

//       sharedUtils.showAlert("Please note","You are required to sign up or login first!");
//       $state.go('login', {}, {location: "replace"});

//       $rootScope.extras = false;


//     }
//   });

// };

$scope.addToCart = function(item) {

      //check if item is already added or not
      firebase.database().ref('cart').child(currentUser.uid).once("value", function(snapshot) {

      if(restriction_qty<=2){

        if( snapshot.hasChild(item.id) == true ){
          console.log(snapshot.child(item.id).val());
          console.log(total_qty);
          //if item is already in the cart
          var currentQty = snapshot.child(item.id).val().item_qty;

          firebase.database().ref('cart/').child(currentUser.uid).child(item.id).update({   // update
            item_qty : currentQty+1,
            item_total_price: (item.price*(currentQty+1))
          });

        }else{

          var alertPopup = $ionicPopup.alert({
             title: 'Item Added!',
             template: 'You can view them in your cart'
           });
           alertPopup.then(function(res) {
           });

          //if item is new in the cart
          firebase.database().ref('cart/').child(currentUser.uid).child(item.id).set({    // set
            item_name: item.item_name,
            item_image: item.URL,
            item_price: item.price,
            item_qty: 1,
            item_total_price: (item.price*1),
            category: item.category,
            restriction: 'yes',
            user: currentUser.email
          });
        }
      }else{
          var alertPopup = $ionicPopup.alert({
             title: 'Maximum item limit!',
             template: 'You have reached the maximum item limit for Spirit, Wine and Beer'
           });
           alertPopup.then(function(res) {
           });
      }

      });
      
};

$scope.showImages = function(index) {
  $scope.activeSlide = index;
  $scope.showModal('templates/image-popover.html');
}

$scope.showModal = function(templateUrl) {
  $ionicModal.fromTemplateUrl(templateUrl, {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.show();
  });
}

// Close the modal
$scope.closeModal = function() {
  $scope.modal.hide();
  $scope.modal.remove()
};

})

//-------------------------------------------------------------------------------------------------------------------------------------

.controller('wineCtrl', function($scope,$rootScope,$ionicSideMenuDelegate,fireBaseData,$state,
  $ionicHistory,$firebaseArray,sharedCartService,sharedUtils, $ionicModal, $ionicPopup) {

  var total_qty=0;
  var restriction_qty=0;

  sharedUtils.showLoading();

  var currentUser;
//Check if user already logged in
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
$scope.user_info=user; //Saves data to user_info
currentUser = user;

firebase.database().ref('cart').child(user.uid).on('value', function(_snapshot){

  total_qty=0;
  restriction_qty=0;

          _snapshot.forEach(function (childSnapshot){
              var element = childSnapshot.val();
              // element.id = childSnapshot.key;
              total_qty += element.item_qty;
              // result.push(element);
              if(element.restriction == 'yes'){

                restriction_qty += element.item_qty;

              }
            });

        });
}else {

}
});

// On Loggin in to menu page, the sideMenu drag state is set to true
// $ionicSideMenuDelegate.canDragContent(true);
$rootScope.extras=true;

// When user visits A-> B -> C -> A and clicks back, he will close the app instead of back linking
$scope.$on('$ionicView.enter', function(ev) {
  if(ev.targetScope !== $scope){
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
  }
});

$scope.loadMenu = function() {

// $scope.menu=$firebaseArray(fireBaseData.refMenuSpirits());

firebase.database().ref('menu/wine').on('value', function(_snapshot){

  var result = [];

  _snapshot.forEach(function (childSnapshot){
    var element = childSnapshot.val();
    element.id = childSnapshot.key;
    result.push(element);
  });

  var len = result.length;
  var mid = len / 2;
  $scope.left  = result.slice(0, mid+1);
  $scope.right = result.slice(mid+1, len);

  sharedUtils.hideLoading();

});

}

$scope.showProductInfo=function (id) {

};
// $scope.addToCart=function(item){

//   firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       sharedCartService.add(item);
//     }else {

//       sharedUtils.showAlert("Please note","You are required to sign up or login first!");
//       $state.go('login', {}, {location: "replace"});

//       $rootScope.extras = false;


//     }
//   });

// };

$scope.addToCart = function(item) {

      //check if item is already added or not
      firebase.database().ref('cart').child(currentUser.uid).once("value", function(snapshot) {

        if(restriction_qty<=2){

        if( snapshot.hasChild(item.id) == true ){

          //if item is already in the cart
          var currentQty = snapshot.child(item.id).val().item_qty;

          firebase.database().ref('cart/').child(currentUser.uid).child(item.id).update({   // update
            item_qty : currentQty+1,
            item_total_price: (item.price*(currentQty+1))
          });

        }else{

          var alertPopup = $ionicPopup.alert({
             title: 'Item Added!',
             template: 'You can view them in your cart'
           });
           alertPopup.then(function(res) {
           });

          //if item is new in the cart
          firebase.database().ref('cart/').child(currentUser.uid).child(item.id).set({    // set
            item_name: item.item_name,
            item_image: item.URL,
            item_price: item.price,
            item_qty: 1,
            item_total_price: (item.price*1),
            category: item.category,
            restriction: 'yes',
            user: currentUser.email
          });
        }

        }else{
          var alertPopup = $ionicPopup.alert({
             title: 'Maximum item limit!',
             template: 'You have reached the maximum item limit for Spirit, Wine and Beer'
           });
           alertPopup.then(function(res) {
           });
      }

      });
      
};

$scope.showImages = function(index) {
  $scope.activeSlide = index;
  $scope.showModal('templates/image-popover.html');
}

$scope.showModal = function(templateUrl) {
  $ionicModal.fromTemplateUrl(templateUrl, {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.show();
  });
}

// Close the modal
$scope.closeModal = function() {
  $scope.modal.hide();
  $scope.modal.remove()
};

})

//-------------------------------------------------------------------------------------------------------------------------------------

.controller('beersCtrl', function($scope,$rootScope,$ionicSideMenuDelegate,fireBaseData,$state,
  $ionicHistory,$firebaseArray,sharedCartService,sharedUtils, $ionicModal,$ionicPopup) {

  var total_qty=0;
  var restriction_qty=0;

  sharedUtils.showLoading();
//Check if user already logged in
var currentUser;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
$scope.user_info=user; //Saves data to user_info
currentUser = user;

firebase.database().ref('cart').child(user.uid).on('value', function(_snapshot){

  total_qty=0;
  restriction_qty=0;

          _snapshot.forEach(function (childSnapshot){
              var element = childSnapshot.val();
              // element.id = childSnapshot.key;
              total_qty += element.item_qty;
              // result.push(element);
              if(element.restriction == 'yes'){

                restriction_qty += element.item_qty;

              }
            });

        });
}else {

}
});

// On Loggin in to menu page, the sideMenu drag state is set to true
// $ionicSideMenuDelegate.canDragContent(true);
$rootScope.extras=true;

// When user visits A-> B -> C -> A and clicks back, he will close the app instead of back linking
$scope.$on('$ionicView.enter', function(ev) {
  if(ev.targetScope !== $scope){
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
  }
});


$scope.loadMenu = function() {

// $scope.menu=$firebaseArray(fireBaseData.refMenuSpirits());

firebase.database().ref('menu/beer').on('value', function(_snapshot){

  var result = [];

  _snapshot.forEach(function (childSnapshot){
    var element = childSnapshot.val();
    element.id = childSnapshot.key;
    result.push(element);
  });

  var len = result.length;
  var mid = len / 2;
  $scope.left  = result.slice(0, mid+1);
  $scope.right = result.slice(mid+1, len);

  sharedUtils.hideLoading();

});

}

$scope.showProductInfo=function (id) {

};
// $scope.addToCart=function(item){

//   firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       sharedCartService.add(item);
//     }else {

//       sharedUtils.showAlert("Please note","You are required to sign up or login first!");
//       $state.go('login', {}, {location: "replace"});

//       $rootScope.extras = false;


//     }
//   });

// };

$scope.addToCart = function(item) {

      //check if item is already added or not
      firebase.database().ref('cart').child(currentUser.uid).once("value", function(snapshot) {

        if(restriction_qty<=2){

        if( snapshot.hasChild(item.id) == true ){

          //if item is already in the cart
          var currentQty = snapshot.child(item.id).val().item_qty;

          firebase.database().ref('cart/').child(currentUser.uid).child(item.id).update({   // update
            item_qty : currentQty+1,
            item_total_price: (item.price*(currentQty+1))
          });

        }else{

          var alertPopup = $ionicPopup.alert({
             title: 'Item Added!',
             template: 'You can view them in your cart'
           });
           alertPopup.then(function(res) {
           });

          //if item is new in the cart
          firebase.database().ref('cart/').child(currentUser.uid).child(item.id).set({    // set
            item_name: item.item_name,
            item_image: item.URL,
            item_price: item.price,
            item_qty: 1,
            item_total_price: (item.price*1),
            category: item.category,
            restriction: 'yes',
            user: currentUser.email
          });
        }

        }else{
          var alertPopup = $ionicPopup.alert({
             title: 'Maximum item limit!',
             template: 'You have reached the maximum item limit for Spirit, Wine and Beer'
           });
           alertPopup.then(function(res) {
           });
      }


      });
      
};

$scope.allImages = [{
  'src' : 'img/pic1.jpg'
}, {
  'src' : 'img/pic2.jpg'
}, {
  'src' : 'img/pic3.jpg'
}];

$scope.showImages = function(index) {
  $scope.activeSlide = index;
  $scope.showModal('templates/image-popover.html');
}

$scope.showModal = function(templateUrl) {
  $ionicModal.fromTemplateUrl(templateUrl, {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.show();
  });
}

// Close the modal
$scope.closeModal = function() {
  $scope.modal.hide();
  $scope.modal.remove()
};

})

//-------------------------------------------------------------------------------------------------------------------------------------

.controller('tobaccoCtrl', function($scope,$rootScope,$ionicSideMenuDelegate,fireBaseData,$state,
  $ionicHistory,$firebaseArray,sharedCartService,sharedUtils, $ionicModal, $ionicPopup) {

  sharedUtils.showLoading();

  var currentUser;
//Check if user already logged in
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
$scope.user_info=user; //Saves data to user_info
currentUser = user;
}else {

}
});

// On Loggin in to menu page, the sideMenu drag state is set to true
// $ionicSideMenuDelegate.canDragContent(true);
$rootScope.extras=true;

// When user visits A-> B -> C -> A and clicks back, he will close the app instead of back linking
$scope.$on('$ionicView.enter', function(ev) {
  if(ev.targetScope !== $scope){
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
  }
});

$scope.loadMenu = function() {

// $scope.menu=$firebaseArray(fireBaseData.refMenuSpirits());

firebase.database().ref('menu/tobacco').on('value', function(_snapshot){

  var result = [];

  _snapshot.forEach(function (childSnapshot){
    var element = childSnapshot.val();
    element.id = childSnapshot.key;
    result.push(element);
  });

  var len = result.length;
  var mid = len / 2;
  $scope.left  = result.slice(0, mid+1);
  $scope.right = result.slice(mid+1, len);

  sharedUtils.hideLoading();

});

}

$scope.showProductInfo=function (id) {

};
// $scope.addToCart=function(item){

//   firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       sharedCartService.add(item);
//     }else {

//       sharedUtils.showAlert("Please note","You are required to sign up or login first!");
//       $state.go('login', {}, {location: "replace"});

//       $rootScope.extras = false;


//     }
//   });

// };

$scope.addToCart = function(item) {

      //check if item is already added or not
      firebase.database().ref('cart').child(currentUser.uid).once("value", function(snapshot) {

        if( snapshot.hasChild(item.id) == true ){

          //if item is already in the cart
          var currentQty = snapshot.child(item.id).val().item_qty;

          firebase.database().ref('cart/').child(currentUser.uid).child(item.id).update({   // update
            item_qty : currentQty+1,
            item_total_price: (item.price*(currentQty+1))
          });

        }else{

          var alertPopup = $ionicPopup.alert({
             title: 'Item Added!',
             template: 'You can view them in your cart'
           });
           alertPopup.then(function(res) {
           });

          //if item is new in the cart
          firebase.database().ref('cart/').child(currentUser.uid).child(item.id).set({    // set
            item_name: item.item_name,
            item_image: item.URL,
            item_price: item.price,
            item_qty: 1,
            item_total_price: (item.price*1),
            category: item.category,
            user: currentUser.email
          });
        }
      });
      
};

$scope.showImages = function(index) {
  $scope.activeSlide = index;
  $scope.showModal('templates/image-popover.html');
}

$scope.showModal = function(templateUrl) {
  $ionicModal.fromTemplateUrl(templateUrl, {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.show();
  });
}

// Close the modal
$scope.closeModal = function() {
  $scope.modal.hide();
  $scope.modal.remove()
};

})

//-------------------------------------------------------------------------------------------------------------------------------------

.controller('accessoriesCtrl', function($scope,$rootScope,$ionicSideMenuDelegate,fireBaseData,$state,
  $ionicHistory,$firebaseArray,sharedCartService,sharedUtils, $ionicModal, $ionicPopup) {

  sharedUtils.showLoading();

  var currentUser;
//Check if user already logged in
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
$scope.user_info=user; //Saves data to user_info
currentUser = user;
}else {

}
});

// On Loggin in to menu page, the sideMenu drag state is set to true
// $ionicSideMenuDelegate.canDragContent(true);
$rootScope.extras=true;

// When user visits A-> B -> C -> A and clicks back, he will close the app instead of back linking
$scope.$on('$ionicView.enter', function(ev) {
  if(ev.targetScope !== $scope){
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
  }
});

$scope.loadMenu = function() {

// $scope.menu=$firebaseArray(fireBaseData.refMenuSpirits());

firebase.database().ref('menu/accessories').on('value', function(_snapshot){

  var result = [];

  _snapshot.forEach(function (childSnapshot){
    var element = childSnapshot.val();
    element.id = childSnapshot.key;
    result.push(element);
  });

  var len = result.length;
  var mid = len / 2;
  $scope.left  = result.slice(0, mid+1);
  $scope.right = result.slice(mid+1, len);

  sharedUtils.hideLoading();

});

}

$scope.showProductInfo=function (id) {

};
// $scope.addToCart=function(item){

//   firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       sharedCartService.add(item);
//     }else {

//       sharedUtils.showAlert("Please note","You are required to sign up or login first!");
//       $state.go('login', {}, {location: "replace"});

//       $rootScope.extras = false;


//     }
//   });

// };

$scope.addToCart = function(item) {

      //check if item is already added or not
      firebase.database().ref('cart').child(currentUser.uid).once("value", function(snapshot) {

        if( snapshot.hasChild(item.id) == true ){

          //if item is already in the cart
          var currentQty = snapshot.child(item.id).val().item_qty;

          firebase.database().ref('cart/').child(currentUser.uid).child(item.id).update({   // update
            item_qty : currentQty+1,
            item_total_price: (item.price*(currentQty+1))
          });

        }else{

          var alertPopup = $ionicPopup.alert({
             title: 'Item Added!',
             template: 'You can view them in your cart'
           });
           alertPopup.then(function(res) {
           });

          //if item is new in the cart
          firebase.database().ref('cart/').child(currentUser.uid).child(item.id).set({    // set
            item_name: item.item_name,
            item_image: item.URL,
            item_price: item.price,
            item_qty: 1,
            item_total_price: (item.price*1),
            category: item.category,
            user: currentUser.email
          });
        }
      });
      
};

$scope.showImages = function(index) {
  $scope.activeSlide = index;
  $scope.showModal('templates/image-popover.html');
}

$scope.showModal = function(templateUrl) {
  $ionicModal.fromTemplateUrl(templateUrl, {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.show();
  });
}

// Close the modal
$scope.closeModal = function() {
  $scope.modal.hide();
  $scope.modal.remove()
};

})

//-------------------------------------------------------------------------------------------------------------------------------------

.controller('othersCtrl', function($scope,$rootScope,$ionicSideMenuDelegate,fireBaseData,$state,
  $ionicHistory,$firebaseArray,sharedCartService,sharedUtils, $ionicModal, $ionicPopup) {

  sharedUtils.showLoading();

  var currentUser;
//Check if user already logged in
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
$scope.user_info=user; //Saves data to user_info
currentUser = user;
}else {

}
});

// On Loggin in to menu page, the sideMenu drag state is set to true
// $ionicSideMenuDelegate.canDragContent(true);
$rootScope.extras=true;

// When user visits A-> B -> C -> A and clicks back, he will close the app instead of back linking
$scope.$on('$ionicView.enter', function(ev) {
  if(ev.targetScope !== $scope){
    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();
  }
});

$scope.loadMenu = function() {

firebase.database().ref('menu/others').on('value', function(_snapshot){

  var result = [];

  _snapshot.forEach(function (childSnapshot){
    var element = childSnapshot.val();
    element.id = childSnapshot.key;
    result.push(element);
  });

  var len = result.length;
  var mid = len / 2;
  $scope.left  = result.slice(0, mid+1);
  $scope.right = result.slice(mid+1, len);

  sharedUtils.hideLoading();

});

}

$scope.showProductInfo=function (id) {

};
// $scope.addToCart=function(item){

//   firebase.auth().onAuthStateChanged(function(user) {
//     if (user) {
//       sharedCartService.add(item);
//     }else {

//       sharedUtils.showAlert("Please note","You are required to sign up or login first!");
//       $state.go('login', {}, {location: "replace"});

//       $rootScope.extras = false;


//     }
//   });

// };

$scope.addToCart = function(item) {

      //check if item is already added or not
      firebase.database().ref('cart').child(currentUser.uid).once("value", function(snapshot) {

        if( snapshot.hasChild(item.id) == true ){

          //if item is already in the cart
          var currentQty = snapshot.child(item.id).val().item_qty;

          firebase.database().ref('cart/').child(currentUser.uid).child(item.id).update({   // update
            item_qty : currentQty+1,
            item_total_price: (item.price*(currentQty+1))
          });

        }else{

          var alertPopup = $ionicPopup.alert({
             title: 'Item Added!',
             template: 'You can view them in your cart'
           });
           alertPopup.then(function(res) {
           });

          //if item is new in the cart
          firebase.database().ref('cart/').child(currentUser.uid).child(item.id).set({    // set
            item_name: item.item_name,
            item_image: item.URL,
            item_price: item.price,
            item_qty: 1,
            item_total_price: (item.price*1),
            category: item.category,
            user: currentUser.email
          });
        }
      });
      
};

$scope.showImages = function(index) {
  $scope.activeSlide = index;
  $scope.showModal('templates/image-popover.html');
}

$scope.showModal = function(templateUrl) {
  $ionicModal.fromTemplateUrl(templateUrl, {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.show();
  });
}

// Close the modal
$scope.closeModal = function() {
  $scope.modal.hide();
  $scope.modal.remove()
};

})

//-------------------------------------------------------------------------------------------------------------------------------------

.controller('paymentCardCtrl', function($scope,$rootScope,$state,$stateParams,sharedCartService,sharedUtils,$firebaseArray,
  $ionicHistory,fireBaseData, $ionicPopup,$http,$window) {

  sharedUtils.showLoading();

  var selectedAdress = $stateParams.address;
  var selectedPhone = $stateParams.phone;

  $rootScope.extras=true;

  $scope.showDropinContainer = true;
  $scope.isError = false;
  $scope.isPaid = false;

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      $scope.addresses= $firebaseArray( fireBaseData.refUser().child(user.uid).child("address") );
      $scope.phone= $firebaseArray( fireBaseData.refUser().child(user.uid).child("phone") );
      $scope.user_info=user;
    }
  });

  $scope.payments = [
  {id: 'OnlineBanking', name: 'Online Banking'}
  ];

$scope.cart=sharedCartService.cart_items;  // Loads users cart

// $scope.get_qty = function() {
  $scope.total_qty=0;
  $scope.total_amount=0;

  for (var i = 0; i < sharedCartService.cart_items.length; i++) {
    $scope.total_qty += sharedCartService.cart_items[i].item_qty;
    $scope.total_amount += (sharedCartService.cart_items[i].item_qty * sharedCartService.cart_items[i].item_price);
  }

  $scope.getToken = function () {

    var clientToken = "sandbox_8xyp2j27_cwdpmj2qc4dfnpcg";

    braintree.setup(clientToken, 'dropin', {
      container: 'payment-form',
      paymentMethodNonceReceived: function (event, nonce, address, payment) {

        sharedUtils.showLoading();
        $scope.showDropinContainer = true;

        $http({
          method: 'POST',
          url: 'https://boozeapp.herokuapp.com/process',
          data: {
            amount: $scope.total_amount,
            payment_method_nonce: nonce
          }
        }).success(function (data) {

          if (data.success) {
            $scope.message = 'Payment authorized, thanks.';
            $scope.showDropinContainer = false;
            $scope.isError = false;
            $scope.isPaid = true;

            for (var i = 0; i < sharedCartService.cart_items.length; i++) {
//Add cart item to order table
fireBaseData.refOrder().push({

//Product data is hardcoded for simplicity
product_name: sharedCartService.cart_items[i].item_name,
product_price: sharedCartService.cart_items[i].item_price,
product_image: sharedCartService.cart_items[i].item_image,
product_id: sharedCartService.cart_items[i].$id,

//item data
item_qty: sharedCartService.cart_items[i].item_qty,

//Order data
user_id: $scope.user_info.uid,
user_adress: selectedAdress,
user_phone: selectedPhone,
user_name:firebase.auth().currentUser.email,
status: "Queued"
});

}

//Remove users cart
firebase.database().ref('cart').child($scope.user_info.uid).remove();

sharedUtils.showAlert("Info", "Order Successfull");

// Go to past order page
$ionicHistory.nextViewOptions({
  historyRoot: true
});
sharedUtils.hideLoading();
$state.go('lastOrders', {}, {location: "replace", reload: true});

} else {
// implement your solution to handle payment failures
sharedUtils.hideLoading();
$scope.message = 'Payment failed: ' + data.message + ' Please refresh the page and try again.';
$scope.isError = true;
}

}).error(function (error) {
  sharedUtils.hideLoading();
  $scope.message = 'Error: cannot connect to server. Please make sure your server is running.';
  $scope.showDropinContainer = false;
  $scope.isError = true;
});

}
});

    sharedUtils.hideLoading();

  }

  sharedUtils.hideLoading();

  $scope.getToken();

})

//-------------------------------------------------------------------------------------------------------------------------------------