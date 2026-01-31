
//LISTA PRODUCTOS: id/nombre/precio/stock
let productos = [
    {id: 1, nombre: "galletas chocolate", precio: 2000, stock: 12},
    {id: 2, nombre: "galletas vainilla", precio: 2000, stock: 11},
    {id: 3, nombre: "muffin arandano", precio: 1800, stock: 9},
    {id: 4, nombre: "muffin vainilla", precio: 1800, stock: 14},
    {id: 5, nombre: "muffin frambuesa", precio: 1800, stock: 7},
    {id: 6, nombre: "pie limon", precio: 12500, stock: 5},
    {id: 7, nombre: "pie manzana", precio: 12500, stock: 3},
    {id: 8, nombre: "pie mango", precio: 12800, stock: 2},
    {id: 9, nombre: "alfajores", precio: 3000, stock: 15},
    {id: 10, nombre: "brownie", precio: 1500, stock: 21},
    {id: 11, nombre: "rollos canela", precio: 2000, stock: 11},
    {id: 12, nombre: "queque vainilla", precio: 1100, stock: 20}
];

//----------------------------------------------------------------------------

//VARIABLES

let nombre;
let carrito = [];

//----------------------------------------------------------------------------



//FUNCIONES

//FUNCION RECORRER LISTA DE PRODUCTOS / INFORMACION DE CADA PRODUCTO
function informacionProducto(idProducto) {

    for (let producto of productos) {
        //ID 
        if (producto.id === idProducto) {
            //Mostrar info
            console.log(`Producto: ${producto.nombre}`);
            console.log(`Precio: $${producto.precio}`);
            console.log(`Stock: ${producto.stock}`);
            return;
        }
    }
    console.log(`No se encontró producto con ID: ${idProducto}`);
}




//funcion para agregar al carrito con cantidad
const agregarAlCarrito = (indiceProducto, cantidad) => {

    //Buscar el producto en el array de productos
    let producto = productos[parseInt(indiceProducto) - 1];
    
    //Verificar si el producto ya está en el carrito
    for (let i = 0; i < carrito.length; i++) {

        //carrito[i][0] es el índice del producto
        if (carrito[i][0] === parseInt(indiceProducto)) {
            //Si ya existe, sumar la cantidad
            carrito[i][2] += cantidad; // Actualizar cantidad
            //Actualizar subtotal
            carrito[i][3] = carrito[i][2] * carrito[i][1];
            console.log(`Se agregaron ${cantidad} unidades más`);
            return;
        }
    }
    
    //Si no existe en el carrito, agregarlo como nuevo
    //[índice_producto, precio, cantidad, subtotal]
    let subtotal = producto.precio * cantidad;
    carrito.push([parseInt(indiceProducto), producto.precio, cantidad, subtotal]);
    console.log("Producto agregado al carrito");
};



