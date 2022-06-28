

// MODIFICACION DE TABLAS CON JQUERY
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
    //CERRAR MODAL AL INICIAR
    modal.classList.toggle("closed");
    modalOverlay.classList.toggle("closed");
    //TABLA JQUERY
    $('#tabla__productos').DataTable();
} );


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
            }else{
                tipo_perfil.innerHTML = "Admin";
            }
        }
    })
}
cargarcookie();

/* COLLAPSE MENU   */
const linkCollapse = document.getElementsByClassName('collapse_link');
for (let i = 0; i < linkCollapse.length; i++) {
    console.log(linkCollapse[i]);
    linkCollapse[i].addEventListener('click', function(){
        const collapseMenu = this.nextElementSibling; 
        collapseMenu.classList.toggle('showCollapse')
    } )
}

let table = $('#tabla__productos').DataTable({
    ajax: {
        url : "/data",
        dataSrc : ''
    },
    columns:[
        {data: "sku"},
        {data: "descripcion"},
        {data: "precio_inversion"},
        {data: "precio_venta"},
        {data: "stock"},
        {data: "categoria"},
        {data: "unidad"},
        {data: null,
            "render": function(data){
              if(data.estado == 0){
                return `<label class="switch" onchange="cambiarEstado(${data.sku}, ${data.estado})">
                <input id="togBtn" type="checkbox" value="${data.estado}">
                <span class="slider round"></span>
                </label>`
                }else{
                 return   `<label class="switch" onchange="cambiarEstado(${data.sku}, ${data.estado})">
                <input id="togBtn" type="checkbox" value="${data.estado}" checked>
                <span class="slider round"></span>
                </label>`
                }
            }

            



        },
        {data: null,
            "render": function(data){
                return `<a onclick="editar_modal(${data.sku},'${data.descripcion}','${data.precio_inversion}',${data.precio_venta},${data.stock},${data.categoria_idcategoria})"><span class="material-icons-sharp action_item" id="edit_button">edit</span></a> <a onclick="confirmar(${data.sku})"><span class="material-icons-sharp action_item eliminar_button">delete</span></a>`
            }
        }
    ],
    //${data.sku},${data.descripcion},${data.precio_inversion},${data.precio_venta},${data.stock},${data.categoria_idcategoria}


    // Quitar sort de las coolumas
    'aoColumnDefs': [{
         'bSortable': false,
         'aTargets': ['nosort'],
     }],
     // Botones para exportar a excel, pdf u otro
    dom: 'lBfrtip',
    buttons: {
        dom: {
            button: {
                className: 'btn-export'
            }
        },
        buttons: [
            {
                //COPY
                extend: 'copy',
                text: '<i class="fa-solid fa-copy"></i> COPY', //u can define a diferent text or icon
                title: 'Lista de productos',
                className: 'btn-export'
            },
            {
                //CSV
                extend: 'csv',
                text: '<i class="fa-solid fa-file-csv"></i> CSV', //u can define a diferent text or icon
                title: 'Lista de productos',
            },
            {
                //EXCEL
                extend: 'excelHtml5',
                text: '<i class="fas fa-file-excel"></i> EXCEL', //u can define a diferent text or icon
                title: 'Lista de productos',
            },
            {
                //PDF
                extend: 'pdf',
                text: '<i class="fa-solid fa-file-pdf"></i> PDF', //u can define a diferent text or icon
                title: 'Lista de productos',
            },
            {
                //PRINT
                extend: 'print',
                text: '<i class="fas fa-print"></i> IMPRIMIR',
                title: 'Lista de productos',
            }
        ]
    },

    language: {
        "lengthMenu": "Mostrar _MENU_ datos",
        "zeroRecords": "Nothing found - sorry",
        "info": "Mostrando pagina _PAGE_ de _PAGES_",
        "infoEmpty": "Producto no disponibles",
        "infoFiltered": "(filtrado de _MAX_ productos totales)",
        "paginate": {
            "first":      "First",
            "last":       "Last",
            "next":       "Siguiente",
            "previous":   "Anterior"
        },
        "search": "Buscar:"
    },

    // Botones para mostar numero de registros
    "lengthMenu": [[10,30,50,80,100,120, -1], [10,30,50,80,100,120, "All"]],

    
 });


 $(".btn-export").css({"background-color": "var(--color-primary)", "color": "var(--color-white)","font-size": "1.3rem", "border-radius": "5%", "padding": ".8rem",
 "margin-left": "2rem", "margin-bottom": "12px "

 
});

// MANIPULAR SIDE IZQUIERDO Y CAMBIO DE TEMA

const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector('#theme-toggler');


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

//FUNCIÓN CARGAR CATEGORIA CON AJAX - TOMANDO LA URL DE LA CARPETA RUTAS!

