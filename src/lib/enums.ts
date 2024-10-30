//------------------------------------Node-------------
export enum NODE_NETWORK_TYPE {
  MAIN_NET = 'MAIN_NET',
  TEST_NET = 'TEST_NET',
}
//-----------------------------------------------------

//--------------------------------Fee Scheme--------------
export enum FEE_SCHEME_ACTIVITY {
  SEND = 'SEND',
  RECEIVE = 'RECEIVE',
  BUY = 'BUY',
  SELL = 'SELL',
  EXCHANGE = 'EXCHANGE',
}

export enum FEE_SCHEME_FEE_TYPE {
  PERCENT = 'PERCENT',
  AMOUNT = 'AMOUNT',
}

export enum FEE_SCHEME_GAS_PRICE_TYPE {
  PERCENT = 'PERCENT',
  AMOUNT = 'AMOUNT',
}

export enum FEE_SCHEME_CRITERIA_TYPE {
  AMOUNT = 'AMOUNT',
  DATE = 'DATE',
  DAY = 'DAY',
  COUNTRY = 'COUNTRY',
}

export enum FEE_SCHEME_CRITERIA_COMPARASION {
  LESS_THAN = 'LESS_THAN',
  GREATER_THAN = 'GREATER_THAN',
  EQUALS = 'EQUALS',
}
//----------------------------------------------------------

export enum VENDOR_TYPE {
  LIQUIDITY = 'liquidity',
}
