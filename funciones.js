let lista = [];
let tarjetas = [];


function aplicar() {
    lista = [];

    revisar("checkvegetariano");
    revisar("checkpicante");
    revisar("checkmarino");
    revisar("checkcriollo");
    revisar("checkselvatico");
    revisar("checkpastas");
    revisar("checkoriental");
    revisar("checkpostre");
    revisar("checkandino");

    console.log(lista);

    tarjetas = document.getElementsByClassName("tarjeta");

}

function revisar(a) {
    if(document.getElementById(a).checked == true) {
        lista.push(document.getElementById(a).name);
    }
}

function validar() {
    for (tarjeta in tarjetas) {
        let categorias = [];
        categorias = tarjeta.getElementsByClassName("categorias")
    }
}

