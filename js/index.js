const mainValute = document.querySelector('.main-valute')
const mainFavorites = document.querySelector('.main-favorites')

mainValute.addEventListener('click', (e) => {
	if (e.target.className === `main-valute-container-add`) {
		//Добавление в избранное 
		const moneyName = e.target.previousSibling.previousSibling;
		//Создание или добавление в локальное хранилище
		if (localStorage.getItem('money') === null || localStorage.getItem('money').length === 0) {
			let name = [moneyName.dataset.id]
			localStorage.setItem(`money`, JSON.stringify(name));
			getValue()
		} else {
			let arr = localStorage.getItem('money')
			arr = JSON.parse(arr)
			if (arr.indexOf(moneyName.dataset.id) == -1) {
				arr.push(moneyName.dataset.id)
				getValue()
				localStorage.setItem(`money`, JSON.stringify(arr));
			}
		}
	}
})
//Удаление 
if (mainFavorites) {
	mainFavorites.addEventListener('click', (e) => {
		const moneyName = e.target.previousSibling.previousSibling;

		if (e.target.className === `main-valute-container-delete`) {
			let arr = localStorage.getItem('money')
			arr = JSON.parse(arr)
			if (arr.indexOf(moneyName.dataset.id) !== -1) {
				arr = arr.filter(el => el !== moneyName.dataset.id)
				console.log(arr);
				localStorage.setItem('money', JSON.stringify(arr))
				getValue()
			}
		}
	})
}



// Получить значение курса к рублю через запрос и вывод значений 
const getValue = async () => {
	let res = await fetch("https://www.cbr-xml-daily.ru/daily_json.js")
	res = await res.json()
	const container = document.querySelector('.main-valute')


	//Получение всей валюты из избранного 
	let favoriteValute = localStorage.getItem('money')
	favoriteValute = JSON.parse(favoriteValute)
	const favoritesDiv = document.querySelector('.main-favorites')


	if (favoriteValute) {
		favoritesDiv.innerHTML = ''
		container.innerHTML = ''
		for (let index = 0;index < favoriteValute.length;index++) {
			if (res.Valute.hasOwnProperty(favoriteValute[index])) {
				let valute = res.Valute[favoriteValute[index]] // Вывод обьекта валюты в отдельную переменную 
				if (favoritesDiv) {
					createBlock(valute, favoritesDiv, favoriteValute[index], true, 'main-valute-container-delete', 'удалить')
				}
			}	
		}
	}

	for (let i = 0;i < favoriteValute.length;i++) {
		if (res.Valute[favoriteValute[i]]) {
			delete res.Valute[favoriteValute[i]]
		}
	}

	for (const [key, value] of Object.entries(res.Valute)) {
		if (container) {
			//Вывод всей Валюты
			createBlock(value, container, key, true)
		}
	}
}
getValue()

//Функция для создания блоков валюты 
function createBlock(dataObject, nameContainer, key, addButton = false, classButton = `main-valute-container-add`, valueButton = 'в избранное',) {

	const valuteContainer = document.createElement('div')
	valuteContainer.className = 'main-valute-container';

	const valuteName = document.createElement('div')
	valuteName.className = `main-valute-container-name `;
	valuteName.dataset.id = `${key}`;

	valuteName.innerText = `${dataObject.Name}`;

	const valutePrice = document.createElement('div')
	valutePrice.className = 'main-valute-container-price';
	valutePrice.innerText = `${dataObject.Value.toFixed(2)} ₽`;



	valuteContainer.appendChild(valuteName)
	valuteContainer.appendChild(valutePrice)

	//Добавление кнопки
	if (addButton === true) {
		const button = document.createElement('button')
		button.className = `${classButton}`;
		button.innerText = `${valueButton}`;
		valuteContainer.appendChild(button)
	}

	nameContainer.appendChild(valuteContainer)

}
