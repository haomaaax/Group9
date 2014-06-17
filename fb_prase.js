//init parse 

Parse.initialize("wfsQ2jK7uRpaJJjX4C3zhTvDXlzpVbkpGOrVIFdJ", "6IRXG0BIzE5ToEHOYh3HGjaXrNiU7HaG5Repvte0");



//init facebook

window.fbAsyncInit = function () {

    FB.init({

        appId: '1515134405376425', // Facebook App ID

        status: true, // check login status

        cookie: true, // enable cookies to allow Parse to access the session

        xfbml: true, // parse XFBML

        version: 'v2.0'

    });







    // Additional initialization code here

    

    



}; //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<init end


function LoginClick(){
    
        FB.getLoginStatus(function (response) {

        if (response.status === 'connected') {

            $('#login').remove();

            var FacebookID = Parse.Object.extend("FacebookID");//class

            var query2 = new Parse.Query(FacebookID);

            query2.find({

                success: function (results) {

                    results.forEach(function (e) {

                        var fbid = e.get("userID");

                        var username = e.get('username');

                        var getfieldname = $('#valueID').val();

                        var output = '<option id="valueID" value=' + fbid + '>' + username + '</option>';

                        $('#facebookname').append(output);

                        $('#facebookname').prop('selectedIndex', -1);

                    });

                },

                error: function () {

                    // error is an instance of Parse.Error.

                }

            });

        } else if (response.status === 'not_authorized') {

            $('#main').html('<h1>Please authorized this apps</h1><h4> p/s: please allow browser popup for this website and refresh to use this apps</h4>');

            $('#facebookname,#Sent,label').remove();

            FacebookLogin();

        } else {

            // the user isn't logged in to Facebook.

            $('#main').html('<h1>Please login to use this apps</h1><h4> p/s: please allow browser popup for this website and refresh to use this apps</h4>');

            $('#facebookname,#Sent,label').remove();

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

                          }, 

                          error: function(error) {

                            alert("Error: " + error.code + " " + error.message);

                          }

                        });

            });

            $('.info').html('Wait we\'ll sent you back....');

            setTimeout(function () {

                window.location.reload();

            }, 2000); // little hack for allow api to fetch data alittle bit longer



        }

    }, {

        scope: 'user_likes'

    });





}















//LOAD FACEBOOK SDK ASYNC

(function (d, s, id) {

    var js, fjs = d.getElementsByTagName(s)[0];

    if (d.getElementById(id)) {

        return;

    }

    js = d.createElement(s);

    js.id = id;

    js.src = "//connect.facebook.net/en_US/all.js"; //change to all.js instead of sdk.js (for api 2.0 fix )

    fjs.parentNode.insertBefore(js, fjs);

}(document, 'script', 'facebook-jssdk'));









//Button to get picture and transfer js only after the pages has load

function callAllPagesPhotos() {

    $.getScript("js/bjqs-1.3.min.js", function () {

        $('#my-slideshow').bjqs({

            height: 320,

            width: 620,

            responsive: true,

            showcontrols: true,

            nexttext: '>',

            prevtext: '<',

            showmarkers: false,

            usecaptions: true

        }); // script for slideshow

    });

    $('#Sent').attr('disabled', 'disabled');

}



//onchange event

$("#facebookname").change(function () {

    $('#slideshow').html('<div id="my-slideshow"><ul class="bjqs"></ul></div>');

    $('.info').html('<h3>Please wait while we fetching the data....</h3>');

    var valueID = this.options[this.selectedIndex].value;

    var queryuser = valueID + "/likes?limit=100";

    FB.api(queryuser, {

        fields: 'albums.fields(name)'

    }, function (response) {

        //console.log(response);

        for (var i = 0; i < response.data.length; i++) {

            for (var k = 0; k < response.data[i].albums.data.length; k++) {

                if (response.data[i].albums.data[k].name == "Cover Photos") {

                    FB.api(response.data[i].albums.data[k].id + '/photos', function (response) {

                        //console.log(response);

                        image = response.data[0].images[0].source; //finding the newest uploaded cover photo url    

                        pagesID = response.data[0].from.id;

                        pagesName = response.data[0].from.name;

                        var output = "<li><a class='socialplugin' href='http://www.facebook.com/plugins/likebox.php?href=https://www.facebook.com/" + pagesID + "&width=400&height=600&colorscheme=light&show_faces=true&header=true&stream=false&show_border=true&appId=352670434772249'><img width='100%' title='" + pagesName + "' src=" + image + " /></a></li>";

                        $('.bjqs').append(output);

                    }); //<<<<<<<<<<<<<<<<<<facebook api /photos

                } //<<<<<<<<<<<<<<<<<<<<<IF cover photo statement

            } //<<<<<<<<<<<<<<<<<<<<<<<<<2nd FOR statement                       

        } //<<<<<<<<<<<<<<< FOR statement all pages album

    });

    setTimeout(function () {

        $(".socialplugin").colorbox({

            iframe: true,

            innerWidth: 400,

            innerHeight: 600

        });

        $('#Sent').removeAttr('disabled');

        $('.info').html(' ');

    }, 5000); // little hack for allow api to fetch data alittle bit longer

});