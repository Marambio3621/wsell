

const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector('#theme-toggler');

const nombre_perfil = document.querySelector("#nombre_perfil");
const tipo_perfil = document.querySelector("#tipo_perfil");

$(document).ready( function () {
    $.ajax({
        url: "/getcookie",
        dataSrc: "",
        
        success(res){
            console.log(res.jwt);
            let token= parseJwt(res.jwt);
            console.log(token);
            nombre_perfil.innerHTML = token.nombre + '!';
            if(token.tipo == "v"){
                window.location.href = "/ventas";
            }
        }
    })

} );

// CARGAR DATOS DE JSON WEB TOKEN

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

function cargarcookie(){
    $.ajax({
        url: "/getcookie",
        dataSrc: "",
        
        success(res){
            console.log(res.jwt);
            let token= parseJwt(res.jwt);
            console.log(token);
            nombre_perfil.innerHTML = token.nombre + '!';
            if(token.tipo == "v"){
                tipo_perfil.innerHTML = "Vendedor";
            }else{
                tipo_perfil.innerHTML = "Admin";
            }
        }
    })
}
cargarcookie();

// MANIPULACION DEL MODAL

var modal = document.querySelector("#modal");
var modalOverlay = document.querySelector("#modal-overlay");
var closeButton = document.querySelector("#close-button");
var openButton = document.querySelector('#open-button');
var cancelButton = document.querySelector("#cancel-button");


closeButton.addEventListener("click", function() {
  modal.classList.toggle("closed");
  modalOverlay.classList.toggle("closed");
  
});

openButton.addEventListener("click", function() {
    modal.classList.toggle("closed");
    modalOverlay.classList.toggle("closed");
  });
  

cancelButton.addEventListener("click", function() {
  modal.classList.toggle("closed");
  modalOverlay.classList.toggle("closed");
});


// MODAL DETALLE_VENTA

var modal_detalle_venta = document.querySelector("#modal_detalle_venta");
var modalOverlay_detalle_venta = document.querySelector("#modal-overlay_detalle_venta");

var closeButtonModalDetalleVenta = document.querySelector("#close-button-detalle-venta");
var okButtonModalDetalleVenta = document.querySelector("#ok-button-detalle-venta");

closeButtonModalDetalleVenta.addEventListener("click", function() {
    modal_detalle_venta.classList.toggle("closed");
    modalOverlay_detalle_venta.classList.toggle("closed");
  });
  

  okButtonModalDetalleVenta.addEventListener("click", function() {
    modal_detalle_venta.classList.toggle("closed");
    modalOverlay_detalle_venta.classList.toggle("closed");
});


$(document).ready( function () {
    //CERRAR MODAL AL INICIAR
    modal.classList.toggle("closed");
    modalOverlay.classList.toggle("closed");

    modal_detalle_venta.classList.toggle("closed");
    modalOverlay_detalle_venta.classList.toggle("closed");
} );

console.log("hola");
menuBtn.addEventListener('click', ()=>{
    sideMenu.style.display = 'block';
})

closeBtn.addEventListener('click', ()=>{
    sideMenu.style.display = 'none'
})

function changeBackground() {
    if (sessionStorage.getItem('theme') == 0){
        sessionStorage.setItem('theme', 1);
    }else{
        sessionStorage.setItem('theme', 0);
    }    
}


function checkBackground(){
    if(sessionStorage.getItem('theme') == 1){
        document.body.classList.toggle('dark-theme-variables');
        themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
        themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
    }
}
checkBackground();

themeToggler.addEventListener('click', ()=>{
    document.body.classList.toggle('dark-theme-variables');
    themeToggler.querySelector('span:nth-child(1)').classList.toggle('active');
    themeToggler.querySelector('span:nth-child(2)').classList.toggle('active');
    changeBackground();
})

/* COLLAPSE MENU   */
const linkCollapse = document.getElementsByClassName('collapse_link');
for (let i = 0; i < linkCollapse.length; i++) {
    console.log(linkCollapse[i]);
    linkCollapse[i].addEventListener('click', function(){
        const collapseMenu = this.nextElementSibling; 
        collapseMenu.classList.toggle('showCollapse')
    } )
}


dayButton = document.querySelector('#btn_filter');
rangeButton = document.querySelector('#btn_range');



function numberWithPoints(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}



document.getElementById('datePicker').valueAsDate = new Date();
let fecha = document.getElementById('datePicker').value;

function cargarTablaVentasRecientes(fecha){
    $("#body_ventas_recientes tr").remove();
    $.ajax({
        url: "/ventas_index/"+fecha,
        dataSrc: "",
        
        success(res){
            var ventas = $.parseJSON(res);
            console.log(ventas);
            let total_venta = [];
            let acum = 0;

            console.log(acum);

            /* LLENAR TABLA CON LAS TODAS LAS VENTAS REALIZADAS */
            for(let i = 0; i < ventas.length;i++){
                $('#body_ventas_recientes').prepend(`<tr>
                <td>${ventas[i].idventa}</td>
                <td>${ventas[i].valorT}</td>
                <td>${ventas[i].tipo_pago}</td>
                <td class="success">Realizado</td>
                <td class="primary">
                    <a onclick="mostrar_detalle_venta(${ventas[i].idventa})"> Detalles</a>            
                </td>
                </tr>`)

                acum = acum + parseInt(ventas[i].valorT.replace('.',''))
            }
            console.log(acum);

            $("#total_vendido").text(`Total Vendido:$${numberWithPoints(acum)}`);
        }
    })
}

cargarTablaVentasRecientes(fecha);

