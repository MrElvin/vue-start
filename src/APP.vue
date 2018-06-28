<template lang="pug">
  div(id="app")
    h1 Let's Start Vue
    img(src="./assets/images/logo.png")
    p by Breezymelon
</template>

<script>
import './hot'

export default {
  name: 'App',
  data () {
    return {
    }
  },
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html, body, #app {
  height: 100%;
  width: 100%;
  background: #333440;
}
</style>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  min-height: 400px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  color: #2c3e50;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
h1 {
  padding-top: 100px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #37AD70;
}
p {
  font-size: 12px;
  color: #f2f2f2;
  padding-bottom: 50px;
}
</style>

