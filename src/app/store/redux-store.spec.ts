/// <reference types="jasmine" />
import { appReducer, ADD_FAVORITE, REMOVE_FAVORITE, LEER_AHORA, INITIAL_STATE } from './redux-store'

describe('Suite de Pruebas Unitarias - Redux Reducer (appReducer)', () => {

  it('Debe retornar el estado inicial predeterminado cuando la acción no coincide', () => {
    const accionDesconocida = { type: 'ACCION_INEXISTENTE', payload: null }
    const nuevoEstado = appReducer(INITIAL_STATE, accionDesconocida)

    expect(nuevoEstado).toEqual(INITIAL_STATE)
  })

  it('Debe agregar un elemento a la lista de favoritos con ADD_FAVORITE', () => {
    const hotelPrueba = { id: 1, nombre: 'Hotel Ejemplo Plaza', ciudad: 'Buenos Aires' }
    const accionAgregar = { type: ADD_FAVORITE, payload: hotelPrueba }

    const nuevoEstado = appReducer(INITIAL_STATE, accionAgregar)

    expect(nuevoEstado.favoritos.length).toBe(1)
    expect(nuevoEstado.favoritos[0].nombre).toBe('Hotel Ejemplo Plaza')
  })

  it('No debe agregar duplicados a la lista de favoritos con ADD_FAVORITE', () => {
    const hotelPrueba = { id: 1, nombre: 'Hotel Ejemplo Plaza' }
    const estadoConHotel = { ...INITIAL_STATE, favoritos: [hotelPrueba] }
    const accionAgregar = { type: ADD_FAVORITE, payload: hotelPrueba }

    const nuevoEstado = appReducer(estadoConHotel, accionAgregar)

    expect(nuevoEstado.favoritos.length).toBe(1)
  })

  it('Debe eliminar un elemento de la lista de favoritos con REMOVE_FAVORITE', () => {
    const estadoInicialConFavorito = {
      ...INITIAL_STATE,
      favoritos: [{ id: 1, nombre: 'Hotel Ejemplo Plaza' }]
    }
    const accionEliminar = { type: REMOVE_FAVORITE, payload: { id: 1 } }

    const nuevoEstado = appReducer(estadoInicialConFavorito, accionEliminar)

    expect(nuevoEstado.favoritos.length).toBe(0)
  })

  it('Debe agregar un elemento a la lista de leerAhora con LEER_AHORA', () => {
    const articuloPrueba = { id: 101, titulo: 'Guía de Viaje' }
    const accionLeerAhora = { type: LEER_AHORA, payload: articuloPrueba }

    const nuevoEstado = appReducer(INITIAL_STATE, accionLeerAhora)

    expect(nuevoEstado.leerAhora.length).toBe(1)
    expect(nuevoEstado.leerAhora[0].titulo).toBe('Guía de Viaje')
  })

})