import { Component, OnInit } from '@angular/core'
import { RadSideDrawer } from 'nativescript-ui-sidedrawer'
import { Application, View, Color, Dialogs } from '@nativescript/core'

@Component({
  selector: 'Home',
  templateUrl: './home.component.html',
  standalone: false
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>Application.getRootView()
    sideDrawer.showDrawer()
  }

  // Gesto Tap
  onAnimarRana(args: any): void {
    const rana = args.object as View

    rana.animate({
      translateY: -35,
      rotate: 15,
      scaleX: 1.15,
      scaleY: 1.15,
      duration: 200,
      curve: "easeOut"
    }).then(() => {
      return rana.animate({
        translateY: 0,
        rotate: 0,
        scaleX: 1.0,
        scaleY: 1.0,
        duration: 300,
        curve: "spring"
      })
    })
  }

  // Gesto LongPress
  onSuperSaltoRana(args: any): void {
    const rana = args.object as View

    rana.animate({
      translateY: -90,
      rotate: 360,
      scaleX: 1.4,
      scaleY: 1.4,
      backgroundColor: new Color("#81C784"),
      duration: 450,
      delay: 100,
      curve: "easeInOut"
    }).then(() => {
      return rana.animate({
        translateY: 0,
        rotate: 0,
        scaleX: 1.0,
        scaleY: 1.0,
        backgroundColor: new Color("transparent"),
        duration: 400,
        curve: "spring"
      })
    }).then(() => {
      Dialogs.alert({
        title: "¡Croac! 🐸",
        message: "¡Has probado el super salto elástico de la rana!",
        okButtonText: "¡Genial!"
      })
    })
  }
}