import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { Input } from '../../input/Input'
import classNames from 'classnames'
import styles from '../lab1Content/Lab1Content.module.scss'
import { useFormik } from 'formik'
import { useCompGraphData } from '../../../providers/CompGraphDataProvider'
import { ElementType, Lab, NicomedesCarhoidElement, Pos } from '../../../core/types'
import Timeline from '../../../core/Timeline'
import * as yup from 'yup'
import { ManipulateContent } from '../lab1Content/Lab1Content'

const getShift = (dimensions: Pos, scale: number): Pos =>
  [Math.round(dimensions[0] / scale / 2), Math.round(dimensions[1] / scale / 2)]

export const Lab2Content: FC = () => {
  const state = useCompGraphData()
  const [lineLength, setLineLength] = useState(0)

  const initialShift = useMemo(() => {
    const dimensions = state.scene.get().getDimensions()
    const scale = state.scene.get().getScale()

    return getShift(dimensions, scale)
  }, [state])

  const { values, handleChange, errors, setFieldValue } = useFormik({
    initialValues: {
      scale: 8,
      shiftX: initialShift[0],
      shiftY: initialShift[1],
      a: -4,
      b: 2,
      figureHighlightFrom: 0,
      figureHighlightTo: 0,
      enableTagnet: false,
      enableNormal: false,
      enableAsymptotes: false,
      enablePDots: true,
      testPosT: 0
    },
    onSubmit: () => console.log('Submit!'),
    validateOnChange: true,
    validationSchema: yup.object().shape({
      scale: yup.number(),
      shiftX: yup.number(),
      a: yup.number(),
      b: yup.number(),
      figureHighlightFrom: yup.number().min(0, 'Should be more than 0').max(2, 'Should be less than 2'),
      figureHighlightTo: yup.number().min(0, 'Should be more than 0').max(2, 'Should be less than 2')
    })
  })

  const timeLine = useRef(new Timeline((t, fromControl) => {
    const nc: NicomedesCarhoidElement = {
      type: ElementType.NicomedesCarhoid,
      id: 'nc',
      a: -4 + t * (8 / 2000),
      b: 2,
      testPos: 0
    }
    setFieldValue('a', nc.a).then(() => {}).catch(() => {})
    setFieldValue('b', nc.b).then(() => {}).catch(() => {})
    if (!fromControl) {
      setTimeout(() => {
        const barEl = document.getElementById('time-line-progress') as HTMLInputElement
        if (barEl !== null) {
          console.log(`Test ${t / 20}`)
          barEl.value = `${t / 20}`
        }
      })
    }
    state.scene.get().updateScene({
      elements: [nc]
    })
  }, 2000).injectProgress('timer-time'))

  useEffect(() => {
    if (timeLine.current.isPlaying) {
      return
    }
    const nc: NicomedesCarhoidElement = {
      type: ElementType.NicomedesCarhoid,
      id: 'nc',
      a: parseFloat(values.a.toString()),
      b: parseFloat(values.b.toString()),
      highlight: {
        from: parseFloat(values.figureHighlightFrom.toString()) * Math.PI,
        to: parseFloat(values.figureHighlightTo.toString()) * Math.PI
      },
      enableTagnet: values.enableTagnet,
      enableNormal: values.enableNormal,
      enableAsymptotes: values.enableAsymptotes,
      enablePDots: values.enablePDots,
      testPos: parseFloat(values.testPosT.toString())
    }

    const arrows = {
      lab: Lab.V2,
      type: ElementType.ARROWS,
      id: 'arrows'
    }

    const scene = {
      scale: values.scale,
      shiftY: values.shiftY,
      shiftX: values.shiftX,
      elements: [nc, arrows]
    }

    if (scene.scale !== state.scene.get().getScale()) {
      const shift = getShift(state.scene.get().getDimensions(), scene.scale)
      scene.shiftX = shift[0]
      scene.shiftY = shift[1]
      setFieldValue('shiftX', shift[0]).then(() => {}).catch(() => {})
      setFieldValue('shiftY', shift[1]).then(() => {}).catch(() => {})
    }

    state.scene.get().updateScene(scene)
  }, [values])

  useEffect(() => {
    // trapezoidal rule
    const arcLength = (a: number, b: number, from: number, to: number): number => {
      const steps = 1000
      const h = (to - from) / steps
      let sum = 0

      for (let i = 1; i < steps; i++) {
        const theta = from + i * h
        const r = a / Math.cos(theta) + b
        const rDer = a * Math.sin(theta) / Math.pow(Math.cos(theta), 2)
        const f = Math.sqrt(Math.pow(rDer, 2) + Math.pow(r, 2))
        sum += f
      }

      return (h / 2) * (2 * sum)
    }

    setLineLength(arcLength(
      values.a,
      values.b,
      parseFloat(values.figureHighlightFrom.toString()) * Math.PI,
      parseFloat(values.figureHighlightTo.toString()) * Math.PI
    ))
  }, [values.a, values.b, values.figureHighlightFrom, values.figureHighlightTo])

  const handlePlay = (): void => {
    timeLine.current.play()
  }

  const handlePause = (): void => {
    timeLine.current.pause()
  }

  const handleReset = (): void => {
    timeLine.current.reset()
  }

  return (<>
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
      <h4>Carhoid</h4>
      <div className={classNames(styles.twoInputs, styles.withMargin)}>
        <Input<number>
            label='a:'
            value={values.a}
            onDefaultChange={handleChange}
            name='a'
            error={errors.a}
        />
        <Input<number>
            label='b:'
            value={values.b}
            onDefaultChange={handleChange}
            name='b'
            error={errors.b}
        />
      </div>
      <div className={classNames(styles.rangeInput, styles.animation)}>
        <input
            type={'range'}
            id={'time-line-progress'}
            max={100}
            defaultValue={0}
            onChange={(e) => {
              timeLine.current.setProgress(e.target.valueAsNumber * 20)
            }}
        />
      </div>
      <div className={styles.control}>
        <div className={styles.time}>Animation:&nbsp;<div id={'timer-time'}>0s</div></div>
        <div className={styles.btns}>
          <div className={styles.btn} onClick={handlePlay}>Play</div>
          <div className={styles.btn} onClick={handlePause}>Pause</div>
          <div className={styles.btn} onClick={handleReset}>Reset</div>
        </div>
      </div>
    </div>
     <div className={styles.section}>
      <h4>Highlight</h4>
      <div className={classNames(styles.twoInputs, styles.withMargin)}>
        <div className={styles.inputWrapper}>
          <Input<number>
              label='From:'
              value={values.figureHighlightFrom}
              onDefaultChange={handleChange}
              name='figureHighlightFrom'
              error={errors.figureHighlightFrom}
          />
          <span className={styles.text}> * Pi</span>
        </div>
        <div className={styles.inputWrapper}>
          <Input<number>
              label='To:'
              value={values.figureHighlightTo}
              onDefaultChange={handleChange}
              name='figureHighlightTo'
              error={errors.figureHighlightTo}
          />
          <span className={styles.text}> * Pi</span>
        </div>
        <Input<number>
            label='Highlight Length:'
            value={lineLength}
            disabled
        />
      </div>
     </div>
     <div className={styles.section}>
      <h4>Options</h4>
      <div className={classNames(styles.twoInputs, styles.withMargin)}>
        <div className={styles.checkboxSection}>
          <input
              type={'checkbox'}
              name={'enableTagnet'}
              onChange={handleChange}
              checked={values.enableTagnet}
          />
          Enable tagnet
        </div>
        <div className={styles.inputWrapper}>
          <Input<number>
              label='Test Point:'
              value={values.testPosT}
              onDefaultChange={handleChange}
              name='testPosT'
              error={errors.testPosT}
          />
          <span className={styles.text}> * Pi</span>
        </div>
      </div>
      <div className={styles.twoInputs}>
        <div className={styles.checkboxSection}>
          <input
              type={'checkbox'}
              name={'enableNormal'}
              onChange={handleChange}
              checked={values.enableNormal}
          />
          Enable normal
        </div>
        <div className={styles.inputWrapper}>
        </div>
      </div>
      <div className={styles.twoInputs}>
        <div className={styles.checkboxSection}>
          <input
              type={'checkbox'}
              name={'enableAsymptotes'}
              onChange={handleChange}
              checked={values.enableAsymptotes}
          />
          Enable asymptotes
        </div>
        <div className={styles.inputWrapper}>
        </div>
      </div>
      <div className={styles.twoInputs}>
        <div className={styles.checkboxSection}>
          <input
              type={'checkbox'}
              name={'enablePDots'}
              onChange={handleChange}
              checked={values.enablePDots}
          />
          Enable inflection points
        </div>
        <div className={styles.inputWrapper}>
        </div>
      </div>
     </div>
    <div className={styles.section}></div>
    <ManipulateContent />
  </>)
}
