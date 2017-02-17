/* ДЗ 5.2 - Div D&D */

/** Со звездочкой */
/**
 * Создать страницу с кнопкой
 * При нажатии на кнопку должен создаваться div со случайными размерами, цветом фона и позицией
 * Необходимо предоставить возможность перетаскивать созданные div при помощи drag and drop
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */

const CONTAIN_WIDTH = 800;
const CONTAIN_HEIGHT = 500;

let homeworkContainer = document.querySelector('#homework-container');
let container = document.getElementById('homework-container');

container.style.height = CONTAIN_HEIGHT + 'px';
container.style.width = CONTAIN_WIDTH + 'px';
container.style.position = 'relative';
container.style.borderWidth = '1px';
container.style.borderColor = '#000';
container.style.borderStyle = 'solid';

/**
 * Функция должна создавать и возвращать новый div с классом draggable-div и случайными размерами/цветом/позицией
 * Функция должна только создавать элемент и задвать ему случайные размер/позицию/цвет
 * Функция НЕ должна добавлять элемент на страницу
 *
 * @return {Element}
 */
function createDiv() {
    let div = document.createElement('div');
    let params = {
        size: { width: randomNum(200), height: randomNum(100) },
        backgroundColor: `#${randomNum(1000000)}`,
        position: { left: randomNum(CONTAIN_WIDTH), top: randomNum(CONTAIN_HEIGHT) }
    };

    if (params.size.width + params.position.left > CONTAIN_WIDTH) {
        params.position.left = CONTAIN_WIDTH - params.size.width;
    }

    if (params.size.height + params.position.top > CONTAIN_HEIGHT) {
        params.position.top = CONTAIN_HEIGHT - params.size.height;
    }

    div.classList.add('draggable-div');
    div.style.position = 'absolute';
    div.style.width = params.size.width + 'px';
    div.style.height = params.size.height + 'px';
    div.style.left = params.position.left + 'px';
    div.style.top = params.position.top + 'px';
    div.style.backgroundColor = params.backgroundColor;
    div.style.cursor = 'pointer';
    
    function randomNum(size) {
        return Math.floor(Math.random()*size);
    }

    return div;
}

/**
 * Функция должна добавлять обработчики событий для перетаскивания элемента при помощи drag and drop
 *
 * @param {Element} target
 */
function addListeners(target) {
    homeworkContainer.addEventListener('mousedown', (event) => {
        if (event.target != target) {
            return;
        }
        
        let box = target.getBoundingClientRect();
        let shift = {
            X: event.pageX - box.left,
            Y: event.pageY - box.top
        }

        let handlerMove = (event) => {
            let top = event.pageY - shift.Y;
            let left = event.pageX - shift.X;

            if ((top + box.height) > CONTAIN_HEIGHT) {
                top = CONTAIN_HEIGHT - box.height;
            } else if (top < 0) {
                top = 0;
            }

            if ((left + box.width) > CONTAIN_WIDTH) {
                left = CONTAIN_WIDTH - box.width;
            } else if (left < 0) {
                left = 0;
            }

            target.style.top = top + 'px';
            target.style.left = left + 'px';
        };
        let handlerUp = () => {
            homeworkContainer.removeEventListener('mousemove', handlerMove);
            homeworkContainer.removeEventListener('mouseup', handlerUp);
        }

        homeworkContainer.addEventListener('mousemove', handlerMove);
        homeworkContainer.addEventListener('mouseup', handlerUp)

    })

    homeworkContainer.addEventListener('dragstart', (event) => event.preventDefault());

}

let addDivButton = homeworkContainer.querySelector('#addDiv');

addDivButton.addEventListener('click', function() {
    // создать новый div
    let div = createDiv();

    // добавить на страницу
    homeworkContainer.appendChild(div);
    // назначить обработчики событий мыши для реализации d&d
    addListeners(div);
    // можно не назначать обработчики событий каждому div в отдельности, а использовать делегирование
    // или использовать HTML5 D&D - https://www.html5rocks.com/ru/tutorials/dnd/basics/
});

export {
    createDiv
};
