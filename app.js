// app.js
var express = require("express");
var db = require("better-sqlite3")("productos.db");
var app = express();

// Crear tabla productos
db.prepare("CREATE TABLE IF NOT EXISTS productos(id INTEGER PRIMARY KEY,nombre TEXT UNIQUE,stock INTEGER,precio REAL)").run();

// Insertar productos iniciales
var productos = [["Teclado",10,1200],["Mouse",15,800],["Monitor",5,4500]];
productos.forEach(function(p){
  db.prepare("INSERT OR IGNORE INTO productos(nombre,stock,precio) VALUES (?,?,?)").run(p[0],p[1],p[2]);
});

// Endpoint: todos los productos
app.get("/productos", function(req,res){
  res.json(db.prepare("SELECT * FROM productos").all());
});

// Endpoint: producto por ID
app.get("/productos/:id", function(req,res){
  var p = db.prepare("SELECT * FROM productos WHERE id=?").get(parseInt(req.params.id));
  res.json(p ? p : {mensaje:"Producto no encontrado"});
});

// Iniciar servidor
app.listen(3000, function(){
  console.log("Servidor corriendo en http://localhost:3000");
});