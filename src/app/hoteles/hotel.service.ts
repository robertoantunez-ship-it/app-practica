import { Injectable } from "@angular/core";

export interface Hotel {
    id: number;
    nombre: string;
    ubicacion: string;
    categoria: string;
    imagen: string;
    descripcion?: string;
    archivado?: boolean;
}

@Injectable({
    providedIn: "root"
})
export class HotelService {
    private hotels: Hotel[] = [
        { 
            id: 1, 
            nombre: "Hotel Plaza Central", 
            ubicacion: "Centro Histórico", 
            categoria: "Estándar", 
            imagen: "res://logo", // 
            descripcion: "Hotel de lujo ubicado en el centro histórico, ideal para viajes de negocios.",
            archivado: false 
        },
        { 
            id: 2, 
            nombre: "Resort Gran Mar", 
            ubicacion: "Zona Costera", 
            categoria: "Playa", 
            imagen: "https://picsum.photos/id/10/200/200", 
            descripcion: "Resort frente al mar con vista panorámica, alberca y restaurante de mariscos.",
            archivado: false 
        },
        {
            id: 3,
            nombre: "Hostal Colonial",
            ubicacion: "Zona Antigua",
            categoria: "Económico",
            imagen: "~/assets/logo_r.png", 
            descripcion: "Alojamiento acogedor de estilo colonial en el corazón de la ciudad.",
            archivado: false
        }
    ];

    getHotels(): Hotel[] {
        return this.hotels.filter(h => !h.archivado);
    }

    getHotelById(id: number): Hotel | undefined {
        return this.hotels.find(h => h.id === id);
    }

    updateHotel(id: number, nuevoNombre: string, nuevaDescripcion?: string, nuevaCategoria?: string): void {
        const hotel = this.getHotelById(id);
        if (hotel) {
            hotel.nombre = nuevoNombre;
            if (nuevaDescripcion !== undefined) {
                hotel.descripcion = nuevaDescripcion;
            }
            if (nuevaCategoria) {
                hotel.categoria = nuevaCategoria;
            }
        }
    }

    deleteHotel(id: number): void {
        const index = this.hotels.findIndex(h => h.id === id);
        if (index > -1) {
            this.hotels.splice(index, 1);
        }
    }

    archiveHotel(id: number): void {
        const hotel = this.getHotelById(id);
        if (hotel) {
            hotel.archivado = true;
        }
    }

    addHotel(): Hotel {
        const idNuevo = Math.floor(Math.random() * 1000);
        const nuevo: Hotel = {
            id: idNuevo,
            nombre: `Hotel Suite ${idNuevo}`,
            ubicacion: "Nueva Sede",
            categoria: "Estándar",
            imagen: "res://logo",
            descripcion: "Descripción para el nuevo hotel.",
            archivado: false
        };
        this.hotels.unshift(nuevo);
        return nuevo;
    }
}