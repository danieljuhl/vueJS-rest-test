<template>
  <div id="app">
    <app-homepage></app-homepage>
    <router-view/>
  </div>
</template>

<script>
import Homepage from './components/Homepage';

export default {
    name: 'App',
    components: {
        appHomepage: Homepage,
    },
};
</script>

<style>

</style>
