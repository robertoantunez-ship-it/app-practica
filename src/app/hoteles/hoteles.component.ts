import { Component, OnInit, OnDestroy, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule, RouterExtensions, registerElement } from "@nativescript/angular";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { Application, Dialogs, isAndroid, Utils, View, Color, AnimationCurve } from "@nativescript/core";
import { HotelService, Hotel } from "./hotel.service";
import { Subscription } from "rxjs";

// =========================================================================
// MODO ENTREGA FINAL:
// Descomenta la siguiente línea solo cuando vayas a compilar con "ns run android"
// =========================================================================
// registerElement("PullToRefresh", () => require("@nativescript-community/ui-pulltorefresh").PullToRefresh);

@Component({
    selector: "ns-hoteles",
    templateUrl: "./hoteles.component.html",
    standalone: true,
    imports: [NativeScriptCommonModule],
    schemas: [NO_ERRORS_SCHEMA]
})
export class HotelesComponent implements OnInit, OnDestroy {
    hotels: Hotel[] = [];
    private hotelsSubscription!: Subscription;

    constructor(
        private routerExtensions: RouterExtensions,
        private hotelService: HotelService
    ) {}

    ngOnInit(): void {
        // Suscripción reactiva: cualquier actualización en HotelService se refleja aquí al instante
        this.hotelsSubscription = this.hotelService.hotels$.subscribe((listaHoteles) => {
            this.hotels = listaHoteles.filter(h => !h.archivado);
        });
    }

    ngOnDestroy(): void {
        // Cancela la suscripción al destruir el componente para liberar memoria
        if (this.hotelsSubscription) {
            this.hotelsSubscription.unsubscribe();
        }
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>Application.getRootView();
        sideDrawer.showDrawer();
    }

    onItemTap(args: any): void {
        const hotelSeleccionado = this.hotels[args.index];
        this.routerExtensions.navigate(["/hoteles/detalle", hotelSeleccionado.id]);
    }

    onLongPressItem(args: any, hotel: Hotel): void {
        const view = args.object as View;

        view.animate({
            backgroundColor: new Color("#FFC107"),
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 300,
            delay: 100,
            iterations: 1,
            curve: AnimationCurve.easeIn
        }).then(() => {
            return view.animate({
                backgroundColor: new Color("transparent"),
                scaleX: 1.0,
                scaleY: 1.0,
                duration: 300,
                curve: AnimationCurve.easeOut
            });
        }).then(() => {
            Dialogs.action({
                message: `¿Qué deseas hacer con "${hotel.nombre}"?`,
                cancelButtonText: "Cancelar",
                actions: ["archivar", "borrar"]
            }).then((result) => {
                if (result === "borrar") {
                    this.hotelService.deleteHotel(hotel.id);
                    Dialogs.alert({ title: "Acción Ejecutada", message: "Se eliminó el elemento", okButtonText: "OK" });
                } else if (result === "archivar") {
                    this.hotelService.archiveHotel(hotel.id);
                    Dialogs.alert({ title: "Acción Ejecutada", message: "Se archivó el elemento", okButtonText: "OK" });
                }
            });
        });
    }

    onSelectCategory(hotel: Hotel, event: any): void {
        if (event && event.object && event.object.stopPropagating) {
            event.object.stopPropagating();
        }

        Dialogs.action({
            message: "Selecciona una nueva categoría:",
            cancelButtonText: "Cancelar",
            actions: ["Lujo", "Económico", "Boutique", "Playa"]
        }).then((result) => {
            if (result && result !== "Cancelar") {
                this.hotelService.updateHotel(hotel.id, hotel.nombre, hotel.descripcion || '', result);
                this.showToast(`Categoría cambiada a ${result}`);
            }
        });
    }

    onDeleteHotel(hotel: Hotel, event: any): void {
        if (event && event.object && event.object.stopPropagating) {
            event.object.stopPropagating();
        }

        this.hotelService.deleteHotel(hotel.id);
        Dialogs.alert({
            title: "Acción Ejecutada",
            message: `Se eliminó el elemento: ${hotel.nombre}`,
            okButtonText: "Entendido"
        });
    }

    private showToast(mensaje: string): void {
        if (isAndroid) {
            const context = Utils.ad.getApplicationContext();
            (android as any).widget.Toast.makeText(context, mensaje, (android as any).widget.Toast.LENGTH_SHORT).show();
        } else {
            Dialogs.alert({ title: "Notificación", message: mensaje, okButtonText: "OK" });
        }
    }

    onRefresh(): void {
        this.hotelService.addHotel();
    }

    onPull(e: any): void {
        const pullRefresh = e.object;
        setTimeout(() => {
            this.onRefresh();
            if (pullRefresh && "refreshing" in pullRefresh) {
                pullRefresh.refreshing = false;
            }
        }, 1500);
    }
}