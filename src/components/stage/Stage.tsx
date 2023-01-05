import React, { FC, useEffect } from 'react'
import styles from './Stage.module.scss'
import { useCompGraphData } from '../../providers/CompGraphDataProvider'

export const Stage: FC = () => {
  const state = useCompGraphData()

  useEffect(() => {
    state.scene.set((stage) => {
      const stageEl = document.getElementById('stage')
      if (stageEl != null) {
        const width = stageEl.offsetWidth * 2
        const height = stageEl.offsetHeight * 2;
        (stageEl as HTMLCanvasElement).width = width;
        (stageEl as HTMLCanvasElement).height = height
        const canvasCtx = (stageEl as HTMLCanvasElement).getContext('2d')
        if (canvasCtx != null) {
          stage.canvasCtx = canvasCtx
          stage.dimensions = [width, height]
        }
      }

      stage.draw()

      return stage
    })
  }, [state])

  return (
      <canvas className={styles.root} id='stage' />
  )
}
