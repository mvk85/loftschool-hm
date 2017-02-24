import {
    createCookie,
    deleteCookie
} from './index';

/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */

let homeworkContainer = document.querySelector('#homework-container');
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
let addButton = homeworkContainer.querySelector('#add-button');
let listTable = homeworkContainer.querySelector('#list-table tbody');

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
    let f = full.toLowerCase();
    let ch = chunk.toLowerCase();
    
    return f.indexOf(ch) != -1 ? true : false;
}

/**
 * Создает новый tr для таблицы со списком cookie
 *
 * @param name - имя cookie
 * @param value - значение cookie
 */
function createCookieTr(name, value) {
    let tr = document.createElement('tr');
    let tdName = document.createElement('td');
    let tdValue = document.createElement('td');
    let tdButtonDelele = document.createElement('td');

    tdName.innerHTML = name;
    tdValue.innerHTML = value;
    tdButtonDelele.innerHTML = '<button class="delete-cookie">Удалить</button>'
    tr.appendChild(tdName);
    tr.appendChild(tdValue);
    tr.appendChild(tdButtonDelele);
    listTable.appendChild(tr);
}

/**
 * Вспомогательная функция, взята из теста "2-cookie.js"
 * @returns {*}
 */
function getCookies() {
    return document.cookie
        .split('; ')
        .filter(Boolean)
        .map(cookie => cookie.match(/^([^=]+)=(.+)/))
        .reduce((obj, [, name, value]) => {
            obj[name] = value;

            return obj;
        }, {});
}

/**
 * Функция заполнения таблицы-списка cookies
 */
function fillTableCookies(objCookies = {}) {
    objCookies = isEmptyObject(objCookies) ? getCookies() : objCookies;

    listTable.innerHTML = '';

    if (!isEmptyObject(objCookies)) {
        for ( let name in objCookies ) {
            if ({}.hasOwnProperty.call(objCookies, name)) {
                createCookieTr(name, objCookies[name]);
            }            
        }
    }
}

/**
 * Функция получения списка cookie для вывода в таблице
 * @param value
 * @returns {Object{name<String>: value<String>}}
 */
function filterCookies(value) {
    let listCookies = getCookies();
    let resultCookies = {};

    for ( let nameCookie in listCookies ) {
        if ({}.hasOwnProperty.call(listCookies, nameCookie)) {
            let valueCookie = listCookies[nameCookie];

            if (isMatching(nameCookie, value) || isMatching(valueCookie, value)) {
                resultCookies[nameCookie] = valueCookie;
            }    
        }
    }

    return resultCookies;
}

function checkEmpty(item) {
    if (!item.value) {
        item.style.borderColor = 'red';
    } else {
        item.style.borderColor = '';
    }
}

function isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
}

fillTableCookies();

listTable.addEventListener('click', (event) => {
    let target = event.target;
    
    if (target.tagName == 'BUTTON' && target.classList.contains('delete-cookie')) {
        let tr = target.closest('tr');
        let listTd = tr.querySelectorAll('td');
        let nameCookie = listTd[0].innerHTML;

        deleteCookie(nameCookie);
        tr.closest('tbody').removeChild(tr);
    }
});

filterNameInput.addEventListener('keyup', function() {
    let valueInput = this.value;
    let resultCookies = filterCookies(valueInput);

    if (!valueInput) {
        fillTableCookies();
        
        return;
    }

    if (!isEmptyObject(resultCookies)) {
        fillTableCookies(resultCookies);
    } else {
        listTable.innerHTML = '';
    }
});

addButton.addEventListener('click', () => {
    let name = addNameInput.value;
    let value = addValueInput.value;
    let filterInput = filterNameInput.value;

    checkEmpty(addNameInput);
    checkEmpty(addValueInput);
    
    if (!name || !value) {
        return;
    }

    createCookie(name, value);
    
    if (filterInput) {
        let resultCookies = filterCookies(filterInput);

        if (!isEmptyObject(resultCookies)) {
            fillTableCookies(resultCookies);
        }
    } else {
        fillTableCookies();    
    }
});