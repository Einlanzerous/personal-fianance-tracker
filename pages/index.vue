<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">
      Summary
    </h1>
    <div>
      <USelectMenu :options="transactionViewOptions" v-model="selectedView" />
    </div>
  </section>

  <section class="grid grid-cols-1 sm:grid-col-2 lg:grid-cols-4 sm:gap-16 mb-10">
    <Trend color="green" title="Income" :amount="incomeTotal" :last-amount="previousIncomeTotal" :loading="isPending" />
    <Trend color="red" title="Expenses" :amount="expensesTotal" :last-amount="previousExpensesTotal" :loading="isPending" />
    <Trend color="green" title="Investments" :amount="64300" :last-amount="57884" :loading="isPending" />
    <Trend color="red" title="Savings" :amount="447" :last-amount="0" :loading="isPending" />
  </section>

  <section class="flex justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold">
        Transactions
      </h2>
      <div class="text-gray-500 dark:text-gray-400">
        You have {{ incomeCount }} income sources and {{ expensesCount }} expenses this period.
      </div>
    </div>
    <div>
      <TransactionModal v-model="isOpen" :transactions="transactions" @saved="refresh" />
      <UButton icon="i-heroicons-plus-circle" color="white" variant="solid" label="Add" @click="isOpen = true" />
    </div>
  </section>

  <section v-if="!isPending">
    <div v-for="(transactionsByDate, date) in byDate" :key="date" class="mb-10">
      <DailyTransactionSummary :date="date" :transactions="transactionsByDate" />
      <Transaction v-for="transaction in transactionsByDate" :key="transaction.id" :transaction="transaction"
        @deleted="refresh" />
    </div>
  </section>
  <section v-else>
    <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
  </section>
</template>

<script setup lang="ts">
import { transactionViewOptions } from '~/constants';

const isOpen = ref(false);
const selectedView = ref(transactionViewOptions[2]);
const { current, previous } = useSelectedTimePeriod(selectedView);

defineComponent({
  props: {
    transactions: {
      type: Array,
      required: true,
    },
  },
  emits: ['saved', 'deleted'],
});

const { isPending, refresh, transactions: {
  incomeCount,
  expensesCount,
  incomeTotal,
  expensesTotal,
  grouped: {
    byDate
  }
}} = useFetchTransactions(current);

// await refresh();

const { refresh: refreshPrevious, transactions: {
  incomeTotal: previousIncomeTotal,
  expensesTotal: previousExpensesTotal,
}} = useFetchTransactions(previous);

// await refreshPrevious();
</script>