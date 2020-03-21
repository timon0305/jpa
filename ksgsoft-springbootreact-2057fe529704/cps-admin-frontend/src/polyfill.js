/*
* required polyfills
*/
import 'core-js/es6/array'
// import 'core-js/es6/regexp'
import 'core-js/es6/map'
// import 'core-js/es6/weak-map'
import 'core-js/es6/set'
import 'core-js/es7/object'

(function () {

  if ( typeof window.CustomEvent === "function" ) return false

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined }
    var evt = document.createEvent( 'CustomEvent' )
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail )
    return evt
  }

  CustomEvent.prototype = window.Event.prototype

  window.CustomEvent = CustomEvent
})()
