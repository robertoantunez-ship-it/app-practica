import { Component, OnInit } from '@angular/core'
import { NavigationEnd, Router } from '@angular/router'
import { RouterExtensions } from '@nativescript/angular'
import Theme from '@nativescript/theme'
import {
  DrawerTransitionBase,
  RadSideDrawer,
  SlideInOnTopTransition,
} from 'nativescript-ui-sidedrawer'
import { filter } from 'rxjs/operators'
import { Application, Utils } from '@nativescript/core'

let firebase: any
try {
  firebase = require('nativescript-plugin-firebase')
} catch (e) {
  console.log('Plugin Firebase no disponible en el entorno actual.')
}

@Component({
  selector: 'ns-app',
  templateUrl: 'app.component.html',
  standalone: false
})
export class AppComponent implements OnInit {
  private _activatedUrl: string
  private _sideDrawerTransition: DrawerTransitionBase

  constructor(private router: Router, private routerExtensions: RouterExtensions) {}

  ngOnInit(): void {
    Theme.setMode(Theme.Light)
    this._activatedUrl = '/home'
    this._sideDrawerTransition = new SlideInOnTopTransition()

    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => (this._activatedUrl = event.urlAfterRedirects))

    this.inicializarFirebase()
  }

  inicializarFirebase(): void {
    if (!firebase) return

    try {
      firebase.init({
        onPushTokenReceivedCallback: (token: string) => {
          console.log('==================================================')
          console.log('FIREBASE FCM TOKEN ASSIGNED:', token)
          console.log('==================================================')
        },
        onMessageReceivedCallback: (message: any) => {
          const titulo = message?.title || 'Notificación'
          const cuerpo = message?.body || 'Has recibido un mensaje'
          this.mostrarToast(`${titulo}: ${cuerpo}`)
        }
      }).then(
        () => console.log('Firebase inicializado correctamente.'),
        (error: any) => console.log('Firebase omitido en modo Preview:', error)
      )
    } catch (error) {
      console.log('Excepción capturada en Preview (Firebase requiere build nativo):', error)
    }
  }

  mostrarToast(mensaje: string): void {
    try {
      if (Utils.android) {
        const context = Application.android.context || Utils.android.getApplicationContext()
        if (context && typeof android !== 'undefined') {
          android.widget.Toast.makeText(context, mensaje, android.widget.Toast.LENGTH_LONG).show()
        }
      }
    } catch (e) {
      console.log('Toast omitido en Preview:', e)
    }
  }

  get sideDrawerTransition(): DrawerTransitionBase {
    return this._sideDrawerTransition
  }

  isComponentSelected(url: string): boolean {
    return this._activatedUrl === url
  }

  onNavItemTap(navItemRoute: string): void {
    this.routerExtensions.navigate([navItemRoute], {
      transition: {
        name: 'fade',
      },
    })

    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.closeDrawer()
  }
}