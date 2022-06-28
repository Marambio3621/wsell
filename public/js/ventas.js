const sideMenu = document.querySelector("aside");
const menuBtn = document.querySelector("#menu-btn");
const closeBtn = document.querySelector("#close-btn");
const themeToggler = document.querySelector('#theme-toggler');

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


date = new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDay();
    hora = date.getHours();
    minuto = date.getMinutes();
    segundo = date.getSeconds();


    /* HORA EN  STANDBY
    ESTA PUESTA PERO HAY QUE HACER QUE FUNCIONE AUTOMATICO
    */
function updateClock(){
    hora = date.getHours();
    minuto = date.getMinutes();
    segundo = date.getSeconds();
    document.getElementById("current_date").innerHTML = `FECHA : ${day}/${month}/${year}                    HORA : ${hora}:${minuto}:${segundo}`;

}

setInterval(updateClock,1000);





// CARGAR DATOS DE JSON WEB TOKEN

const nombre_perfil = document.querySelector("#nombre_perfil");
const tipo_perfil = document.querySelector("#tipo_perfil");
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
          document.getElementById("rut_vendedor").value = token.id;
          nombre_perfil.innerHTML = token.nombre + '!';
          if(token.tipo == "v"){
            tipo_perfil.innerHTML = "Vendedor";
            $("#menu_item_index").hide();
            $("#menu_item_producto").hide();
            $("#menu_item_negocio").hide();
            $("#menu_item_usuarios").hide();
            $("#menu_item_informes").hide();
        }else{
            tipo_perfil.innerHTML = "Admin";
        }
      }
  })
}
cargarcookie();




//TABLA DINAMICA
()=>{
  $('#dtDynamicVerticalScrollExample').DataTable({
    "scrollY": "50vh",
    "scrollCollapse": true,
  });
  $('.dataTables_length').addClass('bs-select');
}

//CAR
function cargarSearch(){
  $.ajax({
      url: "/data_search",
      dataSrc: "",
      success(res){
          var producto = $.parseJSON(res);
          let array_producto_sku = [];
          let array_producto_descripcion = [];
          let array_producto_precio_venta = [];
          let array_producto_precio_inversion = [];
          let array_producto_stock = [];
          let array_producto_categoria = [];
          let array_producto_unidad = [];

        for(let i = 0; i < producto.length;i++){
          array_producto_sku[i] = producto[i].sku;
          array_producto_descripcion[i] = producto[i].descripcion
          array_producto_precio_inversion[i] = producto[i].precio_inversion;
          array_producto_precio_venta[i] = producto[i].precio_venta;
          array_producto_stock[i] = producto[i].stock;
          array_producto_categoria[i] = producto[i].categoria_idcategoria;
          array_producto_unidad[i] = producto[i].unidad;
        }

          //let array_producto = Object.values(producto[0]);
          console.log(producto);

          let autoCompleteJS = new autoComplete(// API Advanced Configuration Object
          {
              selector: "#autoComplete",
              placeHolder: "Scanear SKU o buscar producto...",
              data: {
                src: array_producto_descripcion
              },
              resultsList: {
                  element: (list, data) => {
                      if (!data.results.length) {
                          // Create "No Results" message element
                          const message = document.createElement("div");
                          // Add class to the created element
                          message.setAttribute("class", "no_result");
                          // Add message text content
                          //message.innerHTML = `<span>Found No Results for "${data.query}"</span>`;
                          // Append message element to the results list
                          //list.prepend(message);
                      }
                  },
                  noResults: true,
              },
              resultItem: {
                tag: "li",
                class: "autoComplete_result",
                element: (item, data) => {
                    item.setAttribute("data-parent", "food-item");
                },
                highlight: "autoComplete_highlight",
                selected: "autoComplete_selected"
              }
            

              
          });

          document.querySelector("#autoComplete").addEventListener("selection", function (event) {
            // "event.detail" carries the autoComplete.js "feedback" object
            //console.log(event.detail);

            //PERMITE VER DETALLE DE LA SELECCION
            //console.log(event.detail.selection.value);

            //GUARDO EL NOMBRE DE PRODUCTO SELECCIONADO
            let producto_seleccionado = event.detail.selection.value;

            //SACO LA POSICION DEL PRODUCTO SELECCIONADO
            let posicion = array_producto_descripcion.indexOf(producto_seleccionado);
          
            //EL INPUT SE PONE VACIO
            $('#autoComplete').val("").trigger('change');

            cargarProducto(array_producto_sku[posicion],array_producto_descripcion[posicion],array_producto_precio_inversion[posicion],array_producto_precio_venta[posicion],array_producto_stock[posicion],array_producto_categoria[posicion], array_producto_unidad[posicion],posicion);
           /* $('#producto_lista').prepend(`<tr class="lista_elemento">
            <td>${array_producto_descripcion[posicion]}</td>
            <td>${array_producto_precio_venta[posicion]}</td>
            <td>1</td>
            <td>${ 1 * array_producto_precio_venta[posicion]}</td>
            <td>
              <button style="background: none;" class="eliminar_elemento"><span class="material-icons-sharp" style="color: var(--color-danger);">delete</span></button>
            </td>
            </tr>`)
            $('#autoComplete').focus();*/

          });

          $(document).on('click', '.eliminar_elemento', function(e){
            e.preventDefault();
            let row_item = $(this).parent().parent();
            $(row_item).remove();
            actualizarVenta();
          })

          $(document).on('click', '.aumentar_cantidad', function(e){
            console.log("deberia AUMENTAR Xd")
            let row = $(this).parents();
            let input = row[1].cells[3].children[0].value;
            input++;
            row[1].cells[3].children[0].value = input;
            row[1].children[4].children[0].value = parseInt(input) * parseInt(row[1].cells[2].innerHTML);
            actualizarVenta();
          })

          $(document).on('click', '.disminuir_cantidad', function(e){
            console.log("deberia disminuir Xd")
            console.log("deberia AUMENTAR Xd")
            let row = $(this).parents();
            let input = row[1].cells[3].children[0].value;
            input--;
            if(input <= 0){
              input = 1;
            }
            row[1].cells[3].children[0].value = input;
            row[1].children[4].children[0].value = parseInt(input) * parseInt(row[1].cells[2].innerHTML);
            actualizarVenta();
          })

           
      }
  })
  

}
cargarSearch();





