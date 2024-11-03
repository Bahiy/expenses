<template>
  <form @submit.prevent="doLogin()" class="form-login">
    <div class="card">
      <div class="card-header text-center">
        <h1 class="mb-0 title">Expenses</h1>
      </div>
      <div class="card-body">
        <div class="inputs-login">
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
        <div class="footer">
          Não tem conta?
          <router-link to="/register" class="link"
            >Clique aqui para Registrar</router-link
          >
        </div>
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
  .card {
    border: 1px solid var(--dark);
    box-shadow: var(--featured-dark) 0px 1rem 3rem 0px;
  }
  .title {
    font-size: 2rem;
    color: var(--featured);
    font-weight: 600;
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

  .footer {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .link {
      color: var(--featured) !important;
      text-decoration: none;
      &:hover {
        color: var(--featured-dark) !important;
        text-decoration: underline;
      }
    }
  }
}
</style>
