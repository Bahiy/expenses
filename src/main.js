import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/scss/app.scss";
import FirebasePlugin from "./firebase/index"; // Caminho para o seu plugin
import money from "v-money";
import "./utils/directives";

Vue.use(FirebasePlugin);
Vue.use(money, {
  decimal: ",",
  thousands: ".",
  prefix: "R$ ",
  precision: 2,
});
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
