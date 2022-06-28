const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require("../database/db");
const {promisify} = require('util');

//Procedimiento para registrar usuarios
exports.register = async(req, res)=>{
    try{
        const rut = req.body.rut;
        const nombre = req.body.nombre;
        const apellido_p = req.body.apellido_p;
        const apellido_m = req.body.apellido_m;
        const correo = req.body.correo;
        const telefono = req.body.telefono;
        const direccion = req.body.direccion;
        const tipo = req.body.tipo;
        const contraseña_por_defecto = 'wsell123';

        let passHash = await bcryptjs.hash(contraseña_por_defecto, 8);

        conexion.query(`INSERT INTO usuario VALUES (${rut}, '${nombre}', '${apellido_p}', '${apellido_m}','${correo}' ,'${passHash}' ,'${telefono}' ,'${direccion}','${tipo}', 1, (SELECT rut_negocio FROM negocio LIMIT 1))`, (error, results)=>{
            if(error){
                console.log(error);
            }
            else{
                res.redirect('/usuarios')
            }
        });
    }catch(error){
        console.log(error);
    }

}


//Procedimiento para logear usuarios

exports.login = async(req, res)=>{
    try{
        const rut = req.body.rut;
        const contraseña = req.body.password;
        conexion.query(`SELECT * FROM usuario WHERE idusuario = ${rut}`, async (error, results)=>{
            if(results.length == 0 || !(await bcryptjs.compare(contraseña, results[0].contraseña))){
                console.log(error);
                res.redirect('/sesion_fallida')
            }
            else{
                //INICIO DE SESION
                const id = results[0].idusuario;
                const nombre = results[0].nombre;
                const apellido_p = results[0].apellido_paterno;
                const tipo = results[0].tipo;
                const token = jwt.sign({id:id, nombre: nombre, apellido_p: apellido_p, tipo: tipo}, process.env.JWT_SECRETO , {expiresIn: process.env.JWT_TIEMPO_EXPIRA});
                console.log(results[0].nombre + ' ' + results[0].apellido_paterno);
                console.log(`TOKEN: ${token} para el rut ${rut}`);
                //res.redirect('/usuarios')

                const cookiesOptions ={
                    expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }

                res.cookie('jwt', token, cookiesOptions);
                res.redirect('/')
            }
        });
        console.log(rut , contraseña);
    }catch(error){
        console.log(error);
    }

}


exports.updateUsuario = (req,res) =>{
        const rut = req.body.rut;
        const nombre = req.body.nombre;
        const apellido_p = req.body.apellido_p;
        const apellido_m = req.body.apellido_m;
        const correo = req.body.correo;
        const telefono = req.body.telefono;
        const direccion = req.body.direccion;
        const tipo = req.body.tipo;

    conexion.query(`UPDATE usuario SET nombre='${nombre}', apellido_paterno='${apellido_p}' , apellido_materno='${apellido_m}', correo='${correo}', telefono='${telefono}' , direccion='${direccion}', tipo='${tipo}' WHERE idusuario = ${rut}`, (error, results) =>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/usuarios')
        }
    })
}

exports.updateContrasena = async(req,res) =>{
    const rut = req.body.rut;
    const contraseña = req.body.contraseña;

    let passHash = await bcryptjs.hash(contraseña, 8);

    console.log(rut + contraseña);

    conexion.query(`UPDATE usuario SET contraseña='${passHash}' WHERE idusuario = ${rut}`, (error, results) =>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/configuracion')
        }
    })
}

exports.deleteUsuario = ('/deleteUsuario/:id', (req,res)=>{
    const id = req.params.id;
    conexion.query(`DELETE FROM usuario WHERE idusuario = ${id}`, (error, results) =>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/usuarios');
        }
    })
})

exports.resetPassword = ('/resetPassword/:id', async(req,res)=>{
    const rut = req.params.id;

    const contraseña_por_defecto = 'wsell123';
    let passHash = await bcryptjs.hash(contraseña_por_defecto, 8);
    conexion.query(`UPDATE usuario SET contraseña='${passHash}' WHERE idusuario = ${rut}`, (error, results) =>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/usuarios');
        }
    })
})


//VERIFICAR SI ESTA LOGEADO
exports.isAuthenticated = async(req, res, next)=>{
    if(req.cookies.jwt){
        try{
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO);
            conexion.query(`SELECT * FROM usuario WHERE idusuario = ${decodificada.idusuario}`, (error, results)=>{
                if(!results){
                    return next();
                }
                req.user = results[0];
                return next();
            })
        }catch (error){
            console.log(error);
            return next();
        }
    }else{
        res.redirect('/login');
    }
}

exports.logout = (req, res) =>{
    res.clearCookie('jwt');
    return res.redirect('/');
}



//RUTA PARA CAMBIAR ESTADO DE USUARIO
exports.update_estado_usuario = (req,res)=>{
    const rut = req.params.rut;
    const estado = req.params.estado;
    conexion.query(`UPDATE usuario SET estado=${estado} WHERE idusuario = ${rut}`, (error, results) =>{
        if(error){
            console.log(error);
        }
        else{
            res.redirect('/usuarios')
        }
    })
}