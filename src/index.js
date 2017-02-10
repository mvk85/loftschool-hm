/* ДЗ 3 - объекты и массивы */

/*
 Задача 1:
 Напишите аналог встроенного метода forEach для работы с массивами
 */
function forEach(array, fn) {
    for (var i = 0; i < array.length; i++) {
        fn(array[i], i, array);
    }
}

/*
 Задача 2:
 Напишите аналог встроенного метода map для работы с массивами
 */
function map(array, fn) {
    let newArray = [];

    for (var i = 0; i < array.length; i++) {
        newArray.push(fn(array[i], i, array))
    }
    
    return newArray;
}

/*
 Задача 3:
 Напишите аналог встроенного метода reduce для работы с массивами
 */
function reduce(array, fn, initial) {
    if (!Array.isArray(array)) {
        return false;
    } else if (array.length < 2) {
        return array[0];
    }

    let result, i;
    
    if (initial) {
        result = initial;
        i = 0;
    } else {
        result = array[0];
        i = 1;
    }

    for ( ; i < array.length; i++) {
        result = fn(result, array[i], i, array);
    }
    
    return result;
}

/*
 Задача 4:
 Функция принимает объект и имя свойства, которое необходиом удалить из объекта
 Функция должна удалить указанное свойство из указанного объекта
 */
function deleteProperty(obj, prop) {
    if (obj[prop]) {
        delete obj[prop];
    }
}

/*
 Задача 5:
 Функция принимает объект и имя свойства и возвращает true или false
 Функция должна проверить существует ли укзаанное свойство в указанном объекте
 */
function hasProperty(obj, prop) {
    return obj.hasOwnProperty(prop);
}

/*
 Задача 6:
 Функция должна получить все перечисляемые свойства объекта и вернуть их в виде массива
 */
function getEnumProps(obj) {
    let result = [];

    for (var key in obj) {
        result.push(key);
    }

    return result;
}

/*
 Задача 7:
 Функция должна перебрать все свойства объекта, преобразовать их имена в верхний регистра и вернуть в виде массива
 */
function upperProps(obj) {
    let arrProp = Object.keys(obj);
    
    // это почему-то у меня не сработало, хотя по логике должно было...
    
    /*
    return arrProp.forEach(function (el, i, a) {
        a[i] = a[i].toUpperCase();
        //или так 
        //arrProp[i] = a[i].toUpperCase(); 
    });*/    
    
    for ( let i = 0; i < arrProp.length; i++) {
        arrProp[i] = arrProp[i].toUpperCase(); 
    }
    
    return arrProp;
}

/*
 Задача 8 *:
 Напишите аналог встроенного метода slice для работы с массивами
 */
function slice(array, from, to) {
    let result = [];
    let length = array.length;

    if (!from && to == undefined) {
        return array.map((el) => el);
    } else if ((!from && !to) || (from >= length)) {
        return result;
    }; 
    
    if ( from < (-length) ) {
        from = 0;
    };
    
    if ( from >= 0 && from < length ) {
        to = to || length;
       
        if ( to < 0 && (to > -length)) {
            to = length + to;
        } else if (to < -length) {
            to = 0;
        } else if (to > length) {
            to = length;
        }
        
        for (let i = from; i < to; i++) {
            result.push(array[i]);
        }
        
        return result;
    }    
}

/*
 Задача 9 *:
 Функция принимает объект и должна вернуть Proxy для этого объекта
 Proxy должен перехватывать все попытки записи значений свойств и возводить это значение в квадрат
 */
function createProxy(obj) {
    return new Proxy(obj, {
        get (target, prop) {
            return target[prop];
        },
        set (target, prop, value) {
            target[prop] = value * value; 
           
            return true;
        }
    });
}

export {
    forEach,
    map,
    reduce,
    deleteProperty,
    hasProperty,
    getEnumProps,
    upperProps,
    slice,
    createProxy
};
