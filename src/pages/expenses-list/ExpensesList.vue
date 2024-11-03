<template>
  <div>
    <div class="months-navigation">
      <div
        :key="i"
        class="month-link"
        @click="setActiveMonth(month)"
        v-for="(month, i) in groupedMonths"
        :class="{ active: month.month === activeMonth.month }"
      >
        <div class="month-label">{{ month.month }}</div>
        <div class="value-label" v-money-format="month.total" />
      </div>
    </div>

    <div class="container-group">
      <div class="container">
        <div v-if="activeMonth.data && activeMonth.data.length === 0">
          Você não cadastrou nenhum neste mês
        </div>
        <template v-else>
          <expense-list-item
            :key="index"
            :data="item"
            v-for="(item, index) in activeMonth.data"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import groupBy from "lodash.groupby";
import ExpenseListItem from "./ExpensesListItem.vue";

export default {
  name: "ExpensesList",
  components: {
    ExpenseListItem,
  },
  data: () => ({
    expenses: [],
    activeMonth: {},
  }),
  created() {
    this.getData();
  },
  mounted() {
    this.setActiveMonth();
  },
  computed: {
    groupedMonths() {
      let groupedMonths = [];

      const addCurrentMonth = () => {
        groupedMonths.push({
          data: [],
          total: 0,
          month: moment().format("MM/YYYY"),
        });
      };

      if (this.expenses.length) {
        const months = groupBy(this.expenses, (i) =>
          moment(i.createdAt).format("MM/YYYY")
        );

        const sortedMonths = Object.keys(months).sort((a, b) => {
          const pattern = "MM/YYYY HH";

          return moment(`${a} 01`, pattern).isBefore(moment(`${b} 01`, pattern))
            ? -1
            : +1;
        });

        groupedMonths = sortedMonths.map((month) => ({
          month,
          data: months[month],
          total: months[month].map((i) => +i.value).reduce((a, c) => a + c, 0),
        }));

        const lastMonth = moment(
          groupedMonths[groupedMonths.length - 1].month,
          "MM/YYYY"
        );

        if (!lastMonth.isSame(moment(), "month")) {
          addCurrentMonth();
        }
      } else {
        addCurrentMonth();
      }

      return groupedMonths;
    },
  },
  methods: {
    getData() {
      const ref = this.$firebase.database().ref(`/${window.uid}`);

      ref.on("value", (snapshot) => {
        const values = snapshot.val();
        this.expenses = values ? Object.keys(values).map((i) => values[i]) : [];
      });
    },
    setActiveMonth(month = null) {
      this.activeMonth =
        month ||
        (this.groupedMonths.length
          ? this.groupedMonths[this.groupedMonths.length - 1]
          : {});
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
    transition: 0.2s;
    cursor: pointer;
    text-align: center;
    .month-label {
      color: var(--light) !important;
    }
    &:hover {
      background-color: var(--featured);
      color: var(--light) !important;
      .value-label {
        color: var(--dark) !important;
        font-weight: 600;
      }
    }
    &.active {
      background-color: var(--featured);
      color: var(--light) !important;
      .value-label {
        color: var(--dark) !important;
        font-weight: 600;
      }
    }
    .value-label {
      color: var(--featured);
      font-size: 0.8rem;
    }
  }
}
.container {
  padding: 1rem 1rem;
  font-size: 1.25rem;
  overflow: hidden auto;
  height: calc(100vh - 4.7rem);
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
}
.container::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
</style>
