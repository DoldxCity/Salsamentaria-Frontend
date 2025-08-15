// ====== VARIABLES GLOBALES ======
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [
    { nombre: "Admin", apellido: "Sistema", usuario: "admin", clave: "1234", telefono: "000000000", rol: "admin" },
    { nombre: "Juan", apellido: "Empleado", usuario: "empleado", clave: "1234", telefono: "111111111", rol: "empleado" }
];
let productos = JSON.parse(localStorage.getItem("productos")) || [];
let categorias = JSON.parse(localStorage.getItem("categorias")) || [];
let ventas = JSON.parse(localStorage.getItem("ventas")) || [];
let historial = JSON.parse(localStorage.getItem("historial")) || [];

// ====== FUNCIONES GENERALES ======
function guardarDatos() {
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("productos", JSON.stringify(productos));
    localStorage.setItem("categorias", JSON.stringify(categorias));
    localStorage.setItem("ventas", JSON.stringify(ventas));
    localStorage.setItem("historial", JSON.stringify(historial));
}

function mostrar(seccion) {
    document.querySelectorAll("main section").forEach(sec => sec.classList.add("oculto"));
    document.getElementById(seccion).classList.remove("oculto");
}

function mostrarSub(id) {
    document.querySelectorAll(".subseccion").forEach(div => div.classList.add("oculto"));
    document.getElementById(id).classList.remove("oculto");

    if (id === "gestionarUsuarios") mostrarUsuarios();
    if (id === "gestionarProductos") mostrarProductos();
    if (id === "actualizarStock") actualizarSelectProductos();
    if (id === "gestionarCategorias") mostrarCategorias();
    if (id === "nuevaVenta") actualizarSelectVentas();
    if (id === "gestionarVentas") mostrarVentas();
}

// ====== LOGIN ======
function login() {
    const user = document.getElementById("usuario").value;
    const pass = document.getElementById("clave").value;
    const error = document.getElementById("error");

    const encontrado = usuarios.find(u => u.usuario === user && u.clave === pass);

    if (encontrado) {
        if (encontrado.rol === "admin") {
            window.location.href = "admin.html";
        } else {
            window.location.href = "empleado.html";
        }
    } else {
        error.textContent = "Usuario o contraseña incorrectos";
    }
}

// ====== USUARIOS ======
function crearUsuario() {
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const usuario = document.getElementById("usuarioNuevo").value.trim();
    const clave = document.getElementById("claveNueva").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    if (!nombre || !apellido || !usuario || !clave || !telefono) {
        alert("Todos los campos son obligatorios");
        return;
    }

    usuarios.push({ nombre, apellido, usuario, clave, telefono, rol: "empleado" });
    historial.push(`Usuario creado: ${usuario}`);
    guardarDatos();

    alert("Usuario creado con éxito");
    document.getElementById("nombre").value = "";
    document.getElementById("apellido").value = "";
    document.getElementById("usuarioNuevo").value = "";
    document.getElementById("claveNueva").value = "";
    document.getElementById("telefono").value = "";
}

function mostrarUsuarios() {
    const tabla = document.getElementById("tablaUsuarios");
    tabla.innerHTML = "";
    usuarios.forEach((u, index) => {
        tabla.innerHTML += `
            <tr>
                <td>${u.nombre}</td>
                <td>${u.apellido}</td>
                <td>${u.usuario}</td>
                <td>${u.telefono}</td>
                <td><button onclick="eliminarUsuario(${index})">Eliminar</button></td>
            </tr>
        `;
    });
}

function eliminarUsuario(index) {
    if (confirm("¿Eliminar este usuario?")) {
        historial.push(`Usuario eliminado: ${usuarios[index].usuario}`);
        usuarios.splice(index, 1);
        guardarDatos();
        mostrarUsuarios();
    }
}

// ====== PRODUCTOS ======
function crearProducto() {
    const nombre = document.getElementById("prodNombre").value.trim();
    const categoria = document.getElementById("prodCategoria").value.trim();
    const precio = parseFloat(document.getElementById("prodPrecio").value);
    const stock = parseInt(document.getElementById("prodStock").value);

    if (!nombre || !categoria || isNaN(precio) || isNaN(stock)) {
        alert("Todos los campos son obligatorios");
        return;
    }

    productos.push({ nombre, categoria, precio, stock });
    historial.push(`Producto creado: ${nombre}`);
    guardarDatos();

    alert("Producto creado con éxito");
    document.getElementById("prodNombre").value = "";
    document.getElementById("prodCategoria").value = "";
    document.getElementById("prodPrecio").value = "";
    document.getElementById("prodStock").value = "";
}

