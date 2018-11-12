<template>
  <div>
      {{msg}}
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
    data() {
        return {
            msg: 'this is tags views'
        }
    },
}
</script>

<style scoped>

</style>