import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptCommonModule } from '@nativescript/angular'

import { FavoritesRoutingModule } from './favorites-routing.module'
import { FavoritesComponent } from './favorites.component'
import { FavoriteDetailComponent } from './favorite-detail.component'

@NgModule({
  imports: [
    NativeScriptCommonModule,
    FavoritesRoutingModule
  ],
  declarations: [
    FavoritesComponent,
    FavoriteDetailComponent
  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class FavoritesModule { }