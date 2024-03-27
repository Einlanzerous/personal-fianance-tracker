export const useCurrency = (amount: Ref<number>) => {
  const currency = computed(() => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(isRef(amount) ? (amount.value as number) : amount);
  });

  return {
    currency,
  };
};