//const total_venta = document.querySelector("#total_vendido");

function cargarTablaVentasByRange(fecha1, fecha2){
    $("#body_ventas_recientes tr").remove();
    $.ajax({
        url: "/ventas_range/"+fecha1+"/"+fecha2,
        dataSrc: "",
        
        success(res){
            var ventas = $.parseJSON(res);
            console.log(ventas);
            let total_venta = [];
            let acum = 0;
            /* FOR PARA LLENAR UN ARRAY CON TODAS LAS VENTAS DEL DIA */
            for(let i = 0; i < ventas.length ;i++){
                total_venta[i] = parseInt(ventas[i].valorT);
            }

            /* LLENAR TABLA CON LAS TODAS LAS VENTAS REALIZADAS */
            for(let i = 0; i < ventas.length;i++){
                $('#body_ventas_recientes').prepend(`<tr>
                <td>${ventas[i].idventa}</td>
                <td>${ventas[i].valorT}</td>
                <td>${ventas[i].tipo_pago}</td>
                <td class="success">Realizado</td>
                <td class="primary">
                    <a onclick="mostrar_detalle_venta(${ventas[i].idventa})"> Detalles</a>            
                </td>
                </tr>`)
                acum = acum + parseInt(ventas[i].valorT.replace('.',''))
            }
            console.log(acum);

            $("#total_vendido").text(`Total Vendido:$${numberWithPoints(acum)}`);
        }
    })
}


dayButton.addEventListener("click", function() {
    let fecha = document.getElementById('datePicker').value;
    cargarTablaVentasRecientes(fecha);
  });


rangeButton.addEventListener("click", function(){
    let fecha1 = document.getElementById('fecha1').value;
    let fecha2 = document.getElementById('fecha2').value;
    cargarTablaVentasByRange(fecha1, fecha2);
    modal.classList.toggle("closed");
    modalOverlay.classList.toggle("closed");
})
   


function cargar_detalle_venta(idventa){
    $("#tbody_detalle_venta tr").remove(); 
    $.ajax({
        url: "/detalle_venta/"+idventa,
        dataSrc: "",
        
        success(res){
            var detalle = $.parseJSON(res);
            for(let i = 0; i < detalle.length;i++){
                $('#tbody_detalle_venta').prepend(`<tr>
                <td>${detalle[i].cantidad}</td>
                <td>${detalle[i].descripcion}</td>
                <td>${detalle[i].precio_unitario}</td>
                <td>${detalle[i].sub_total}</td>
                </tr>`)
            }
        }
    })
}

function cargar_detalle_venta_usuario(idventa){
    $.ajax({
        url: "/detalle_venta_usuario/"+idventa,
        dataSrc: "",
        
        success(res){
            let detalle = $.parseJSON(res);   
            console.log(detalle);
            $("#nombre_vendedor").text(`Vendedor: ${detalle[0].nombre} ${detalle[0].apellido_paterno}`);
            $("#fecha_venta").text(`Fecha: ${detalle[0].fecha}`);
            $("#forma_de_pago").text(`Forma de pago: ${detalle[0].tipo_pago}`);

            $("#pago_venta").text(`Pago: $${detalle[0].pago}`);
            $("#vuelto_venta").text(`Vuelto: $${detalle[0].vuelto}`);
            $("#total_venta").text(`Total: $${detalle[0].total_venta}`);
        }
    })
}

function cargar_detalle_negocio(){
    $.ajax({
        url: "/negocio/dato_negocio",
        dataSrc: "",
        success(res){
            let detalle = $.parseJSON(res);
            $("#nombre_negocio").text(`Negocio: ${detalle[0].descripcion}`);
            $("#rut_negocio").text(`Rut Negocio: ${detalle[0].rut_negocio}`);
            $("#direccion_negocio").text(`Dirección: ${detalle[0].direccion}`);
            $("#telefono_negocio").text(`Telefono: ${detalle[0].telefono}`)
        }
    })
}

function mostrar_detalle_venta(idventa){
    modal_detalle_venta.classList.toggle("closed");
    modalOverlay_detalle_venta.classList.toggle("closed");
    $("#id_de_venta").text(`N° de Venta: ${idventa}`)
    cargar_detalle_negocio();
    cargar_detalle_venta_usuario(idventa);
    cargar_detalle_venta(idventa);
}


/*const options = {
    margin: 0.5,
    filename: 'detalle.pdf',
    image: { 
      type: 'jpeg', 
      quality: 500
    },
    html2canvas: { 
      scale: 1 
    },
    jsPDF: { 
      unit: 'in', 
      format: 'letter', 
      orientation: 'portrait' 
    }
  }
  
  $("#imprimir-pdf").click(function(e){
    e.preventDefault();
    const detalle = document.getElementById('modal_contenido_venta');
    html2pdf().from(detalle).set(options).save();
    
  });*/

  /* PDF PARA EL GRAFICO */



  function printReporte() 
  {
  
    var divToPrint=document.getElementById('div_ventas');
  
    var newWin=window.open('','Print-Window');
  
    newWin.document.open();
  
    newWin.document.write('<html><body onload="window.print()">'+divToPrint.innerHTML+'</body></html>');
  
    newWin.document.close();
  
    setTimeout(function(){newWin.close();},10);
  
  }


function printDiv() 
{

  var divToPrint=document.getElementById('DivIdToPrint');

  var newWin=window.open('','Print-Window');

  newWin.document.open();

  newWin.document.write('<html><body onload="window.print()">'+divToPrint.innerHTML+'</body></html>');

  newWin.document.close();

  setTimeout(function(){newWin.close();},10);

}