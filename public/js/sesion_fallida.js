$(document).ready( function () {

    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Inicio de sesion incorrecto',
        timer: 2000
      }).then((result) => {
            location.href="/login";
      });
} );