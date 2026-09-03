import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, ApplicationSettings, Dialogs } from '@nativescript/core'

@Component({
  selector: 'Browse',
  templateUrl: './browse.component.html',
  standalone: false
})
export class BrowseComponent implements OnInit {
  username: string = ''
  private readonly USERNAME_KEY = 'user_settings_username'

  constructor() {}

  ngOnInit(): void {
    this.cargarNombreUsuario()
  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }

  cargarNombreUsuario(): void {
    const guardado = ApplicationSettings.getString(this.USERNAME_KEY)
    this.username = guardado ? guardado : 'Usuario Invitado'
  }

  guardarNombreUsuario(): void {
    if (!this.username || this.username.trim() === '') {
      Dialogs.alert({
        title: 'Error',
        message: 'El nombre no puede estar vacío',
        okButtonText: 'OK'
      })
      return
    }

    ApplicationSettings.setString(this.USERNAME_KEY, this.username.trim())
    Dialogs.alert({
      title: 'Ajustes Guardados',
      message: `El nombre de usuario '${this.username.trim()}' se guardó correctamente.`,
      okButtonText: 'Entendido'
    })
  }
}