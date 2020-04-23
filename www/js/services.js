angular.module('app.services', [])

.factory('fireBaseData', function($firebase) {
	var ref = new Firebase("https://production-app-9ed98.firebaseio.com/"),
    refCart = new Firebase("https://production-app-9ed98.firebaseio.com/cart"),
    refPostcodes = new Firebase("https://production-app-9ed98.firebaseio.com/postcodes"),
    refUser = new Firebase("https://production-app-9ed98.firebaseio.com/users"),
    refCategory = new Firebase("https://production-app-9ed98.firebaseio.com/category"),
    refOrder = new Firebase("https://production-app-9ed98.firebaseio.com/orders"),
    refFeatured = new Firebase("https://production-app-9ed98.firebaseio.com/featured"),
    refMenu = new Firebase("https://production-app-9ed98.firebaseio.com/menu");
    refMenuSpirits = new Firebase("https://production-app-9ed98.firebaseio.com/menu/spirits");
    refMenuBeer = new Firebase("https://production-app-9ed98.firebaseio.com/menu/beer");
    refMenuTobacco = new Firebase("https://production-app-9ed98.firebaseio.com/menu/tobacco");
    refMenuOthers = new Firebase("https://production-app-9ed98.firebaseio.com/menu/others");
    refMenuWine = new Firebase("https://production-app-9ed98.firebaseio.com/menu/wine");
    refMenuAccessories = new Firebase("https://production-app-9ed98.firebaseio.com/menu/accessories");
  return {
    ref: function() {
      return ref;
    },
    refCart: function() {
      return refCart;
    },
    refPostcodes: function() {
      return refPostcodes;
    },
    refUser: function() {
      return refUser;
    },
    refCategory: function() {
      return refCategory;
    },
    refOrder: function() {
      return refOrder;
    },
    refFeatured: function() {
      return refFeatured;
    },
    refMenu: function() {
      return refMenu;
    },
    refMenuSpirits: function() {
      return refMenuSpirits;
    },
    refMenuBeer: function() {
      return refMenuBeer;
    },
    refMenuTobacco: function() {
      return refMenuTobacco;
    },
    refMenuOthers: function() {
      return refMenuOthers;
    },
    refMenuWine: function() {
      return refMenuWine;
    },
    refMenuAccessories: function() {
      return refMenuAccessories;
    }
  }
})

.factory('sharedUtils',['$ionicLoading','$ionicPopup', function($ionicLoading,$ionicPopup){

    var functionObj={};

    functionObj.showLoading=function(){
      $ionicLoading.show({
        content: '<i class=" ion-loading-c"></i> ', // The text to display in the loading indicator
        animation: 'fade-in', // The animation to use
        showBackdrop: true, // Will a dark overlay or backdrop cover the entire view
        maxWidth: 200, // The maximum width of the loading indicator. Text will be wrapped if longer than maxWidth
        showDelay: 0 // The delay in showing the indicator
      });
    };
    functionObj.hideLoading=function(){
      $ionicLoading.hide();
    };

    functionObj.showAlert = function(title,message) {
      var alertPopup = $ionicPopup.alert({
        title: title,
        template: message
      });
    };

    return functionObj;

}])

  .factory('sharedCartService', ['$ionicPopup','fireBaseData','$firebaseArray',function($ionicPopup, fireBaseData, $firebaseArray){

    var uid ;// uid is temporary user_id
    var cart={}; // the main Object

    //Check if user already logged in
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        uid=user.uid;
        cart.cart_items = $firebaseArray(fireBaseData.refCart().child(uid));
      }
    });

    //Add to Cart
    cart.add = function(item) {
      //check if item is already added or not
      fireBaseData.refCart().child(uid).once("value", function(snapshot) {

        if( snapshot.hasChild(item.id) == true ){

          //if item is already in the cart
          var currentQty = snapshot.child(item.id).val().item_qty;

          fireBaseData.refCart().child(uid).child(item.id).update({   // update
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
          fireBaseData.refCart().child(uid).child(item.id).set({    // set
            item_name: item.item_name,
            item_image: item.URL,
            item_price: item.price,
            item_qty: 1,
            item_total_price: (item.price*1),
            user: firebase.auth().currentUser.email
          });
        }
      });
    };

    cart.drop=function(item_id){
      fireBaseData.refCart().child(uid).child(item_id).remove();
    };

    cart.increment=function(item_id){

      //check if item is exist in the cart or not
      fireBaseData.refCart().child(uid).once("value", function(snapshot) {
        if( snapshot.hasChild(item_id) == true ){

          var currentQty = snapshot.child(item_id).val().item_qty;
          var item_price = snapshot.child(item_id).val().item_price;
          //check if currentQty+1 is less than available stock
          fireBaseData.refCart().child(uid).child(item_id).update({
            item_qty : currentQty+1,
            item_total_price: (item_price*(currentQty+1))
          });

        }else{
          //pop error
        }
      });

    };

    cart.decrement=function(item_id){

      //check if item is exist in the cart or not
      fireBaseData.refCart().child(uid).once("value", function(snapshot) {
        if( snapshot.hasChild(item_id) == true ){

          var currentQty = snapshot.child(item_id).val().item_qty;
          var item_price = snapshot.child(item_id).val().item_price;

          if( currentQty-1 <= 0){
            cart.drop(item_id);
          }else{
            fireBaseData.refCart().child(uid).child(item_id).update({
              item_qty : currentQty-1,
              item_total_price: (item_price*(currentQty-1))
            });
          }

        }else{
          //pop error
        }
      });

    };

    return cart;
  }])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}]);