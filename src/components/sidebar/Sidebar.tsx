import React, { FC } from 'react'
import styles from './Sidebar.module.scss'
import { Lab } from '../../core/types'
import { useCompGraphData } from '../../providers/CompGraphDataProvider'
import { Lab1Content } from './lab1Content/Lab1Content'
import { Lab2Content } from './lab2Content/Lab2Content'
import { Lab7Content } from './lab7Content/Lab7Content'
import { Lab3Content } from './lab3Content/Lab3Content'

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
      {state.lab.get() === Lab.V3 && (
        <Lab3Content />
      )}
      {state.lab.get() === Lab.V7 && (
        <Lab7Content />
      )}
    </div>
  )
}
