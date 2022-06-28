var loginButton = document.querySelector("#btn");
$(document).ready( function () {
    $('#btn').attr('type', 'button');
} );




loginButton.addEventListener("click", function() {

    let user = document.getElementById('rut').value;
    let password = document.getElementById('password').value;

    if(user == '' || password == ''){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Ingrese un rut y contraseña',
          })
    }else if(user != '' && password != ''){
        $('#btn').attr('type', 'submit');
    }
});