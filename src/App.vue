<template>
  <div id="app">
    <app-homepage></app-homepage>
  </div>
</template>

<script>
import Homepage from './components/Homepage';

var deferredPrompt;

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(function() {
            console.log('Service Worker Registered');
        })
        .catch(function(error) {
            console.log(error);
        });
}

window.addEventListener('beforeinstallprompt', function(event) {
    console.log('beforeinstallprompt fired');
    event.preventDefault();
    deferredPrompt = event;
    return false;
});

export default {
    name: 'App',
    components: {
        appHomepage: Homepage,
    },
};
</script>

<style>

</style>
