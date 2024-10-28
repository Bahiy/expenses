<template>
  <div class="expense-list-item row">
    <div class="col-2">12/08/2024</div>
    <div class="col-8">
      Lorem ipsum dolor sit amet consectetur adipisicing elit.
    </div>
    <div class="col money">
      <div v-money-format="120" />
    </div>
    <div class="col text-center">
      <router-link to="/">
        <button class="icon btn-primary-outline" type="button">
          <i class="fa fa-receipt" />
        </button>
      </router-link>
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
    console.log(this.getData());
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
    color: var(--featured-dark);
  }
}
</style>
