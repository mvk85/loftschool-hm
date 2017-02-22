/* ДЗ 6.1 - Асинхронность и работа с сетью */

/**
 * Функция должна создавать Promise, который должен быть resolved через seconds секунду после создания
 *
 * @param {number} seconds - количество секунд, через которое Promise должен быть resolved
 * @return {Promise}
 */
function delayPromise(seconds) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), seconds * 1000);    
    });    
}

/**
 * Функция должна вернуть Promise, который должен быть разрешен массивом городов, загруженным из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * Элементы полученного массива должны быть отсортированы по имени города
 *
 * @return {Promise<Array<{name: String}>>}
 */
function loadAndSortTowns() {

    function compareCity(objCity1, objCity2) {
        if (objCity1.name < objCity2.name) {
            return -1
        } else if (objCity1.name > objCity2.name) {
            return 1
        }

        return 0
    }
    
    return new Promise((resolve, reject) => {
        let url = 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json';
        let xhr = new XMLHttpRequest();

        xhr.open('GET', url, true);
        xhr.send();
        xhr.timeout = 5000;

        xhr.addEventListener('readystatechange', () => {
            if (xhr.readyState != 4) return;

            if (xhr.status != 200) {
                reject();
            }
            
            let arTowns = JSON.parse(xhr.responseText);

            if (arTowns.length < 1) {
                return;
            } else {
                arTowns.sort(compareCity);    
            }                

            resolve(arTowns);        
        });

        xhr.addEventListener('error', () => reject());
    })  
}

export {
    delayPromise,
    loadAndSortTowns
};
