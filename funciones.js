let lista = [];

let calcularB = document.getElementById('calcular');

function añadir() {
    Ncajas = document.getElementById("ncajas");
    Nalfajores = document.getElementById("nalfajores");
    cliente = document.getElementById("cliente");
    fecha = document.getElementById("fecha");
    botonCalcular= document.getElementById("calcular");
    
    if (Ncajas.value === '' || Nalfajores.value === '') {
        return
    }

    newElement(Ncajas.value, Nalfajores.value, cliente.value, fecha.value);
    renderPedidos();
    botonCalcular.style.display = 'block'
    Ncajas.value = '';
    Nalfajores.value = '';
    cliente.value = '';
    fecha.value = '';
}

function newElement(a, b, c, d) {
    const nuevoPedido = {
        id: (Math.random()*100).toString(36).slice(3),
        cajas: a,
        alfajores: b,
        cliente: c,
        fecha: d,
        precio: (b === '12'? `${a * 18} soles` : `${a * 15} soles`),
    }
    lista.push(nuevoPedido);
}

function renderPedidos() {
    const listaHTML = lista.map(pedido => {
        return `
            <li id="${pedido.id}" class="pedido"><p>${pedido.cliente != '' ? 'Para ' + pedido.cliente +':</p><br><p>' : ''}${pedido.cajas} ${pedido.cajas > 1 ? 'cajas': ' caja'} con ${pedido.alfajores} alfajores</p><button class="borrar" data-id="${pedido.id}" type="submit">X</button></li>
        
        `
    })
    const pedidos = document.getElementById('pedidos');

    pedidos.innerHTML = listaHTML.join('');

    document.querySelectorAll(".borrar").forEach((button) =>{
        button.addEventListener('click', (e) => {
            const id = button.getAttribute("data-id");
            lista = lista.filter((pedido) => pedido.id != id);
            
            renderPedidos();    
        })
    })
    
}

    




function calcular() {
    sumarCantidades();
    calcularIngredientes();
    convertir();
    mostrar();
    pedidos.innerHTML ='';
}

function sumarCantidades() {
    total = 0;
    lista.forEach(pedido => {
        total += pedido.alfajores * pedido.cajas
    });
}


function calcularIngredientes() {
    harina = Math.round(160/36 * total);
    azucar = Math.round(52/36 * total);
    maicena = Math.round(120/36 * total);
    margarina = Math.round(225/36 * total);
}


function convertir() {
    if (harina > 1000) {
        harina = (harina / 1000);
        uHarina = 'kilos'
    } else {
        uHarina = 'gramos'
    }
    if (azucar > 1000) {
        azucar = (azucar / 1000);
        uAzucar = 'kilos'
    } else{
        uAzucar = 'gramos'
    }
    if (maicena > 1000) {
        maicena = (maicena / 1000);
        uMaicena = 'kilos'
    } else {
        uMaicena = 'gramos'
    }
    if (margarina > 1000) {
        margarina = (margarina / 1000);
        uMargarina = 'kilos'
    } else {
        uMargarina = 'gramos'
    }
}

function mostrar(){
    cHarina = document.getElementById('cHarina');
    cAzucar = document.getElementById('cAzucar');
    cMaicena = document.getElementById('cMaicena');
    cMargarina = document.getElementById('cMargarina');
    textoTotal = document.getElementById('total');

    cHarina.innerHTML = `${harina} ${uHarina} de harina`
    cAzucar.innerHTML = `${azucar} ${uAzucar} de azúcar`
    cMaicena.innerHTML = `${maicena} ${uMaicena} de maicena`
    cMargarina.innerHTML = `${margarina} ${uMargarina} de margarina`
    textoTotal.innerHTML = `Para un total de ${total} alfajores`
}




function generatePDF(){
    var pdfObject = jsPDFInvoiceTemplate.default(props);
    
    console.log("Object created: ", pdfObject);
}

calcularB.addEventListener( 'click', e => {
    props = {
        outputType: jsPDFInvoiceTemplate.OutputType.Save,
        returnJsPDFDocObject: true,
        fileName: "Pedido",
        orientationLandscape: false,
        compress: true,
        logo: {
            src: "logo.png",
            type: 'PNG', //optional, when src= data:uri (nodejs case)
            width: 53.33, //aspect ratio = width/height
            height: 53.33,
            margin: {
                top: 0, //negative or positive num, from the current position
                left: 0 //negative or positive num, from the current position
            }
        },
        stamp: {
            inAllPages: true, //by default = false, just in the last page
            src: "https://raw.githubusercontent.com/edisonneza/jspdf-invoice-template/demo/images/qr_code.jpg",
            type: 'JPG', //optional, when src= data:uri (nodejs case)
            width: 20, //aspect ratio = width/height
            height: 20,
            margin: {
                top: 0, //negative or positive num, from the current position
                left: 0 //negative or positive num, from the current position
            }
        },
        business: {

        },
        invoice: {
            header: [
              {
                title: "#", 
                style: { 
                  width: 10 
                } 
              }, 
              { 
                title: "Fecha solicitada",
                style: {
                  width: 30
                } 
              }, 
              { 
                title: "Cliente",
                style: {
                  width: 30
                } 
              }, 
              { title: "Cajas"},
              { title: "Tamaño de caja"},
              { title: "Precio"},
            ],
            table: Array.from(Array(lista.length), (item, index)=>([
                index + 1,
                lista[index].fecha != '' ? lista[index].fecha : 'No especifica',
                lista[index].cliente != '' ? lista[index].cliente : 'No especifica',
                lista[index].cajas,
                lista[index].alfajores,
                lista[index].precio,
            ])),
            additionalRows: [{
                col1: 'Total:',
                col2: '145,250.50',
                col3: 'ALL',
                style: {
                    fontSize: 14 //optional, default 12
                }
            },
            {
                col1: 'VAT:',
                col2: '20',
                col3: '%',
                style: {
                    fontSize: 10 //optional, default 12
                }
            },
            {
                col1: 'SubTotal:',
                col2: '116,199.90',
                col3: 'ALL',
                style: {
                    fontSize: 10 //optional, default 12
                }
            }],
        },
        footer: {
            text: "The invoice is created on a computer and is valid without the signature and stamp.",
        },
        pageEnable: true,
        pageLabel: "Page ",
        };
    lista = [];
    return props
})
