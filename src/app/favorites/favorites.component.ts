import { Component, OnInit } from '@angular/core'
import { RouterExtensions } from '@nativescript/angular'
import { Application, isAndroid } from '@nativescript/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { FavoritesService, FavoriteItem } from './favorites.service'

@Component({
  selector: 'Favorites',
  templateUrl: './favorites.component.html',
  standalone: false
})
export class FavoritesComponent implements OnInit {
  platformMessage: string = 'Ejecutando en otra plataforma'
  items: FavoriteItem[] = [] 

  constructor(
    private routerExtensions: RouterExtensions,
    private favoritesService: FavoritesService 
  ) { }

  ngOnInit(): void {
    if (isAndroid) {
      this.platformMessage = 'Aplicación ejecutándose en Android'
    }
    this.items = this.favoritesService.getItems() 
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
}