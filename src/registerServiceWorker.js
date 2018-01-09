if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
  .then(function() {
    // registration worked
    console.log('Registration succeeded.');
  }).catch(function(error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}
