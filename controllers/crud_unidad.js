const conexion = require("../database/db");


exports.save_unidad = (req,res) =>{
    const descripcion = req.body.descripcion;
    const estado = 1; // ACTIVO

    //console.log(`INSERT INTO producto VALUES (${sku}, '${desc}', '${precio_in}', ${precio_ven} , ${stock}, ${categoria})`);
    conexion.query(`INSERT INTO unidad (descripcion, estado) VALUES ('${descripcion}', ${estado})`, (error, results)=>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/producto/unidad')
        }
    });
}

exports.update_unidad = (req,res) =>{
    const id = req.body.id;
    const descripcion = req.body.descripcion;

    conexion.query(`UPDATE unidad SET descripcion='${descripcion}' WHERE id = ${id}`, (error, results) =>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/producto/unidad')
        }
    })
}

//RUTA PARA CAMBIAR ESTADO DE UNIDADES
exports.update_estado_unidad = (req,res)=>{
    const id = req.params.id;
    const estado = req.params.estado;
    conexion.query(`UPDATE unidad SET estado=${estado} WHERE id = ${id}`, (error, results) =>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/producto/unidad')
        }
    })
}

//RUTA PARA ELIMINAR PRODUCTOS
exports.deleteUnidad = (req,res)=>{
    const id = req.params.id;
    conexion.query(`DELETE FROM unidad WHERE id = ${id}`, (error, results) =>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/producto/unidad')
        }
    })
}