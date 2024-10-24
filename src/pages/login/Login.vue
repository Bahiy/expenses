<template>
  <form @submit.prevent="doLogin()" class="form-login">
    <div class="card">
      <div class="card-header text-center">
        <h1 class="mb-0">Expenses</h1>
      </div>
      <div class="card-body">
        <div class="form-group">
          <input
            type="email"
            v-model="email"
            autocomplete="email"
            class="form-control"
            placeholder="E-mail"
            required
          />
        </div>
        <div class="form-group">
          <input
            type="password"
            v-model="password"
            autocomplete="current-password"
            class="form-control"
            placeholder="Senha"
            required
          />
        </div>
        <button class="btn btn-primary w-100" :disabled="loading">
          <template v-if="loading">
            Entrando...
            <i class="fa fa-spinner fa-spin"></i>
          </template>
          <template v-else>
            Entrar
            <i class="fa fa-sign-in"></i>
          </template>
        </button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      loading: false,
    };
  },
  methods: {
    async doLogin() {
      this.loading = true;
      const { email, password } = this;
      try {
        const res = await this.$auth.signInWithEmailAndPassword(
          email,
          password
        );
        window.uid = res.user.uid;

        this.$router.push({ name: "home" }).catch(() => {});

        console.log(res);
      } catch (err) {
        console.log(err);
      }
      this.loading = false;
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (window.uid) {
        vm.$router.push({ name: home });
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.form-login {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  h1 {
    font-size: 1.5rem;
  }
  .card {
    width: 30%;
    color: var(--darker);
  }
}
.link {
  color: var(--featured);
  text-decoration: none;
  &:hover {
    color: var(--featured-dark);
    text-decoration: underline;
  }
}
</style>
