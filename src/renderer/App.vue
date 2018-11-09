<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
    name: 'downloader'
};
</script>

<style>
/* CSS */
body, div, p, a, ul, li, header, main, footer, aside, section, h1, h2, h3 {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}
body, #app {
    width: 100vw;
    height: 100vh;
}
</style>
