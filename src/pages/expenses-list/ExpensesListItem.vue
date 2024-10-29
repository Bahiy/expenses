<template>
  <div>
    <div
      :key="i"
      v-for="(expense, i) in expenses"
      class="expense-list-item row"
    >
      <div class="col-2" v-date-format="expense.createdAt"></div>
      <div class="col-8">
        {{ expense.description }}
      </div>
      <div class="col money">
        <div v-money-format="expense.value" />
      </div>

      <div v-if="expense.receipt" class="col text-center">
        <a target="_blank" :href="expense.receipt">
          <button class="icon btn-primary-outline" type="button">
            <i class="fa fa-receipt" />
          </button>
        </a>
      </div>
      <!-- TODO - Criar botão de adicionar comprovante na listagem -->
      <!-- TODO - Separar gastos por mês -> Ordenado descrescente-->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      expenses: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      const ref = this.$database.ref(`/${window.uid}`);
      ref.on("value", (snapshot) => {
        const values = snapshot.val();
        if (values) {
          this.expenses = Object.keys(values).map((i) => values[i]);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.expense-list-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-items: center;
  border-bottom: 1px solid var(--dark-medium);
  padding: 0.5rem 0;
  .money {
    color: var(--featured);
  }
  .icon {
    text-align: center;
    background-color: transparent;
    border: 1px solid;
    border-radius: 0.3rem;
    color: var(--ligh-medium);
  }
}
</style>
