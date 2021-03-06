// MODIFICACION DE TABLAS CON JQUERY

var grafico4;
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

// GRAFICO 4 Grafico cantidad producto AL A??O
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


function numberWithPoints(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

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
    let grafico = document.getElementById("grafico_cantidad_productos"); 
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
    graficoCantidadProducto(year);
    tablaCantidadProducto(year);
  });