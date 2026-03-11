/*
=====================================
SISTEMA SIMPLE DE AUTENTICACION DEMO
Usuarios:
admin / admin123
cotizador / cotizador123
=====================================
*/

function login(){

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    if(usuario === "admin" && password === "admin123"){

        localStorage.setItem("usuario","admin");
        window.location="admin.html";
    }

    else if(usuario === "cotizador" && password === "cotizador123"){

        localStorage.setItem("usuario","cotizador");
        window.location="cotizador.html";
    }

    else{

        alert("Usuario o contraseña incorrectos");
    }
}