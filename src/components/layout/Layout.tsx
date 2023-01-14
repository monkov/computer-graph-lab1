import React, { FC, useState } from 'react'
import styles from './Layout.module.scss'
import classNames from 'classnames'
import { Sidebar } from '../sidebar/Sidebar'
import { useCompGraphData } from '../../providers/CompGraphDataProvider'
import { Lab } from '../../core/types'
import { Stage } from '../stage/Stage'

export const Layout: FC = () => {
  const state = useCompGraphData()
  const [currentLab, setCurrentLab] = useState<Lab>(Lab.V3)

  state.lab.onChange((lab) => {
    setCurrentLab(lab)
    state.scene.get().clearScene()
  })

  return (
      <div className={styles.root}>
          <div className={styles.header}>
              <h2>CompGraph<span>.</span></h2>
              <div className={styles.labs}>
                  <div className={classNames(styles.labsItem, {
                    [styles.active]: currentLab === Lab.V1
                  })} onClick={() => state.lab.set(Lab.V1)}>Lab 1</div>
                  <div className={classNames(styles.labsItem, {
                    [styles.active]: currentLab === Lab.V2
                  })} onClick={() => state.lab.set(Lab.V2)}>Lab 2</div>
                  <div onClick={() => state.lab.set(Lab.V3)} className={classNames(styles.labsItem, {
                    [styles.active]: currentLab === Lab.V3
                  })}>Lab 3</div>
                  <div onClick={() => state.lab.set(Lab.V7)} className={classNames(styles.labsItem, {
                    [styles.active]: currentLab === Lab.V7
                  })}>Lab 7</div>
              </div>
          </div>
          <Stage/>
          <Sidebar />
      </div>
  )
}
