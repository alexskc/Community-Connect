myApp.controller('SuccessController', ['$rootScope','$scope', '$location', '$firebaseAuth','$firebaseObject', function($rootScope, $scope, $location, $firebaseAuth,$firebaseObject) {
  $scope.message = "Congratulations on joining CommunityConnect Portal!!!";

  var ref = firebase.database().ref();
  var auth = $firebaseAuth();

    $scope.PriorityList=[];
    $scope.PostList =[];
    $scope.current_user = "null";

    try{
        $scope.community = sessionStorage.getItem("community_id");
        console.log($scope.community);
    }
    catch(e){
        $scope.community = "null";
    }

    try{
        $scope.userid = sessionStorage.getItem("userID");
        console.log($scope.userid);
    }
    catch(e){
        $scope.userid = "null";
    }


    //var user = $rootScope.currentUser;
  $scope.go_events_page = function(){
      $scope.save_user_data();
      $location.path('/events');

  };

    $scope.new_community = function(){
        $scope.save_user_data();
        $location.path('/community_create');
    }

   //get community
    $scope.getCommunity = function(){
        console.log("Started", $scope.community == null);
        //go through database and see if we are apart of the community
        var x = firebase.database().ref('/Community List/');
        x.once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                //check if we found the community we are in
                if($scope.community === "null" || $scope.community == null) {
                    childSnapshot.forEach(function (item) {
                        //check if we are in the members section
                        if (item.key === "Members") {
                            //go through list and compare ID's
                            for (i = 0; i < item.val().length; i++) {
                                if (item.val()[i] === $scope.userid) {
                                    //update community key in scope and update the scope
                                    $scope.community = childSnapshot.key;
                                    $scope.$apply();
                                    break;
                                }
                            }
                        }
                    });
                }
                else{
                    console.log("Running Get Post");
                    //run populate posts
                    $scope.load_post();
                }
            });
            if($scope.community === "null" || $scope.community == null){
                console.log("redirecting");
                $scope.new_community();
                $scope.$apply();
            }
        });


    };
    //post function
    $scope.load_post = function(){
        //go through database with the community name and get all post
        if($scope.community == null){
            //console.log($scope.community);
            return;
        }
        else{
            var refCurrentPostsRef = firebase.database().ref('/Community List/' + $scope.community + '/Post');
            refCurrentPostsRef.once('value').then(function(snapshot) {
                //put post in appropriate list and update page
                console.log(snapshot);
                try{
                    Object.values(snapshot.val()).forEach(function(element) {
                        if (element.Priority) {
                            $scope.PriorityList.push(element);
                        } else {
                            $scope.PostList.push(element);
                        }
                        $scope.$apply();
                    });
                }
                catch(e){
                    console.log("No Post");
                }


            });
        }

    };
    $scope.save_user_data = function(){
        try {
            // session code here
            sessionStorage.setItem("userID", $scope.current_user.uid);
            sessionStorage.setItem("community_id", $scope.community)
        }
        catch (e) {
            sessionStorage.clear();
        }
    };

    if($scope.userid !== "null" && $scope.userid !== null){
        //run get community function
        console.log("getting community", $scope.userid);
        $scope.getCommunity();
    }
    else{
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                $scope.current_user = user;
                $scope.userid = user.uid;
                $scope.$apply();
                console.log("Running get Community", $scope.userid);
                $scope.getCommunity();

            } else {
                // No user is signed in.
                console.log("waiting for user...")
            }
        });
    }
}]);