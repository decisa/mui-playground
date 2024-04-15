import { ViewState } from 'react-map-gl'
import { MapState } from './useMap'

export const mapActions = ['SET_VIEW', 'SET_MARKERS'] as const
export type MapActions = (typeof mapActions)[number]

type Action<T extends MapActions, P> = {
  type: T
  payload: P
}

type SetViewAction = Action<'SET_VIEW', Partial<MapState['viewState']>>

type SetMarkersAction = Action<'SET_MARKERS', MapState['markers']>

export type MapReducerActions = SetViewAction | SetMarkersAction

export function mapReducer(
  state: MapState,
  action: MapReducerActions
): MapState {
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
    default:
      return state
  }
}
