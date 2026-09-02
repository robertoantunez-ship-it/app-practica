import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'
import { HotelesComponent } from './hoteles/hoteles.component'
import { HotelDetalleComponent } from './hoteles/hotel-detalle.component'

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('~/app/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'browse',
    loadChildren: () => import('~/app/browse/browse.module').then((m) => m.BrowseModule),
  },
  {
    path: 'search',
    loadChildren: () => import('~/app/search/search.module').then((m) => m.SearchModule),
  },
  {
    path: 'featured',
    loadChildren: () => import('~/app/featured/featured.module').then((m) => m.FeaturedModule),
  },
  {
    path: 'settings',
    loadChildren: () => import('~/app/settings/settings.module').then((m) => m.SettingsModule),
  },
  { 
    path: 'favorites', 
    loadChildren: () => import('./favorites/favorites.module').then((m) => m.FavoritesModule),
  },
  { path: 'hoteles', component: HotelesComponent },
  { path: 'hoteles/detalle/:id', component: HotelDetalleComponent }
  
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}