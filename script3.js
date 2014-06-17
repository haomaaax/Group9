// JavaScript Document

Parse.initialize("wfsQ2jK7uRpaJJjX4C3zhTvDXlzpVbkpGOrVIFdJ", "6IRXG0BIzE5ToEHOYh3HGjaXrNiU7HaG5Repvte0");

window.fbAsyncInit = function () {
    
//    facebook init
//    輸入基本的Facebook init的狀態，與Facebook 連接，包括APP ID的設定
    FB.init({
        appId      : '1515134405376425',
        xfbml      : true,
        version    : 'v2.0',
//        status     : true, // check login status
        cookie     : true // enable cookies to allow Parse to access the session
    });
    
//     Parse.FacebookUtils.init({
//        appId      : '1515134405376425', // Facebook App ID
//        channelUrl : 'http://chialinyu.github.io/G9/AllAboutFood/', // Channel File
//        cookie     : true, // enable cookies to allow Parse to access the session
//        xfbml      : true  // parse XFBML
//     });
//    
//    Parse.FacebookUtils.logIn(null, {
//          success: function(user) {
//            if (!user.existed()) {
//              alert("User signed up and logged in through Facebook!");
//            } else {
//              alert("User logged in through Facebook!");
//            }
//          },
//          error: function(user, error) {
//            alert("User cancelled the Facebook login or did not fully authorize.");
//          }
//        });

}; //<<<<<<<<<<<<<<<init end    

function reload(){
            alert("Reload here!!");
            window.location.reload();
}

function clickFBLogin(){
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            console.log("connected!!");
            var FacebookID = Parse.Object.extend("FacebookID");//class
            var query2 = new Parse.Query(FacebookID);
            
            query2.find({
                success: function (results) {
                    results.forEach(function (e) {
                        var fbid = e.get("userID");
                        var username = e.get('username');
                    });
                    
                    alert("used to login before~~~~~");
                    parent.$.fancybox.close();                      
                },
                error: function () {
                    // error is an instance of Parse.Error.
                    alert("error~~~~~");
                }
            });
        } else if (response.status === 'not_authorized') {
            console.log("no authorized!!");
           FacebookLogin();
            
        } else {
            console.log("not login yet!!");
            // the user isn't logged in to Facebook.
            FacebookLogin();
        }
    });
}

//LOGIN Fix

function FacebookLogin() {
    FB.login(function (response) {
        if (response.authResponse) {
            FB.api('/me', function (response) {
                        var userName = response.name;   
                        var userID = response.id;
                        var FacebookID = Parse.Object.extend("FacebookID");
//                        console.log('Good to see you, ' + response.name + '.');
//                        var FacebookID = Parse.Object.extend("FacebookID");
                        var query = new Parse.Query(FacebookID);
                        query.equalTo("userID", userID);//
                        query.find({
                          success: function(results) {
                              console.log(results.length);
                              if (results.length === 0){//沒有資料回傳
                                var facebookID = new FacebookID();//不用自己手動建class
                                facebookID.set("username",userName);
                                facebookID.set("userID",userID);
                                facebookID.save();
                              }
                              var currentuser = new Parse.Query(FacebookID);
                              currentuser.equalTo("username", "currentuser");
                              currentuser.find({
                                success: function(a){
                                    currentuser.set("userID",userID);
                                }
                               , error:function(b){
                                    
                                }
                              });
                          }, 
                          error: function(error) {
                            alert("Error: " + error.code + " " + error.message);
                          }
                        });
            });
            $('.info').html('Wait we\'ll sent you back....');
            setTimeout(function () {
                parent.window.location.reload();
            }, 2000); // little hack for allow api to fetch data alittle bit longer
        }
    }, {
        scope: 'user_likes'
    });
}

//LOAD FACEBOOK SDK ASYNC，這是基本的東西，應該不用多說了吧
(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js"; 
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