//Funcion para eliminar un producto del carrito y que cantidad desea eliminar
function eliminarDelCarrito() {

    //ver si el caarrito esta vacio o no
    if (carrito.length === 0) {
        console.log("El carrito está vacío, no hay productos para eliminar.");
        return false;
    }
    
    //Mostrar el carrito actual
    mostrarCarrito();
    
    let eliminando = 1;
    while (eliminando == 1) {
        let opcionEliminar = prompt(
            "¿Qué producto desea eliminar?\n" +
            "1. Eliminar un producto específico\n" +
            "2. Vaciar todo el carrito\n" +
            "3. Volver al menú anterior\n" + 
            "4. Ir a pagar después de eliminar"
        );
        
        switch(opcionEliminar) {
            case "1":

                //Eliminar un producto específico
                let numEliminar = prompt("Ingrese el número del producto que desea eliminar (1-" + carrito.length + "): ");

                numEliminar = parseInt(numEliminar); //pasarlo a numero
                
                //validar la entrada del numero
                if (isNaN(numEliminar) || numEliminar < 1 || numEliminar > carrito.length) {
                    console.log("Número inválido. Intente nuevamente.");

                } else {
                    //información del producto a eliminar
                    let productoEliminado = carrito[numEliminar - 1];  
                    let nombreProducto = productos[productoEliminado[0] - 1].nombre;  //empiezan en 0 pero le mostramos al usuario desde 1
                    
                    //Preguntar si quiere eliminar todas las unidades o solo algunas
                    let opcionCantidad = prompt(
                        `¿Qué desea hacer con "${nombreProducto}"?\n` +
                        `1. Eliminar todas las unidades (${productoEliminado[2]} unidades)\n` +
                        `2. Eliminar solo algunas unidades\n` +
                        `3. Cancelar`
                    );
                    
                    //Eliminar todo el producto del carrito
                    if (opcionCantidad === "1") {
                        carrito.splice(numEliminar - 1, 1);
                        console.log(`Se eliminó "${nombreProducto}" del carrito.`);


                    //eliminar solo algunas unidades
                    } else if (opcionCantidad === "2") {
                        let cantidadEliminar = parseInt( prompt(`¿Cuántas unidades desea eliminar? (1-${productoEliminado[2]}): `));
                        

                        //validar cantidad a eliminar
                        if (isNaN(cantidadEliminar) || cantidadEliminar < 1 || cantidadEliminar > productoEliminado[2]) {
                            console.log("Cantidad inválida.");


                        //Si elimina todas las unidades, quitar el producto completo
                        } else if (cantidadEliminar === productoEliminado[2]) {
                            carrito.splice(numEliminar - 1, 1);
                            console.log(`Se eliminaron todas las unidades de "${nombreProducto}".`);


                        //Reducir la cantidad
                        } else {
                            productoEliminado[2] -= cantidadEliminar; //aqui resta la cantidad
                            productoEliminado[3] = productoEliminado[2] * productoEliminado[1];
                            console.log(`Se eliminaron ${cantidadEliminar} unidades de "${nombreProducto}".`);
                        }
                    } else if (opcionCantidad === "3") {
                        console.log("Operación cancelada.");
                    } else {
                        console.log("Opción inválida.");
                    }
                }
                
                //Mostrar carrito actualizado
                mostrarCarrito();
                break;
                
            case "2":
                //Vaciar todo el carrito
                let confirmar = prompt("¿Está seguro que desea vaciar todo el carrito? (Si/No): ");
                if (confirmar.toUpperCase() === "SI") {
                    carrito.length = 0; //Vaciar el array
                    console.log("Carrito vaciado completamente.");
                    eliminando = 0;
                } else {
                    console.log("Operación cancelada.");
                }
                break;
                
            case "3":
                //Volver al menú anterior
                eliminando = 0;
                return false; // No ir a pagar

            case "4":
                //Ir a pagar después de eliminar
                eliminando = 0;
                return true; // Sí ir a pagar
                
            default:
                console.log("Opción inválida. Por favor, ingrese 1, 2, 3 o 4.");
        }
    }
    return false;
}


//FUNCIÓN PARA MOSTRAR EL CARRITO
function mostrarCarrito(modoResumen = false) {
    if (carrito.length === 0) {
        console.log("El carrito está vacío");
        return 0;
    }
    
    let totalGeneral = 0;

    if (!modoResumen) {
        console.log("\n-----TU CARRITO-----");
    } else {
        console.log("\nRESUMEN DE TU COMPRA");
        console.log("----------------------------");
    }
    
    for (let i = 0; i < carrito.length; i++) {

        let indiceProducto = carrito[i][0]; //Índice del producto (1-12)
        let precio = carrito[i][1]; //Precio unidad
        let cantidad = carrito[i][2]; //Cantidad seleccionada
        let subtotal = carrito[i][3]; //Subtotal (precio × cantidad)

        //Buscar el nombre del producto
        let nombreProducto = productos[indiceProducto - 1].nombre;
        
        if (modoResumen) {
            console.log(`${nombreProducto}`);
            console.log(` Cantidad: ${cantidad}`);
            console.log(` Precio unitario: $${precio}`);
            console.log(` Subtotal: $${subtotal}`);
            console.log("----------------------------");
        } else {
            console.log(`${i + 1}. ${nombreProducto}`);
            console.log(`Cantidad: ${cantidad} x $${precio}`);
            console.log(`Subtotal: $${subtotal}`);
            console.log("--------------------");
        }
        
        totalGeneral += subtotal;
    }
    
    console.log(`SUBTOTAL A PAGAR: $${totalGeneral}`);
    return totalGeneral;
}



