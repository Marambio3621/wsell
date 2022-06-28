// MODIFICACION DE TABLAS CON JQUERY

var grafico6;
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
/* CHART JS */
// GRAFICO Grafico Ingresos OBTENIDOS AL AÑO

filterButton = document.querySelector('#btn_filter');

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



function numberWithPoints(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

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



function exportReportToExcel() {
    let table = document.getElementsByTagName("table"); // you can use document.getElementById('tableId') as well by providing id to the table tag
    TableToExcel.convert(table[0], { // html code may contain multiple tables so here we are refering to 1st table tag
      name: `tabla.xlsx`, // fileName you could use any name
      sheet: {
        name: 'Sheet 1' // sheetName
      }
    });
  }

document.getElementById('tabla-pdf').onclick = function(){
    let table = document.getElementById("tabla"); 
    let opt = {
        margin: 1,  
        filename: 'tabla.pdf',
        image: { type: 'jpeg', quality: 0.98},
        html2canvas: {scale: 2},
        jsPDF: { unit:'in', format:'letter', orientation: 'portrait'}
    }

    html2pdf(table, opt);
};

/* PDF PARA EL GRAFICO */
document.getElementById('grafico-pdf').onclick = function(){
    let grafico = document.getElementById("grafico_cantidad_ventas"); 
    grafico.style.width="1050px";
    grafico.style.height="300px";
    let opt = {
        margin: 0,
        filename: 'grafico.pdf',
        image: { type: 'jpeg', quality: 1},
        html2canvas: {scale: 2},
        jsPDF: { unit:'in', format:'letter', orientation: 'landscape'}
    }

    html2pdf(grafico, opt);
};



var startYear = 1800;
for (i = new Date().getFullYear(); i > startYear; i--)
{
  $('#yearpicker').append($('<option />').val(i).html(i));
}


filterButton.addEventListener("click", function() {
    let year = $("#yearpicker").val();
    graficoCantidadVentas(year);
    tablaVentasRealizadas(year);
  });