function cargarSKU(){
  $.ajax({
    url: "/data_search",
    dataSrc: "",
    success(res){
        var producto = $.parseJSON(res);
        let array_producto_sku = [];
        let array_producto_descripcion = [];
        let array_producto_precio_venta = [];
        let array_producto_precio_inversion = [];
        let array_producto_stock = [];
        let array_producto_categoria = [];
        let array_producto_unidad = [];

      for(let i = 0; i < producto.length;i++){
        array_producto_sku[i] = producto[i].sku;
        array_producto_descripcion[i] = producto[i].descripcion
        array_producto_precio_inversion[i] = producto[i].precio_inversion;
        array_producto_precio_venta[i] = producto[i].precio_venta;
        array_producto_stock[i] = producto[i].stock;
        array_producto_categoria[i] = producto[i].categoria;
        array_producto_unidad[i] = producto[i].unidad;
      }

      let valor_sku = $("#autoComplete").val();


      if(array_producto_sku.includes(parseInt(valor_sku))){
        let posicion = array_producto_sku.indexOf(parseInt(valor_sku));
        cargarProducto(array_producto_sku[posicion],array_producto_descripcion[posicion],array_producto_precio_inversion[posicion],array_producto_precio_venta[posicion],array_producto_stock[posicion],array_producto_categoria[posicion], array_producto_unidad[posicion],posicion);
       /* $('#producto_lista').prepend(`<tr class="lista_elemento">
        <td>${array_producto_descripcion[posicion]}</td>
        <td>${array_producto_precio_venta[posicion]}</td>
        <td>1</td>
        <td>${ 1 * array_producto_precio_venta[posicion]}</td>
        <td>
            <button style="background: none;" class="eliminar_elemento"><span class="material-icons-sharp" style="color: var(--color-danger);">delete</span></button>
        </td>
        </tr>`)
        $('#autoComplete').val("").trigger('change');
        $('#autoComplete').focus();*/

        /* event listener */
      }else{
        sku_not_found()
      }
         
    }
})
}

// SI PRESIONA ENTER EN EL SEARCH
let search_input = document.querySelector('input');
search_input.addEventListener('keyup', (e)=>{
  if(e.keyCode === 13){
    cargarSKU();
  }
})

