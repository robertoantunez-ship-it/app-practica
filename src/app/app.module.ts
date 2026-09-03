import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptModule } from '@nativescript/angular'
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular'
import { HttpClientModule } from '@angular/common/http' // Importación añadida

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    AppRoutingModule, 
    NativeScriptModule, 
    NativeScriptUISideDrawerModule,
    HttpClientModule // Módulo registrado
  ],
  declarations: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}