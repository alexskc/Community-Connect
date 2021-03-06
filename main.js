var config = {
  apiKey: "AIzaSyB4Mpz4ECLl9RQU8kJZGg84j-EAcV7yKSA",
  authDomain: "communityconnect-3f395.firebaseapp.com",
  databaseURL: "https://communityconnect-3f395.firebaseio.com",
  storageBucket: "communityconnect-3f395.appspot.com",
};
firebase.initializeApp(config);

var database = firebase.database();
var priority_list=[];
var normal_list=[];

function get_posts() {
  var refCurrentPostsRef = firebase.database().ref('/Community List/' + currentCommunity() + '/Post');
  refCurrentPostsRef.on('value', function(snapshot) {
    Object.values(snapshot.val()).forEach(function(element) {
      if (element.Priority) {
        priority_list.push(element);
      } else {
        normal_list.push(element);
      }
    });
    var $scope = angular.element(document.querySelector('[ng-app=myApp]')).scope();
   $scope.$apply(); 
  });
}


function writePost(e) {
  e.preventDefault();
  var postText = e.target[0].value;
  firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
    var request = new XMLHttpRequest();
    request.open('POST', 'https://us-central1-communityconnect-3f395.cloudfunctions.net/helloWorld', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function() {
      console.log(request.responseText);
    }
    var send = {"idToken": idToken, "postText": postText, "communityId": currentCommunity()};
    request.send(JSON.stringify(send));
  });
}

function currentCommunity() {
  return sessionStorage.getItem('community');
}


function signin(e) {
  e.preventDefault();
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    alert("Incorrect email or password!");
  });

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    window.location.replace("dashboard.html");
  }
});
}
  
angular.module('myApp', [])
    .controller('View1Ctrl', function ($scope) {
        $scope.PriorityList=[];
        $scope.PriorityList = priority_list;
        $scope.PostList = normal_list;
    });

function signOut() {
  firebase.auth().signOut().then(function() {
      console.log("Signed Out");
  });
}

function setCommunity(e, communityId) {
  e.preventDefault();
  sessionStorage['community'] = communityId;
  location.reload();
}


var completetemplate = "";
var communityList = "";
function populateCommunities(userId) {
  var communityNames = [];
  var template = "";
  firebase.database().ref('/User List/' + userId + "/Communities").once('value').then(function(snapshot) {
    communityList = Object.values(snapshot.toJSON());
    communityList.forEach(function(element) {
      firebase.database().ref('/Community List/' + element + '/Name').once('value').then(function(snapshot) {
        communityNames.push(snapshot.val());
        template += genFromTemplate("communitylist.html", [{"find": "CommunityID", "replace": "\'" + element + "\'"},{"find": "communityName", "replace": snapshot.val()}]);
        completetemplate += template;
        if (communityNames.length == communityList.length) {
          insertCommunities(completetemplate);
        }
      });
    });
  });
  firebase.database().ref('/User List/' + userId + "/Name").once('value').then(function(snapshot) {
    var header = document.getElementsByClassName("header")[0].innerHTML;
    header = header.replace("{{User Name}}", snapshot.val());
    document.getElementsByClassName("header")[0].innerHTML = header;
  });
  firebase.database().ref('/Community List/' + currentCommunity() + "/Name").once('value').then(function(snapshot) {
    var header = document.getElementsByClassName("header")[0].innerHTML;
    header = header.replace("{{Community Name}}", snapshot.val());
    document.getElementsByClassName("header")[0].innerHTML = header;
  });
}

function insertCommunities(template) {
  document.getElementsByClassName("communitylist")[0].innerHTML = template;
}

function genFromTemplate(template, FindAndReplaceArr) {
  var request = new XMLHttpRequest();
  request.open('GET', template, false);
  var template = ""; 
  request.onload = function() {
    template = request.responseText;
    FindAndReplaceArr.forEach(function(element) {
      template = template.replace("{{" + element.find + "}}", element.replace);
    });
  }
  request.send();
  return template;
}

function toggleCommunities() {
  if (document.getElementsByClassName("communitylist")[0].style.display == "block") {
    document.getElementsByClassName("communitylist")[0].style.display = "none"; } else {
    document.getElementsByClassName("communitylist")[0].style.display = "block"; }
}
