<template>
  <div class="home">
    <div class="row">
      <div class="col-6 home-box">
        <small>Você gastou:</small>
        <p class="money">R$ 900,00</p>
        <small>em 89 compras</small>
      </div>
      <div class="col-6 home-box">
        <small>A média de gastos é de:</small>
        <p class="money">R$ 99,80</p>
      </div>
      <div class="col-6 home-box">
        <small>O MAIOR gasto foi de:</small>
        <p class="money">R$ 99,89</p>
        <small>No dia 26/10/2024</small>
      </div>
      <div class="col-6 home-box">
        <small>O MENOR gasto foi de:</small>
        <p class="money">R$ 3,09</p>
        <small>No dia 26/10/2024</small>
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
        biggest: {},
        lowest: {},
      };
      if (exp.length) {
        values.totalsSpent = exp.map(e => e.values);
      }
      return values;
    },
  },
  methods: {
    getData() {
      const ref = this.$database.ref(`/${window.uid}`);
      ref.on("value", (payload) => {
        const values = payload.val();
        if (values) {
          this.expenses = Object.keys(values).map((i) => values[i]);
        }

        console.log(this.expenses);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  padding: 1rem;
  .home-box {
    font-size: 3rem;
    width: 50%;
    height: calc(50vh - 1rem);
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--dark-medium);
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
