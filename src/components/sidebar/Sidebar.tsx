import React, { FC } from 'react'
import styles from './Sidebar.module.scss'
import { Lab } from '../../core/types'
import { useCompGraphData } from '../../providers/CompGraphDataProvider'
import { Lab1Content } from './lab1Content/Lab1Content'
import { Lab2Content } from './lab2Content/Lab2Content'

export const Sidebar: FC = () => {
  const state = useCompGraphData()

  return (
    <div className={styles.root}>
      {state.lab.get() === Lab.V1 && (
        <Lab1Content />
      )}
      {state.lab.get() === Lab.V2 && (
        <Lab2Content />
      )}
    </div>
  )
}
