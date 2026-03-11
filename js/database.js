/*
================================================
BASE DE DATOS INDEXEDDB DEL SISTEMA
================================================
*/

let db;

function iniciarDB(){

    const request = indexedDB.open("cotizador_autos_db",1);

    request.onupgradeneeded = function(event){

        db = event.target.result;

        /*
        TABLA COTIZACIONES
        */

        if(!db.objectStoreNames.contains("cotizaciones")){

            db.createObjectStore("cotizaciones",{
                keyPath:"id",
                autoIncrement:true
            });

        }

        /*
        TABLA CONFIGURACION
        */

        if(!db.objectStoreNames.contains("configuracion")){

            db.createObjectStore("configuracion",{
                keyPath:"id",
                autoIncrement:true
            });

        }

    };

    request.onsuccess = function(event){

        db = event.target.result;

        console.log("Base de datos lista");

        insertarDescuentosSiNoExisten();

        insertarCotizacionesDemo();

        /*
        SI EXISTE LA FUNCION mostrarCotizaciones
        (solo en el panel admin)
        */

        if(typeof mostrarCotizaciones === "function"){
            mostrarCotizaciones();
        }

         // cargar cotizaciones del usuario si existe la función
        if(typeof cargarMisCotizaciones === "function"){
            cargarMisCotizaciones();
        }

    };

}


/*
========================================
INSERTAR DESCUENTOS SOLO SI LA TABLA ESTA VACIA
========================================
*/

function insertarDescuentosSiNoExisten(){

    const tx = db.transaction("configuracion","readwrite");

    const store = tx.objectStore("configuracion");

    const countRequest = store.count();

    countRequest.onsuccess = function(){

        if(countRequest.result === 0){

            console.log("Insertando descuentos por defecto...");

            store.add({ kmMin:0, kmMax:50000, descuento:10 });
            store.add({ kmMin:50001, kmMax:100000, descuento:20 });
            store.add({ kmMin:100001, kmMax:150000, descuento:30 });
            store.add({ kmMin:150001, kmMax:999999, descuento:40 });

        }

    };

}


/*
========================================
INSERTAR COTIZACIONES DE DEMO
========================================
*/

function insertarCotizacionesDemo(){

    const tx = db.transaction("cotizaciones","readwrite");

    const store = tx.objectStore("cotizaciones");

    const countRequest = store.count();

    countRequest.onsuccess = function(){

        if(countRequest.result === 0){

            console.log("Insertando cotizaciones demo...");

            store.add({
                marca:"Toyota",
                modelo:"Corolla",
                version:"XLI",
                anio:2021,
                km:45000,
                estado:"Medio",
                precioBase:23000000,
                descuentoAplicado:10,
                precioFinal:20700000,
                fecha:new Date().toLocaleDateString()
            });

            store.add({
                marca:"Volkswagen",
                modelo:"Gol",
                version:"Trend",
                anio:2020,
                km:80000,
                estado:"Alto",
                precioBase:10500000,
                descuentoAplicado:20,
                precioFinal:8400000,
                fecha:new Date().toLocaleDateString()
            });

        }

    };

}

/*
========================================
GUARDAR COTIZACION EN INDEXEDDB
========================================
*/

function guardarCotizacionDB(cotizacion){

    const tx = db.transaction("cotizaciones","readwrite");

    const store = tx.objectStore("cotizaciones");

    const request = store.add(cotizacion);

    request.onsuccess = function(){

        console.log("Cotización guardada correctamente");

    };

    request.onerror = function(){

        console.error("Error al guardar cotización");

    };

}