//SKU NO ENCONTRADO CON LA LIBRERIA SWEETALERT.JS
function sku_not_found(){
  Swal.fire({
      title: 'SKU NO ENCONTRADO',
      icon: 'warning',
      confirmButtonColor: 'var(--color-primary)',
      confirmButtonText: 'Confirmar',
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {

      }
    })
}


//BOTON CANCELAR VENTA
function cancelar_venta(){
  $(".lista_elemento").remove();
  $('#autoComplete').val("").trigger('change');
}


//CARGAR PRODUCTO
function cargarProducto(sku,descripcion,precio_inversion,precio_venta,stock, id_categoria, unidad){
  let cantidad = 1;
  console.log(unidad);
  if(unidad != "pesable"){
        $('#producto_lista').prepend(`<tr class="lista_elemento">
        <td>${sku}</td>
        <td>${descripcion}</td>
        <td>${precio_venta}</td>
        <td style="display:flex; justify-content: center">
            <input class="cantidad_producto" style="width: 2rem; text-align:center;background-color:rgba(0, 0, 0, 0.03); color:var(--color-dark) ;border-radius:5px;" type="text" value="${cantidad}" name="input_cantidad" id="input_cantidad"></input>
            <button style="background: none;" class="aumentar_cantidad"><span class="material-icons-sharp" style="color: var(--color-primary);">add_circle_outline</span></button>
            <button style="background: none;" class="disminuir_cantidad"><span class="material-icons-sharp" style="color: var(--color-warning);">remove_circle_outline</span></button>
        </td>

        <td id="sub_total">
            <input disabled class="sub_total" style="font-color: var(--color-light);width: 4rem;text-align:center;color:var(--color-dark); background-color: var(--color-white); border-radius:5px;" type="text" value="${cantidad * precio_venta}" name="input_cantidad" id="sub_total"></input>
        </td>
        
        <td>
            <button style="background: none;" class="eliminar_elemento"><span class="material-icons-sharp" style="color: var(--color-danger);">delete</span></button>
        </td>
        </tr>`)
        $('#autoComplete').val("").trigger('change');
        $('#autoComplete').focus();
        $("#input_cantidad").on("change keyup paste", function(){
              cantidad = $("#input_cantidad").val();
              if($("#input_cantidad").val() != ""){
                  let row = $(this).parents();
                  let input = row[1].cells[3].children[0].value;
      
                if(input <= 0) {
                  input = 1;
                  //MODIFICO EL SUBTOTAL Y multiplico PRECIO VENTA * LA CANTIDAD DEFINIDA POR EL USUARIO
                  row[1].children[4].children[0].value = parseInt(input) * parseInt(precio_venta);
                  row[1].cells[3].children[0].value = input;
                }else{
                  console.log(row[1].children[4].children[0].value);
                  row[1].children[4].children[0].value = parseInt(input) * parseInt(precio_venta);
                }
                
                //console.log(parseInt(input) * parseInt(precio_venta) + "PROBANDO")
              }
              //let collection = document.getElementsByClassName("cantidad_producto");
              //console.log(row);
      //        let valor = collection[0].value;
              //console.log(collection);
              actualizarVenta();
        })
      
        actualizarVenta();
  }else{
        $('#producto_lista').prepend(`<tr class="lista_elemento">
        <td>${sku}</td>
        <td>${descripcion}</td>
        <td>${precio_venta}</td>
        <td style="display:flex; justify-content: center">
            <input disabled class="cantidad_producto" style="width: 3rem; color:var(--color-dark);text-align:center;background-color: var(--color-white); border-radius:5px;" type="text" value="${cantidad}" name="input_cantidad" id="input_cantidad"></input>
        </td>
        <td id="sub_total">
            <input class="sub_total_pesable" style="width: 4rem; text-align:center;color:var(--color-dark);background-color:rgba(0, 0, 0, 0.03);height:100%; border-radius:5px;" type="text" placeholder="${precio_venta}" name="input_cantidad" id="input_precio"></input>
        <td>
            <button style="background: none; color:var(--color-dark);" class="eliminar_elemento"><span class="material-icons-sharp" style="color: var(--color-danger);">delete</span></button>
        </td>
        </tr>`)
        $('#autoComplete').val("").trigger('change');
        $('#input_precio').focus();
        $("#input_precio").on("change keyup paste", function(){
              if($("#input_precio").val() != ""){
                  let row = $(this).parents();
                  let input = row[1].cells[3].children[0].value;
                  let input_precio = row[1].cells[4].children[0].value;
                  console.log(input_precio)
                  console.log(input);
      
                if(input_precio <= 0) {
                  input_precio = "";
                  //MODIFICO EL SUBTOTAL Y multiplico PRECIO VENTA * LA CANTIDAD DEFINIDA POR EL USUARIO
                  row[1].cells[4].children[0].value = input_precio;
                  row[1].cells[3].children[0].value = 1;
                }else{
                  row[1].cells[3].children[0].value = (parseInt(input_precio)/parseInt(precio_venta)).toFixed(2);
                }
                
                //console.log(parseInt(input) * parseInt(precio_venta) + "PROBANDO")
              }
              //let collection = document.getElementsByClassName("cantidad_producto");
              //console.log(row);
      //        let valor = collection[0].value;
              //console.log(collection);
              actualizarVenta();
        })
      
        actualizarVenta();
  }
  
}



