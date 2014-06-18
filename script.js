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

    FB.getLoginStatus(function(response){
     if (response.status === 'connected'){
         console.log("connected!! in init");
         //
//         document.getElementById("fb_login").style.display='none';
//         document.getElementById("login_bt2").style.display='none';
//         document.getElementById("fb_logout").style.display='show';
//         console.log("show~~~~");
         //
         if (response.authResponse) {
            FB.api('/me', function (response){
                var userName = response.name;   
                var userID = response.id;
                var FacebookID = Parse.Object.extend("FacebookID");
                console.log('Good to see you, ' + response.name + '.');

                var query = new Parse.Query(FacebookID);
                query.equalTo("userID", userID);//
                query.find({
                  success: function(results) {
                      console.log("results.length",results.length);
                      if (results.length === 0){//沒有資料回傳
                        var facebookID = new FacebookID();//不用自己手動建class
                        facebookID.set("username",userName);
                        facebookID.set("userID",userID);
                        facebookID.save();
                      }
                      else{
                        console.log("results=",results[0].id);  
//                                console.log("results=",results);
                        getpairinfo(results[0].id);
                      }
                      document.cookie= userID;
                      console.log("login~id=",userID);

                      $("#UserName").empty();
                      $("#UserName").append("Hi~ "+response.name);//append User Name

                  }, 
                  error: function(error) {
                    alert("Error: " + error.code + " " + error.message);
                  }
                });
            });       
        }

     }else if (response.status === 'not_authorized'){
        console.log("this user is not authorizied your apps in init");
//        document.getElementById("fb_login").style.display='show';
//        document.getElementById("login_bt2").style.display='show'; 
//        document.getElementById("fb_logout").style.display='none';
//        console.log("hide1~~~~");         

     }else{
        console.log("not login in init"); 
//        document.getElementById("fb_login").style.display='show'; 
//        document.getElementById("login_bt2").style.display='show'; 
//        document.getElementById("fb_logout").style.display='none';
//        console.log("hide2~~~~");  
     }
    });
}; //<<<<<<<<<<<<<<<init end    

//function reload(){
//            alert("Reload here!!");
//            window.location.reload();
//}

function clickFBLogin(){
//    document.getElementById("fb_logout").style.display='none';
//    $("#fb_logout").hide();
//    console.log("hide");
    
    FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
            console.log("connected!!");
            
//            document.getElementById("fb_login").style.display='none';
//            document.getElementById("fb_logout").style.display='block';
            
            
            document.cookie = response.authResponse.userID;//?
            console.log("js_id=",response.authResponse.userID);//?
            console.log("js_cookie=",document.cookie);//?
            
            var FacebookID = Parse.Object.extend("FacebookID");//class
            var query2 = new Parse.Query(FacebookID);
            
            query2.find({
                success: function (results) {
                    results.forEach(function (e) {
                        var fbid = e.get("userID");
                        var username = e.get('username');
                    });
                    
//                    $("#fb_logout").show();
                    alert("used to login before~~~~~");
                    parent.$.fancybox.close();                      
                },
                error: function () {
                    // error is an instance of Parse.Error.
                    alert("error~~~~~");
                }
            });
            
////                    document.getElementById("nav_login").text()="Log out";//  
//                    parent.$("#nav_login").remove();//parent?
//                    console.log("remove");
////                    $("#nav_login").val('Log out');//////////////
//                    $("#nav_login").prev("span").attr("nav_login","nav_logout"); /////////
            
            
        } else if (response.status === 'not_authorized') {
            console.log("no authorized!!");
//            document.getElementById("fb_login").style.display='none';
//            document.getElementById("fb_logout").style.display='block';
//            $("#fb_logout").hide();//
            FacebookLogin();
               
            
        } else {
            console.log("not login yet!!");
            // the user isn't logged in to Facebook.
//            $("#fb_logout").hide();//
//            document.getElementById("fb_login").style.display='block';
//            document.getElementById("fb_logout").style.display='none';
            FacebookLogin();

        }
    });
}

//LOGIN Fix

