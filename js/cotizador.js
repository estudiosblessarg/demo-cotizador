/*
===========================================
SISTEMA PRINCIPAL DE COTIZACION
===========================================
*/

async function cotizar(){

    // =====================================
    // OBTENER DATOS DEL FORMULARIO
    // =====================================

    const marca = document.getElementById("marca").value;
    const modelo = document.getElementById("modelo").value;
    const version = document.getElementById("version").value;
    const anio = parseInt(document.getElementById("anio").value);

    const km = parseInt(document.getElementById("km").value);

    const estado = document.getElementById("estado").value;

    // =====================================
    // OBTENER USUARIO LOGUEADO
    // =====================================

    const usuario = localStorage.getItem("usuario") || "Invitado";


    // =====================================
    // VALIDACION DE CAMPOS
    // =====================================

    if(!marca || !modelo || !version || !anio || !km){

        alert("Complete todos los campos obligatorios");
        return;

    }


    // =====================================
    // BUSCAR MARCA EN EL JSON
    // =====================================

    const marcaData = datosVehiculos.marcas.find(
        m => m.nombre === marca
    );

    if(!marcaData){

        alert("Marca no encontrada");
        return;

    }


    // =====================================
    // BUSCAR MODELO
    // =====================================

    const modeloData = marcaData.modelos.find(
        m => m.nombre === modelo
    );

    if(!modeloData){

        alert("Modelo no encontrado");
        return;

    }


    // =====================================
    // BUSCAR VERSION
    // =====================================

    const versionData = modeloData.versiones.find(
        v => v.nombre === version
    );

    if(!versionData){

        alert("Versión no encontrada");
        return;

    }


    // =====================================
    // BUSCAR AÑO
    // =====================================

    const anioData = versionData.anios.find(
        a => a.anio === anio
    );

    if(!anioData){

        alert("Año no encontrado");
        return;

    }


    // =====================================
    // OBTENER PRECIO BASE
    // =====================================

    const precioBase = anioData.precio;


    // =====================================
    // CALCULAR DESCUENTO
    // =====================================

    const descuento = calcularDescuento(km);


    // =====================================
    // CALCULO PRECIO FINAL
    // =====================================

    const precioFinal = precioBase - (precioBase * descuento / 100);


    // =====================================
    // MOSTRAR RESULTADO
    // =====================================

    document.getElementById("resultado").innerText =
        "Precio estimado: $" + precioFinal.toLocaleString();


    // =====================================
    // CREAR OBJETO COTIZACION
    // =====================================

    const cotizacion = {

        usuario: usuario,   // 👈 NUEVO CAMPO

        marca: marca,
        modelo: modelo,
        version: version,
        anio: anio,
        km: km,
        estado: estado,

        precioBase: precioBase,
        descuentoAplicado: descuento,
        precioFinal: precioFinal,

        fecha: new Date().toLocaleDateString()

    };


    // =====================================
    // GUARDAR EN INDEXED DB
    // =====================================

    guardarCotizacionDB(cotizacion);

}

/*
========================================
CARGAR COTIZACIONES DEL USUARIO
========================================
*/

function cargarMisCotizaciones(){

    if(!db){
        console.warn("DB aún no inicializada");
        return;
    }

    const usuario = localStorage.getItem("usuario") || "Invitado";

    const tabla = document.getElementById("misCotizaciones");

    tabla.innerHTML = "";

    const tx = db.transaction("cotizaciones","readonly");
    const store = tx.objectStore("cotizaciones");

    const request = store.getAll();

    request.onsuccess = function(){

        const lista = request.result;

        const filtradas = lista.filter(c => c.usuario === usuario);

        filtradas.forEach(c => {

            const fila = document.createElement("tr");

            fila.innerHTML = `
            <td>${c.marca}</td>
            <td>${c.modelo}</td>
            <td>${c.version}</td>
            <td>${c.anio}</td>
            <td>${c.km}</td>
            <td>$${c.precioFinal.toLocaleString()}</td>
            <td>${c.fecha}</td>

            <td>
            <button onclick="editarCotizacionUsuario(${c.id})">Editar</button>
            <button onclick="eliminarCotizacionUsuario(${c.id})">Eliminar</button>
            </td>
            `;

            tabla.appendChild(fila);

        });

    };

}

/*
========================================
ELIMINAR COTIZACION
========================================
*/

function eliminarCotizacionUsuario(id){

    if(!confirm("¿Eliminar esta cotización?")) return;

    const tx = db.transaction("cotizaciones","readwrite");
    const store = tx.objectStore("cotizaciones");

    store.delete(id);

    tx.oncomplete = function(){

        cargarMisCotizaciones();

    };

}

/*
========================================
EDITAR COTIZACION
========================================
*/

function editarCotizacionUsuario(id){

    const tx = db.transaction("cotizaciones","readonly");
    const store = tx.objectStore("cotizaciones");

    const request = store.get(id);

    request.onsuccess = function(){

        const c = request.result;

        document.getElementById("marca").value = c.marca;
        document.getElementById("modelo").value = c.modelo;
        document.getElementById("version").value = c.version;
        document.getElementById("anio").value = c.anio;
        document.getElementById("km").value = c.km;
        document.getElementById("estado").value = c.estado;

        eliminarCotizacionUsuario(id);

    };

}




/*
==================================
LOGOUT DEL PANEL
==================================
*/

function logout(){

    sessionStorage.clear();
    localStorage.removeItem("usuario");

    window.location.href = "login.html";

}