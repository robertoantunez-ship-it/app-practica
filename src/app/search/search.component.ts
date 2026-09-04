import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, ApplicationSettings, Dialogs } from '@nativescript/core'
import { registerElement } from '@nativescript/angular'
import { HotelService } from '../hoteles/hotel.service'
import { ReduxStore, ADD_FAVORITE } from '../store/redux-store'

// 1. Registro del elemento MapView en Angular y requerimiento del SDK
registerElement('MapView', () => require('nativescript-google-maps-sdk').MapView)
const gmaps = require('nativescript-google-maps-sdk')

@Component({
  selector: 'Search',
  templateUrl: './search.component.html',
  standalone: false
})
export class SearchComponent implements OnInit {
  searchText: string = ''
  filteredItems: Array<any> = []
  cargando: boolean = false
  historialBusquedas: string[] = []

  private readonly HISTORIAL_KEY = 'historial_busquedas_key'

  // 2. Propiedades para el control del mapa
  latitude = -34.6037
  longitude = -58.3817
  zoom = 12

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    this.cargarHistorial()
    this.ejecutarBusqueda()
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }

  // --- LÓGICA DE GOOGLE MAPS ---

  onMapReady(args: any): void {
    const mapView = args.object
    const marker = new gmaps.Marker()

    marker.position = gmaps.Position.positionFromLatLng(-34.6037, -58.3817)
    marker.title = "Buenos Aires"
    marker.snippet = "Argentina"
    marker.userData = { index: 1 }

    mapView.addMarker(marker)
  }

  // --- LÓGICA DE BÚSQUEDA Y SERVICIO ---

  onSearchTextChange(): void {
    this.ejecutarBusqueda()
  }

  ejecutarBusqueda(): void {
    this.cargando = true
    const query = this.searchText.trim()

    if (query !== '') {
      this.guardarEnHistorial(query)
    }

    this.hotelService.buscarHotelesRemoto(this.searchText).subscribe({
      next: (data) => {
        this.filteredItems = data
        this.cargando = false
      },
      error: (err) => {
        console.error('Error Status:', err.status)
        console.error('Error Message:', err.message)
        this.cargando = false
      }
    })
  }

  // --- PERSISTENCIA CON ApplicationSettings ---

  cargarHistorial(): void {
    const guardado = ApplicationSettings.getString(this.HISTORIAL_KEY)
    if (guardado) {
      try {
        this.historialBusquedas = JSON.parse(guardado)
      } catch (e) {
        this.historialBusquedas = []
      }
    }
  }

  guardarEnHistorial(termino: string): void {
    this.historialBusquedas = this.historialBusquedas.filter(
      (item) => item.toLowerCase() !== termino.toLowerCase()
    )
    this.historialBusquedas.unshift(termino)

    if (this.historialBusquedas.length > 5) {
      this.historialBusquedas = this.historialBusquedas.slice(0, 5)
    }

    ApplicationSettings.setString(
      this.HISTORIAL_KEY,
      JSON.stringify(this.historialBusquedas)
    )
  }

  seleccionarDelHistorial(termino: string): void {
    this.searchText = termino
    this.ejecutarBusqueda()
  }

  limpiarHistorial(): void {
    this.historialBusquedas = []
    ApplicationSettings.remove(this.HISTORIAL_KEY)
  }

  // --- REDUX REDUCER DISPATCH ---

  agregarAFavoritos(hotel: any): void {
    const store = ReduxStore.getInstance()
    store.dispatch({ type: ADD_FAVORITE, payload: hotel })

    Dialogs.alert({
      title: "Favoritos",
      message: `"${hotel.nombre}" agregado a tus favoritos.`,
      okButtonText: "OK"
    })
  }
}