import React, { createContext, FC, PropsWithChildren, useContext } from 'react'
import { useObservable } from '@legendapp/state/react'
import { ObservableObject } from '@legendapp/state'
import { Lab } from '../core/types'
import Stage from '../core/Stage'

interface CompGraphDataContextProps {
  lab: Lab
  scene: Stage
}

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
const CompGraphDataContext = createContext<ObservableObject<CompGraphDataContextProps>>({} as ObservableObject<CompGraphDataContextProps>)

export const CompGraphDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const state = useObservable<CompGraphDataContextProps>({
    lab: window.location.search === '?lab2' ? Lab.V2 : Lab.V3,
    scene: new Stage()
  })

  state.onChange((val) => console.log(val))

  return (
      <CompGraphDataContext.Provider value={state}>
        {children}
      </CompGraphDataContext.Provider>
  )
}

export const useCompGraphData = (): ObservableObject<CompGraphDataContextProps> => useContext(CompGraphDataContext)
