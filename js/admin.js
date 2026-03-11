/*
==================================
PANEL ADMINISTRADOR
Muestra todas las cotizaciones
DESDE INDEXED DB
==================================
*/

function mostrarCotizaciones(){

    const tabla = document.getElementById("tabla");

    tabla.innerHTML = "";

    const tx = db.transaction("cotizaciones","readonly");

    const store = tx.objectStore("cotizaciones");

    const request = store.getAll();

    request.onsuccess = function(){

        const lista = request.result;

        lista.forEach(c=>{

            const fila=document.createElement("tr");

            fila.innerHTML=`

            <td>${c.marca}</td>
            <td>${c.modelo}</td>
            <td>${c.version}</td>
            <td>${c.anio}</td>
            <td>${c.km}</td>
            <td>${c.estado}</td>
            <td>$${c.precioFinal.toLocaleString()}</td>
            <td>${c.fecha}</td>
            <td>${c.usuario}</td>

            <td>

            <button onclick="editarCotizacion(${c.id})">
            Editar
            </button>

            <button onclick="eliminarCotizacion(${c.id})">
            Eliminar
            </button>

            </td>

            `;

            tabla.appendChild(fila);

        });

    };

}



/*
==================================
ABRIR PANEL DE EDICION
==================================
*/

function editarCotizacion(id){

    const tx = db.transaction("cotizaciones","readonly");

    const store = tx.objectStore("cotizaciones");

    const request = store.get(id);

    request.onsuccess = function(){

        const c = request.result;

        document.getElementById("editId").value = c.id;
        document.getElementById("editKm").value = c.km;
        document.getElementById("editDescuento").value = c.descuentoAplicado;

        document.getElementById("editorCotizacion").style.display = "block";

    };

}



/*
==================================
GUARDAR CAMBIOS
==================================
*/

function guardarEdicion(){

    const id = parseInt(document.getElementById("editId").value);

    const km = parseInt(document.getElementById("editKm").value);

    const descuento = parseInt(document.getElementById("editDescuento").value);

    const tx = db.transaction("cotizaciones","readwrite");

    const store = tx.objectStore("cotizaciones");

    const request = store.get(id);

    request.onsuccess = function(){

        const cotizacion = request.result;

        cotizacion.km = km;

        cotizacion.descuentoAplicado = descuento;

        const precioBase = cotizacion.precioBase;

        cotizacion.precioFinal = precioBase - (precioBase * descuento / 100);

        store.put(cotizacion);

        document.getElementById("editorCotizacion").style.display="none";

        mostrarCotizaciones();

    };

}



/*
==================================
CANCELAR EDICION
==================================
*/

function cancelarEdicion(){

    document.getElementById("editorCotizacion").style.display="none";

}



/*
==================================
ELIMINAR COTIZACION
==================================
*/

function eliminarCotizacion(id){

    if(!confirm("¿Eliminar esta cotización?")) return;

    const tx = db.transaction("cotizaciones","readwrite");

    const store = tx.objectStore("cotizaciones");

    store.delete(id);

    tx.oncomplete = function(){

        mostrarCotizaciones();

    };

}



/*
==================================
LOGOUT DEL PANEL ADMIN
==================================
*/

function logout(){

    sessionStorage.clear();

    localStorage.removeItem("usuario");

    window.location.href = "login.html";

}