function cargarCategoria(){

    $.ajax({
        url: "/categoria",
        dataSrc: "",
        success(res){
            var categoria = $.parseJSON(res);
            console.log(categoria);

            console.log(categoria);
            $('#tipo_categoria').append($('<option>',{
                value: '',
                text: 'Seleccionar'
            }))

            for(i=0;i<categoria.length;i++){
                $('#tipo_categoria').append($('<option>',{
                    value: categoria[i]['idcategoria'],
                    text: categoria[i]['descripcion']
                }))
            }

        }
    })
}

cargarCategoria();




// CARGAR UNIDAD
function cargarUnidad(){

    $.ajax({
        url: "/unidad",
        dataSrc: "",
        success(res){
            var categoria = $.parseJSON(res);
            console.log(categoria);

            console.log(categoria);
            $('#unidad').append($('<option>',{
                value: '',
                text: 'Seleccionar'
            }))

            for(i=0;i<categoria.length;i++){
                $('#unidad').append($('<option>',{
                    value: categoria[i]['id'],
                    text: categoria[i]['descripcion']
                }))
            }
        }
    })
}

cargarUnidad();

//FUNCION DE APLICACIÓN Y CONFIGURACION DE ALERTA CON LA LIBRERIA SWEETALERT.JS
function confirmar(id){
    Swal.fire({
        title: '¿Confirma eliminar el registro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'var(--color-primary)',
        cancelButtonColor: 'var(--color-danger)',
        confirmButtonText: 'Confirmar',
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          window.location = '/delete/' + id;
          Swal.fire('Realizado!', '', 'success');
        }
      })
}

// MANIPULACION DEL MODAL

var modal = document.querySelector("#modal");
var modalOverlay = document.querySelector("#modal-overlay");
var closeButton = document.querySelector("#close-button");
var openButton = document.querySelector("#open-button");
var cancelButton = document.querySelector("#cancel-button");



closeButton.addEventListener("click", function() {
  modal.classList.toggle("closed");
  modalOverlay.classList.toggle("closed");
});


cancelButton.addEventListener("click", function() {
    modal.classList.toggle("closed");
    modalOverlay.classList.toggle("closed");
  });

openButton.addEventListener("click", function() {
  modal.classList.toggle("closed");
  modalOverlay.classList.toggle("closed");

  $('#atributo1').val("");
  $('#atributo2').val("");
  $('#atributo3').val("");
  $('#atributo4').val("");
  $('#atributo5').val("");


  $('#primaryKey').show();
  $('#btn_submit').text("Agregar");
  $("#modal_titulo").text("Crear Producto");
  $('form').attr('action', 'save');
});


var submitButton = document.querySelector("#btn_submit");
submitButton.addEventListener("click", function() {
    if( $('#atributo1').val() == '' || $('#atributo2').val()  == ''|| $('#atributo3').val()  == '' || $('#atributo4').val()  == ''|| $('#atributo5').val()  == ''|| $('#unidad').val() == ''){
        Swal.fire({
            title: 'Rellene todos los datos porfavor',
            icon: 'warning',
            showCancelButton: false,
            confirmButtonColor: 'var(--color-primary)',
            cancelButtonColor: 'var(--color-danger)',
            confirmButtonText: 'Confirmar',
          })
    }else{
        Swal.fire('Realizado!', '', 'success');
        $('#btn_submit').attr('type', 'submit');
    }
  });



//MODAL DE CREACIÓN SE LE CAMBIA EL ATRIBUTO ACTION A 'UPDATE' PARA PODER EDITAR UN PRODUCTO

function editar_modal(sku, desc , precio_in, precio_ven, stock, categoria){
  modal.classList.toggle("closed");
  modalOverlay.classList.toggle("closed");
  $('#primaryKey').css('display','none');
  $('#atributo1').val(sku);
  $('#atributo2').val(desc);
  $('#atributo3').val(precio_in);
  $('#atributo4').val(precio_ven);
  $('#atributo5').val(stock);
  $('#btn_submit').text("Editar");
  $("#modal_titulo").text("Editar Producto");
  $('form').attr('action', 'update');
}







function cambiarEstado(sku, estado){
    estado;
    if(estado == 0){

        console.log(estado);
        valor = estado + 1;
        /*console.log($("#togBtn").val())
        console.log($("#togBtn").is(':checked'));*/
        window.location = '/actualizar_estado_producto/' + sku + '/' + valor;
    }else if(estado == 1){
        console.log(estado);
        valor = estado - 1;
        /*console.log($("#togBtn").val())
        console.log($("#togBtn").is(':checked'));*/
        window.location = '/actualizar_estado_producto/' + sku + '/' + valor;
    }
}

