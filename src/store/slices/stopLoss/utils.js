export const stopLossInitialState = {
  loading: false,
  error: '',
  stopLossModelId: 0,
  stopLossAggregate: {
    coinsurance: 0,
    deductible: 0,
    modelId: 0,
  },
  stopLossPopulationCredibility: {
    modelId: 0,
    populationCredibility: 0,
  },
  stopLossPremiums: [
    {
      categoryType: "",
      modelId: 0,
      netExpense: 0,
      pmpm: 0,
      serviceCategory: "",
      totalPremium: 0,
    },
  ],
  stopLossSpecifics: [
    {
      categoryType: "",
      coinsurance: 0,
      deductible: 0,
      modelId: 0,
      serviceCategory: "",
    },
  ],
};