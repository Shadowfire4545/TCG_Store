import { Injectable } from "@angular/core";
import { Producto } from "../../shared/interfaces/producto.interface";
import { HttpClient } from "@angular/common/http";

// Extend the Producto interface with an optional cantidadEnCarrito property
interface ProductoEnCarrito extends Producto {
  cantidadEnCarrito?: number;
}

@Injectable({
  providedIn: "root"
})
export class CarritoService {
  private carrito: ProductoEnCarrito[] = [];

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:3000/cartas';

  agregarProducto(producto: Producto) {
    return this.http.post(this.apiUrl, producto);
  }

  obtenerCarrito(): ProductoEnCarrito[] {
    return this.carrito;
  }

  eliminarProducto(index: number): void {
    this.carrito.splice(index, 1);
    this.guardarCarrito();
  }

  actualizarProducto(id: number, producto: Producto) {
    return this.http.put(`${this.apiUrl}/${id}`, producto);
  }

  
  actualizarCantidad(index: number, nuevaCantidad: number): { success: boolean, message: string } {
    if (index >= 0 && index < this.carrito.length) {
      const item = this.carrito[index];
      
      // Check stock limit
      if (nuevaCantidad > item.cantidad) {
        return { 
          success: false, 
          message: `No hay suficiente stock. Máximo: ${item.cantidad}`
        };
      }
      
      if (nuevaCantidad <= 0) {
        this.eliminarProducto(index);
      } else {
        // Update quantity
        item.cantidadEnCarrito = nuevaCantidad;
        this.guardarCarrito();
      }
      return { success: true, message: 'Cantidad actualizada' };
    }
    return { success: false, message: 'Producto no encontrado' };
  }

  generarXML() {
    let subtotal = 0;
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
    <recibo>\n`;
    
    this.carrito.forEach((producto) => {
      const cantidad = producto.cantidadEnCarrito || 1;
      const precioTotal = producto.precio * cantidad;
      
      xml += `<producto id="${producto.id}">
        <nombre>${producto.nombre}</nombre>
        <precio>${producto.precio}</precio>
        <cantidad>${cantidad}</cantidad>
        <total>${precioTotal}</total>
      </producto>\n`;
      
      subtotal += precioTotal;
    });

    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    xml += `<subtotal>${subtotal.toFixed(2)}</subtotal>
    <iva>${iva.toFixed(2)}</iva>
    <total>${total.toFixed(2)}</total>
    </recibo>`;
    
    const blob = new Blob([xml], {type: 'application/xml'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = 'recibo.xml';
    a.href = url;
    
    document.body.appendChild(a);
    a.click();
    
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  limpiarCarrito(): void {
    this.carrito = [];
    this.guardarCarrito();
  }

  private guardarCarrito(): void {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
  }
}