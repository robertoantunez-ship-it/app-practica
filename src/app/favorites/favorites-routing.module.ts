import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

import { FavoritesComponent } from './favorites.component'
import { FavoriteDetailComponent } from './favorite-detail.component'

const routes: Routes = [
  { path: '', component: FavoritesComponent },
  { path: 'detail', component: FavoriteDetailComponent }
]

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class FavoritesRoutingModule { }