const mysql = require('mysql');

const conexion = mysql.createConnection({
    host:'localhost',
    user:'root',
    password: 'jean1010',
    database: 'mydb'
})

conexion.connect((error) =>{
    if(error){
        console.error(`El error de conexión es ${error}`);
    }
    console.log("Conexion Satisfactoria con la base de datos");
})

module.exports = conexion;