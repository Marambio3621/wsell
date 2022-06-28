const express = require('express');
const router = express.Router();

const { obtenerInforme1 } = require('../controllers/informes')

const conexion = require('../database/db');

date = new Date();
year = date.getFullYear();
month = date.getMonth() + 1;
day = date.getDate();
hora = date.getHours();
minuto = date.getMinutes();
segundo = date.getSeconds();


/* TODO ESTO SE PUEDE HACER CON EL TEMPLATE ENGINE .EJS */

//RUTA PARA MOSTRAR REGISTROS
/*router.get('/',(req, res)=>{
    conexion.query('SELECT * FROM producto', (error, results) =>{
        if(error){
            throw error;
        }else{
            res.render('index', {results:results});
        }
    })
});*/


//RUTA PARA INSERTAR REGISTROS
/*router.get('../public/html/producto.html', (req,res)=>{
    res.render('');
})*/


//RUTA PARA EDITAR REGISTROS
/*router.get('/edit/:id', (req,res)=>{
    const id = req.params.id;
    conexion.query(`SELECT * FROM producto WHERE sku = ${id}`, (error, results) =>{
        if(error){
            throw error;
        }else{
            res.render('../views/edit.ejs', {producto:results[0]});
        }
    })
})*/

//RUTA PARA MOSTRAR VENTAS CON AJAX - PARA LA PESTAÑA INDEX.HTML (DEL DIA CORRESPONDIENTE)
router.get('/ventas_recientes_index/:fecha',(req, res)=>{
    const fecha = req.params.fecha;
    conexion.query(`SELECT idventa, fecha, FORMAT(valorT, 0, 'de_DE') as valorT, (CASE tipo_pago 
        WHEN 1 THEN 'Efectivo'
        WHEN 2 THEN 'Tarjeta' 
        END) AS tipo_pago FROM venta WHERE fecha ='${fecha}' ORDER BY idventa ASC LIMIT 8;`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})

//RUTA PARA MOSTRAR TOTAL INGRESOS DEL DIA PARA INDEX.HTML (DEL DIA CORRESPONDIENTE)
router.get('/vendido_dia/:fecha1/:fecha2',(req, res)=>{
    const fecha_actual = req.params.fecha1;
    const fecha_anterior = req.params.fecha2;
    conexion.query(`SELECT 
	SUM(valorT) AS total_vendido,
    ROUND(SUM(valorT) * 100 / (SELECT SUM(valorT) FROM venta WHERE fecha = '${fecha_anterior}') - 100) AS porcentaje_ingresos
FROM venta 
WHERE fecha ='${fecha_actual}' 
GROUP BY fecha;`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})


//RUTA PARA MOSTRAR VENTAS CON AJAX - PARA LA PESTAÑA INDEX.HTML (DEL DIA CORRESPONDIENTE)
router.get('/ventas_index/:fecha',(req, res)=>{
    const fecha = req.params.fecha;
    conexion.query(`SELECT idventa, fecha, FORMAT(valorT, 0, 'de_DE') AS valorT, (CASE tipo_pago 
                                                    WHEN 1 THEN 'Efectivo'
                                                    WHEN 2 THEN 'Tarjeta' 
                                                    END) AS tipo_pago FROM venta WHERE fecha ='${fecha}' ORDER BY idventa ASC;`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})

//RUTA PARA MOSTRAR DATOS EN EL GRAFICO TOP 5 CANTIDAD DE PRODUCTOS VENDIDOS EN EL INDEX
router.get('/index/cantidad_productos/:fecha',(req, res)=>{
    const fecha = req.params.fecha;
    conexion.query(`SELECT count(producto_sku) as count_sku, (SELECT descripcion FROM producto WHERE sku = producto_sku) AS descripcion 
                FROM detalle
                INNER JOIN venta AS v ON v.idventa =  id_venta
                WHERE v.fecha = '${fecha}'
                GROUP BY producto_sku ORDER BY count_sku DESC LIMIT 5;`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})

//RUTA PARA MOSTRAR VENTAS CON AJAX ENTRE UN RANGO DE FECHA
router.get('/ventas_range/:fecha1/:fecha2',(req, res)=>{
    const fecha1 = req.params.fecha1;
    const fecha2 = req.params.fecha2;
    conexion.query(`SELECT idventa, fecha, FORMAT(valorT, 0, 'de_DE') AS valorT, (CASE tipo_pago 
                                                    WHEN 1 THEN 'Efectivo'
                                                    WHEN 2 THEN 'Tarjeta' 
                                                    END) AS tipo_pago
                FROM venta WHERE fecha >='${fecha1}' AND fecha <='${fecha2}' ORDER BY idventa ASC`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})



//RUTA PARA ELIMINAR PRODUCTOS
router.get('/delete/:id', (req,res)=>{
    const id = req.params.id;
    conexion.query(`DELETE FROM producto WHERE sku = ${id}`, (error, results) =>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/producto')
        }
    })
})


//RUTA PARA CAMBIAR ESTADO DE PRODUCTOS
router.get('/actualizar_estado_producto/:sku/:estado', (req,res)=>{
    const sku = req.params.sku;
    const estado = req.params.estado;
    console.log(sku,estado);
    conexion.query(`UPDATE producto SET estado=${estado} WHERE sku = ${sku}`, (error, results) =>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/producto')
        }
    })
})


//RUTA PARA MOSTRAR PRODUCTOS CON AJAX - PARA LA PESTAÑA PRODUCTO.HTML
router.get('/data',(req, res)=>{
    conexion.query('SELECT sku, descripcion, precio_inversion, precio_venta, stock, (SELECT descripcion FROM categoria WHERE idcategoria = categoria_idcategoria) AS categoria, (SELECT descripcion FROM unidad WHERE id = fk_id_unidad) AS unidad, estado FROM producto', (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})

//RUTA PARA MOSTRAR PRODUCTOS CON AJAX - PARA LA PESTAÑA PRODUCTO.HTML
router.get('/data_search',(req, res)=>{
    conexion.query('SELECT sku, descripcion, precio_inversion, precio_venta, stock, (SELECT descripcion FROM categoria WHERE idcategoria = categoria_idcategoria) AS categoria, (SELECT descripcion FROM unidad WHERE id = fk_id_unidad) AS unidad, estado FROM producto WHERE estado = 1;', (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})


//RUTA PARA CARGAR CATEGORIAS CON AJAX
router.get('/categoria',(req, res)=>{
    conexion.query('SELECT * FROM categoria', (error, results) =>{
        if(error){
            throw error;
        }else{
            categoria = JSON.stringify(results);
            res.send(categoria);
        }
    })  
})

//RUTA PARA CARGAR UNIDADES CON AJAX
router.get('/unidad',(req, res)=>{
    conexion.query('SELECT * FROM unidad', (error, results) =>{
        if(error){
            throw error;
        }else{
            categoria = JSON.stringify(results);
            res.send(categoria);
        }
    })  
})



// RUTAS PARA INFORMES 

//RUTA PARA MOSTRAR DATOS EN EL GRAFICO DE INGRESOS OBTENIDOS DEL AÑO
router.get('/informes/ingresos/:year',(req, res)=>{
    const año = req.params.year;
    conexion.query(`SELECT valor_total, month FROM vista_ingresos_obtenidos WHERE fecha > '${año}-01-01' AND fecha < '${año}-12-31'`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})

//RUTA PARA MOSTRAR DATOS EN EL GRAFICO GANANCIAS REALIZADAS DEL AÑO
router.get('/informes/ganancia_ventas/:year',(req, res)=>{
    const año = req.params.year;
    conexion.query(`SELECT ganancia, month FROM vista_ganancias_obtenidas WHERE fecha > '${año}-01-01' AND fecha < '${año}-12-31' order by month;`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})

//RUTA PARA MOSTRAR INVERTIDO EN EL DIA INDEX.HTML
router.get('/invertido_dia/:fecha_actual/:fecha_anterior',(req, res)=>{
    const fecha_actual = req.params.fecha_actual;
    const fecha_anterior = req.params.fecha_anterior;
    conexion.query(`SELECT 
    SUM(precio_inversion * cantidad) as invertido,
    DAY(fecha) as day,
    ROUND(SUM(precio_inversion * cantidad) * 100 / (SELECT SUM(precio_inversion * cantidad) FROM detalle INNER JOIN venta as venta on venta.idventa = detalle.id_venta INNER JOIN producto as producto on producto.sku = detalle.producto_sku WHERE fecha = '${fecha_anterior}') - 100) AS porcentaje_invertido
    FROM detalle as detalle 
    INNER JOIN venta as venta on venta.idventa = detalle.id_venta 
    INNER JOIN producto as producto on producto.sku = detalle.producto_sku
    WHERE fecha = '${fecha_actual}';`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})

//RUTA PARA MOSTRAR PORCENTAJE GANANCIAS EN EL DIA INDEX.HTML
router.get('/ganancias_dia/:fecha_actual/:fecha_anterior',(req, res)=>{
    const fecha_actual = req.params.fecha_actual;
    const fecha_anterior = req.params.fecha_anterior;
    conexion.query(`SELECT
	SUM(sub_total - (precio_inversion * cantidad)) AS ganancia,
    ROUND(SUM(sub_total - (precio_inversion * cantidad)) * 100 / (SELECT SUM(sub_total - (precio_inversion * cantidad)) FROM detalle JOIN venta ON idventa = id_venta
	JOIN producto ON sku = producto_sku WHERE fecha = '${fecha_anterior}') - 100) AS porcentaje_ganancia,
	fecha AS fecha
FROM detalle
JOIN venta ON idventa = id_venta
JOIN producto ON sku = producto_sku
where fecha = '${fecha_actual}'`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})

//RUTA PARA MOSTRAR DATOS EN EL GRAFICO INGRESOS POR VENDEDORES EN EL AÑO
router.get('/informes/ingresos_vendedor/:year',(req, res)=>{
    const año = req.params.year;
    conexion.query(`SELECT nombre, ingresos FROM vista_ingresos_vendedores WHERE fecha > '${año}-01-01' AND fecha < '${año}-12-31' order by ingresos;`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})


//RUTA PARA MOSTRAR DATOS EN EL GRAFICO TOP 10 CANTIDAD DE PRODUCTOS VENDIDOS 
router.get('/informes/cantidad_productos/:year',(req, res)=>{
    const año = req.params.year;
    conexion.query(`SELECT count_sku, descripcion FROM vista_cantidad_productos_vendidos WHERE fecha > '${año}-01-01' AND fecha < '${año}-12-31' LIMIT 10;`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})


//RUTA PARA MOSTRAR DATOS EN EL GRAFICO EFECTIVO VS TARJETA
router.get('/informes/efectivo_tarjeta/:year',(req, res)=>{
    const año = req.params.year;
    conexion.query(`SELECT tipo_pago, porcentaje_tipo_pago FROM vista_tarjeta_vs_efectivo WHERE año = ${año};`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})

//RUTA PARA MOSTRAR DATOS EN EL GRAFICO CANTIDAD VENTAS REALIZADAS DEL AÑO
router.get('/informes/cantidad_ventas/:year',(req, res)=>{
    const año = req.params.year;
    conexion.query(`SELECT cantidad_venta, month FROM vista_cantidad_ventas WHERE año = ${año} order by month;`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})

// FIN -- RUTA INFORMES

//RUTA PARA MOSTRAR TODAS LAS CATEGORIAS DE LA BASE DE DATOS
router.get('/producto/lista_categoria',(req, res)=>{
    conexion.query(`SELECT * FROM categoria`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})

//RUTA PARA MOSTRAR TODAS LAS UNIDADES DE LA BASE DE DATOS
router.get('/producto/lista_unidad',(req, res)=>{
    conexion.query(`SELECT * FROM unidad`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})



//RUTA PARA MOSTRAR TODAS LOS USUARIOS DE LA BASE DE DATOS
router.get('/usuarios/lista_usuarios',(req, res)=>{
    conexion.query(`SELECT * FROM usuario`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})

//OBTENGO COOKIE PARA EL JWT
router.get('/getcookie', function (req, res) {
    res.send(req.cookies);
})

//OBTENGO DATOS DE LA TABLA NEGOCIO
router.get('/negocio/dato_negocio',(req, res)=>{
    conexion.query(`SELECT * FROM negocio LIMIT 1`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})


//OBTENGO CANTIDAD DE VENDEDORES
router.get('/numVendedor',(req, res)=>{
    conexion.query(`SELECT count(idusuario) AS cantidad_vendedores FROM usuario`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})

//EDIT NEGOCIO
router.post('/config_negocio',(req, res)=>{
    const rut = req.body.atributo0;
    const descripcion = req.body.descripcion;
    const telefono = req.body.telefono;
    const direccion = req.body.direccion;
    const razon_social = req.body.razon_social;
    const correo = req.body.correo; 

    conexion.query(`UPDATE negocio SET descripcion='${descripcion}', telefono='${telefono}' ,direccion='${direccion}' ,razon_social='${razon_social}' ,correo='${correo}'  WHERE rut_negocio = ${rut}`, (error, results) =>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/negocio')
        }
    })
})


//DETALLE VENTAS
router.get('/detalle_venta/:idventa',(req, res)=>{
    const idventa = req.params.idventa;
    conexion.query(`SELECT 
                    (SELECT descripcion FROM producto WHERE sku = d.producto_sku) AS descripcion, 
                    FORMAT(d.precio_unitario, 0, 'de_DE') AS precio_unitario, 
                    d.cantidad AS cantidad, 
                    FORMAT(d.sub_total, 0, 'de_DE') AS sub_total FROM detalle as d
                INNER JOIN venta AS v ON v.idventa = d.id_venta
                WHERE d.id_venta = ${idventa};`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})



//FALTA HACERLA VISTA - ES VENTA + USUARIO
router.get('/detalle_venta_usuario/:idventa',(req, res)=>{
    const idventa = req.params.idventa;
    conexion.query(`SELECT 
                        nombre, 
                        apellido_paterno,
                        CONCAT( DATE_FORMAT(fecha, '%d-%m-%Y') , ' a las ',  DATE_FORMAT(hora, '%H:%i'))  AS fecha, 
                        (CASE tipo_pago 
                            WHEN 1 THEN 'Efectivo'
                            WHEN 2 THEN 'Tarjeta' 
                        END) AS tipo_pago,
                        FORMAT(valorT, 0, 'de_DE') AS total_venta,
                        FORMAT(pago, 0, 'de_DE') AS pago,
                        FORMAT(vuelto, 0, 'de_DE') AS vuelto
                        FROM usuario
                    INNER JOIN venta ON usuario_id =  idusuario
                    WHERE idventa = ${idventa};`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})

//OBTENER NUM DE ULTIMA VENTA
router.get('/obtener_num_venta',(req, res)=>{
    conexion.query(`SELECT MAX(idventa) + 1 AS num_venta FROM venta`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})


// RESUMEN DE ANALISIS DEL INDEX

//CANTIDAD VENTAS REALIZADAS DEL DIA
router.get('/index_ventas_realizadas/:fecha_actual/:fecha_anterior',(req, res)=>{
    const fecha_actual = req.params.fecha_actual;
    const fecha_anterior = req.params.fecha_anterior;
    conexion.query(`SELECT 
	count(idventa) AS ventas_del_dia,
    ROUND(count(idventa) * 100 / (SELECT count(idventa) FROM venta WHERE fecha = '${fecha_anterior}') - 100) AS porcentaje_ventas_realizadas
FROM venta WHERE fecha = '${fecha_actual}';`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})


//CANTIDAD PRODUCTOS VENDIDOS DEL DIA
router.get('/index_productos_vendidos/:fecha_actual/:fecha_anterior',(req, res)=>{
    const fecha_actual = req.params.fecha_actual;
    const fecha_anterior = req.params.fecha_anterior;
    conexion.query(`SELECT 
	count(producto_sku) AS cantidad_producto,
    ROUND(count(producto_sku) * 100 / (SELECT count(producto_sku) FROM detalle INNER JOIN venta ON idventa = id_venta WHERE fecha = '${fecha_anterior}') - 100) AS porcentaje_productos_vendidos
FROM detalle 
INNER JOIN venta ON idventa = id_venta
WHERE fecha = '${fecha_actual}';`, (error, results) =>{
        if(error){
            throw error;
        }else{
            data = JSON.stringify(results);
            res.send(data);
        }
    })  
})







//VENTAS
const {save, update, save_venta} = require('../controllers/crud');
router.post('/save', save)
router.post('/update', update)
router.post('/save_venta',save_venta)

//USUARIOS
const {register, login, logout, updateUsuario, updateContrasena, deleteUsuario,resetPassword, update_estado_usuario} = require('../controllers/authController');
router.post('/register', register);
router.post('/login', login);
router.post('/updateUsuario', updateUsuario);
router.post('/updateContrasena', updateContrasena);
router.get('/logout', logout);
router.get('/deleteUsuario/:id', deleteUsuario);
router.get('/resetPassword/:id', resetPassword);
router.get('/usuarios/update_estado_usuario/:rut/:estado', update_estado_usuario);

//UNIDAD
const {save_unidad, update_unidad, update_estado_unidad, deleteUnidad} = require('../controllers/crud_unidad');
router.post('/producto/save_unidad', save_unidad);
router.post('/producto/update_unidad', update_unidad);
router.get('/producto/update_estado_unidad/:id/:estado',update_estado_unidad);
router.get('/producto/deleteUnidad/:id',deleteUnidad);

//CATEGORIA
const {save_categoria, update_categoria, update_estado_categoria, deleteCategoria} = require('../controllers/crud_categoria');
router.post('/producto/save_categoria', save_categoria);
router.post('/producto/update_categoria', update_categoria);
router.get('/producto/update_estado_categoria/:id/:estado',update_estado_categoria);
router.get('/producto/deleteCategoria/:id',deleteCategoria);


module.exports = router;