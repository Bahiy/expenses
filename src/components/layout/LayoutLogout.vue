<template>
  <button class="btn btn-logout" @click="logout()">
    <i class="fa fa-sign-out"></i>
    Sair
  </button>
</template>

<script>
export default {
  methods: {
    async logout() {
      this.$root.$emit("Spinner::show");
      await this.$auth.signOut();
      this.$router.push({ name: "login" }).catch(() => {});
      this.$root.$emit("Spinner::hide");
    },
  },
};
</script>

<style scoped lang="scss">
.btn-logout {
  width: 100%;
  cursor: pointer;
  color: var(--light);
  &:hover {
    background-color: #ac2121;
  }
}
</style>