function cargarNumVenta(){

  $.ajax({
      url: "/obtener_num_venta",
      dataSrc: "",
      success(res){
          var venta = $.parseJSON(res);
          console.log(venta)
          $("#num_venta").text(`N° de venta: ${venta[0].num_venta}`)

      }
  })
}

cargarNumVenta();




// DEJAR LOS INPUTS SOLAMENTE EN MODO LECTURA
document.getElementById('total_venta').readOnly = true;
document.getElementById('vuelto_venta').readOnly = true;

//ACUMULADOR TOTAL DE VENTA

//ACTUALIZAR INFORMACION VENTA
function actualizarVenta(){
  totalVenta = 0;
  if(document.getElementsByClassName("sub_total").length == 0 && document.getElementsByClassName("sub_total_pesable").length == 0){
    $('#total_venta').val(totalVenta);
  }
  else{
    const collection = document.getElementsByClassName("sub_total");
    const collection_2 = document.getElementsByClassName("sub_total_pesable");
    console.log(collection);
    for(let i = 0; i< collection_2.length;i++){
      totalVenta = totalVenta + parseInt(collection_2[i].value);
      }
    for(let i = 0; i< collection.length;i++){
      console.log(collection[i].innerHTML);
    totalVenta = totalVenta + parseInt(collection[i].value);
    }
    console.log(totalVenta)
    $('#total_venta').val(totalVenta);
    console.log(totalVenta)
  }
  
}

//Generar Vuelto
$("#paga_venta").on("change keyup paste", function(){
    let vuelto = parseInt($("#vuelto_venta").val());
    vuelto = parseInt($('#paga_venta').val()) - parseInt($('#total_venta').val());
    $('#vuelto_venta').val(vuelto)
})


var array_detalle_venta = []
//generar arreglo de detalle de venta
function añadir_detalle_venta(){
  //array_detalle_venta = ["tomate",1000,3,3000];
  
  let detalles = $("#producto_lista").parents();
  console.log(detalles)


  /*let row = $(this).parents();
            let input = row[1].cells[3].children[0].value;
            input++;
            row[1].cells[3].children[0].value = input;
            row[1].children[4].innerHTML = parseInt(input) * parseInt(row[1].cells[2].innerHTML);
            actualizarVenta();*/
  
  let cantidad_rows = detalles[0].children[1].children.length;
  let cantidad_elementos = 0;
  for (let i = 0; i < cantidad_rows; i++) {
      for (let j = 0; j < detalles[0].children[1].children[i].children.length - 1; j++) {
        if(j == 1){
          // AQUI SE ENCUENTRA EN LA DESCRIPCION DEL PRODUCTO POR LO TANTO SE DEBE HACER NADA
          // YA QUE NO NECESITO LA DESCRIPCION DEL PRODUCTO 
        }else if(j == 3){
          //console.log(detalles[0].children[1].children[i].children[j].children[0].value);
          // ingreso A LOS ROWS DE LOS DETALLES Y OBTENGO el valor del input CANTIDAD
          array_detalle_venta[cantidad_elementos] = detalles[0].children[1].children[i].children[j].children[0].value;
          cantidad_elementos++;
        }
        else if(j == 4){
          //console.log(detalles[0].children[1].children[i].children[j].children[0].value);
          // ingreso A LOS ROWS DE LOS DETALLES Y OBTENGO el valor del input CANTIDAD
          array_detalle_venta[cantidad_elementos] = detalles[0].children[1].children[i].children[j].children[0].value;
          cantidad_elementos++;
        }else{
          // ingreso A LOS ROWS DE LOS DETALLES Y OBTENGO SUS VALORES A TRAVES DEL INNERHTML
          array_detalle_venta[cantidad_elementos] = detalles[0].children[1].children[i].children[j].innerText;
          cantidad_elementos++;
        }
      }
  }
  console.log(array_detalle_venta)
  

  array_detalle_venta.forEach(element => {
    $('#informacion_venta').prepend(`
    <input type="hidden" name="result" value=${element}>`)
  });
}