//funcion para procesar pagos
function procesarPago() {

    if (carrito.length === 0) {
        console.log("El carrito está vacío. No hay nada que pagar.");
        return false;
    }

    console.log("-----------------------")
    console.log("---PASTELERÍA SIN GLUTEN - PROCESO DE PAGO---")
    console.log("-----------------------")


    //productos seleccionados
    let subtotal = mostrarCarrito(true);

    if (subtotal === 0) {
        return false;
    }

    let descuento = 0;
    let tieneDescuento = false;
    
    if (subtotal >= 40000) {
        descuento = subtotal * 0.15;
        tieneDescuento = true;
        console.log(`\nDESCUENTO 15%: -$${descuento}`);
    } else {
        let faltaParaDescuento = 40000 - subtotal;
        console.log(`\nTe faltan $${faltaParaDescuento} para obtener 15% de descuento`);
    }


    //Calcular envío (gratis si subtotal >= 30.000, sino 2.990)
    let costoEnvio = 0;
    let envioGratis = false;
    
    if (subtotal >= 30000) {
        envioGratis = true;
        console.log("ENVÍO: GRATIS");
    } else {
        costoEnvio = 2990;
        console.log(`ENVÍO: $${costoEnvio}`);
    }


    //total final
    let totalFinal = subtotal - descuento + costoEnvio;
    
    console.log("-----------------------")
    console.log(`TOTAL A PAGAR: $${totalFinal}`);
    console.log("-----------------------")


    //confirmar crompra si/no
    let confirmar = confirm(`¿Confirmar compra por $${totalFinal}?: `);

    if (confirmar) {
        console.log("\nPROCESANDO PAGO...");

        //Actualizar stock de productos
        for (let item of carrito) {
            let indiceProducto = item[0] - 1;
            let cantidadComprada = item[2];
            productos[indiceProducto].stock -= cantidadComprada;
        }

        //Generar número de orden
        let numOrden = Math.floor(Math.random() * 90000) + 10000;  //nuemro de orden aleatorio
            
        console.log("-----------------------");
        console.log("¡PAGO PROCESADO EXITOSAMENTE!");
        console.log("-----------------------");


        //ticket de compra
        alert(
            "¡PAGO PROCESADO EXITOSAMENTE!\n\n" +
            `TICKET DE COMPRA #${numOrden}\n` +
            `Cliente: ${nombre}\n` +
            "-----------------------\n" +
            "¡GRACIAS POR SU COMPRA!\n" +
            "Vuelva pronto"
        );
        

        //Vaciar carrito después de la compra exitosa
        carrito.length = 0;

        //Preguntar si quiere seguir comprando
        let seguir = prompt("\n¿Desea seguir comprando? (Si/No): ");
        
        if (seguir.toUpperCase() === "SI") {
            return false; //Quiere seguir comprando
        } else {
            return true; //Quiere salir del programa
        }

    } else {
        console.log("\n Compra cancelada.");
    }


}



//----------------------------------------------------------------

//INICIO
console.log("-----PASTELERIA SIN GLUTEN-----");
nombre = prompt("¿Cual es su nombre?: ");
console.log("¡¡BIENVENIDO/A " + nombre + " !!");


//----------------------------------------------------------------


let stop = 1;


