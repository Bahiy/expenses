<template>
  <form @submit.prevent="doRegister" class="form-login">
    <div class="card">
      <div class="card-header text-center">
        <h1 class="mb-0">Expenses</h1>
      </div>
      <div class="card-body">
        <div class="inputs-login">
          <h1>REGISTRO</h1>
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
          <div class="form-group">
            <input
              required
              type="password"
              v-model="registrationPassword"
              placeholder="Repita sua senha"
              class="form-control"
            />
          </div>
        </div>
        <button class="btn btn-primary w-100" :disabled="loading">
          <template v-if="loading">
            Registrando...
            <i class="fa fa-spinner fa-spin"></i>
          </template>
          <template v-else>
            Registrar
            <i class="fa fa-sign-in"></i>
          </template>
        </button>
      </div>
    </div>
  </form>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      email: "",
      password: "",
      registrationPassword: "",
      loading: false,
    };
  },
  methods: {
    async doRegister() {
      this.loading = true;
      const { email, password } = this;
      try {
        const res = await this.$auth.createUserWithEmailAndPassword(
          email,
          password
        );
        window.uid = res.user.uid;

        this.$router.push({ name: "home" }).catch(() => {});

        console.log(res);
      } catch (err) {
        let message = "";
        switch (err.code) {
          case "auth/too-many-requests":
            message =
              "Sua conta foi bloqueada devido a múltiplas tentativas de login incorretas. \n\nTente novamente mais tarde.";
            break;

          default:
            message =
              "Credenciais inválidas. \n\nSe você esqueceu sua senha, clique em 'Esqueci a senha' para redefini-la.";
            break;
        }
        this.$root.$emit("Notification::show", {
          type: "danger",
          message: message,
        });
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
    width: 25%;
    color: var(--darker);
  }
  .card-body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .inputs-login {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
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
