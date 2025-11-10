export const formatCurrency = new Intl.NumberFormat("en-US", {
	minimumFractionDigits: 0,
	maximumFractionDigits: 0,
	style: "currency",
	currency: "USD",
});
