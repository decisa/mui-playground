// import { ViewState } from 'react-map-gl'
// import { act } from 'react-dom/test-utils'
import { MapState } from './useMap'
// import { Marker } from './MapMarker'

export const mapActions = [
  'SET_VIEW',
  'SET_MARKERS',
  'SET_CROSSHAIR_MARKER',
  'SET_DIRECTIONS',
] as const
export type MapActions = (typeof mapActions)[number]

type Action<T extends MapActions, P> = {
  type: T
  payload: P
}

type SetViewAction = Action<'SET_VIEW', Partial<MapState['viewState']>>

type SetMarkersAction = Action<'SET_MARKERS', MapState['markers']>

type SetDirectionsAction = Action<'SET_DIRECTIONS', MapState['directions']>
// set 1 marker and zoom to it
type SetMarker = Action<'SET_CROSSHAIR_MARKER', MapState['markers'][0] | null>

export type MapReducerActions =
  | SetViewAction
  | SetMarkersAction
  | SetMarker
  | SetDirectionsAction

export function mapReducer(
  state: MapState,
  action: MapReducerActions
): MapState {
  let markers: MapState['markers']
  switch (action.type) {
    case 'SET_VIEW':
      return {
        ...state,
        viewState: {
          ...state.viewState,
          ...action.payload,
        },
      }
    case 'SET_MARKERS':
      return {
        ...state,
        markers: action.payload,
      }
    case 'SET_CROSSHAIR_MARKER':
      markers = action.payload ? [{ ...action.payload, type: 'crosshair' }] : []
      return {
        ...state,
        markers,
        viewState: {
          ...state.viewState,
          latitude: action.payload?.latitude || 40.1110498,
          longitude: action.payload?.longitude || -75.0036599,
          zoom: action.payload ? 17 : 6,
          pitch: 0,
        },
      }
    case 'SET_DIRECTIONS':
      return {
        ...state,
        directions: action.payload,
      }
    default:
      return state
  }
}
