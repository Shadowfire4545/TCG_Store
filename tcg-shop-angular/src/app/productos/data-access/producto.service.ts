import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Producto } from '../../shared/interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = 'http://localhost:3000/cartas';

  constructor(private http: HttpClient) { }

  obtenerProducto() {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  agregarProducto(producto: Producto) {
    return this.http.post(this.apiUrl, producto);
  }

  actualizarProducto(id: number, producto: Producto) {
    return this.http.put(`${this.apiUrl}/${id}`, producto);
  }

  eliminarProducto(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}