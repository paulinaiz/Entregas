//VARIABLES
let carrito = [];
let productos = [];
let busquedaActiva = false; 
let ultimoTerminoBusqueda = "";

//----------------------------------------------------------------------------



//FUNCIONES


//funcion para cargar el json
async function cargarProductos() {
    try {
        const response = await fetch('productos.json');
        const data = await response.json();

        productos = data;

        renderizarProductos(productos); 
    } catch (error) {
        mostrarNotificacion("Error cargando productos", "error");
    }
}


// Función para guardar el estado en el historial
function guardarEstadoHistorial(termino) {
    const url = new URL(window.location);
    if (termino && termino !== "") {
        url.searchParams.set('busqueda', termino);
    } else {
        url.searchParams.delete('busqueda');
    }
    window.history.pushState({ busqueda: termino || null }, '', url);
}


const inputBusqueda = document.getElementById('input-busqueda');
const btnLupa = document.getElementById('btn-lupa');


// Función para realizar la búsqueda
function ejecutarBusqueda(actualizarHistorial = true) {
    const termino = inputBusqueda.value.toLowerCase().trim();
    
    if (termino === "") {
        renderizarProductos(productos);
        busquedaActiva = false;
        if (actualizarHistorial) {
            guardarEstadoHistorial("");
        }
        return;
    }

    const productosFiltrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(termino)
    );

    if (productosFiltrados.length > 0) {
        renderizarProductos(productosFiltrados);
        busquedaActiva = true;
        
        if (actualizarHistorial) {
            guardarEstadoHistorial(termino);
        }
        
        // Scroll al producto si solo hay uno
        if (productosFiltrados.length === 1) {
            const elemento = document.getElementById(`producto-${productosFiltrados[0].id}`);
            if (elemento) elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    } else {
        const contenedor = document.getElementById('contenedor-productos');
        contenedor.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding: 3rem;">
                <p style="font-family: 'Poppins', sans-serif; font-size: 1.2rem; color: #666;">
                    No se encontraron productos con "<strong>${termino}</strong>"
                </p>
            </div>
        `;
        
        busquedaActiva = true;
        if (actualizarHistorial) {
            guardarEstadoHistorial(termino);
        }
        mostrarNotificacion("No se encontraron productos con ese nombre", "error");
    }
}

//Función para resetear la búsqueda y volver a todos los productos
function resetearBusqueda() {
    inputBusqueda.value = "";
    renderizarProductos(productos);
    busquedaActiva = false;
    guardarEstadoHistorial("");
}

//flecha atrás/adelante del navegador
window.addEventListener('popstate', (event) => {
    const busqueda = event.state?.busqueda;
    
    if (busqueda && busqueda !== "") {
        inputBusqueda.value = busqueda;
        ejecutarBusqueda(false);
    } else {
        resetearBusqueda();
    }
});

// Evento al escribir en la lupa, se borra todo, vuelven todos los productos
inputBusqueda.addEventListener('input', () => {
    if (inputBusqueda.value === "" && busquedaActiva) {
        resetearBusqueda();
    }
});


// Agregar un botón "Limpiar búsqueda" o mostrar todos al borrar
inputBusqueda.addEventListener('input', () => {
    if (inputBusqueda.value === "") {
        renderizarProductos(productos);
    }
});


//el evento al presionar Enter
inputBusqueda.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        ejecutarBusqueda();
    }
});

// Evento al hacer clic en la lupa
btnLupa.addEventListener('click', ejecutarBusqueda);



//funcion para las cards
function renderizarProductos(productos) {
    const contenedor = document.getElementById('contenedor-productos');
    contenedor.innerHTML = '';

    productos.forEach(producto => {
        const card = document.createElement('article');
        card.classList.add('card-producto');
        card.id = `producto-${producto.id}`;

        card.innerHTML = `
            <div class="contenido-card">
                <img src="imagenes/${producto.imagen}" alt="${producto.nombre}">
                <h2>${producto.nombre}</h2>
                <img src="imagenes/libre_de_gluten.png" class="icon-sin-gluten">
                <p>$${producto.precio.toLocaleString()}</p>
            </div>
            <button class="btn-agregar" data-id="${producto.id}">Añadir al carrito</button>
        `;

        contenedor.appendChild(card);
    });
}




//Función agregar al carrito
function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto);
    
    if (!producto) return false;

    if (producto.stock <= 0) {
        mostrarNotificacion("Lo sentimos, este producto está agotado", "error");
        return false;
    }

    const productoEnCarrito = carrito.find(item => item.id === idProducto);

    if (productoEnCarrito) {
        if (productoEnCarrito.cantidad < producto.stock) {
            productoEnCarrito.cantidad++;
        } else {
            mostrarNotificacion("No hay suficiente stock disponible", "error");
            return false;
        }
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
    }

    return true;
}



// Función para actualizar la cuenta del carrito
function actualizarCuentaCarrito() {
    const cuentaCarrito = document.getElementById('cuenta-carrito');  //en cuenta-carrito se muestra la cuenta

    //verificamos si existe
    if (cuentaCarrito) {
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        cuentaCarrito.textContent = totalItems;
        
        if (totalItems > 0) {
            cuentaCarrito.style.display = 'inline-block';
        } else {
            cuentaCarrito.style.display = 'none';
        }
    }
}


// Función para guardar carrito en localStorage
function guardarCarritoEnLocalStorage() {
    try {
        localStorage.setItem('carritoPasteleria', JSON.stringify(carrito));
    } catch (e) {
        mostrarNotificacion("Error al guardar carrito en localStorage:", e);
    }
}


// Función para cargar carrito desde localStorage
function cargarCarritoDesdeLocalStorage() {
    try {
        const carritoGuardado = localStorage.getItem('carritoPasteleria');
        if (carritoGuardado) {
            carrito = JSON.parse(carritoGuardado);
        }
    } catch (e) {
        mostrarNotificacion("Error al cargar carrito desde localStorage:", e);
        carrito = [];
    }
}


// Función para procesar pagos
function procesarPago() {

    //verificar si el carrito esta vacio
    if (carrito.length === 0) {
        mostrarNotificacion("El carrito está vacío. No hay nada que pagar.", "error");
        return false;
    }

    let subtotal = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    
    //verificamos si el subtotal es valido
    if (subtotal === 0) {
        mostrarNotificacion("Error al calcular el total", "error");
        return false;
    }

    //calcula descuento del 15% si subtotal es mayor o igual a 40 mil
    let descuento = 0;
    let tieneDescuento = false;
    
    if (subtotal >= 40000) {
        descuento = subtotal * 0.15;
        tieneDescuento = true;
    }

    //calcular envio gratis si el subtotal es mayor o igual a 30 mil
    let costoEnvio = 0;
    let envioGratis = false;
    
    if (subtotal >= 30000) {
        envioGratis = true;
    } else {
        costoEnvio = 2990;
    }

    //total final
    let totalFinal = subtotal - descuento + costoEnvio;

    mostrarModalConfirmacion(subtotal, descuento, costoEnvio, totalFinal, tieneDescuento, envioGratis);
    
    return false;
}


// Función para mostrar modal de confirmación de compra
function mostrarModalConfirmacion(subtotal, descuento, costoEnvio, totalFinal, tieneDescuento, envioGratis) {

    //creamos el elemento, contenedor principal
    const modal = document.createElement('div');
    modal.className = 'modal-confirmacion';  //clase css
    modal.id = 'modal-confirmacion-pago';    //id unico

    //contenido html que no es visible todavia
    modal.innerHTML = `
        <div class="modal-contenido-confirmacion">
            <div class="modal-header-confirmacion">
                <h2 class="titulo-confirmacion">Confirmar Compra</h2>
                <button class="btn-cerrar-confirmacion">×</button>
            </div>
            
            <div class="resumen-compra" style="margin-bottom: 25px;">
                <h3 class="resumen-titulo">Resumen de la compra</h3>
                
                <div style="margin-bottom: 15px;">
                    <div class="fila-resumen">
                        <span>Subtotal:</span>
                        <span>$${subtotal.toLocaleString()}</span>
                    </div>
                    
                    ${tieneDescuento ? 
                        `<div class="fila-resumen" style="color: #2ecc71;">
                            <span>Descuento 15%:</span>
                            <span>-$${descuento.toLocaleString()}</span>
                        </div>` 
                        : 
                        `<div class="texto-informativo">
                            <i>Te faltan $${(40000 - subtotal).toLocaleString()} para 15% de descuento</i>
                        </div>`
                    }
                    
                    <div class="fila-resumen">
                        <span>Envío:</span>
                        <span>${envioGratis ? 'GRATIS' : `$${costoEnvio.toLocaleString()}`}</span>
                    </div>
                    
                    ${!envioGratis ? 
                        `<div class="texto-informativo" style="margin-bottom: 15px;">
                            <i>Te faltan $${(30000 - subtotal).toLocaleString()} para envío gratis</i>
                        </div>` 
                        : ''
                    }
                    
                    <div class="fila-total">
                        <span>TOTAL:</span>
                        <span class="texto-total">$${totalFinal.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <div class="contenedor-botones">
                <button class="btn-cancelar btn-cancelar-compra">Cancelar</button>
                
                <button class="btn-confirmar btn-confirmar-compra">Confirmar Pago</button>
            </div>
        </div>
    `;

    //lo agrego al documento para que sea visible
    document.body.appendChild(modal);

    //para los eventos
    const btnCerrar = modal.querySelector('.btn-cerrar-confirmacion');
    const btnCancelar = modal.querySelector('.btn-cancelar-compra');
    const btnConfirmar = modal.querySelector('.btn-confirmar-compra');

    //funcion para cerrar el elemento
    const cerrarModal = () => {
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    };

    btnCerrar.addEventListener('click', cerrarModal);
    btnCancelar.addEventListener('click', cerrarModal);

    btnConfirmar.addEventListener('click', () => {
        finalizarCompra();
        cerrarModal();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            cerrarModal();
        }
    });
}


// Función para finalizar la compra
function finalizarCompra() {
    mostrarAnimacionProcesamiento();

    const procesarPago = new Promise((resolve) => {
        setTimeout(() => {
            resolve("Pago procesado");
        }, 2000);
    });

    procesarPago.then(() => {
        for (let item of carrito) {
            const producto = productos.find(p => p.id === item.id);
            if (producto) {
                producto.stock -= item.cantidad;
            }
        }

        mostrarMensajeGracias();

        carrito.length = 0;
        actualizarCuentaCarrito();
        guardarCarritoEnLocalStorage();

        const modalCarrito = document.getElementById('modal-carrito');
        if (modalCarrito && !modalCarrito.classList.contains('oculto')) {
            actualizarCarritoDOM();
        }
    });
}


//Función para mostrar animación de procesamiento
function mostrarAnimacionProcesamiento() {
    const loadingModal = document.createElement('div');
    loadingModal.className = 'modal-cargando';
    
    loadingModal.innerHTML = `
        <div class="contenedor-carga">
            <div class="spinner-carga"></div>
            <h3 class="titulo-carga">Procesando pago...</h3>
            <p>Por favor espere</p>
        </div>
    `;

    document.body.appendChild(loadingModal);

    setTimeout(() => {
        if (loadingModal.parentNode) {
            loadingModal.parentNode.removeChild(loadingModal);
        }
    }, 2000);
}

//Función para mostrar mensaje de agradecimiento
function mostrarMensajeGracias() {
    const mensajeModal = document.createElement('div');
    mensajeModal.className = 'modal-gracias';

    mensajeModal.innerHTML = `
        <div class="gracias-contenido">
            <div class="check-exito">✓</div>
            <h2 class="titulo-gracias">¡Gracias por su compra!</h2>
            <p class="mensaje-gracias">Su pedido ha sido procesado exitosamente</p>
            <button class="btn-cerrar-gracias">Continuar comprando</button>
        </div>
    `;

    document.body.appendChild(mensajeModal);

    const btnCerrar = mensajeModal.querySelector('.btn-cerrar-gracias');
    btnCerrar.addEventListener('click', () => {
        mensajeModal.style.opacity = '0';
        mensajeModal.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            if (mensajeModal.parentNode) {
                mensajeModal.parentNode.removeChild(mensajeModal);
            }
        }, 300);
    });

    mensajeModal.addEventListener('click', (e) => {
        if (e.target === mensajeModal) {
            mensajeModal.style.opacity = '0';
            mensajeModal.style.transition = 'opacity 0.3s';
            setTimeout(() => {
                if (mensajeModal.parentNode) {
                    mensajeModal.parentNode.removeChild(mensajeModal);
                }
            }, 300);
        }
    });
}



//Función para mostrar notificaciones con toastify
function mostrarNotificacion(mensaje, tipo = "success") {
    //colores
    const colores = {
        success: "linear-gradient(to right, #6E2391, #9b59b6)",
        error: "linear-gradient(to right, #ff5f6d, #ffc371)",
        warning: "linear-gradient(to right, #f39c12, #f1c40f)",
        info: "linear-gradient(to right, #00b09b, #96c93d)"
    };

    Toastify({
        text: mensaje,
        duration: 3000,
        close: true,
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, 
        style: {
            background: colores[tipo] || colores.success,
            fontFamily: "Poppins, sans-serif",
            borderRadius: "8px"
        },
        onClick: function(){} //un callback después de hacer clic
    }).showToast();
}




//Función para mostrar/ocultar el carrito
function toggleCarrito() {
    const modalCarrito = document.getElementById('modal-carrito');
    if (modalCarrito) {
        modalCarrito.classList.toggle('oculto');
        if (!modalCarrito.classList.contains('oculto')) {
            actualizarCarritoDOM();
        }
    }
}

//Función para actualizar el DOM del carrito
function actualizarCarritoDOM() {
    const carritoItems = document.getElementById('carrito-items');
    const carritoSubtotal = document.getElementById('carrito-subtotal');
    const carritoDescuento = document.getElementById('carrito-descuento');
    const carritoTotal = document.getElementById('carrito-total');
    
    if (!carritoItems) return;
    
    carritoItems.innerHTML = '';
    
    if (carrito.length === 0) {
        carritoItems.innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center; padding: 2rem; font-family: "Poppins", serif;">
                    <p>El carrito está vacío</p>
                </td>
            </tr>
        `;
        carritoSubtotal.textContent = '$0';
        carritoDescuento.textContent = '$0';
        carritoTotal.textContent = '$0';
        return;
    }
    
    let subtotal = 0;
    
    carrito.forEach(item => {
        const producto = productos.find(p => p.id === item.id);

        const productoTotal = item.precio * item.cantidad;
        subtotal += productoTotal;
        
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>
                <div class="producto-info">
                    <img src="imagenes/${producto.imagen}" alt="${item.nombre}">
                    <div class="producto-detalles">
                        <h3>${item.nombre}</h3>
                        <p>$${item.precio.toLocaleString()}</p>
                    </div>
                </div>
            </td>
            <td>
                <div class="cantidad-controles">
                    <button class="btn-cantidad" data-id="${item.id}" data-action="decrementar">-</button>
                    <span class="cantidad-numero">${item.cantidad}</span>
                    <button class="btn-cantidad" data-id="${item.id}" data-action="incrementar">+</button>
                </div>
            </td>
            <td>
                <span class="producto-total">$${productoTotal.toLocaleString()}</span>
                <button class="btn-eliminar" data-id="${item.id}">🗑️</button>
            </td>
        `;
        carritoItems.appendChild(fila);
    });
    
    let descuento = 0;
    if (subtotal >= 40000) {
        descuento = subtotal * 0.15;
    }
    
    let envio = 2990;
    if (subtotal >= 30000) {
        envio = 0;
    }
    
    const total = subtotal - descuento + envio;
    
    carritoSubtotal.textContent = `$${subtotal.toLocaleString()}`;
    carritoDescuento.textContent = `$${descuento.toLocaleString()}`;
    carritoTotal.textContent = `$${total.toLocaleString()}`;
    
    const carritoEnvio = document.getElementById('carrito-envio');
    if (carritoEnvio) {
        carritoEnvio.textContent = envio === 0 ? 'GRATIS' : `$${envio.toLocaleString()}`;
    }
    
    actualizarCuentaCarrito();
}



//Función para modificar cantidad en el carrito
function modificarCantidad(id, accion) {
    const itemIndex = carrito.findIndex(item => item.id === id);
    
    if (itemIndex === -1) return;
    
    const producto = productos.find(p => p.id === id);
    
    if (accion === 'incrementar') {
        if (carrito[itemIndex].cantidad < producto.stock) {
            carrito[itemIndex].cantidad++;
        } else {
            mostrarNotificacion('No hay suficiente stock disponible', 'error');
            return;
        }
    } else if (accion === 'decrementar') {
        if (carrito[itemIndex].cantidad > 1) {
            carrito[itemIndex].cantidad--;
        } else {
            carrito.splice(itemIndex, 1);
        }
    }
    
    guardarCarritoEnLocalStorage();
    actualizarCarritoDOM();
}


//Función para eliminar producto del carrito
function eliminarDelCarrito(id) {
    const itemIndex = carrito.findIndex(item => item.id === id);
    
    if (itemIndex !== -1) {
        carrito.splice(itemIndex, 1);
        guardarCarritoEnLocalStorage();
        actualizarCarritoDOM();
        mostrarNotificacion('Producto eliminado del carrito');
    }
}


// INICIALIZACIÓN
document.addEventListener('DOMContentLoaded', () => {

    cargarProductos();

    //Cargar carrito desde localStorage
    cargarCarritoDesdeLocalStorage();
    
    //Actualizar cuenta del carrito inicial
    actualizarCuentaCarrito();
    
    document.addEventListener('click', (e) => {

        //Detectar click en botón "Agregar"
        if (e.target.classList.contains('btn-agregar')) {

            const id = parseInt(e.target.dataset.id);

            const agregado = agregarAlCarrito(id);

            if (agregado) {
                guardarCarritoEnLocalStorage();
                actualizarCuentaCarrito();
                mostrarNotificacion('Producto agregado al carrito');
            }
        }

    });
    
    //conectar ícono del carrito
    const iconoCarrito = document.querySelector('.carrito');
    if (iconoCarrito) {
        iconoCarrito.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleCarrito();
        });
    }
    
    //Conectar botón para cerrar el carrito
    const btnCerrarCarrito = document.getElementById('cerrar-carrito');
    if (btnCerrarCarrito) {
        btnCerrarCarrito.addEventListener('click', toggleCarrito);
    }
    
    //Conectar botón "Finalizar Compra"
    const btnFinalizarCompra = document.getElementById('finalizar-compra');
    if (btnFinalizarCompra) {
        btnFinalizarCompra.addEventListener('click', () => {
            toggleCarrito();
            setTimeout(() => procesarPago(), 300);
        });
    }
    
    //eventos para los botones dentro del carrito
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-cantidad')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            const accion = e.target.getAttribute('data-action');
            modificarCantidad(id, accion);
        }
        
        if (e.target.classList.contains('btn-eliminar')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            eliminarDelCarrito(id);
        }
        
        if (e.target.id === 'modal-carrito') {
            toggleCarrito();
        }
    });
});