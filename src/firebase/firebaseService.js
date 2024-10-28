// src/services/firebaseService.js
import firebase from "firebase/compat/app";
import "firebase/compat/database"; // Certifique-se de que o Firebase esteja configurado

// Configuração inicial do Firebase
const db = firebase.database();

const expensesService = {
  expenses: [],

  // Função para obter os dados e mantê-los no array centralizado
  async fetchExpenses() {
    const ref = db.ref(`/${window.uid}`); // Usando 'db' ao invés de 'this.$database'
    const snapshot = await ref.once("value");
    const values = snapshot.val();
    if (values) {
      this.expenses = Object.keys(values).map((key) => values[key]);
    }
    return this.expenses;
  },
};

export default expensesService;
