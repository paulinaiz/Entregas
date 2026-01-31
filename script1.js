//LISTA PRODUCTOS: id/nombre/precio/stock
let productos = [
    {id: 1, nombre: "galletas de arandanos", precio: 2500, stock: 12},
    {id: 2, nombre: "galletas de vainilla", precio: 2100, stock: 11},
    {id: 3, nombre: "galletas con chispas de chocolate", precio: 2500, stock: 9},
    {id: 4, nombre: "Muffin de frambuesa", precio: 1800, stock: 14},
    {id: 5, nombre: "Muffin de arandanos", precio: 1800, stock: 7},
    {id: 6, nombre: "Muffin de vainilla", precio: 1800, stock: 5},
    {id: 7, nombre: "Tartaleta de maracuya y mango", precio: 3000, stock: 25},
    {id: 8, nombre: "Tartaleta de kiwi frutilla arandano", precio: 3000, stock: 8},
    {id: 9, nombre: "Tartaleta de frutilla arandano", precio: 3000, stock: 15},
    {id: 10, nombre: "Tartaleta de frutilla", precio: 3000, stock: 21},
    {id: 11, nombre: "Tartaleta de limon", precio: 3000, stock: 11},
    {id: 12, nombre: "Tartaleta de arandano", precio: 3000, stock: 29},
    {id: 13, nombre: "Tartalerta de maracuya", precio: 3000, stock: 41},
    {id: 14, nombre: "Tartaleta de manzana", precio: 3000, stock: 4}
];

//----------------------------------------------------------------------------

//VARIABLES
let carrito = [];

//----------------------------------------------------------------------------

//FUNCIONES

// Función agregar al carrito
function agregarAlCarrito(idProducto) {
    const producto = productos.find(p => p.id === idProducto); //busca el producto en el array productos
    
    //verificar si el producto existe
    if (!producto) {
        console.error("Producto no encontrado");
        return;
    }
    
    //verificamos si hay stock disponible
    if (producto.stock <= 0) {
        alert("Lo sentimos, este producto está agotado");
        return;
    }
    
    //se busca si el producto ya está en el carrito
    const productoEnCarrito = carrito.find(item => item.id === idProducto);
    
    // si es verdad que el producto existe en el carrito
    if (productoEnCarrito) {
        if (productoEnCarrito.cantidad < producto.stock) {
            productoEnCarrito.cantidad++;
        } else {
            alert("No hay suficiente stock disponible");
            return;
        }
    } else {                           //si no existe en el carrito
        if (producto.stock > 0) {
            carrito.push({            //agrega un nuevo objeto al array carrito
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                cantidad: 1
            });
        }
    }
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
        console.error("Error al guardar carrito en localStorage:", e);
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
        console.error("Error al cargar carrito desde localStorage:", e);
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


//Función para finalizar la compra
function finalizarCompra() {
    mostrarAnimacionProcesamiento();

    setTimeout(() => {
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

    }, 2000);
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

//Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = "success") {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.classList.add('salida');
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.parentNode.removeChild(notificacion);
            }
        }, 300);
    }, 3000);
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
        const productoTotal = item.precio * item.cantidad;
        subtotal += productoTotal;
        
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>
                <div class="producto-info">
                    <img src="imagenes/${getImagenProducto(item.id)}" alt="${item.nombre}">
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

//Función auxiliar para obtener la imagen del producto
function getImagenProducto(id) {
    const imagenes = {
        1: 'tres-galletas-arandano.png',
        2: 'tres-gralletas-vainilla.png',
        3: 'tres-galletas-chispas-de-chocolate.png',
        4: 'muffin-frambuesa.png',
        5: 'muffin-arandanos.png',
        6: 'muffin-de-vainilla.png',
        7: 'tartaleta-maracuya-mango.png',
        8: 'tartaletta-kiwi-frutilla-arandano.png',
        9: 'tartaletta-frutilla-arandano.png',
        10: 'tartaletta-frutilla.png',
        11: 'tartaletta-limon.png',
        12: 'tartaletta-arandano.png',
        13: 'tartaletta-maracuya.png',
        14: 'tartaletta-manzana.png'
    };
    
    return imagenes[id] || 'libre_de_gluten.png';
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
    //Cargar carrito desde localStorage
    cargarCarritoDesdeLocalStorage();
    
    //Actualizar cuenta del carrito inicial
    actualizarCuentaCarrito();
    
    //Conectar botones "Añadir al carrito"
    const botonesAgregar = document.querySelectorAll('.btn-agregar');
    botonesAgregar.forEach((boton, index) => {
        const idProducto = index + 1;
        boton.addEventListener('click', () => {
            agregarAlCarrito(idProducto);
            guardarCarritoEnLocalStorage();
            actualizarCuentaCarrito();
            mostrarNotificacion('Producto agregado al carrito');
        });
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