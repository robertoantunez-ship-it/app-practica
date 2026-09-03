import { Component, OnInit, OnDestroy } from '@angular/core'
import { RouterExtensions } from '@nativescript/angular'
import { Application, isAndroid, Dialogs } from '@nativescript/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { FavoritesService, FavoriteItem } from './favorites.service'
import { ReduxStore, LEER_AHORA, REMOVE_FAVORITE } from '../store/redux-store'
import { Subscription } from 'rxjs'

@Component({
  selector: 'Favorites',
  templateUrl: './favorites.component.html',
  standalone: false
})
export class FavoritesComponent implements OnInit, OnDestroy {
  platformMessage: string = 'Ejecutando en otra plataforma'
  items: any[] = []
  private reduxSubscription!: Subscription

  constructor(
    private routerExtensions: RouterExtensions,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    if (isAndroid) {
      this.platformMessage = 'Aplicación ejecutándose en Android'
    }

    // Escucha en tiempo real los cambios del Store de Redux
    const store = ReduxStore.getInstance()
    this.reduxSubscription = store.select('favoritos').subscribe((favoritosRedux) => {
      this.items = favoritosRedux
    })
  }

  ngOnDestroy(): void {
    if (this.reduxSubscription) {
      this.reduxSubscription.unsubscribe()
    }
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }

  onGoToDetail(): void {
    this.routerExtensions.navigate(['/favorites/detail'], {
      transition: { name: 'slide' }
    })
  }

  // Despacha la acción 'LEER_AHORA' al Store de Redux
  accionLeerAhora(hotel: any): void {
    const store = ReduxStore.getInstance()
    store.dispatch({ type: LEER_AHORA, payload: hotel })

    Dialogs.alert({
      title: 'Redux Action',
      message: `Se envió la acción 'LEER_AHORA' para "${hotel.nombre}" al Store de Redux.`,
      okButtonText: 'OK'
    })
  }

  quitarFavorito(hotel: any): void {
    const store = ReduxStore.getInstance()
    store.dispatch({ type: REMOVE_FAVORITE, payload: hotel })
  }
}