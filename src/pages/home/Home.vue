<template>
  <div class="home">
    <div class="row">
      <div class="col-6 home-box">
        <small>Você gastou:</small>
        <p class="money" v-money-format="totals.totalsSpent"></p>
        <small>em {{ totals.qtd }} compras</small>
      </div>
      <div class="col-6 home-box">
        <small>A média de gastos é de:</small>
        <p class="money" v-money-format="totals.average" />
      </div>
    </div>
    <div class="row">
      <div class="col-6 home-box">
        <small>O MAIOR gasto foi de:</small>
        <p class="money" v-money-format="totals.biggest.value" />
        <small v-date-format="totals.biggest.createdAt" />
      </div>
      <div class="col-6 home-box">
        <small>O MENOR gasto foi de:</small>
        <p class="money" v-money-format="totals.lowest.value" />
        <small v-date-format="totals.lowest.createdAt" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      expenses: [],
    };
  },
  created() {
    this.getData();
  },
  computed: {
    totals() {
      const { expenses: exp } = this;
      const values = {
        totalsSpent: 0,
        average: 0,
        qtd: 0,
        biggest: {},
        lowest: {},
      };
      if (exp.length) {
        values.totalsSpent = exp
          .map((e) => e.value)
          .reduce((acc, cur) => acc + cur, 0)
          .toFixed(2);

        values.qtd = exp.length;

        values.average = (values.totalsSpent / values.qtd).toFixed(2);

        values.biggest = exp.sort((a, b) => b.value - a.value)[0];
        values.lowest = exp.sort((a, b) => a.value - b.value)[0];
      }
      return values;
    },
  },
  methods: {
    getData() {
      const ref = this.$database.ref(`/${window.uid}`);
      ref.on("value", (snapshot) => {
        const values = snapshot.val();
        if (values) {
          this.expenses = Object.keys(values).map((i) => values[i]);
        }

        console.log("Retorno das expenses no BD:", this.expenses);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  .row {
    align-items: center;
    justify-content: center;
    gap: 2rem;
    margin: 1rem;
  }
  .home-box {
    font-size: 3rem;
    width: 40%;
    height: calc(50vh - 3rem);
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--featured-dark);
    box-shadow: 0px 0px 0.5rem 0rem var(--featured-dark);
    border-radius: 10px;

    // &:nth-child(2), :nth-child(4){

    //   border-left: none;
    //   border-bottom: none;
    // }
    // &:nth-child(3), :nth-child(4){
    //   border-top: none;
    //   border-right: none;
    // }
    .money {
      color: var(--featured);
    }
    small {
      font-size: 1.1rem;
    }
  }
}
</style>
