// MODIFICACION DE TABLAS CON JQUERY

var grafico5;
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
// GRAFICO Grafico Ingresos OBTENIDOS AL A??O
/* CHART JS */
// GRAFICO Grafico Ingresos OBTENIDOS AL A??O

filterButton = document.querySelector('#btn_filter');

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
    let grafico = document.getElementById("grafico_efectivo_tarjeta"); 
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
    graficoEfectivoTarjeta(year);
    tablaEfectivoTarjeta(year);
  });
