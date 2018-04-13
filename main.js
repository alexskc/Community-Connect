var config = {
  apiKey: "AIzaSyB4Mpz4ECLl9RQU8kJZGg84j-EAcV7yKSA",
  authDomain: "communityconnect-3f395.firebaseapp.com",
  databaseURL: "https://communityconnect-3f395.firebaseio.com",
  storageBucket: "communityconnect-3f395.appspot.com",
};
firebase.initializeApp(config);
 

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

function signOut() {
  firebase.auth().signOut().then(function() {
      console.log("Signed Out");
  });
}