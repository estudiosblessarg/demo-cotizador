/*
========================================
CALCULO DINAMICO DE DESCUENTO POR KM
========================================
*/

let configuracionDescuentos=null;

async function cargarDescuentos(){

    const respuesta=await fetch("data/configuracion_descuentos.json");

    configuracionDescuentos=await respuesta.json();
}

function calcularDescuento(km){

    for(let rango of configuracionDescuentos.rangos_km){

        if(km>=rango.min && km<=rango.max){

            return rango.descuento;
        }
    }

    return 0;
}