function FacebookLogin() {
//    deleteAllCookies();
    FB.login(function (response) {
        if (response.authResponse) {
            FB.api('/me', function (response) {
                        var userName = response.name;   
                        var userID = response.id;
                        var FacebookID = Parse.Object.extend("FacebookID");
                        console.log('Good to see you, ' + response.name + '.');
                
                        var query = new Parse.Query(FacebookID);
                        query.equalTo("userID", userID);//
                        query.find({
                          success: function(results) {
                              console.log("results.length",results.length);
                              if (results.length === 0){//沒有資料回傳
                                var facebookID = new FacebookID();//不用自己手動建class
                                facebookID.set("username",userName);
                                facebookID.set("userID",userID);
                                facebookID.save();
                              }
                              else{
                                console.log("results=",results[0].id);  
//                                console.log("results=",results);
                                getpairinfo(results[0].id);
                              }
                              document.cookie= userID;
                              console.log("login~id=",userID);
                              
                              $("#UserName").empty();
                              $("#UserName").append("Hi~ "+response.name);//append User Name

                          }, 
                          error: function(error) {
                            alert("Error: " + error.code + " " + error.message);
                          }
                        });
            });
            $('.info').html('Wait we\'ll sent you back....');
            setTimeout(function () {
//                window.location.reload();//parent
                $.fancybox.close();
            }, 2000); // little hack for allow api to fetch data alittle bit longer
        }
    }, {
        scope: 'user_likes'
    }); 
}

function FacebookLogout() {
    FB.getLoginStatus(function(response) {
        if (response && response.status === 'connected') {
            FB.logout(function(response) {
                document.location.reload();//parent
            });
        }
    });
    deleteAllCookies();
//    parent.$.fancybox.close(); 
}

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
    	var cookie = cookies[i];
    	var eqPos = cookie.indexOf("=");
    	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
//    	document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

//        <script>
function getpairinfo(ObjectID){
//				Parse.initialize("wfsQ2jK7uRpaJJjX4C3zhTvDXlzpVbkpGOrVIFdJ", "6IRXG0BIzE5ToEHOYh3HGjaXrNiU7HaG5Repvte0");

				var currentuser = Parse.Object.extend("FacebookID");//include class
				var querypair = new Parse.Query(currentuser);//對class做搜尋
				//querypair.refresh();
                
                //Max 6/17 plus date 
                var date = new Date($.now());
                var month = new Array(12);
                    month[0] = "01";
                    month[1] = "02";
                    month[2] = "03";
                    month[3] = "04";
                    month[4] = "05";
                    month[5] = "06";
                    month[6] = "07";
                    month[7] = "08";
                    month[8] = "09";
                    month[9] = "10";
                    month[10] = "11";
                    month[11] = "12";
                
                var Year = date.getFullYear();
                var Month = month[date.getMonth()];
                var Day = date.getDate();
                
                var numDate = parseInt(Year+Month+Day);
                var searchInput = "";
				querypair.get(ObjectID, { //objectid
				  success: function(user) {
				  	//user = unsynuser.fetch();
				  	//querypair.refresh();
				  	console.log(user.get("ingredient"));
				  	//var obj = user.get("ingredient").split(",");
                    var obj = user.get("ingredient").split(' ');
                      
                      
                    for(var j=1; j<obj.length; j=j+2){
                        if(parseInt(obj[j]) <= (parseInt(Year+Month+Day) - 7)){
				  		    console.log("obj" + obj[j] );
                            $('#refrigerator').append('<div class="box_red" value='+obj[j-1]+'>'+obj[j-1]+" "+'<div class="box_hover">'+obj[j]+" "+"</div>");
                            searchInput += obj[j-1] + " ";
                            
                        }
				  	}
                      
				  	for(var i=0; i<obj.length; i=i+2){
                        if(parseInt(obj[i+1]) > (parseInt(Year+Month+Day) - 7)){
                            console.log("obj" + obj[i] );
                            $('#refrigerator').append('<div class="box" value='+obj[i]+'>'+obj[i]+" "+'<div class="box_hover">'+obj[i+1]+"</div>"+" "+"</div>");
                            searchInput += obj[i] + " ";
                        }
				  	}
				  	$('#gsc-i-id1').val(searchInput);
                      
				  },
				  error: function(object, error) {
				  	console.log("nonono");
				    
				  }
				});
				
			}
//		</script>


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

