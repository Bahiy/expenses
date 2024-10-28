import Vue from "vue";
import moment from "moment";

Vue.directive("money-format", (element, { value }) => {
  element.innerHTML = new Intl.NumberFormat('pt-BR', {
    currency: 'BRL',
    style: 'currency',
    minimumFractionDigits: 2
  }).format(value || 0);
});

Vue.directive('date-format', (element, { value }) => {
  element.innerHTML = moment(value).format('DD/MM/YYYY [às] HH:mm:ss')
})
