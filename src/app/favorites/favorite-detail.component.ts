import { Component, OnInit } from '@angular/core'
import { RouterExtensions } from '@nativescript/angular'

@Component({
  selector: 'FavoriteDetail',
  templateUrl: './favorite-detail.component.html',
  standalone: false
})
export class FavoriteDetailComponent implements OnInit {

  constructor(private routerExtensions: RouterExtensions) { }

  ngOnInit(): void { }

  onBack(): void {
    this.routerExtensions.back()
  }
}