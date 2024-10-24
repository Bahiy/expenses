import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/scss/app.scss";
import FirebasePlugin from "./firebase/index"; // Caminho para o seu plugin

Vue.config.productionTip = false;
Vue.use(FirebasePlugin);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
