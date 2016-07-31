import Vue from 'vue'
import App from './App'
import Firebase from 'firebase'

var config = {
  apiKey: "AIzaSyAYVtNf1LZjvCRHVGsktSXJi1zTm0a4xHs",
  authDomain: "fir-link-aa249.firebaseapp.com",
  databaseURL: "https://fir-link-aa249.firebaseio.com",
  storageBucket: "fir-link-aa249.appspot.com",
};
let database = Firebase.initializeApp(config);
/* eslint-disable no-new */
new Vue({
  el: 'body',
  components: { App },
  firebase: {database}
})
