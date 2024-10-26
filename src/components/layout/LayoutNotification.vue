<template>
  <div
    v-if="show"
    :class="`alert-${type}`"
    class="alert alert-dismissible fade show"
  >
    {{ message }}
    <button type="button" class="btn-close" @click="close()"></button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      type: "danger",
      message: "",
    };
  },
  created() {
    this.$root.$on("Notification::show", (payload) => {
      this.show = true;
      this.type = payload.type;
      this.message = payload.message;

      {
        type: "success";
        message: "";
        show: false;
      }
      setTimeout(() => {
        this.close();
      }, payload.time || 4000);
    });
  },
  methods: {
    close() {
      this.message = "";
      this.type = "danger";
      this.show = false;
    },
  },
};
</script>

<style scoped lang="scss">
.alert {
  position: absolute;
  max-width: 25rem;
  right: 1.3rem;
  top: 1.3rem;
  transition: 0.9s;
}
</style>
