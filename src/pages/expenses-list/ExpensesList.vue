<template>
  <div>
    <div class="months-navigation">
      <div :key="i" v-for="(month, i) in groupedMonth" class="month-link">
        <div class="month-label">{{ month.month }}</div>
        <div class="value-label" v-money-format="month.total" />
      </div>
    </div>

    <div class="container">
      <expenses-list-item />
    </div>
  </div>
</template>

<script>
import groupBy from "lodash.groupby";
import moment from "moment";
import ExpensesListItem from "./ExpensesListItem";
export default {
  name: "ListaGastos",
  components: {
    ExpensesListItem,
  },
  data() {
    return {
      expenses: [],
    };
  },
  created() {
    this.getData();
  },
  computed: {
    groupedMonth() {
      if (this.expenses.length) {
        const months = groupBy(this.expenses, (index) =>
          moment(index.createdAt).format("MM/YYYY")
        );

        const sortedMonths = Object.keys(months).sort((a, b) => {
          const pattern = "MM/YYYY HH";
          if (moment(`${a} 01`, pattern).isBefore(moment(`${b} 01`, pattern))) {
            return -1;
          } else {
            return +1;
          }
        });
        return sortedMonths.map((month) => ({
          month,
          data: months[month],
          total: months[month]
            .map((i) => i.value)
            .reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              0
            ),
        }));
      } else {
        return [];
      }
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
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.months-navigation {
  display: flex;
  width: 100%;
  background-color: var(--featured-dark);
  .month-link {
    padding: 1rem;
    transition: 0.4s;
    cursor: pointer;
    text-align: center;
    &:hover {
      background-color: var(--featured);
    }
    .value-label {
      color: var(--darker);
      font-size: 0.8rem;
    }
  }
}
.container {
  padding: 0rem 1rem;
  font-size: 1.25rem;
}
</style>
