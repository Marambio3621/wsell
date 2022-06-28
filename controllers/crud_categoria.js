const conexion = require("../database/db");


exports.save_categoria = (req,res) =>{
    const descripcion = req.body.descripcion;
    const estado = 1; // ACTIVO

    //console.log(`INSERT INTO producto VALUES (${sku}, '${desc}', '${precio_in}', ${precio_ven} , ${stock}, ${categoria})`);
    conexion.query(`INSERT INTO categoria (descripcion, estado) VALUES ('${descripcion}', ${estado})`, (error, results)=>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/producto/categoria')
        }
    });
}

exports.update_categoria = (req,res) =>{
    const id = req.body.id;
    const descripcion = req.body.descripcion;

    conexion.query(`UPDATE categoria SET descripcion='${descripcion}' WHERE idcategoria = ${id}`, (error, results) =>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/producto/categoria')
        }
    })
}

//RUTA PARA CAMBIAR ESTADO DE UNIDADES
exports.update_estado_categoria = (req,res)=>{
    const id = req.params.id;
    const estado = req.params.estado;
    conexion.query(`UPDATE categoria SET estado=${estado} WHERE idcategoria = ${id}`, (error, results) =>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/producto/categoria')
        }
    })
}

//RUTA PARA ELIMINAR PRODUCTOS
exports.deleteCategoria = (req,res)=>{
    const id = req.params.id;
    conexion.query(`DELETE FROM categoria WHERE idcategoria = ${id}`, (error, results) =>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/producto/categoria')
        }
    })
}