function mostrarProductos() {
    const tabla = document.getElementById("tablaProductos");
    tabla.innerHTML = "";
    productos.forEach((p, index) => {
        tabla.innerHTML += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.categoria}</td>
                <td>$${p.precio.toFixed(2)}</td>
                <td>${p.stock}</td>
                <td><button onclick="eliminarProducto(${index})">Eliminar</button></td>
            </tr>
        `;
    });
}

function eliminarProducto(index) {
    if (confirm("¿Eliminar este producto?")) {
        historial.push(`Producto eliminado: ${productos[index].nombre}`);
        productos.splice(index, 1);
        guardarDatos();
        mostrarProductos();
    }
}

function actualizarSelectProductos() {
    const select = document.getElementById("productoSelect");
    select.innerHTML = "";
    productos.forEach((p, i) => {
        select.innerHTML += `<option value="${i}">${p.nombre}</option>`;
    });
}

function actualizarStockProducto() {
    const index = document.getElementById("productoSelect").value;
    const nuevoStock = parseInt(document.getElementById("nuevoStock").value);

    if (isNaN(nuevoStock)) {
        alert("Ingrese un número válido");
        return;
    }

    productos[index].stock = nuevoStock;
    historial.push(`Stock actualizado: ${productos[index].nombre} = ${nuevoStock}`);
    guardarDatos();
    alert("Stock actualizado");
    document.getElementById("nuevoStock").value = "";
}

// ====== CATEGORÍAS ======
function crearCategoria() {
    const nombre = document.getElementById("catNombre").value.trim();
    if (!nombre) {
        alert("Ingrese un nombre de categoría");
        return;
    }
    categorias.push(nombre);
    historial.push(`Categoría creada: ${nombre}`);
    guardarDatos();
    alert("Categoría creada con éxito");
    document.getElementById("catNombre").value = "";
}

function mostrarCategorias() {
    const tabla = document.getElementById("tablaCategorias");
    tabla.innerHTML = "";
    categorias.forEach((c, index) => {
        tabla.innerHTML += `
            <tr>
                <td>${c}</td>
                <td><button onclick="eliminarCategoria(${index})">Eliminar</button></td>
            </tr>
        `;
    });
}

function eliminarCategoria(index) {
    if (confirm("¿Eliminar esta categoría?")) {
        historial.push(`Categoría eliminada: ${categorias[index]}`);
        categorias.splice(index, 1);
        guardarDatos();
        mostrarCategorias();
    }
}

// ====== FACTURACIÓN ======
function actualizarSelectVentas() {
    const select = document.getElementById("ventaProducto");
    select.innerHTML = "";
    productos.forEach((p, i) => {
        select.innerHTML += `<option value="${i}">${p.nombre}</option>`;
    });
}

function crearVenta() {
    const indexProd = document.getElementById("ventaProducto").value;
    const cantidad = parseInt(document.getElementById("ventaCantidad").value);

    if (isNaN(cantidad) || cantidad <= 0) {
        alert("Ingrese una cantidad válida");
        return;
    }

    const prod = productos[indexProd];
    if (cantidad > prod.stock) {
        alert("No hay suficiente stock");
        return;
    }

    prod.stock -= cantidad;
    const total = prod.precio * cantidad;
    const fecha = new Date().toLocaleString();

    ventas.push({ producto: prod.nombre, cantidad, total, fecha });
    historial.push(`Venta registrada: ${prod.nombre} x${cantidad} - $${total}`);
    guardarDatos();

    alert("Venta registrada");
    document.getElementById("ventaCantidad").value = "";
}

function mostrarVentas() {
    const tabla = document.getElementById("tablaVentas");
    tabla.innerHTML = "";
    ventas.forEach(v => {
        tabla.innerHTML += `
            <tr>
                <td>${v.producto}</td>
                <td>${v.cantidad}</td>
                <td>$${v.total.toFixed(2)}</td>
                <td>${v.fecha}</td>
            </tr>
        `;
    });
}

// ====== REPORTES ======
function generarReporte(tipo) {
    const div = document.getElementById("resultadoReporte");
    let html = "<h3>Reporte</h3><table border='1' width='100%'><tr>";

    if (tipo === "clientes") {
        html += "<th>Nombre</th><th>Usuario</th></tr>";
        usuarios.forEach(u => html += `<tr><td>${u.nombre} ${u.apellido}</td><td>${u.usuario}</td></tr>`);
    }
    if (tipo === "categorias") {
        html += "<th>Categoría</th></tr>";
        categorias.forEach(c => html += `<tr><td>${c}</td></tr>`);
    }
    if (tipo === "productos") {
        html += "<th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th></tr>";
        productos.forEach(p => html += `<tr><td>${p.nombre}</td><td>${p.categoria}</td><td>$${p.precio}</td><td>${p.stock}</td></tr>`);
    }
    if (tipo === "ventas") {
        html += "<th>Producto</th><th>Cantidad</th><th>Total</th><th>Fecha</th></tr>";
        ventas.forEach(v => html += `<tr><td>${v.producto}</td><td>${v.cantidad}</td><td>$${v.total}</td><td>${v.fecha}</td></tr>`);
    }

    html += "</table>";
    div.innerHTML = html;
}

// ====== HISTORIAL ======
function mostrarHistorial() {
    const ul = document.getElementById("listaHistorial");
    ul.innerHTML = "";
    historial.forEach(h => {
        ul.innerHTML += `<li>${h}</li>`;
    });
}
