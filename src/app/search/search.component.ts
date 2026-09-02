import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application } from '@nativescript/core'

@Component({
  selector: 'Search',
  templateUrl: './search.component.html',
  standalone: false
})
export class SearchComponent implements OnInit {
  searchText: string = ''

  // Lista con 3 orígenes de imágenes distintos (res://, https:// y ~/)
  allItems = [
    { 
      id: 1, 
      nombre: 'Hotel Plaza Central', 
      categoria: 'Lujo', 
      imagen: 'res://logo' 
    },
    { 
      id: 2, 
      nombre: 'Hostal del Sol', 
      categoria: 'Económico', 
      imagen: 'https://picsum.photos/id/10/200/200' 
    },
    { 
      id: 3, 
      nombre: 'Resort Gran Mar', 
      categoria: 'Playa', 
      imagen: '~/assets/logo.png' 
    }
  ]

  // Arreglo para almacenar los resultados del filtrado
  filteredItems: Array<any> = []

  constructor() {}

  ngOnInit(): void {
    this.filteredItems = [...this.allItems]
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }

  onSearchTextChange(): void {
    if (!this.searchText || this.searchText.trim() === '') {
      this.filteredItems = [...this.allItems]
    } else {
      const query = this.searchText.toLowerCase()
      this.filteredItems = this.allItems.filter((item) => 
        item.nombre.toLowerCase().includes(query) || 
        item.categoria.toLowerCase().includes(query)
      )
    }
  }
}