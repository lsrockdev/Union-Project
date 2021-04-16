export const formatCurrency = value => {
  return `PKR ${parseFloat(value)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,')}/-`;
};
