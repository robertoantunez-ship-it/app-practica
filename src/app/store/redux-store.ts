import { BehaviorSubject, Observable } from 'rxjs';

export interface AppState {
    favoritos: any[];
    leerAhora: any[];
}

export const INITIAL_STATE: AppState = {
    favoritos: [],
    leerAhora: []
};

export const ADD_FAVORITE = 'ADD_FAVORITE';
export const REMOVE_FAVORITE = 'REMOVE_FAVORITE';
export const LEER_AHORA = 'LEER_AHORA';

export function appReducer(state: AppState = INITIAL_STATE, action: { type: string; payload?: any }): AppState {
    switch (action.type) {
        case ADD_FAVORITE:
            if (state.favoritos.some(item => item.id === action.payload.id)) {
                return state;
            }
            return { ...state, favoritos: [...state.favoritos, action.payload] };

        case REMOVE_FAVORITE:
            return { ...state, favoritos: state.favoritos.filter(item => item.id !== action.payload.id) };

        case LEER_AHORA:
            if (state.leerAhora.some(item => item.id === action.payload.id)) {
                return state;
            }
            return { ...state, leerAhora: [...state.leerAhora, action.payload] };

        default:
            return state;
    }
}

export class ReduxStore {
    private static instance: ReduxStore;
    private stateSubject = new BehaviorSubject<AppState>(INITIAL_STATE);

    private constructor() {}

    public static getInstance(): ReduxStore {
        if (!ReduxStore.instance) {
            ReduxStore.instance = new ReduxStore();
        }
        return ReduxStore.instance;
    }

    public dispatch(action: { type: string; payload?: any }): void {
        const currentState = this.stateSubject.getValue();
        const newState = appReducer(currentState, action);
        this.stateSubject.next(newState);
    }

    public select<K extends keyof AppState>(key: K): Observable<AppState[K]> {
        return new Observable(subscriber => {
            const sub = this.stateSubject.subscribe(state => {
                subscriber.next(state[key]);
            });
            return () => sub.unsubscribe();
        });
    }
}