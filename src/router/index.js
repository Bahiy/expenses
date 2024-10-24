import Vue from "vue";
import VueRouter, { RouterLink } from "vue-router";

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    {
      path: "/",
      name: "home",
      meta: {
        icon: "home",
        title: "Home",
      },
      component: () =>
        import(/* webpackChunkName: "home" */ "../pages/home/Home"),
    },
    {
      path: "/lista-gastos",
      name: "lista-gastos",
      meta: {
        icon: "list-ul",
        title: "Lista Gastos",
      },
      component: () =>
        import(
          /* webpackChunkName: "lista-gastos" */ "../pages/lista-gastos/ListaGastos"
        ),
    },
    {
      path: "/login",
      name: "login",
      meta: {
        title: "Login",
      },
      component: () =>
        import(/* webpackChunkName: "login" */ "../pages/login/Login"),
    },
  ],
});
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} - Expenses`;
  if (!window.uid && to.name !== "login") {
    next({ name: "login" });
  } else {
    next();
  }
});

export default router;
