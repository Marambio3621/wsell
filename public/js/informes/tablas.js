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


filterButton = document.querySelector('#btn_filter');

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

function numberWithPoints(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}


// tabla INGRESOS MENSUALES
function tablaIngresosMensuales(year){
    $("#tbody_ingresos_mensuales tr").remove(); 
    $.ajax({
        url: "/informes/ingresos/"+year,
        dataSrc: "",
        success(res){
            var array = $.parseJSON(res);
            
            
            let start_month = array[0].month;
            let cant_valor = array.length;
            let cont = 0;
            console.log(start_month)
            for (let i = 0 ;i < start_month - 1 ;i++) {
                $('#tbody_ingresos_mensuales').prepend(`<tr>
                <td>${i+1}</td>
                <td>${0}</td>
                </tr>`)
                cont++;
            }
            for (let i = 0 ; i < cant_valor ;i++) {
                $('#tbody_ingresos_mensuales').prepend(`<tr>
                <td>${i + start_month}</td>
                <td>${numberWithPoints(array[i].valor_total)}</td>
                </tr>`)
                cont++;
            }
            for (let i = cont ; i < 12 ;i++) {

                $('#tbody_ingresos_mensuales').prepend(`<tr>
                <td>${i+1}</td>
                <td>${0}</td>
                </tr>`)

            }
        }
    })

}
tablaIngresosMensuales(2022);


// tabla GANANCIAS MENSUALES DEL AÑO
function tablaGananciasMensuales(year){
    $("#tbody_ganancias_mensuales tr").remove(); 
    $.ajax({
        url: "/informes/ganancia_ventas/"+year,
        dataSrc: "",
        success(res){
            var array = $.parseJSON(res);
            let start_month = array[0].month;
            let cant_valor = array.length;
            let cont = 0;
            console.log(start_month)
            for (let i = 0 ;i < start_month - 1 ;i++) {
                $('#tbody_ganancias_mensuales').prepend(`<tr>
                <td>${i+1}</td>
                <td>${0}</td>
                </tr>`)
                cont++;
            }
            for (let i = 0 ; i < cant_valor ;i++) {
                $('#tbody_ganancias_mensuales').prepend(`<tr>
                <td>${i + start_month}</td>
                <td>${numberWithPoints(array[i].ganancia)}</td>
                </tr>`)
                cont++;
            }
            for (let i = cont ; i < 12 ;i++) {

                $('#tbody_ganancias_mensuales').prepend(`<tr>
                <td>${i+1}</td>
                <td>${0}</td>
                </tr>`)

            }
                  
        }
    })

}
tablaGananciasMensuales(2022);



// tabla 3 Ingresos vendedor
function tablaIngresosVendedores(year){
    $("#tbody_ingresos_vendedores tr").remove(); 
    $.ajax({
        url: "/informes/ingresos_vendedor/"+year,
        dataSrc: "",
        success(res){
            var array = $.parseJSON(res);

            for (let i = 0; i < array.length; i++) {
                $('#tbody_ingresos_vendedores').prepend(`<tr>
                <td>${array[i].nombre}</td>
                <td>${numberWithPoints(array[i].ingresos)}</td>
                </tr>`)

            }
             
        }
    })

}
tablaIngresosVendedores(2022);

// tabla CANTIDAD PRODUCTO
function tablaCantidadProducto(year){
    $("#tbody_cantidad_producto tr").remove(); 
    $.ajax({
        url: "/informes/cantidad_productos/"+year,
        dataSrc: "",
        success(res){
            var array = $.parseJSON(res);
            
            cantidad = [];
            descripcion_producto = []
            array.reverse();
            for (let i = 0; i < array.length; i++) {
                cantidad[i] = array[i].count_sku;
                descripcion_producto[i] = array[i].descripcion;
                $('#tbody_cantidad_producto').prepend(`<tr>
                <td>${array[i].descripcion}</td>
                <td>${numberWithPoints(array[i].count_sku)}</td>
                </tr>`)

            }        
        }
    })

}
tablaCantidadProducto(2022);

// tabla Efectivo vs Tarjeta
function tablaEfectivoTarjeta(year){
    $("#tbody_efectivo_tarjeta tr").remove(); 
    $.ajax({
        url: "/informes/efectivo_tarjeta/"+year,
        dataSrc: "",
        success(res){
            var array = $.parseJSON(res);

            for (let i = 0; i < array.length; i++) {
                if(array[i].tipo_pago == 1){
                    $('#tbody_efectivo_tarjeta').prepend(`<tr>
                    <td>Efectivo</td>
                    <td>${array[i].porcentaje_tipo_pago}%</td>
                    </tr>`)
                }
                else{
                    $('#tbody_efectivo_tarjeta').prepend(`<tr>
                    <td>Tarjeta</td>
                    <td>${array[i].porcentaje_tipo_pago}%</td>
                    </tr>`)
                }
            }        
        }
    })

}
tablaEfectivoTarjeta(2022);

// tabla CANTIDAD VENTAS REALIZADAS
function tablaVentasRealizadas(year){
    $("#tbody_cantidad_ventas tr").remove(); 
    $.ajax({
        url: "/informes/cantidad_ventas/"+year,
        dataSrc: "",
        success(res){
            var array = $.parseJSON(res);
            
            
            let start_month = array[0].month;
            let cant_valor = array.length;
            let cont = 0;
            for (let i = 0 ;i < start_month - 1 ;i++) {
                $('#tbody_cantidad_ventas').prepend(`<tr>
                <td>${i+1}</td>
                <td>${0}</td>
                </tr>`)
                cont++;
            }
            for (let i = 0 ; i < cant_valor ;i++) {
                $('#tbody_cantidad_ventas').prepend(`<tr>
                <td>${i + start_month}</td>
                <td>${numberWithPoints(array[i].cantidad_venta)}</td>
                </tr>`)
                cont++;
            }
            for (let i = cont ; i < 12 ;i++) {

                $('#tbody_cantidad_ventas').prepend(`<tr>
                <td>${i+1}</td>
                <td>${0}</td>
                </tr>`)

            }       
        }
    })

}
tablaVentasRealizadas(2022);




var startYear = 1800;
for (i = new Date().getFullYear(); i > startYear; i--)
{
  $('#yearpicker').append($('<option />').val(i).html(i));
}


filterButton.addEventListener("click", function() {
    let year = $("#yearpicker").val();
    tablaIngresosMensuales(year);
    tablaGananciasMensuales(year);
    tablaIngresosVendedores(year);
    tablaCantidadProducto(year);
    tablaEfectivoTarjeta(year);
    tablaVentasRealizadas(year);
  });