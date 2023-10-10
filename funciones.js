var lista = [];
var tarjetas = [];


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

    tarjetas = document.getElementsByClassName("tarjeta");

    for(let i = 0; i < tarjetas.length; i++){
        tarjetas[i].style.display = "block"
    }
    console.log(lista)
    if(lista.length > 0){
        for(let i = 0; i < tarjetas.length; i++) {
            let categorias = tarjetas[i].getElementsByClassName("categoria");
            let contiene = false
    
    
            for(let j = 0; j < categorias.length; j++) {
                console.log(categorias[j])
                let categoria = categorias[j].classList[1];
                console.log(categoria)
                if (lista.includes(categoria)){
                    contiene = true;
                }
            }
    
    
            if (!contiene) {
                tarjetas[i].style.display = "none"
            }
        }
    }


}

function revisar(a) {
    if(document.getElementById(a).checked == true) {
        lista.push(document.getElementById(a).name);
    }
}



