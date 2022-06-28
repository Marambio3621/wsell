

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
                $("#menu_item_index").hide();
                $("#menu_item_producto").hide();
                $("#menu_item_negocio").hide();
                $("#menu_item_usuarios").hide();
                $("#menu_item_informes").hide();
            }
        }
    })


    //CERRAR MODAL AL INICIAR
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
            document.getElementById("rut").value = token.id;
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

var btn_confirmar = document.querySelector("#btn_submit");


btn_confirmar.addEventListener("click", function() {
    if($("#contraseña").val() == "" && $("#contraseña_reingresada").val() == ""){
        Swal.fire({
            title: 'Contraseña no puede ser vacia',
            icon: 'warning',
            confirmButtonColor: 'var(--color-primary)',
            confirmButtonText: 'Confirmar',
          })
    }
    else if($("#contraseña").val() != $("#contraseña_reingresada").val()){
        Swal.fire({
            title: 'La contraseñas ingresadas no son iguales',
            icon: 'warning',
            confirmButtonColor: 'var(--color-primary)',
            confirmButtonText: 'Confirmar',
          })
    }
    else if($("#contraseña").val().length < 8){
        Swal.fire({
            title: 'La contraseñas debe tener 8 digitos',
            icon: 'warning',
            confirmButtonColor: 'var(--color-primary)',
            confirmButtonText: 'Confirmar',
          })
    }
    if($("#contraseña").val() == $("#contraseña_reingresada").val() && $("#contraseña").val().length >= 8){
        $('#btn_submit').attr('type', 'submit');
    }
});



