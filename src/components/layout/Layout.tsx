import React, { FC } from 'react'
import styles from './Layout.module.scss'
import classNames from 'classnames'
import { Sidebar } from '../sidebar/Sidebar'
import { useCompGraphData } from '../../providers/CompGraphDataProvider'
import { Lab } from '../../core/types'
import { Stage } from '../stage/Stage'

export const Layout: FC = () => {
  const state = useCompGraphData()

  return (
      <div className={styles.root}>
          <div className={styles.header}>
              <h2>CompGraph<span>.</span></h2>
              <div className={styles.labs}>
                  <div className={classNames(styles.labsItem, {
                    [styles.active]: state.lab.get() === Lab.V1
                  })}>Lab 1</div>
                  <div className={classNames(styles.labsItem, {
                    [styles.active]: state.lab.get() === Lab.V2
                  })}>Lab 2</div>
                  <div className={classNames(styles.labsItem, {
                    [styles.active]: state.lab.get() === Lab.V3
                  })}>Lab 3</div>
              </div>
          </div>
          <Stage/>
          <Sidebar />
      </div>
  )
}
