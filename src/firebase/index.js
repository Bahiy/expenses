// Importando as dependências do Firebase
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/database";

// Configuração do Firebase
export const firebaseApp = firebase.initializeApp({
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
});

// Criando o plugin Firebase
const FirebasePlugin = {
  install(Vue) {
    // Adiciona as instâncias de Firebase ao Vue prototype para acesso global
    Vue.prototype.$firebase = firebaseApp;
    Vue.prototype.$auth = firebaseApp.auth();
    Vue.prototype.$storage = firebaseApp.storage();
    Vue.prototype.$database = firebaseApp.database();
  },
};

export default FirebasePlugin;
