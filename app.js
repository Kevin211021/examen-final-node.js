// app.js
const express = require("express");
const Database = require("better-sqlite3");
const db = new Database("productos.db");
const app = express();

// Crear tabla productos
db.prepare(`
  CREATE TABLE IF NOT EXISTS productos(
    id INTEGER PRIMARY KEY,
    nombre TEXT UNIQUE,
    stock INTEGER,
    precio REAL
  )
`).run();

// Insertar productos iniciales
const productos = [
  ["Teclado", 10, 1200],
  ["Mouse", 15, 800],
  ["Monitor", 5, 4500]
];
productos.forEach(function(p){
  db.prepare("INSERT OR IGNORE INTO productos(nombre,stock,precio) VALUES (?,?,?)")
    .run(p[0], p[1], p[2]);
});

// Endpoint todos los productos
app.get("/productos", function(req,res){
  const todos = db.prepare("SELECT * FROM productos").all();
  res.json(todos);
});

// Endpoint producto por ID
app.get("/productos/:id", function(req,res){
  const id = parseInt(req.params.id);
  const producto = db.prepare("SELECT * FROM productos WHERE id=?").get(id);
  res.json(producto ? producto : {mensaje:"Producto no encontrado"});
});

// Iniciar servidor
app.listen(3000, function(){
  console.log("Servidor corriendo en http://localhost:3000");
});