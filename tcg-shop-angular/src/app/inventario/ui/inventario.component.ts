import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventarioService } from '../data-access/inventario.service';
import { Producto } from '../../shared/interfaces/producto.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
})
export class InventarioComponent implements OnInit {
  productos: Producto[] = [];
  productoSeleccionado: Producto | null = null;
  modoEdicion = false;

  nuevoProducto: Producto = this.inicializarProducto();

  constructor(
    private inventarioService: InventarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inventarioService.productos$.subscribe(productos => {
      this.productos = productos;
    });
  }

  irAProductos() {
    this.router.navigate(['/productos']);
  }

  inicializarProducto(): Producto {
    return {
      id: 0,
      nombre: '',
      precio: 0,
      cantidad: 0,
      imagen: '',
      rareza: '',
      descripcion: '',
      psa: 0
    };
  }

  guardarProducto() {
    if (this.modoEdicion && this.productoSeleccionado) {
      this.inventarioService.actualizarProducto(this.productoSeleccionado.id, this.nuevoProducto);
    } else {
      this.inventarioService.agregarProducto(this.nuevoProducto);
    }

    this.nuevoProducto = this.inicializarProducto();
    this.modoEdicion = false;
    this.productoSeleccionado = null;
  }

  agregarProducto() {
    this.nuevoProducto = this.inicializarProducto();
    this.modoEdicion = false;
    this.productoSeleccionado = null;

    
  }

  editarProducto(producto: Producto) {
    this.nuevoProducto = { ...producto };
    this.productoSeleccionado = producto;
    this.modoEdicion = true;
  }

  eliminarProducto(id: number) {
    this.inventarioService.eliminarProducto(id);
  }

  cancelarEdicion() {
    this.nuevoProducto = this.inicializarProducto();
    this.productoSeleccionado = null;
    this.modoEdicion = false;
  }
}
