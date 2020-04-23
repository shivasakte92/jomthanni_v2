angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('login', {
      url: '/page2',
      templateUrl: 'templates/login.html',
      controller: 'loginCtrl'
    })

  .state('signup', {
      url: '/page3',
      templateUrl: 'templates/signup.html',
      controller: 'signupCtrl'
    })

  .state('menu2', {
      url: '/page4',
      templateUrl: 'templates/menu2.html',
      controller: 'menu2Ctrl'
    })


  .state('offers', {
    url: '/page5',
    templateUrl: 'templates/offers.html',
    controller: 'MapCtrl'
  })

  .state('myCart', {
    url: '/page6',
    templateUrl: 'templates/myCart.html',
    controller: 'myCartCtrl'
  })

  .state('lastOrders', {
    url: '/page7',
    templateUrl: 'templates/lastOrders.html',
    controller: 'lastOrdersCtrl',
    params: {
    'id': null
      }
  })

  // .state('favourite', {
  //   url: '/page8',
  //   templateUrl: 'templates/favourite.html',
  //   controller: 'favouriteCtrl'
  // })

  .state('settings', {
    url: '/page9',
    templateUrl: 'templates/settings.html',
    controller: 'settingsCtrl'
  })

  .state('support', {
    url: '/page10',
    templateUrl: 'templates/support.html',
    controller: 'supportCtrl'
  })

  .state('checkout', {
    url: '/page11',
    templateUrl: 'templates/checkout.html',
    controller: 'checkoutCtrl',
    params: {
    'address': null, 
    'phone': null
      }
  })

  .state('tabsController.forgotPassword', {
    url: '/page12',
    views: {
      'tab1': {
        templateUrl: 'templates/forgotPassword.html',
        controller: 'forgotPasswordCtrl'
      }
    }
  })

  .state('spirits', {
    url: '/page13',
    templateUrl: 'templates/spirits.html',
    controller: 'spiritsCtrl'
  })

  .state('wine', {
    url: '/page14',
    templateUrl: 'templates/wine.html',
    controller: 'wineCtrl'
  })

  .state('beers', {
    url: '/page15',
    templateUrl: 'templates/beers.html',
    controller: 'beersCtrl'
  })

  .state('tobacco', {
    url: '/page16',
    templateUrl: 'templates/tobacco.html',
    controller: 'tobaccoCtrl'
  })

  .state('accessories', {
    url: '/page17',
    templateUrl: 'templates/accessories.html',
    controller: 'accessoriesCtrl'
  })

  .state('others', {
    url: '/page18',
    templateUrl: 'templates/others.html',
    controller: 'othersCtrl'
  })

    .state('paymentCard', {
    url: '/page19',
    templateUrl: 'templates/paymentBraintree.html',
    controller: 'paymentCardCtrl',
    params: {
    'address': null, 
    'phone': null
      }
  })

    .state('viewOrder', {
    url: '/page20',
    templateUrl: 'templates/viewOrder.html',
    controller: 'viewOrderCtrl',
    params: {
    'id': null
      }
  })

  // .state('testing', {
  //   url: '/page20',
  //   templateUrl: 'templates/testing.html',
  //   controller: 'testingCtrl'
  // })

$urlRouterProvider.otherwise('/page2')

});