import React, { FC, useEffect, useState } from 'react'
import styles from './Lab1Content.module.scss'
import classNames from 'classnames'
import { Element, ElementRules, ElementType, Scene, Tabs } from '../../../core/types'
import { motion } from 'framer-motion'
import { Input } from '../../input/Input'
import { useFormik } from 'formik'
import { useCompGraphData } from '../../../providers/CompGraphDataProvider'
import { createAffineFilter, createRotationFilter } from '../../../core/Filters'
import { useDebounce } from 'use-debounce'

const BuildContent: FC = () => {
  const state = useCompGraphData()

  const [disabledFieldsValues, setDisabledFieldsValues] = useState<{
    innerFigureLine: number
    outerFigureRightLine: number
  }>({
    innerFigureLine: 0,
    outerFigureRightLine: 0
  })

  const { values, errors, handleChange } = useFormik({
    initialValues: {
      scale: 10,
      shiftX: 50,
      shiftY: 50,
      outerFigureUpLine: 20,
      outerFigureDownLine: 20,
      outerFigureRightLine: 40,
      outerFigureLeftRadius: 30,
      outerFigureRightUpRadius: 10,
      outerFigureRightDownRadius: 10,
      innerFigureRadius: 20,
      innerFigureUpLine: 20,
      innerFigureDownLine: 20,
      innerCircleUpRadius: 7.5,
      innerCircleDownRadius: 7.5
    },
    onSubmit: () => console.log('Submit')
  })

  useEffect(() => {
    const {
      scale,
      shiftY,
      shiftX,
      outerFigureLeftRadius,
      outerFigureUpLine,
      outerFigureDownLine,
      outerFigureRightUpRadius,
      outerFigureRightDownRadius,
      innerFigureRadius,
      innerCircleUpRadius,
      innerCircleDownRadius
    } = values

    const startPoint = [0, 30]
    const startReversePoint = [0, -30]

    const scene: Scene = {
      scale: parseInt(String(scale)),
      shiftX: parseInt(String(shiftX)),
      shiftY: parseInt(String(shiftY)),
      elements: []
    }

    // Outer figure
    const circleOuterLeft = {
      id: 'circleOuterLeft',
      type: ElementType.CIRCLE,
      startAngle: -Math.PI / 2,
      endAngle: Math.PI / 2,
      r: parseInt(String(outerFigureLeftRadius)),
      centerX: 0,
      centerY: 0,
      reverse: true
    }

    const lineOuterUpEnd = [startPoint[0] + parseInt(String(outerFigureUpLine)), startPoint[1]]
    const lineOuterUp = {
      id: 'lineOuterUp',
      type: ElementType.LINE,
      start: startPoint,
      end: lineOuterUpEnd
    }

    const lineOuterDownEnd = [startReversePoint[0] + parseInt(String(outerFigureDownLine)), startReversePoint[1]]
    const lineOuterDown = {
      id: 'lineOuterDown',
      type: ElementType.LINE,
      start: startReversePoint,
      end: lineOuterDownEnd
    }

    const circleOuterRightUp = {
      id: 'circleOuterRightUp',
      type: ElementType.CIRCLE,
      startAngle: 0,
      endAngle: Math.PI / 2,
      r: parseInt(String(outerFigureRightUpRadius)),
      centerX: lineOuterUpEnd[0],
      centerY: lineOuterUpEnd[1] - parseInt(String(outerFigureRightUpRadius)),
      reverse: false
    }

    const lineOuterRightStartPos = [
      circleOuterRightUp.r * Math.cos(circleOuterRightUp.startAngle) + circleOuterRightUp.centerX,
      circleOuterRightUp.r * Math.sin(circleOuterRightUp.startAngle) + circleOuterRightUp.centerY
    ]

    const circleOuterRightDown = {
      id: 'circleOuterRightDown',
      type: ElementType.CIRCLE,
      startAngle: Math.PI / 2,
      endAngle: Math.PI,
      r: parseInt(String(outerFigureRightDownRadius)),
      centerX: lineOuterDownEnd[0],
      centerY: lineOuterDownEnd[1] + parseInt(String(outerFigureRightDownRadius)),
      reverse: true
    }

    const circleOuterRightDownEndPos = [
      circleOuterRightDown.r * Math.cos(circleOuterRightDown.endAngle) + circleOuterRightDown.centerX,
      circleOuterRightDown.r * Math.sin(circleOuterRightDown.endAngle) + circleOuterRightDown.centerY
    ]

    const lineOuterRight = {
      id: 'lineOuterRight',
      type: ElementType.LINE,
      start: [30, lineOuterRightStartPos[1]],
      end: [30, circleOuterRightDownEndPos[1]]
    }

    const lineOuterRightLength = Math.abs(lineOuterRightStartPos[1] - circleOuterRightDownEndPos[1])

    // Add support line for Right Up Circle
    const supportOuterCircleRightUpLine = {
      id: 'supportOuterCircleRightUpLine',
      type: ElementType.LINE,
      bindRules: [
        {
          rule: ElementRules.BindStartToStart,
          element: 'lineOuterRight'
        },
        {
          rule: ElementRules.BindEndToStart,
          element: 'circleOuterRightUp'
        }
      ]
    }

    // Add support line for Right Down Circle
    const supportOuterCircleRightDownLine = {
      id: 'supportOuterCircleRightUpLine',
      type: ElementType.LINE,
      bindRules: [
        {
          rule: ElementRules.BindStartToEnd,
          element: 'lineOuterRight'
        },
        {
          rule: ElementRules.BindEndToEnd,
          element: 'circleOuterRightDown'
        }
      ]
    }

    // Add support line, and bind it to circle and upper line
    const supportCircleOuterLeftLineUp = {
      id: 'supportCircleOuterLeftLineUp',
      type: ElementType.LINE,
      bindRules: [
        {
          rule: ElementRules.BindStartToStart,
          element: 'circleOuterLeft'
        },
        {
          rule: ElementRules.BindEndToStart,
          element: 'lineOuterUp'
        }
      ]
    }

    // Add support line, and bind it to circle and down line
    const supportCircleOuterLeftLineDown = {
      id: 'supportCircleOuterLeftLineDown',
      type: ElementType.LINE,
      bindRules: [
        {
          rule: ElementRules.BindStartToEnd,
          element: 'circleOuterLeft'
        },
        {
          rule: ElementRules.BindEndToStart,
          element: 'lineOuterDown'
        }
      ]
    }

    // Push outer figure to the builder
    scene.elements.push(...[
      circleOuterLeft,
      lineOuterUp,
      lineOuterDown,
      circleOuterRightUp,
      supportCircleOuterLeftLineUp,
      supportCircleOuterLeftLineDown,
      circleOuterRightDown,
      lineOuterRight,
      supportOuterCircleRightUpLine,
      supportOuterCircleRightDownLine
    ] as Element[])

    // Inner figure
    const circleInnerLeft = {
      id: 'circleInnerLeft',
      type: ElementType.CIRCLE,
      startAngle: -Math.PI / 2,
      endAngle: Math.PI / 2,
      r: parseInt(String(innerFigureRadius)),
      centerX: 0,
      centerY: 0,
      reverse: true
    }

    const lineInnerUpper = {
      id: 'lineInnerUpper',
      type: ElementType.LINE,
      end: [circleInnerLeft.r, 0],
      bindRules: [
        {
          rule: ElementRules.BindStartToStart,
          element: 'circleInnerLeft'
        }
      ]
    }

    const lineInnerDown = {
      id: 'lineInnerDown',
      type: ElementType.LINE,
      end: [circleInnerLeft.r, 0],
      bindRules: [
        {
          rule: ElementRules.BindStartToEnd,
          element: 'circleInnerLeft'
        }
      ]
    }

    const innerLineLength = Math.sqrt(Math.pow(circleInnerLeft.r, 2) * 2)

    // Push inner figure to the builder
    scene.elements.push(...[
      circleInnerLeft,
      lineInnerUpper,
      lineInnerDown
    ] as Element[])

    // Inner circle1
    const circleInner1 = {
      id: 'circleInner1',
      type: ElementType.CIRCLE,
      startAngle: -Math.PI,
      endAngle: Math.PI,
      r: parseInt(String(innerCircleUpRadius)),
      centerX: 21,
      centerY: 21,
      reverse: true
    }

    scene.elements.push(...[circleInner1] as Element[])

    // Inner circle1
    const circleInner2 = {
      id: 'circleInner2',
      type: ElementType.CIRCLE,
      startAngle: -Math.PI,
      endAngle: Math.PI,
      r: parseInt(String(innerCircleDownRadius)),
      centerX: 21,
      centerY: -21,
      reverse: true
    }

    scene.elements.push(...[circleInner2] as Element[])

    state.scene.get().updateScene(scene)

    setDisabledFieldsValues({ innerFigureLine: innerLineLength, outerFigureRightLine: lineOuterRightLength })

    console.log('Update', scene)
  }, [values])

  return (
    <>
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
        <h4>Outer Figure</h4>
        <div className={styles.twoInputs}>
          <Input<number>
            label='Up line:'
            value={values.outerFigureUpLine}
            onDefaultChange={handleChange}
            name='outerFigureUpLine'
            error={errors.outerFigureUpLine}
          />
          <Input<number>
            label='R (Left):'
            value={values.outerFigureLeftRadius}
            onDefaultChange={handleChange}
            name='outerFigureLeftRadius'
            error={errors.outerFigureLeftRadius}
          />
          <Input<number>
            label='Down line:'
            value={values.outerFigureDownLine}
            onDefaultChange={handleChange}
            name='outerFigureDownLine'
            error={errors.outerFigureDownLine}
          />
          <Input<number>
            label='R (Right Upper):'
            value={values.outerFigureRightUpRadius}
            onDefaultChange={handleChange}
            name='outerFigureRightUpRadius'
            error={errors.outerFigureRightUpRadius}
          />
          <Input<number>
              label='Right line:'
              disabled={true}
              value={disabledFieldsValues.outerFigureRightLine}
          />
          <Input<number>
              label='R (Right Down):'
              value={values.outerFigureRightDownRadius}
              onDefaultChange={handleChange}
              name='outerFigureRightDownRadius'
              error={errors.outerFigureRightDownRadius}
          />
        </div>
      </div>
      <div className={styles.section}>
        <h4>Inner Figure</h4>
        <div className={styles.twoInputs}>
          <Input<number>
            label='R:'
            value={values.innerFigureRadius}
            onDefaultChange={handleChange}
            name='innerFigureRadius'
            error={errors.innerFigureRadius}
          />
          <Input<number>
            label='Upper line:'
            value={disabledFieldsValues.innerFigureLine}
            disabled={true}
          />
          <Input<number>
            label='Down line:'
            value={disabledFieldsValues.innerFigureLine}
            disabled={true}
          />
        </div>
      </div>
      <div className={styles.section}>
        <h4>Inner Circle (UP)</h4>
        <Input<number>
          label='R:'
          value={values.innerCircleUpRadius}
          onDefaultChange={handleChange}
          name='innerCircleUpRadius'
          error={errors.innerCircleUpRadius}
        />
      </div>
      <div className={styles.section}>
        <h4>Inner Circle (Down)</h4>
        <Input<number>
          label='R:'
          value={values.innerCircleDownRadius}
          onDefaultChange={handleChange}
          name='innerCircleDownRadius'
          error={errors.innerCircleDownRadius}
        />
      </div>
    </>
  )
}

