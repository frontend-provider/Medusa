import zeroDecimalCurrencies from "./zero-decimal-currencies"

const computerizeAmount = (amount, currency) => {
  let divisor = 100

  if (zeroDecimalCurrencies.includes(currency.toLowerCase())) {
    divisor = 1
  }

  return Math.round(amount * divisor)
}

export default computerizeAmount
