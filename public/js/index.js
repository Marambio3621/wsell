

const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector('#theme-toggler');

const nombre_perfil = document.querySelector("#nombre_perfil");
const tipo_perfil = document.querySelector("#tipo_perfil");


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
                /*$("#menu_item_index").hide();
                $("#menu_item_producto").hide();
                $("#menu_item_negocio").hide();
                $("#menu_item_usuarios").hide();
                $("#menu_item_informes").hide();*/
            }else{
                tipo_perfil.innerHTML = "Admin";
            }
        }
    })
}
cargarcookie();



$(document).ready( function () {
    //CERRAR MODAL AL INICIAR

    function createBackground() {
        if (sessionStorage.getItem('theme')){
        }else{
            sessionStorage.setItem('theme', 0);
        }
    }
    createBackground()

    modal_detalle_venta.classList.toggle("closed");
    modalOverlay_detalle_venta.classList.toggle("closed");

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


console.log("hola");
menuBtn.addEventListener('click', ()=>{
    sideMenu.style.display = 'block';
})

closeBtn.addEventListener('click', ()=>{
    sideMenu.style.display = 'none'
})

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



function cargarTablaVentasRecientes(fecha){
    $.ajax({
        url: "/ventas_recientes_index/"+fecha,
        dataSrc: "",
        
        success(res){
            var ventas = $.parseJSON(res);
            console.log(ventas);
            let total_venta = [];

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
            }
        }
    })
}


function cargarInversionDelDia(fecha_actual,fecha_anterior){
    $.ajax({
        url: "/invertido_dia/"+fecha_actual+"/"+fecha_anterior,
        dataSrc: "",
        
        success(res){
            let invertido = $.parseJSON(res);

            if(invertido[0].invertido != null){
                $("#total_invertido").text("$"+parseInt(invertido[0].invertido));
                $("#porcentaje_invertido").text(invertido[0].porcentaje_invertido+"%");
                if(invertido[0].porcentaje_invertido>0){
                    $("#circulo_invertido").css(
                        'background',
                        'linear-gradient(var(--color-background) '+100-parseInt(invertido[0].porcentaje_invertido)+'%, var(--color-primary) '+100-parseInt(invertido[0].porcentaje_invertido)+'%)'
                      );
                }else{{
                    $("#circulo_invertido").css(
                        'background',
                        'linear-gradient(var(--color-background) '+100+'%, var(--color-primary) '+100+'%)'
                      );
                }}
            
            }else{
                $("#total_invertido").text("$"+0);
            }
            
        }
    })
}

function cargarVendidoDelDia(fecha_actual,fecha_anterior){
    $.ajax({
        url: "/vendido_dia/"+fecha_actual+"/"+fecha_anterior,
        dataSrc: "",
        
        success(res){
            let vendido = $.parseJSON(res);
            if(vendido.length != 0){
                $("#total_vendido").text("$"+parseInt(vendido[0].total_vendido));
                $("#porcentaje_ingresos").text(vendido[0].porcentaje_ingresos+"%")
                cargarGanancia();
                if(vendido[0].porcentaje_ingresos>0){
                    $("#circulo_ingresos").css(
                        'background',
                        'linear-gradient(var(--color-background) '+100-parseInt(vendido[0].porcentaje_ingresos)+'%, var(--color-primary) '+100-parseInt(vendido[0].porcentaje_ingresos)+'%)'
                      );
                }else{{
                    $("#circulo_ingresos").css(
                        'background',
                        'linear-gradient(var(--color-background) '+100+'%, var(--color-primary) '+100+'%)'
                      );
                }}


            }else{
                $("#total_vendido").text("$"+0);
            }
            
        }
    })
}

function cargarGanancia(){
    let ganancia = parseInt($("#total_vendido").text().slice(1)) - parseInt($("#total_invertido").text().slice(1));
    $("#total_ganancia").text("$"+ganancia)

    $.ajax({
        url: "/ganancias_dia/"+fecha_actual+"/"+fecha_anterior,
        dataSrc: "",
        
        success(res){
            let ganancias = $.parseJSON(res);
            if(ganancias.length != 0){
               $("#porcentaje_ganancia").text(ganancias[0].porcentaje_ganancia+"%")
               if(ganancias[0].porcentaje_ganancia>0){
                $("#circulo_ganancia").css(
                    'background',
                    'linear-gradient(var(--color-background) '+100-parseInt(ganancias[0].porcentaje_ganancia)+'%, var(--color-primary) '+100-parseInt(ganancias[0].porcentaje_ganancia)+'%)'
                  );
                }else{{
                    $("#circulo_ganancia").css(
                        'background',
                        'linear-gradient(var(--color-background) '+100+'%, var(--color-primary) '+100+'%)'
                    );
                }}
               
            }else{
                $("#porcentaje_ganancia").text(0+"%")
            }

        }
    })
    //$("#total_ganancia").text(`$ ${parseInt($("#total_vendido").text) - parseInt($("#total_invertido").text)}`)
}


let fecha = new Date();
let fecha_actual =  `${fecha.getFullYear()}-${fecha.getMonth()+1}-${fecha.getDate()}`
let fecha_anterior= `${fecha.getFullYear()}-${fecha.getMonth()+1}-${fecha.getDate()-1}`
console.log(fecha_actual);


    cargarTablaVentasRecientes(fecha_actual);
    cargarInversionDelDia(fecha_actual, fecha_anterior);
    cargarVendidoDelDia(fecha_actual, fecha_anterior);




function actualizarTotalVendidoDelDia(total_venta){
    let sum = 0;
    for(let i = 0; i< total_venta.length;i++){
        sum += total_venta[i];
    }
    $("#total_vendido").text("$"+sum);
}
//const total_venta = document.querySelector("#total_vendido");

//RESUMEN DE ANALISIS
function cargarVentasRealizadas(fecha_actual,fecha_anterior){
    $.ajax({
        url: "/index_ventas_realizadas/"+fecha_actual+"/"+fecha_anterior,
        dataSrc: "",
        
        success(res){
            let ventas = $.parseJSON(res);
            if(ventas[0].porcentaje_ventas_realizadas >= 0){
                $("#ventas_realizadas").text(`+${ventas[0].porcentaje_ventas_realizadas}%`);
            }else{
                $("#ventas_realizadas").text(`${ventas[0].porcentaje_ventas_realizadas}%`);
            }
            $("#cantidad_ventas_realizadas").text(`${ventas[0].ventas_del_dia}`);
        }
    })
}

function cargarProductosVendidos(fecha_actual,fecha_anterior){
    $.ajax({
        url: "/index_productos_vendidos/"+fecha_actual+"/"+fecha_anterior,
        dataSrc: "",
        
        success(res){
            let ventas = $.parseJSON(res);
            if(ventas[0].porcentaje_productos_vendidos >= 0){
                $("#productos_vendidos").text(`+${ventas[0].porcentaje_productos_vendidos}%`);
            }else{
                $("#productos_vendidos").text(`${ventas[0].porcentaje_productos_vendidos}%`);
            }
            $("#cantidad_productos_vendidos").text(`${ventas[0].cantidad_producto}`);
        }
    })
}

cargarVentasRealizadas(fecha_actual, fecha_anterior);
cargarProductosVendidos(fecha_actual, fecha_anterior);







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






// GRAFICO Grafico cantidad producto AL AÑO
function graficoCantidadProducto(fecha_actual){
    $.ajax({
        url: "/index/cantidad_productos/"+fecha_actual,
        dataSrc: "",
        success(res){
            var array = $.parseJSON(res);
            console.log(array);
            cantidad = [];
            descripcion_producto = []

            for (let i = 0; i < array.length; i++) {
                cantidad[i] = array[i].count_sku;
                descripcion_producto[i] = array[i].descripcion;
            }

        
            // CARGARR GRAFICO
            const ctx_cantidad_productos = document.getElementById('grafico_cantidad_productos');

            let grafico4 = new Chart(ctx_cantidad_productos, {
                type: 'bar',
                data: {
                    labels: descripcion_producto,
                    datasets: [{
                        label: '# of Votes',
                        data: cantidad,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    })

}
graficoCantidadProducto(fecha_actual);


function printDiv() 
{

  var divToPrint=document.getElementById('DivIdToPrint');

  var newWin=window.open('','Print-Window');

  newWin.document.open();

  newWin.document.write('<html><body onload="window.print()">'+divToPrint.innerHTML+'</body></html>');

  newWin.document.close();

  setTimeout(function(){newWin.close();},10);

}


