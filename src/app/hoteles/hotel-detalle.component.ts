import { Component, OnInit, NO_ERRORS_SCHEMA, ViewChild, ElementRef } from "@angular/core";
import { NativeScriptCommonModule, NativeScriptFormsModule, RouterExtensions } from "@nativescript/angular";
import { ActivatedRoute } from "@angular/router";
import { TextField, Dialogs, isAndroid, Utils } from "@nativescript/core";
import { MinLenDirective } from "./min-len.directive";
import { HotelService, Hotel } from "./hotel.service";

@Component({
    selector: "ns-hotel-detalle",
    templateUrl: "./hotel-detalle.component.html",
    standalone: true,
    imports: [
        NativeScriptCommonModule, 
        NativeScriptFormsModule,
        MinLenDirective
    ],
    schemas: [NO_ERRORS_SCHEMA]
})
export class HotelDetalleComponent implements OnInit {
    @ViewChild("nombreField", { static: false }) nombreFieldRef: ElementRef<TextField>;

    hotelId: number = 1;
    nombreHotel: string = "";
    descripcionHotel: string = "";

    opiniones = [
        { usuario: "Carlos Pérez", comentario: "¡Excelente hotel!", puntaje: "4.3", imagen: "res://logo", votoPositivo: true },
        { usuario: "Ana Gómez", comentario: "Buen servicio en general.", puntaje: "3.8", imagen: "res://logo", votoPositivo: false }
    ];

    constructor(
        private routerExtensions: RouterExtensions,
        private route: ActivatedRoute,
        private hotelService: HotelService
    ) {}

    ngOnInit(): void {
        const idParam = this.route.snapshot.params["id"];
        if (idParam) {
            this.hotelId = parseInt(idParam, 10);
        }

        const hotel = this.hotelService.getHotelById(this.hotelId);
        if (hotel) {
            this.nombreHotel = hotel.nombre;
            this.descripcionHotel = hotel.descripcion || "Sin descripción disponible.";
        }
    }

    onBack(): void {
        this.routerExtensions.back();
    }

    onToggleVote(item: any): void {
        item.votoPositivo = !item.votoPositivo;
    }

    onFocusNombre(): void {
        if (this.nombreFieldRef && this.nombreFieldRef.nativeElement) {
            this.nombreFieldRef.nativeElement.focus();
        }
    }

    onGuardarCambios(isFormValid: boolean): void {
        if (!isFormValid) {
            Dialogs.alert({
                title: "Error de Validación",
                message: "Por favor corrige los campos requeridos antes de guardar.",
                okButtonText: "OK"
            });
            return;
        }

        // Guarda tanto el nombre como la descripción en el servicio
        this.hotelService.updateHotel(this.hotelId, this.nombreHotel, this.descripcionHotel);
        this.showToast("¡Datos del hotel actualizados correctamente!");
    }

    private showToast(mensaje: string): void {
        if (isAndroid) {
            const context = Utils.ad.getApplicationContext();
            (android as any).widget.Toast.makeText(context, mensaje, (android as any).widget.Toast.LENGTH_SHORT).show();
        } else {
            Dialogs.alert({ title: "Notificación", message: mensaje, okButtonText: "OK" });
        }
    }
}