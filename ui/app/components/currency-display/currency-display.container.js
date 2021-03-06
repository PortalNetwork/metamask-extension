import { connect } from 'react-redux'
import CurrencyDisplay from './currency-display.component'
import { getValueFromWeiHex, formatCurrency } from '../../helpers/confirm-transaction/util'

const mapStateToProps = (state, ownProps) => {
  const { value, numberOfDecimals = 2, currency } = ownProps
  const { metamask: { currentCurrency, conversionRate } } = state

  const toCurrency = currency || currentCurrency
  const convertedValue = getValueFromWeiHex({ value, toCurrency, conversionRate, numberOfDecimals })
  const formattedValue = formatCurrency(convertedValue, toCurrency)
  const displayValue = `${formattedValue} ${toCurrency.toUpperCase()}`

  return {
    displayValue,
  }
}

export default connect(mapStateToProps)(CurrencyDisplay)
