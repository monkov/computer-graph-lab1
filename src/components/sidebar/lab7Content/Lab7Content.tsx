import React, { FC, useEffect } from 'react'
import { useCompGraphData } from '../../../providers/CompGraphDataProvider'
import { createFractalPos, ElementType, FractalElement } from '../../../core/types'
import { Input } from '../../input/Input'
import classNames from 'classnames'
import styles from '../lab1Content/Lab1Content.module.scss'
import { useFormik } from 'formik'

const k = [
  createFractalPos(0, 0, 0, 0.5, 0, 0, 0.5),
  createFractalPos(0.42, -0.42, 0.42, 0.42, 0, 0.2, 0.4),
  createFractalPos(0.42, 0.42, -0.42, 0.42, 0, 0.2, 0.4),
  createFractalPos(0.10, 0, 0, 1, 0, 0.2, 0.15)
]

export const Lab7Content: FC = () => {
  const state = useCompGraphData()

  const { values, handleChange, errors } = useFormik({
    initialValues: {
      scale: 250,
      shiftX: 2.3,
      shiftY: 1.5
    },
    onSubmit: () => console.log('Submit!')
  })

  useEffect(() => {
    const fractal: FractalElement = {
      id: 'fractal',
      iterations: 700000,
      type: ElementType.FRACTAL,
      k
    }
    // Hack to prevent program freezes
    setTimeout(() => {
      state.get().scene.updateScene({
        scale: values.scale,
        shiftX: values.shiftX,
        disableGrid: true,
        shiftY: values.shiftY,
        elements: [fractal]
      })
    })
  }, [state, values])
  return (
    <div>
      <h3>Settings</h3>
      <Input<number>
          value={values.scale}
          onDefaultChange={handleChange}
          name='scale'
          label='Scale:'
          error={errors.scale}
      />
      <div className={classNames(styles.twoInputs, styles.withMargin)}>
        <Input<number>
            label='Shift X:'
            value={values.shiftX}
            onDefaultChange={handleChange}
            name='shiftX'
            error={errors.shiftX}
        />
        <Input<number>
            label='Shift Y:'
            value={values.shiftY}
            onDefaultChange={handleChange}
            name='shiftY'
            error={errors.shiftY}
        />
      </div>
      <div className={styles.section}>
        <h4>k:</h4>
        <div className={styles.list}>
          {
            k.map((ki, inx) => (
              <React.Fragment key={`${inx}-k-fractal-menu`}>
                <b>{inx}:</b>
                <span><b>a:</b>&nbsp;{ki[0]}</span>
                <span><b>b:</b>&nbsp;{ki[1]}</span>
                <span><b>d:</b>&nbsp;{ki[2]}</span>
                <span><b>e:</b>&nbsp;{ki[3]}</span>
                <span><b>c:</b>&nbsp;{ki[4]}</span>
                <span><b>f:</b>&nbsp;{ki[5]}</span>
                <span><b>p:</b>&nbsp;{ki[6]}</span>
              </React.Fragment>
            ))
          }
        </div>
      </div>
    </div>
  )
}
