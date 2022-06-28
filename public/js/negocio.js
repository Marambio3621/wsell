

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
        },
        error(error){
            console.log(error);
        }
    })
}
cargarcookie();


function cargarNegocio(){
  $.ajax({
      url: "/negocio/dato_negocio",
      dataSrc: "",
      
      success(res){
          var negocio = $.parseJSON(res);
          console.log(negocio[0]);

          $('#rut').text(negocio[0].rut_negocio);
          $('#descripcion').text(negocio[0].descripcion);
          $('#telefono').text(negocio[0].telefono);
          $('#correo').text(negocio[0].correo);
          $('#direccion').text(negocio[0].direccion);
          $('#razon_social').text(negocio[0].razon_social);
      }
  })
}
cargarNegocio();

function cargarCantidadVendedores(){
  $.ajax({
      url: "/numVendedor",
      dataSrc: "",
      
      success(res){
          var vendedor = $.parseJSON(res);
          $('#cantidad_vendedores').text(vendedor[0].cantidad_vendedores);
      }
  })
}
cargarCantidadVendedores();



/* COLLAPSE MENU   */
const linkCollapse = document.getElementsByClassName('collapse_link');
for (let i = 0; i < linkCollapse.length; i++) {
    console.log(linkCollapse[i]);
    linkCollapse[i].addEventListener('click', function(){
        const collapseMenu = this.nextElementSibling; 
        collapseMenu.classList.toggle('showCollapse')
    } )
}

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

// MANIPULACION DEL MODAL

var modal = document.querySelector("#modal");
var modalOverlay = document.querySelector("#modal-overlay");
var closeButton = document.querySelector("#close-button");
var openButton = document.querySelector("#btn_configurar");
var cancelButton = document.querySelector("#cancel-button");


closeButton.addEventListener("click", function() {
  modal.classList.toggle("closed");
  modalOverlay.classList.toggle("closed");
});

openButton.addEventListener("click", function() {
  modal.classList.toggle("closed");
  modalOverlay.classList.toggle("closed");

  let rut = document.getElementById("rut").innerHTML;
  let descripcion = document.getElementById("descripcion").innerHTML;
  let telefono = document.getElementById("telefono").innerHTML;
  let direccion = document.getElementById("direccion").innerHTML;
  let razon_social = document.getElementById("razon_social").innerHTML;
  let correo = document.getElementById("correo").innerHTML;

  $("#atributo0").val(rut);
  $("#atributo1").val(descripcion);
  $("#atributo2").val(telefono);
  $("#atributo3").val(direccion);
  $("#atributo4").val(razon_social);
  $("#atributo5").val(correo);


});

var submitButton = document.querySelector("#btn_submit");
submitButton.addEventListener("click", function() {
    if( $('#atributo1').val() == '' || $('#atributo2').val()  == ''|| $('#atributo3').val()  == '' || $('#atributo4').val()  == ''|| $('#atributo5').val()  == ''){
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

cancelButton.addEventListener("click", function() {
  modal.classList.toggle("closed");
  modalOverlay.classList.toggle("closed");
});

//MODAL DE CREACIÓN SE LE CAMBIA EL ATRIBUTO ACTION A 'UPDATE' PARA PODER EDITAR UN PRODUCTO


