<template>
    <div id="app">
      <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
  @import './style/base.scss';
  html, body {
    height: 100%;
    width: 100%;
    margin: 0;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
    width: 100%;
  }
  main {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
  }
  main > div {
    width: calc(100vw - 310px);
    width: 100%;
  }
  ::-webkit-scrollbar {
      width: 8px !important;
      height: 12px !important;
  }

  ::-webkit-scrollbar-thumb {
      border-radius: 5px !important;
      -webkit-box-shadow: inset 0 0 5px #7A7B7C !important;
      box-shadow: inset 0 0 5px #7A7B7C !important;
      background: #7A7B7C !important;
  }

  ::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 5px #F0F0F0 !important;
      box-shadow: inset 0 0 5px #F0F0F0 !important;
      border-radius: 0 !important;
      background: #F0F0F0 !important;
  }
</style>