const ManipulateContent: FC = () => {
  const state = useCompGraphData()
  const { values: rotateValues, handleChange: handleRotateValuesChange, errors: rotateErrors } = useFormik({
    initialValues: {
      angle: 0,
      shiftX: 0,
      shiftY: 0
    },
    onSubmit: () => console.log('Submit')
  })

  const { values: affineValues, handleChange: handleAffineValuesChange, errors: affineErrors } = useFormik({
    initialValues: {
      xx: 1,
      xy: 0,
      yx: 0,
      yy: 1,
      ox: 0,
      oy: 0
    },
    onSubmit: () => console.log('Submit')
  })

  const { values: projectiveValues, handleChange: handleProjectiveValuesChange, errors: projectiveErrors } = useFormik({
    initialValues: {
      xx: 100,
      xy: 0,
      wx: 1,
      yx: 0,
      yy: 100,
      wy: 1,
      ox: 0,
      oy: 0,
      wo: 300
    },
    onSubmit: () => console.log('Submit')
  })

  const [rotateValuesDebounced] = useDebounce(rotateValues, 5)

  useEffect(() => {
    state.scene.get().updateFilterById(createRotationFilter(rotateValuesDebounced.shiftX, rotateValuesDebounced.shiftY, rotateValuesDebounced.angle / 1000 * Math.PI))
  }, [rotateValuesDebounced])

  useEffect(() => {
    state.scene.get().updateFilterById(createAffineFilter(affineValues.xx, affineValues.xy, affineValues.yx, affineValues.yy, affineValues.ox, affineValues.oy))
  }, [affineValues])

  // useEffect(() => {
  //   state.scene.get().updateFilterById(createProjectiveFilter(
  //     projectiveValues.xx,
  //     projectiveValues.xy,
  //     projectiveValues.wx,
  //     projectiveValues.yx,
  //     projectiveValues.yy,
  //     projectiveValues.wy,
  //     projectiveValues.ox,
  //     projectiveValues.oy,
  //     projectiveValues.wo
  //   ))
  // }, [projectiveValues])

  return (<>
    <h4>Rotate</h4>
    <div className={styles.rangeInput}>
      <input
          type="range"
          name="angle"
          min="0"
          max="2000"
          onChange={handleRotateValuesChange}
          step="1"
          value={rotateValues.angle}
      />
    </div>
    <div className={styles.twoInputs} style={{ marginTop: '28px' }}>
      <Input
        name='shiftX'
        onDefaultChange={handleRotateValuesChange}
        error={rotateErrors.shiftX}
        label='shiftX'
        value={rotateValues.shiftX}
      />
      <Input
          name='shiftY'
          onDefaultChange={handleRotateValuesChange}
          error={rotateErrors.shiftY}
          label='shiftY'
          value={rotateValues.shiftY}
      />
    </div>
    <div className={styles.section}>
      <h4>Affine transformation</h4>
      <div className={styles.twoInputs}>
        <Input
            name='xx'
            onDefaultChange={handleAffineValuesChange}
            error={affineErrors.xx}
            label='XX'
            value={affineValues.xx}
        />
        <Input
            name='xy'
            onDefaultChange={handleAffineValuesChange}
            error={affineErrors.xy}
            label='XY'
            value={affineValues.xy}
        />
      </div>
      <div className={styles.twoInputs}>
        <Input
            name='yx'
            onDefaultChange={handleAffineValuesChange}
            error={affineErrors.yx}
            label='YX'
            value={affineValues.yx}
        />
        <Input
            name='yy'
            onDefaultChange={handleAffineValuesChange}
            error={affineErrors.yy}
            label='YY'
            value={affineValues.yy}
        />
      </div>
      <div className={styles.twoInputs}>
        <Input
            name='ox'
            onDefaultChange={handleAffineValuesChange}
            error={affineErrors.ox}
            label='OX'
            value={affineValues.ox}
        />
        <Input
            name='oy'
            onDefaultChange={handleAffineValuesChange}
            error={affineErrors.oy}
            label='OY'
            value={affineValues.oy}
        />
      </div>
    </div>
    <div className={styles.section}>
      <h4>Projective transformation</h4>
      <div className={styles.threeInputs}>
        <Input
            name='xx'
            onDefaultChange={handleProjectiveValuesChange}
            error={projectiveErrors.xx}
            label='XX'
            value={projectiveValues.xx}
        />
        <Input
            name='xy'
            onDefaultChange={handleProjectiveValuesChange}
            error={projectiveErrors.xy}
            label='XY'
            value={projectiveValues.xy}
        />
        <Input
            name='wx'
            onDefaultChange={handleProjectiveValuesChange}
            error={projectiveErrors.wx}
            label='WX'
            value={projectiveValues.wx}
        />
        <Input
            name='yx'
            onDefaultChange={handleProjectiveValuesChange}
            error={projectiveErrors.yx}
            label='YX'
            value={projectiveValues.yx}
        />
        <Input
            name='yy'
            onDefaultChange={handleProjectiveValuesChange}
            error={projectiveErrors.yy}
            label='YY'
            value={projectiveValues.yy}
        />
        <Input
            name='wy'
            onDefaultChange={handleProjectiveValuesChange}
            error={projectiveErrors.wy}
            label='WY'
            value={projectiveValues.wy}
        />
        <Input
            name='ox'
            onDefaultChange={handleProjectiveValuesChange}
            error={projectiveErrors.ox}
            label='OX'
            value={projectiveValues.ox}
        />
        <Input
            name='oy'
            onDefaultChange={handleProjectiveValuesChange}
            error={projectiveErrors.oy}
            label='OY'
            value={projectiveValues.oy}
        />
        <Input
            name='wo'
            onDefaultChange={handleProjectiveValuesChange}
            error={projectiveErrors.wo}
            label='WO'
            value={projectiveValues.wo}
        />
      </div>
    </div>
  </>)
}

export const Lab1Content: FC = () => {
  const [selectedTab, setSelectedTab] = useState(Tabs.Build)

  return (
    <>
      <h3>Settings</h3>
      <div className={styles.tabs}>
        <div
          className={classNames(styles.tab, { [styles.active]: selectedTab === Tabs.Build })}
          onClick={() => setSelectedTab(Tabs.Build)}
        >
          Figure
          {Tabs.Build === selectedTab && (
            <motion.div className={styles.underline} layoutId="underline" />
          )}
        </div>
        <div
          className={classNames(styles.tab, { [styles.active]: selectedTab === Tabs.Manipulate })}
          onClick={() => setSelectedTab(Tabs.Manipulate)}
        >
          Manipulate
          {Tabs.Manipulate === selectedTab && (
            <motion.div className={styles.underline} layoutId="underline" />
          )}
        </div>
      </div>
      <div className={styles.content}>

        <div className={classNames(styles.slider, {
          [styles.hide]: selectedTab !== Tabs.Build
        })}>
          <BuildContent />
        </div>
        <div className={classNames(styles.slider, {
          [styles.hide]: selectedTab !== Tabs.Manipulate
        })}>
          <ManipulateContent />
        </div>
      </div>
    </>
  )
}
