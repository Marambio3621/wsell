var grafico1;
var grafico2;
var grafico3;
var grafico4;
var grafico5;
var grafico6;


var porcentaje1;
var porcentaje2;


const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector('#theme-toggler');


filterButton = document.querySelector('#btn_filter');

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


/* CHART JS */
// GRAFICO Grafico Ingresos OBTENIDOS AL AÑO

filterButton = document.querySelector('#btn_filter');
function graficoIngresosObtenidos(year){
    $.ajax({
        url: "/informes/ingresos/"+year,
        dataSrc: "",
        success(res){
            var valor = $.parseJSON(res);
            console.log(valor);

            let data =[];
            
            let start_month = valor[0].month;
            let cant_valor = valor.length;
            console.log(start_month)
            for (let i = 0 ;i < start_month - 1 ;i++) {
                data[i] = 0;
            }
            for (let i = 0 ; i < cant_valor ;i++) {
                console.log(valor[i].valor_total)
                data[i + start_month - 1] = valor[i].valor_total;
            }
            for (let i = data.length ; i < 12 ;i++) {
                data[i] = 0;
            }

            // CARGARR GRAFICO

            
                
            
            const ctx_ingresos_mensuales = document.getElementById('grafico_ingresos_mensuales');

            
            console.log("flag de grafico1" + grafico1);
            if(grafico1 != undefined){
                grafico1.destroy();
            }

            grafico1 = new Chart(ctx_ingresos_mensuales, {
                type: 'line',
                data: {
                    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    datasets: [{
                        label: '# of Votes',
                        data: data,
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
            console.log(grafico1);
        }
    })

}
graficoIngresosObtenidos(2022);


// GRAFICO 2 GANANCIAS MENSUALES DEL AÑO
function graficoGananciasMensuales(year){
    $.ajax({
        url: "/informes/ganancia_ventas/"+year,
        dataSrc: "",
        success(res){
            var valor = $.parseJSON(res);
            console.log(valor);
            
            let data =[];
            
            let start_month = valor[0].month;
            let cant_valor = valor.length;
            console.log(start_month)
            for (let i = 0 ;i < start_month - 1 ;i++) {
                data[i] = 0;
            }
            for (let i = 0 ; i < cant_valor ;i++) {
                console.log(valor[i].valor_total)
                data[i + start_month - 1] = valor[i].ganancia;
            }
            for (let i = data.length ; i < 12 ;i++) {
                data[i] = 0;
            }


            if(grafico2 != undefined){
                grafico2.destroy();
            }
        
            // CARGARR GRAFICO
            const ctx_ganancias_mensuales = document.getElementById('grafico_ganancias_mensuales');
            grafico2 = new Chart(ctx_ganancias_mensuales, {
                type: 'line',
                data: {
                    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    datasets: [{
                        label: '# of Votes',
                        data: data,
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
graficoGananciasMensuales(2022);


// GRAFICO 3 Ingresos vendedor
function graficoIngresosVendedores(year){
    $.ajax({
        url: "/informes/ingresos_vendedor/"+year,
        dataSrc: "",
        success(res){
            var array = $.parseJSON(res);
            console.log("flag");
            let nombre = [];
            let ingresos = [];
            
            for (let i = 0; i < array.length; i++) {
                nombre[i] = array[i].nombre;
                ingresos[i] = array[i].ingresos;
            }
        
            // CARGARR GRAFICO
            const ctx_ingresos_vendedor = document.getElementById('grafico_ingresos_vendedor');

            if(grafico3 != undefined){
                grafico3.destroy();
            }

            grafico3 = new Chart(ctx_ingresos_vendedor, {
                type: 'bar',
                data: {
                    labels: nombre,
                    datasets: [{
                        label: '# of Votes',
                        data: ingresos,
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
graficoIngresosVendedores(2022);



// GRAFICO Grafico cantidad producto AL AÑO
function graficoCantidadProducto(year){
    $.ajax({
        url: "/informes/cantidad_productos/"+year,
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

            if(grafico4 != undefined){
                grafico4.destroy();
            }

            grafico4 = new Chart(ctx_cantidad_productos, {
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
graficoCantidadProducto(2022);


// GRAFICO 5

// GRAFICO Grafico EFECTIVO VS TARJETA
function graficoEfectivoTarjeta(year){
    $.ajax({
        url: "/informes/efectivo_tarjeta/"+year,
        dataSrc: "",
        success(res){
            var array = $.parseJSON(res);
            
            console.log(array);

        
            // CARGARR GRAFICO
            const ctx_efectivo_tarjeta = document.getElementById('grafico_efectivo_tarjeta');


            if(grafico5 != undefined){
                grafico5.destroy();
            }


            if(array[0].porcentaje_tipo_pago == 100){
                porcentaje1 = array[0].porcentaje_tipo_pago;
                porcentaje2 = 0;
            }else{
                porcentaje1 = array[0].porcentaje_tipo_pago;
                porcentaje2 = array[1].porcentaje_tipo_pago;
            }

            
            grafico5 = new Chart(ctx_efectivo_tarjeta, {
                type: 'pie',
                data: {
                    labels: ['Tarjeta', 'Efectivo'],
                    datasets: [{
                        label: '# of Votes',
                        data: [porcentaje2, porcentaje1],
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
                }
            });
        }
    })

}
graficoEfectivoTarjeta(2022);









// GRAFICO Grafico CANTIDAD ventas AL AÑO
function graficoCantidadVentas(year){
    $.ajax({
        url: "/informes/cantidad_ventas/"+year,
        dataSrc: "",
        success(res){
            var valor = $.parseJSON(res);
            console.log(valor);
            
            let data =[];
            
            let start_month = valor[0].month;
            let cant_valor = valor.length;
            console.log(start_month)
            for (let i = 0 ;i < start_month - 1 ;i++) {
                data[i] = 0;
            }
            for (let i = 0 ; i < cant_valor ;i++) {
                console.log(valor[i].cantidad_venta)
                data[i + start_month - 1] = valor[i].cantidad_venta;
            }
            for (let i = data.length ; i < 12 ;i++) {
                data[i] = 0;
            }


        
            // CARGARR GRAFICO
            const ctx_cantidad_ventas = document.getElementById('grafico_cantidad_ventas');

            if(grafico6 != undefined){
                grafico6.destroy();
            }
            grafico6 = new Chart(ctx_cantidad_ventas, {
                type: 'bar',
                data: {
                    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                    datasets: [{
                        label: '# of Votes',
                        data: data,
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
graficoCantidadVentas(2022);








var startYear = 1800;
for (i = new Date().getFullYear(); i > startYear; i--)
{
  $('#yearpicker').append($('<option />').val(i).html(i));
}


filterButton.addEventListener("click", function() {
    let year = $("#yearpicker").val();
    graficoIngresosObtenidos(year);
    graficoGananciasMensuales(year);
    graficoIngresosVendedores(year);
    graficoCantidadProducto(year);
    graficoEfectivoTarjeta(year);
    graficoCantidadVentas(year);
  });