let mainConverter = document.querySelector('.main-converter')

async function converter() {
	const valueDiv = document.querySelector('.main-converter-value')
	let res = await fetch("https://www.cbr-xml-daily.ru/daily_json.js")
	res = await res.json()
	console.log(res);

	for (const [key, value] of Object.entries(res.Valute)) {
		let opiton = document.createElement('option')
		opiton.innerText = value.Name
		opiton.value = value.Value
		valueDiv.appendChild(opiton)
	}
	mainConverter.addEventListener('click', (e) => {
		if (e.target.className === 'btn-converter') {
			let input = document.querySelector('.main-converter-count input');
			let valueDiv = document.querySelector('.main-converter-value');
			let resultDiv = document.querySelector('.main-converter-count-result');
			
			console.log(valueDiv.value);
			let result = valueDiv.value * input.value
			result = result.toFixed(2)
			resultDiv.innerText = `= ${result} ₽`
		}
	})
}

converter()
