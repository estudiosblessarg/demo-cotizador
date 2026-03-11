/*
==================================
GESTION DE COTIZACIONES GUARDADAS
Usa localStorage para la demo
==================================
*/

function guardarCotizacion(cotizacion){

    let lista = JSON.parse(localStorage.getItem("cotizaciones")) || [];

    lista.push(cotizacion);

    localStorage.setItem("cotizaciones",JSON.stringify(lista));
}

function obtenerCotizaciones(){

    return JSON.parse(localStorage.getItem("cotizaciones")) || [];
}