const mysql = require('mysql');

const conexion = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user:  process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD ||'jean1010',
    database: process.env.DB_DATABASE ||'mydb'
})

conexion.connect((error) =>{
    if(error){
        console.error(`El error de conexión es ${error}`);
    }
    console.log("Conexion Satisfactoria con la base de datos");
})

module.exports = conexion;