while (stop == 1) {
    
    let opcionInicio = prompt("A) CATALOGO\nB) VER CARRITO\nS) SALIR\n\nEscoja una opcion (A/B/S)");

    //opcion A
    if (opcionInicio.toUpperCase() == "A") {

        let enCatalogo = 1;
        while (enCatalogo == 1) {

            console.log("*****CATALOGO*****");

            //let opcionProducto = prompt("Elija el número del producto o una opción (P/C/S): ");
            let opcionProducto = prompt("\n*****CATALOGO*****\n\n 1)galletas chocolate\n 2)galletas vainilla\n 3)muffin arandano\n 4)muffin vainilla\n 5)muffin frambuesa\n 6)pie limon\n 7)pie manzana\n 8)pie mango\n 9)alfajores\n 10)brownie\n 11)rollos canela\n 12)queque vainilla\n \n P)Ver precios de todos\n C)Ver carrito\n S)Salir al menu principal\n\n Elija el número del producto o una opción (P/C/S): ");

            opcionProducto = opcionProducto.toUpperCase();

            const letrasValidas = ["P", "C", "S"];

            if (letrasValidas.includes(opcionProducto)) {

                if (opcionProducto == "P") {
                    for (let producto of productos) {
                        console.log(`Nombre: ${producto.nombre}, Precio: ${producto.precio}`);
                    }


                } else if (opcionProducto == "C") {

                    let enCarritoDesdeCatalogo = true;
    
                    while (enCarritoDesdeCatalogo) {
                        if (carrito.length === 0) {
                            console.log("El carrito está vacío");
                            enCarritoDesdeCatalogo = false;
                            break;
                        }
                        
                        mostrarCarrito();
                        
                        let opcionCarrito = prompt( "\n¿Qué desea hacer?\n\n 1)Volver al catálogo\n 2)Eliminar productos\n 3)Ir a pagar\n");
                        
                        switch(opcionCarrito) {
                            case "1":
                                enCarritoDesdeCatalogo = false; //Salir para volver a agregar productos
                                break;
                                
                            case "2":
                                let irAPagar = eliminarDelCarrito();
                                if (irAPagar) {
                                    let resultadoPago = procesarPago();
                                    if (resultadoPago === true) {
                                        enCarritoDesdeCatalogo = false;
                                        enCatalogo = 0;
                                        stop = 0;
                                    }
                                }
                                break;
                                
                            case "3":
                                let resultadoPago = procesarPago();
                                if (resultadoPago === true) {
                                    enCarritoDesdeCatalogo = false;
                                    enCatalogo = 0;
                                    stop = 0;
                                } else if (carrito.length === 0) {
                                    // Carrito vacío después de pagar
                                    enCarritoDesdeCatalogo = false;
                                }
                                break;
                                
                            default:
                                console.log("Opción inválida");
                        }
                    }


                //salir (S)
                } else if (opcionProducto == "S") {
                    enCatalogo = 0;

                }
                
            } else if (!isNaN(opcionProducto)) {

                //el usuario escogio un numero (1 - 12)
                let numProducto = parseInt(opcionProducto); //la opcion que escogio el usuario lo pasamos a nuemro entero
                if (numProducto < 1 || numProducto > productos.length) {
                    console.log("Numero de opcion no valida");
                    continue;
                }

                let infoProducto = productos[numProducto - 1]; //porque empieza en 0
                console.log("\n------------------------------------");
                console.log(`PRODUCTO SELECCIONADO:`);
                console.log(`Nombre: ${infoProducto.nombre}`);
                console.log(`Precio: $${infoProducto.precio}`);
                console.log(`Stock disponible: ${infoProducto.stock}`);
                console.log("------------------------------------\n");


                let cantidadValida = false;
                let cantidadProducto = 0;
                let volverAlCatalogo = false;
                

                while (!cantidadValida && !volverAlCatalogo) {

                    cantidadProducto = parseInt(prompt(`¿Cuántas unidades de "${infoProducto.nombre}" desea?: `));

                    //validar el nuemro
                    if (isNaN(cantidadProducto) || cantidadProducto < 1) {
                        console.log("Tiene que ser un numero valido y que esté dentro de las opciones")
                        continue;
                    }

                    if (cantidadProducto > infoProducto.stock) {
                        console.log(`No hay suficiente stock. Solo quedan ${infoProducto.stock} unidades`);

                        console.log("Opciones:");
                        //console.log("1. Intentar con otra cantidad");
                        //console.log("2. Volver al catálogo");

                        let opcionStock = prompt("\nOpciones: \n1) Intentar con otra cantidad\n 2) Volver al catálogo\n\n Elija una opción (1/2): ");

                        if (opcionStock === "2") {
                            volverAlCatalogo = true; //salir del catálogo
                            break;
                        }

                        //vuelve a preguntar la cantidad
                    } else {

                        //Cantidad válida
                        cantidadValida = true;
                    }

                }

                //SOLO AGREGAR AL CARRITO SI: La cantidad es válida, No quiere volver al catálogo, La cantidad está dentro del stock
                if (cantidadValida && !volverAlCatalogo && cantidadProducto > 0 && cantidadProducto <= infoProducto.stock) {
                    agregarAlCarrito(numProducto, cantidadProducto);
                    
                    let continuar = prompt("¿Desea agregar otro producto? (Si/No): ");
                    if (continuar.toUpperCase() !== "SI") {
                        enCatalogo = 0;
                    }
                } else if (volverAlCatalogo) {
                    //Simplemente continuamos, no hacemos nada
                    console.log("Volviendo al catálogo...");
                } else {
                    console.log("No se agregó ningún producto al carrito");
                }

            } else {
                console.log("Opción invalida. Vuelva a intentarlo")
            }

        }

    //opcion B
    } else if (opcionInicio.toUpperCase() == "B") {
        

        if (carrito.length === 0) {
            console.log("El carrito está vacío");

        } else {

            mostrarCarrito();


            let enCarrito = 1;
            while (enCarrito == 1) {
                let opcion3 = prompt("\n 1)Quiere agregar otro producto\n 2)Quiere eliminar un producto\n 3)Ir a pagar ");

                //Validar opción del carrito
                if (!opcion3 || !["1", "2", "3"].includes(opcion3)) {
                    console.log("Opción inválida. Por favor, ingrese 1, 2 o 3.");
                    continue;
                }
                
                //opcion 1 (agregar)
                if (opcion3 == "1") {
                    enCarrito = 0;  //para que vuelva a la opcion a del catalogo

                //opcion 2 (eliminar)
                } else if (opcion3 == "2") { 

                    let irAPagar = eliminarDelCarrito(); // Llama a la función

                    if (irAPagar) {

                        let resultadoPago = procesarPago();
                        
                        if (resultadoPago === true) {
                            enCarrito = 0;
                            stop = 0; //Salir del programa
                        } else {
                            //Si no quiere salir, verificar estado del carrito
                            if (carrito.length === 0) {
                                console.log("El carrito está vacío");
                                enCarrito = 0;
                            } else {
                                mostrarCarrito(); //Mostrar carrito actualizado
                            }
                        }
                        
                    }  
                    
                     //si no paga, muestra el carrito actualizado
                    if (enCarrito == 1 && carrito.length > 0) {
                        mostrarCarrito();
                    }


                //opcion 3 (pagar)
                } else if (opcion3 == "3") {
                    let resultadoPago = procesarPago();
    
                    if (resultadoPago === true) {
                        //Si la función retorna true, el usuario quiere salir del programa
                        enCarrito = 0;
                        stop = 0; // Salir del programa principal
                    } else if (resultadoPago === false) {
                        //Si retorna false, el usuario quiere seguir comprando o canceló
                        //Verificar si el carrito está vacío después del pago
                        if (carrito.length === 0) {
                            console.log("El carrito está vacío");
                            enCarrito = 0; //Volver al menú principal
                        } else {
                            //Mostrar carrito actualizado
                            mostrarCarrito();
                        }
                    }

                } else {
                    alert("Opción inválida. Por favor, ingrese 1, 2 o 3.");
                }

            }
        }



    //opcion S
    } else if (opcionInicio.toUpperCase() == "S") {
        stop = 0;

    } else {
        console.log("Esa opcion no esta disponible, vuelva a intentarlo")
    }
}


