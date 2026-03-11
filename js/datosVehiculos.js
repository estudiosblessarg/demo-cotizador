/*
=====================================================
CARGA DINÁMICA DE VEHÍCULOS DESDE JSON
Simula funcionamiento de una API tipo InfoAuto

Estructura del JSON:

Marca
   └ Modelo
        └ Version
              └ Año

Los selects se cargan de forma encadenada:

Marca → Modelo → Versión → Año
=====================================================
*/

// variable global donde se guardarán los datos del JSON
let datosVehiculos = null;


/*
=====================================================
CARGAR JSON DE VEHICULOS
=====================================================
*/

async function cargarVehiculos(){

    const respuesta = await fetch("data/vehiculos.json");

    datosVehiculos = await respuesta.json();

    cargarMarcas();
}


/*
=====================================================
CARGAR MARCAS
=====================================================
*/

function cargarMarcas(){

    const selectMarca = document.getElementById("marca");

    selectMarca.innerHTML = "<option value=''>Seleccione marca</option>";

    datosVehiculos.marcas.forEach(marca =>{

        let option = document.createElement("option");

        option.value = marca.nombre;
        option.text = marca.nombre;

        selectMarca.appendChild(option);

    });
}


/*
=====================================================
CARGAR MODELOS SEGUN MARCA
=====================================================
*/

function cargarModelos(){

    const marcaSeleccionada = document.getElementById("marca").value;

    const selectModelo = document.getElementById("modelo");

    const selectVersion = document.getElementById("version");

    const selectAnio = document.getElementById("anio");

    // limpiar selects inferiores
    selectModelo.innerHTML = "<option value=''>Seleccione modelo</option>";
    selectVersion.innerHTML = "<option value=''>Seleccione versión</option>";
    selectAnio.innerHTML = "<option value=''>Seleccione año</option>";

    const marca = datosVehiculos.marcas.find(
        m => m.nombre === marcaSeleccionada
    );

    if(!marca) return;

    marca.modelos.forEach(modelo =>{

        let option = document.createElement("option");

        option.value = modelo.nombre;
        option.text = modelo.nombre;

        selectModelo.appendChild(option);

    });
}


/*
=====================================================
CARGAR VERSIONES SEGUN MODELO
=====================================================
*/

function cargarVersiones(){

    const marcaSeleccionada = document.getElementById("marca").value;
    const modeloSeleccionado = document.getElementById("modelo").value;

    const selectVersion = document.getElementById("version");
    const selectAnio = document.getElementById("anio");

    // limpiar select de versiones y años
    selectVersion.innerHTML = "<option value=''>Seleccione versión</option>";
    selectAnio.innerHTML = "<option value=''>Seleccione año</option>";

    const marca = datosVehiculos.marcas.find(
        m => m.nombre === marcaSeleccionada
    );

    if(!marca) return;

    const modelo = marca.modelos.find(
        m => m.nombre === modeloSeleccionado
    );

    if(!modelo) return;

    modelo.versiones.forEach(version =>{

        let option = document.createElement("option");

        option.value = version.nombre;
        option.text = version.nombre;

        selectVersion.appendChild(option);

    });
}


/*
=====================================================
CARGAR AÑOS SEGUN VERSION
=====================================================
*/

function cargarAnios(){

    const marcaSeleccionada = document.getElementById("marca").value;
    const modeloSeleccionado = document.getElementById("modelo").value;
    const versionSeleccionada = document.getElementById("version").value;

    const selectAnio = document.getElementById("anio");

    selectAnio.innerHTML = "<option value=''>Seleccione año</option>";

    const marca = datosVehiculos.marcas.find(
        m => m.nombre === marcaSeleccionada
    );

    if(!marca) return;

    const modelo = marca.modelos.find(
        m => m.nombre === modeloSeleccionado
    );

    if(!modelo) return;

    const version = modelo.versiones.find(
        v => v.nombre === versionSeleccionada
    );

    if(!version) return;

    version.anios.forEach(anioObj =>{

        let option = document.createElement("option");

        option.value = anioObj.anio;
        option.text = anioObj.anio;

        selectAnio.appendChild(option);

    });

}