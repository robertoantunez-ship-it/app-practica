import { Injectable } from '@angular/core'

export interface FavoriteItem {
  id: number
  name: string
}

@Injectable({
  providedIn: 'root' 
})
export class FavoritesService {
  private items: FavoriteItem[] = [
    { id: 1, name: 'Elemento Guardado 1' },
    { id: 2, name: 'Elemento Guardado 2' },
    { id: 3, name: 'Elemento Guardado 3' }
  ]

  getItems(): FavoriteItem[] {
    return this.items
  }
}