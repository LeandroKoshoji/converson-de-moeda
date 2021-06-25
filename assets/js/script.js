const currencyOneEl = document.querySelector('.currency__one')
const currencyTwoEl = document.querySelector('.currency__two')
const userInputEl = document.querySelector('.user__input')
const convertedValueEl = document.querySelector('.converted__value')
const lineBaseEl = document.querySelector('.linebase__result')
const invertButton = document.querySelector('.fa-exchange-alt')

const APIKey = 'd4fa3fafc1b61a122cc9e779'
const getUrl = currency => `https://v6.exchangerate-api.com/v6/${APIKey}/latest/${currency}`

let internalExchangeRateData = {}

const getErrorMessage = errorType =>
  ({
    'unsupported-code': 'Não temos essa moeda em nosso banco de dados',
    'malformed-request': 'Estrutura do request não segue o padrão requerido',
    'invalid-key': 'API Key inválida',
    'inactive-account': 'Por favor, confirme seu e-mail para continuar',
    'quota-reached': 'Limite de request máximo de request atingido.',
  }[errorType] || 'Não foi possível obter os dados')

const fetchData = async currency => {
  try {
    const response = await fetch(getUrl(currency))
    const data = await response.json()

    if (data['error-type']) {
      throw new Error(getErrorMessage(data['error-type']))
    }

    return data
  } catch (error) {
    alert(error.message)
  }
}

const showInitialInfo = rates => {
  const getOptions = activeCurrency =>
    Object.keys(rates)
      .map(currency => `<option ${activeCurrency === currency ? 'selected' : ''}>${currency}</option>`)
      .join('')

  currencyOneEl.innerHTML = getOptions('USD')
  currencyTwoEl.innerHTML = getOptions('BRL')
  convertedValueEl.textContent = `${rates[currencyTwoEl.value].toFixed(2)} ${currencyTwoEl.value}`
  lineBaseEl.textContent = `1 ${currencyOneEl.value} = ${rates[currencyTwoEl.value].toFixed(2)} ${currencyTwoEl.value}`
}

const init = async () => {
  internalExchangeRateData = { ...(await fetchData('USD')) }

  const rates = internalExchangeRateData.conversion_rates

  showInitialInfo(rates)
}

const multiplyRates = () => {
  const targetRate = internalExchangeRateData.conversion_rates[currencyTwoEl.value]

  convertedValueEl.textContent = `${(userInputEl.value * targetRate).toFixed(2)} ${currencyTwoEl.value}`
}

const updateRatesIntoDOM = () => {
  const targetRate = internalExchangeRateData.conversion_rates[currencyTwoEl.value]

  convertedValueEl.textContent = `${(userInputEl.value * targetRate).toFixed(2)} ${currencyTwoEl.value}`
  lineBaseEl.textContent = `1 ${currencyOneEl.value} = ${targetRate.toFixed(2)} ${currencyTwoEl.value}`
}

const invertCurrencyValues = ()=> {
  const prevValue = currencyOneEl.value
  
  currencyOneEl.value = currencyTwoEl.value
  currencyTwoEl.value = prevValue
}

invertButton.addEventListener('click', async ()=> {
  invertCurrencyValues()
  internalExchangeRateData = { ...(await fetchData(currencyOneEl.value)) }
  updateRatesIntoDOM() 
})

userInputEl.addEventListener('input', multiplyRates)

currencyTwoEl.addEventListener('input', updateRatesIntoDOM)

currencyOneEl.addEventListener('input', async event => {
  const inputValue = event.target.value

  internalExchangeRateData = { ...(await fetchData(inputValue)) }

  updateRatesIntoDOM()
})

init()