// CONTROLAR LO QUE SUCEDE CUANDO EL TIPO DE PAGO CAMBIA
  $('input[type=radio][name="metodo_pago"]').on('change', function() {
    if(document.getElementById('efectivo').checked){
      var metodo_pago_change = document.getElementById("efectivo").value;
    }else{
      var metodo_pago_change = document.getElementById("tarjeta").value;
    }

    if(metodo_pago_change == 2){
      $("#div_venta").hide();
      $("#div_vuelto").hide();
      $("#vuelto_venta").val(0);
      $("#paga_venta").val($("#total_venta").val());

    }else{
      $("#div_venta").show();
      $("#div_vuelto").show();
    }
  });



//detalle_venta();
$("#btn_submit").click( ()=>{

  let pago = document.querySelector("#paga_venta").value;
  let total_venta = document.querySelector("#total_venta").value;

  if(document.getElementById('efectivo').checked){
    var metodo_pago = document.getElementById("efectivo").value;
  }else{
    var metodo_pago = document.getElementById("tarjeta").value;
  }
  

  if(metodo_pago == 1){
    if(parseInt(pago) < parseInt(total_venta) || pago == ""){
      Swal.fire({
        title: 'PAGO INCORRECTO',
        icon: 'warning',
        confirmButtonColor: 'var(--color-primary)',
        confirmButtonText: 'Confirmar',
      })
    }else if(total_venta== 0){
      Swal.fire({
        title: 'No hay productos agregado',
        icon: 'warning',
        confirmButtonColor: 'var(--color-primary)',
        confirmButtonText: 'Confirmar',
      })
    }else{
      añadir_detalle_venta();
      $('#btn_submit').attr('type', 'submit');
    }
  }else{
    if(total_venta == 0){
      Swal.fire({
        title: 'No hay productos agregado',
        icon: 'warning',
        confirmButtonColor: 'var(--color-primary)',
        confirmButtonText: 'Confirmar',
      })
    }else{
      Swal.fire({
        title: 'Realizado',
        icon: 'success',
        confirmButtonColor: 'var(--color-primary)',
        confirmButtonText: 'Confirmar',
      })
      añadir_detalle_venta();
      $('#btn_submit').attr('type', 'submit');
    }
  }
})


//var producto_array = Object.values(producto);


// CDN AUTOCOMPLETE CONFIGURATION

/*ajax: {
  url : "/data",
  dataSrc : ''
},
columns:[
  {data: "sku"},
  {data: "descripcion"},
  {data: "precio_inversion"},
  {data: "precio_venta"},
  {data: "stock"},
  {data: "categoria_idcategoria"},
  {data: null,
      "render": function(data){
          return `<a onclick="editar_modal(${data.sku},'${data.descripcion}','${data.precio_inversion}',${data.precio_venta},${data.stock},${data.categoria_idcategoria})"><span class="material-icons-sharp action_item" id="edit_button">edit</span></a> <a onclick="confirmar(${data.sku})"><span class="material-icons-sharp action_item eliminar_button">delete</span></a>`
      }
  }
],*/
  






/* COLLAPSE MENU   */
const linkCollapse = document.getElementsByClassName('collapse_link');
for (let i = 0; i < linkCollapse.length; i++) {
    console.log(linkCollapse[i]);
    linkCollapse[i].addEventListener('click', function(){
        const collapseMenu = this.nextElementSibling; 
        collapseMenu.classList.toggle('showCollapse')
    } )
}


