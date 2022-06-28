const conexion = require("../database/db");


exports.save = (req,res) =>{
    const sku = req.body.sku;
    const desc = req.body.desc;
    const precio_in = req.body.precio_in;
    const precio_ven = req.body.precio_ven;
    const stock = req.body.stock;
    const categoria = req.body.categoria;
    const unidad = req.body.unidad;
    const estado = 1;

    //console.log(`INSERT INTO producto VALUES (${sku}, '${desc}', '${precio_in}', ${precio_ven} , ${stock}, ${categoria})`);
    conexion.query(`INSERT INTO producto VALUES (${sku}, '${desc}', '${precio_in}', ${precio_ven} , ${stock}, ${categoria}, ${unidad}, ${estado})`, (error, results)=>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/producto')
        }
    });
}


exports.update = (req,res) =>{
    const sku = req.body.sku;
    const desc = req.body.desc;
    const precio_in = req.body.precio_in;
    const precio_ven = req.body.precio_ven;
    const stock = req.body.stock;
    const categoria = req.body.categoria;
    const unidad = req.body.unidad;

    conexion.query(`UPDATE producto SET descripcion='${desc}', precio_inversion=${precio_in}, precio_venta=${precio_ven}, stock=${stock}, categoria_idcategoria=${categoria} , fk_id_unidad=${unidad} WHERE sku = ${sku}`, (error, results) =>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/producto')
        }
    })
}
//'2022-04-12'


date = new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    hour = date.getHours();
    minuto = date.getMinutes();
    segundo = date.getSeconds();

exports.save_venta =  (req,res) =>{
    const idusuario = req.body.rut_vendedor;
    const fecha = `${year}-${month}-${day}`;
    const hora = `${hour}:${minuto}:${segundo}`;
    const valorT = req.body.total_venta;
    const tipo_pago = req.body.metodo_pago;
    const pago_venta = req.body.paga_venta;
    const vuelto_venta = req.body.vuelto_venta;

/*
    conexion.query(`INSERT INTO venta (fecha, valorT, tipo_pago ,pago, vuelto, usuario_id) VALUES ('${fecha}', ${valorT} , ${tipo_pago}, ${pago_venta}, ${vuelto_venta}, ${idusuario})`, (error, results) =>{
        if(error){
            console.log(error);
        }
        else{
            //res.redirect('/ventas')
        }
    })*/

    


    const detalle = req.body.result;
    detalle.reverse();
    //console.log(last_id_venta);


    for (let i = 0; i < detalle.length; i=i+4) {
        conexion.query(`INSERT INTO detalle_auxiliar (producto_sku, precio_unitario, cantidad, sub_total, id_venta) VALUES (${detalle[i]}, '${detalle[i+1]}', ${detalle[i+2]}, ${detalle[i+3]}, (SELECT MAX(idventa) FROM venta))`, (error, results) =>{
            if(error){
                console.log(error);
            }
            else{
                
            }
        })

        //BAJAR STOCK
        conexion.query(`CALL SP_ACTUALIZAR_STOCK(${detalle[i]}, ${detalle[i+2]});`, (error, results) =>{
            if(error){
                console.log(error);
            }
            else{
            }
        })
    }

    conexion.query(`CALL SP_INGRESO_VENTA('${fecha}', '${hora}', ${valorT} , ${tipo_pago}, ${pago_venta}, ${vuelto_venta}, ${idusuario})`, (error, results) =>{
        if(error){
            console.log(error);
        }
        else{
            //res.redirect('/ventas')
        }
    })

    res.redirect('/ventas')

   /* conexion.query(`INSERT INTO detalle (producto_sku, descripcion, precio_unitario, cantidad, sub_total, id_venta) VALUES (${detalle[0]}, '${detalle[1]}', ${detalle[2]}, ${detalle[3]}, ${detalle[4]}, (SELECT MAX(idventa) FROM venta))`, (error, results) =>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/ventas')
        }
    })*/

}

//module.exports={save_venta,} ANOTADO