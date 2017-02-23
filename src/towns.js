/**
 * ДЗ 6.2 - Создать страницу с текстовым полем для фильтрации городов
 *
 * Страница должна предварительно загрузить список городов из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * и отсортировать в алфавитном порядке.
 *
 * При вводе в текстовое поле, под ним должен появляться список тех городов,
 * в названии которых, хотя бы частично, есть введенное значение.
 * Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.
 *
 * Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 * После окончания загрузки городов, надпись исчезает и появляется текстовое поле.
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 *
 * *** Часть со звездочкой ***
 * Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 * то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 * При клике на кнопку, процесс загруки повторяется заново
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');

/**
 * Функция должна загружать список городов из https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * И возвращать Promise, которой должен разрешиться массивом загруженных городов
 *
 * @return {Promise<Array<{name: string}>>}
 */
function loadTowns() {
    return require('./index').loadAndSortTowns();
}

/**
 * Функция должна проверять встречается ли подстрока chunk в строке full
 * Проверка должна происходить без учета регистра символов
 *
 * @example
 * isMatching('Moscow', 'moscow') // true
 * isMatching('Moscow', 'mosc') // true
 * isMatching('Moscow', 'cow') // true
 * isMatching('Moscow', 'SCO') // true
 * isMatching('Moscow', 'Moscov') // false
 * 
 * @return {boolean}
 */
function isMatching(full, chunk) {
    full = full.toLowerCase();
    chunk = chunk.toLowerCase();
    
    return full.indexOf(chunk) != -1 ? true : false
}

/**
 * Вспомогательная функция для Promise, обрабатывает состояние rejected,
 * при нажатии на кнопку запускает повторный запрос городов 
 */

function rejected() {
    if(homeworkContainer.querySelector('#reply-container')) {
        loadingBlock.hidden = true;
        
        return;
    }

    let div = document.createElement('div');
    let p = document.createElement('p');
    let btn = document.createElement('button');

    p.innerHTML = 'Не удалось загрузить города';
    btn.setAttribute('id', 'download-city');
    btn.innerText = 'Повторить';

    div.setAttribute('id', 'reply-container');
    div.appendChild(p);
    div.appendChild(btn);
    homeworkContainer.appendChild(div);

    loadingBlock.hidden = true;

    btn.addEventListener('click', () => {
        loadingBlock.hidden = false;
        loadTowns().then(resolved, rejected);
    })
}

/**
 * Вспомогательная функция для Promise, обрабатывает состояние fulfilled
 * @param Array<{name: String}> towns - массив городов
 */

function resolved(towns) {
    if (Array.isArray(towns) && towns.length > 0){
        let arTowns = (() => {
            let result = [];
            let key = 'name';

            towns.forEach((el) => {
                if (key in el) {
                    result.push(el[key]);
                }
            });

            return result;
        })();

        filterBlock.hidden = false;
        loadingBlock.hidden = true;

        let rpl = document.querySelector('#reply-container');
        if(rpl){
            homeworkContainer.removeChild(rpl);
        }

        filterInput.addEventListener('keyup', function() {
            let value = this.value.trim();
            let resultList = value ? getMatching(arTowns, value) : [];

            filterResult.innerHTML = '';

            if (resultList.length) {
                resultList.forEach(el => {
                    let span = document.createElement('span');

                    span.innerHTML = el;
                    filterResult.appendChild(span);
                });
            }

        });
    }
}

function getMatching(arr, chunk) {
    let result = [];

    arr.forEach((el) => {
        if(isMatching(el, chunk)) {
            result.push(el);
        }
    });

    return result;
}

let loadingBlock = homeworkContainer.querySelector('#loading-block');
let filterBlock = homeworkContainer.querySelector('#filter-block');
let filterInput = homeworkContainer.querySelector('#filter-input');
let filterResult = homeworkContainer.querySelector('#filter-result');

filterBlock.hidden = true;
loadingBlock.hidden = false;

loadTowns().then(resolved, rejected);

export {
    loadTowns,
    isMatching
};
