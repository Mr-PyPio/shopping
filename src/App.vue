<template>
    <div>
      <router-view></router-view>
    </div>
</template>

<script>
export default {
  beforeCreate() {
    const username = window.localStorage.getItem('userName') ?? ''
    this.$store.dispatch('updateLoginStatus', username)
  }
}
</script>