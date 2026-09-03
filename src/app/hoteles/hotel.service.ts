import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";

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
    private apiUrl = "https://nag-jitters-prepay.ngrok-free.dev";

    private initialHotels: Hotel[] = [
        { 
            id: 1, 
            nombre: "Hotel Plaza Central", 
            ubicacion: "Centro Histórico", 
            categoria: "Estándar", 
            imagen: "res://logo", 
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

    private hotelsSubject = new BehaviorSubject<Hotel[]>(this.initialHotels);
    public hotels$: Observable<Hotel[]> = this.hotelsSubject.asObservable();

    constructor(private http: HttpClient) {}

    buscarHotelesRemoto(filtro: string = ""): Observable<any[]> {
        const headers = new HttpHeaders({
            'ngrok-skip-browser-warning': 'true'
        });
        return this.http.get<any[]>(`${this.apiUrl}/hoteles?q=${encodeURIComponent(filtro)}`, { headers });
    }

    getHotels(): Hotel[] {
        return this.hotelsSubject.getValue().filter(h => !h.archivado);
    }

    getHotelById(id: number): Hotel | undefined {
        return this.hotelsSubject.getValue().find(h => h.id === id);
    }

    addHotel(): Hotel {
        const currentList = this.hotelsSubject.getValue();
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

        const updatedList = [nuevo, ...currentList];
        this.hotelsSubject.next(updatedList);
        return nuevo;
    }

    // Permite actualizar pasando 3 argumentos (id, nombre, categoría) o 4 (id, nombre, descripción, categoría)
    updateHotel(id: number, nombre: string, arg3: string, arg4?: string): void {
        const currentList = this.hotelsSubject.getValue();
        const updatedList = currentList.map(h => {
            if (h.id === id) {
                const descripcion = arg4 !== undefined ? arg3 : h.descripcion;
                const categoria = arg4 !== undefined ? arg4 : arg3;
            return { ...h, nombre, descripcion, categoria };
        }
        return h;
    });
    this.hotelsSubject.next(updatedList);
}

    archiveHotel(id: number): void {
        const currentList = this.hotelsSubject.getValue();
        const updatedList = currentList.map(h => 
            h.id === id ? { ...h, archivado: true } : h
        );
        this.hotelsSubject.next(updatedList);
    }

    deleteHotel(id: number): void {
        const currentList = this.hotelsSubject.getValue();
        const updatedList = currentList.filter(h => h.id !== id);
        this.hotelsSubject.next(updatedList);
    }
}