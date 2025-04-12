import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Producto } from '../../shared/interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private productosSubject = new BehaviorSubject<Producto[]>([]);
  productos$ = this.productosSubject.asObservable();
  private apiUrl = 'http://localhost:3000/cartas';

  constructor(private http: HttpClient) {
    this.cargarProductos();
  }

  cargarProductos() {
    this.http.get<Producto[]>(this.apiUrl).subscribe(productos => {
      this.productosSubject.next(productos);
    });
  }

  agregarProducto(producto: Producto) {
    return this.http.post(this.apiUrl, producto).subscribe(() => {
      this.cargarProductos();
    });
  }

  actualizarProducto(id: number, producto: Producto) {
    return this.http.put(`${this.apiUrl}/${id}`, producto).subscribe(() => {
      this.cargarProductos();
    });
  }

  eliminarProducto(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.cargarProductos();
    });
  }
}
