package main

import (
	"database/sql"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"strconv"

	_ "github.com/go-sql-driver/mysql"
)

var (
	db         *sql.DB
	plantillas = template.Must(template.ParseGlob("plantillas/*.html"))
)

type Producto struct {
	ID       int
	Nombre   string
	Precio   float64
	Cantidad int
}

func main() {
	var err error
	dns := "root:clave123@tcp(localhost:3306)/prueba1"

	// Conectar a la base
	db, err = sql.Open("mysql", dns)
	if err != nil {
		log.Fatal(err)
	}
	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}
	fmt.Println("Conexión a la base de datos exitosa")

	// Rutas
	http.HandleFunc("/", inicio)
	http.HandleFunc("/agregar", agregarProducto)

	log.Println("Servidor corriendo en http://localhost:8080")
	http.ListenAndServe(":8080", nil)

}

func inicio(w http.ResponseWriter, r *http.Request) {
	// Traer productos desde la base
	rows, err := db.Query("SELECT idproductos, producto, precio, cantidad FROM productos")
	if err != nil {
		http.Error(w, "Error al consultar productos", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var productos []Producto
	for rows.Next() {
		var p Producto
		err := rows.Scan(&p.ID, &p.Nombre, &p.Precio, &p.Cantidad)
		if err != nil {
			http.Error(w, "Error al leer productos", http.StatusInternalServerError)
			return
		}
		productos = append(productos, p)
	}

	data := struct {
		Productos []Producto
	}{
		Productos: productos,
	}

	plantillas.ExecuteTemplate(w, "inicio", data)

}

func agregarProducto(w http.ResponseWriter, r *http.Request) {
	if r.Method != "POST" {
		http.Redirect(w, r, "/", http.StatusSeeOther)
		return
	}

	nombre := r.FormValue("nombre")
	precioStr := r.FormValue("precio")
	cantidadStr := r.FormValue("cantidad")

	precio, err := strconv.ParseFloat(precioStr, 64)
	if err != nil {
		http.Error(w, "Precio inválido", http.StatusBadRequest)
		return
	}

	cantidad, err := strconv.Atoi(cantidadStr)
	if err != nil {
		http.Error(w, "Cantidad inválida", http.StatusBadRequest)
		return
	}

	// Insertar en la base de datos
	_, err = db.Exec("INSERT INTO productos (producto, precio, cantidad) VALUES (?, ?, ?)", nombre, precio, cantidad)
	if err != nil {
		http.Error(w, "Error al insertar producto", http.StatusInternalServerError)
		return
	}

	http.Redirect(w, r, "/", http.StatusSeeOther)
}
