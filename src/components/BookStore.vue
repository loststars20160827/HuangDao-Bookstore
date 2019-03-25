<template>
  <div class="bookstore">
    <TopBar></TopBar>
    <router-view></router-view>
  </div>
</template>

<script>
import TopBar from './TopBar'

export default {
  name: 'BookStore',
  components: {
    TopBar
  },
  data () {
    return {

    }
  },
  methods: {

  }
}
</script>

<style scoped>
.bookstore{
  /* height:100%; */
}
</style>
