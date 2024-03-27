export const useFetchTransactions = (period: any) => {
  const supabase = useSupabaseClient();

  const transactions = ref([]);
  const isPending = ref(false);

  const income = computed(() =>
    transactions.value.filter((t) => t.type === "Income"),
  );
  const expenses = computed(() =>
    transactions.value.filter((t) => t.type === "Expense"),
  );

  const incomeCount = computed(() => income.value.length);
  const expensesCount = computed(() => expenses.value.length);

  const incomeTotal = computed(() =>
    income.value.reduce((sum, t) => sum + t.amount, 0),
  );
  const expensesTotal = computed(() =>
    expenses.value.reduce((sum, t) => sum + t.amount, 0),
  );

  const fetchTransactions = async () => {
    isPending.value = true;

    try {
      const { data } = await useAsyncData(
        `transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`,
        async () => {
          const { data, error } = await supabase
            .from("transactions")
            .select("*")
            .gte("created_at", period.value.from.toISOString())
            .lte("created_at", period.value.to.toISOString())
            .order("created_at", { ascending: false });

          if (error) return [];

          return data;
        },
      );

      return data.value;
    } finally {
      // TODO: handle errors
      isPending.value = false;
    }
  };

  const refresh = async () => (transactions.value = await fetchTransactions());

  watch(period, async () => await refresh());

  // TODO: Type the responses once they are settled
  // ref: https://supabase.com/docs/guides/api/rest/generating-types#update-types-automatically-with-github-actions
  const transactionsGroupedByDate = computed(() => {
    let grouped = {};

    for (const transaction of transactions.value) {
      const date = transaction.created_at.split("T")[0];

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(transaction);
    }

    return grouped;
  });

  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupedByDate,
      },
      income,
      expenses,
      incomeTotal,
      expensesTotal,
      incomeCount,
      expensesCount,
    },
    isPending,
    refresh,
  };
};
