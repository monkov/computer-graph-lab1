import React, { FC, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Input } from '../../input/Input'
import classNames from 'classnames'
import styles from '../lab1Content/Lab1Content.module.scss'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useCompGraphData } from '../../../providers/CompGraphDataProvider'
import { ElementRules, ElementType, EngineeringCurveElement, Scene } from '../../../core/types'
import picImg from './img/pic.png'
import { ManipulateContent } from '../lab1Content/Lab1Content'
import Timeline from '../../../core/Timeline'

const curves: EngineeringCurveElement[] = [
  {
    id: 'c-1',
    type: ElementType.EngineeringCurve,
    a: [10, 19],
    b: [13, 24],
    c: [23, 21],
    d: [21, 20],
    wa: 2,
    wb: 85,
    wc: 15,
    wd: 2,
    enableDescriptors: true
  },
  {
    id: 'c-2',
    type: ElementType.EngineeringCurve,
    a: [20, 29],
    b: [15, 24],
    c: [26, 0],
    d: [27.1, -1],
    wa: 1,
    wb: 1,
    wc: 24,
    wd: 4,
    bindRules: [
      {
        element: 'c-1',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-3',
    type: ElementType.EngineeringCurve,
    a: [30, 29],
    b: [28, -1],
    c: [27, -3],
    d: [30, -3],
    wa: 1,
    wb: 1,
    wc: 2,
    wd: 1,
    bindRules: [
      {
        element: 'c-2',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-4',
    type: ElementType.EngineeringCurve,
    a: [33, 29],
    b: [32, -5.5],
    c: [32.5, -2.5],
    d: [33.6, -1.4],
    wa: 1,
    wb: 1,
    wc: 3,
    wd: 1,
    bindRules: [
      {
        element: 'c-3',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-5',
    type: ElementType.EngineeringCurve,
    a: [33, 29],
    b: [33.1, -0.4],
    c: [35, 1.5],
    d: [32, 1.2],
    wa: 1,
    wb: 1,
    wc: 1,
    wd: 2,
    bindRules: [
      {
        element: 'c-4',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-6',
    type: ElementType.EngineeringCurve,
    a: [35, 29],
    b: [28, 3],
    c: [30, 9],
    d: [27.5, 14.4],
    wa: 1,
    wb: 1,
    wc: 1,
    wd: 4,
    bindRules: [
      {
        element: 'c-5',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-7',
    type: ElementType.EngineeringCurve,
    a: [30.1, 18],
    b: [30.1, 18],
    c: [30.7, 8],
    d: [32.5, 8],
    wa: 2,
    wb: 6,
    wc: 6,
    wd: 1,
    bindRules: [
      {
        element: 'c-6',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-8',
    type: ElementType.EngineeringCurve,
    a: [32.1, 18],
    b: [32.6, 6.9],
    c: [39, 8.2],
    d: [37, 11],
    wa: 2,
    wb: 12,
    wc: 26,
    wd: 6,
    bindRules: [
      {
        element: 'c-7',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-9',
    type: ElementType.EngineeringCurve,
    a: [32.1, 18],
    b: [36, 13],
    c: [35, 8],
    d: [33.6, 18.5],
    wa: 1,
    wb: 1,
    wc: 1.2,
    wd: 1,
    bindRules: [
      {
        element: 'c-8',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-10',
    type: ElementType.EngineeringCurve,
    a: [32.1, 18],
    b: [39, 23.5],
    c: [40.8, 16.4],
    d: [45, 17.6],
    wa: 1,
    wb: 1,
    wc: 1,
    wd: 3,
    bindRules: [
      {
        element: 'c-9',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-11',
    type: ElementType.EngineeringCurve,
    a: [32.1, 18],
    b: [49.1, 17.3],
    c: [49, 13.8],
    d: [50.7, 14.5],
    wa: 1,
    wb: 1,
    wc: 1,
    wd: 1,
    bindRules: [
      {
        element: 'c-10',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-12',
    type: ElementType.EngineeringCurve,
    a: [32.1, 18],
    b: [56.6, 11.5],
    c: [55, 15.1],
    d: [57.8, 14.9],
    wa: 1,
    wb: 1,
    wc: 1,
    wd: 4,
    bindRules: [
      {
        element: 'c-11',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-13',
    type: ElementType.EngineeringCurve,
    a: [33, 23],
    b: [57.5, 17],
    c: [57.9, 19.5],
    d: [56, 21],
    wa: 1,
    wb: 4,
    wc: 2,
    wd: 1,
    bindRules: [
      {
        element: 'c-12',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-14',
    type: ElementType.EngineeringCurve,
    a: [33, 23],
    b: [52.5, 22.5],
    c: [55, 25.9],
    d: [50.7, 28.4],
    wa: 1,
    wb: 1,
    wc: 1,
    wd: 1,
    bindRules: [
      {
        element: 'c-13',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-15',
    type: ElementType.EngineeringCurve,
    a: [33, 23],
    b: [52.7, 33.9],
    c: [50, 36.5],
    d: [47.8, 31.7],
    wa: 1,
    wb: 4,
    wc: 4,
    wd: 1,
    bindRules: [
      {
        element: 'c-14',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-16',
    type: ElementType.EngineeringCurve,
    a: [33, 23],
    b: [38, 36.5],
    c: [37.5, 41.2],
    d: [36, 40],
    wa: 1,
    wb: 1,
    wc: 1,
    wd: 1,
    bindRules: [
      {
        element: 'c-15',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-17',
    type: ElementType.EngineeringCurve,
    a: [33, 23],
    b: [35.7, 42],
    c: [30, 41.3],
    d: [30, 42.6],
    wa: 1,
    wb: 1,
    wc: 1,
    wd: 1,
    bindRules: [
      {
        element: 'c-16',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-18',
    type: ElementType.EngineeringCurve,
    a: [33, 23],
    b: [22, 39],
    c: [22.5, 41.3],
    d: [20, 40.7],
    wa: 1,
    wb: 2,
    wc: 2,
    wd: 1,
    bindRules: [
      {
        element: 'c-17',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-19',
    type: ElementType.EngineeringCurve,
    a: [33, 23],
    b: [9, 41.9],
    c: [5.5, 39.6],
    d: [5, 40.3],
    wa: 1,
    wb: 7,
    wc: 12,
    wd: 10,
    bindRules: [
      {
        element: 'c-18',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-20',
    type: ElementType.EngineeringCurve,
    a: [33, 23],
    b: [-3.5, 36],
    c: [1, 32],
    d: [-3.4, 27],
    wa: 1.5,
    wb: 2.2,
    wc: 1,
    wd: 1,
    bindRules: [
      {
        element: 'c-19',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-21',
    type: ElementType.EngineeringCurve,
    a: [33, 23],
    b: [-5.8, 22],
    c: [-2.5, 18],
    d: [-4.8, 16.7],
    wa: 1,
    wb: 1,
    wc: 1.5,
    wd: 1,
    bindRules: [
      {
        element: 'c-20',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-22',
    type: ElementType.EngineeringCurve,
    a: [33, 23],
    b: [-6.2, 13],
    c: [-5, 8],
    d: [-6.3, 6],
    wa: 1,
    wb: 1,
    wc: 1,
    wd: 1,
    bindRules: [
      {
        element: 'c-21',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-23',
    type: ElementType.EngineeringCurve,
    a: [33, 23],
    b: [-6.9, 3.9],
    c: [-3.5, 0],
    d: [-2.8, 0.1],
    wa: 1,
    wb: 140,
    wc: 140,
    wd: 5,
    bindRules: [
      {
        element: 'c-22',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-24',
    type: ElementType.EngineeringCurve,
    a: [33, 23],
    b: [0, 0],
    c: [-1.2, 2.8],
    d: [0, 2.2],
    wa: 1,
    wb: 1,
    wc: 1,
    wd: 1,
    bindRules: [
      {
        element: 'c-23',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-25',
    type: ElementType.EngineeringCurve,
    a: [33, 23],
    b: [0.8, 5.5],
    c: [-4.4, 5],
    d: [-0.6, 13.1],
    wa: 1,
    wb: 4,
    wc: 2,
    wd: 1,
    bindRules: [
      {
        element: 'c-24',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-26',
    type: ElementType.EngineeringCurve,
    a: [33, 23],
    b: [4, 8.6],
    c: [5.7, 12.5],
    d: [5.3, 13.5],
    wa: 1,
    wb: 2,
    wc: 10,
    wd: 1,
    bindRules: [
      {
        element: 'c-25',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-27',
    type: ElementType.EngineeringCurve,
    a: [33, 23],
    b: [2.7, 18.6],
    c: [5, 17.5],
    d: [4.6, 18.9],
    wa: 1,
    wb: 1.7,
    wc: 2,
    wd: 1,
    bindRules: [
      {
        element: 'c-26',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-28',
    type: ElementType.EngineeringCurve,
    a: [33, 23],
    b: [5, 20],
    c: [8.6, 12],
    d: [9.5, 12.9],
    wa: 1,
    wb: 2,
    wc: 4,
    wd: 1,
    bindRules: [
      {
        element: 'c-27',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-29',
    type: ElementType.EngineeringCurve,
    a: [33, 23],
    b: [10.4, 10.1],
    c: [12.3, 13.5],
    d: [13.5, 12],
    wa: 1,
    wb: 1,
    wc: 1,
    wd: 1,
    bindRules: [
      {
        element: 'c-28',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-30',
    type: ElementType.EngineeringCurve,
    a: [33, 23],
    b: [17, 12.5],
    c: [14.6, 15.4],
    d: [14, 14.8],
    wa: 1,
    wb: 2,
    wc: 2,
    wd: 1,
    bindRules: [
      {
        element: 'c-29',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  },
  {
    id: 'c-31',
    type: ElementType.EngineeringCurve,
    a: [33, 23],
    b: [11, 15.5],
    c: [14.6, 15.4],
    d: [10, 19],
    wa: 1,
    wb: 1,
    wc: 0,
    wd: 1,
    bindRules: [
      {
        element: 'c-30',
        rule: ElementRules.BindStartToEnd
      }
    ],
    enableDescriptors: true
  }
]

interface CurveItemProps extends EngineeringCurveElement {
  onChange: (curve: EngineeringCurveElement) => void
  formControlRef: React.RefObject
}

const CurveItem: FC<CurveItemProps> = ({
  a,
  b,
  c,
  d,
  wa,
  wd,
  wc,
  wb,
  id,
  type,
  onChange,
  bindRules,
  formControlRef
}) => {
  const { values, errors, handleChange, setValues } = useFormik({
    initialValues: {
      bind: bindRules?.find((bind) => bind.rule === ElementRules.BindStartToEnd)?.element ?? '',
      xa: a[0],
      xb: b[0],
      xc: c[0],
      xd: d[0],
      ya: a[1],
      yb: b[1],
      yc: c[1],
      yd: d[1],
      wa,
      wb,
      wc,
      wd
    },
    onSubmit: () => {}
  })

  useImperativeHandle(formControlRef, () => ({
    resetForm: async (curve: EngineeringCurveElement) => {
      await setValues({
        bind: bindRules?.find((bind) => bind.rule === ElementRules.BindStartToEnd)?.element ?? '',
        xa: curve.a[0],
        xb: curve.b[0],
        xc: curve.c[0],
        xd: curve.d[0],
        ya: curve.a[1],
        yb: curve.b[1],
        yc: curve.c[1],
        yd: curve.d[1],
        wa: curve?.wa,
        wb: curve.wb,
        wc: curve.wc,
        wd: curve.wd
      })
    }
  }), [setValues])

  useEffect(() => {
    const castValues = Object.keys(values).map((key) => ({ [key]: parseFloat(({ ...values }[key] as number).toString()) }))
      .reduce((prevVal, currVal) => ({ ...prevVal, ...currVal }), {})

    onChange({
      enableDescriptors: true,
      id,
      type,
      a: [castValues.xa, castValues.ya],
      b: [castValues.xb, castValues.yb],
      c: [castValues.xc, castValues.yc],
      d: [castValues.xd, castValues.yd],
      wa: castValues.wa,
      wb: castValues.wb,
      wc: castValues.wc,
      wd: castValues.wd,
      bindRules: [
        {
          element: values.bind,
          rule: ElementRules.BindStartToEnd
        }
      ]
    })
  }, [values])

  return (
    <div className={styles.curveWrapper}>
      <h4>{id}</h4>
      <div className={styles.checkboxSection}>
        Bind to:&nbsp;&nbsp;&nbsp;
        <Input<string>
            value={values.bind}
            onDefaultChange={handleChange}
            name='bind'
            error={errors.bind}
        />
      </div>
      <div className={styles.curveBlock}>
        <div>
          <div className={styles.twoInputs}>
            <Input<number>
                label='xa'
                value={values.bind !== '' ? undefined : values.xa}
                onDefaultChange={handleChange}
                name='xa'
                disabled={values.bind !== ''}
                error={errors.xa}
            />
            <Input<number>
                label='ya'
                value={values.bind !== '' ? undefined : values.ya}
                onDefaultChange={handleChange}
                name='ya'
                disabled={values.bind !== ''}
                error={errors.ya}
            />
          </div>
        </div>
        <div>
          <div className={styles.twoInputs}>
            <Input<number>
                label='xb'
                value={values.xb}
                onDefaultChange={handleChange}
                name='xb'
                error={errors.xb}
            />
            <Input<number>
                label='yb'
                value={values.yb}
                onDefaultChange={handleChange}
                name='yb'
                error={errors.yb}
            />
          </div>
        </div>
        <div>
          <div className={styles.twoInputs}>
            <Input<number>
                label='xc'
                value={values.xc}
                onDefaultChange={handleChange}
                name='xc'
                error={errors.xc}
            />
            <Input<number>
                label='yc'
                value={values.yc}
                onDefaultChange={handleChange}
                name='yc'
                error={errors.yc}
            />
          </div>
        </div>
        <div>
          <div className={styles.twoInputs}>
            <Input<number>
                label='xd'
                value={values.xd}
                onDefaultChange={handleChange}
                name='xd'
                error={errors.xd}
            />
            <Input<number>
                label='yd'
                value={values.yd}
                onDefaultChange={handleChange}
                name='yd'
                error={errors.yd}
            />
          </div>
        </div>
        <div>
          <div className={classNames(styles.twoInputs, styles.withoutMargin)}>
            <Input<number>
                label='wa'
                value={values.wa}
                onDefaultChange={handleChange}
                name='wa'
                error={errors.wa}
            />
            <Input<number>
                label='wb'
                value={values.wb}
                onDefaultChange={handleChange}
                name='wb'
                error={errors.wb}
            />
          </div>
        </div>
        <div>
          <div className={classNames(styles.twoInputs, styles.withoutMargin)}>
            <Input<number>
                label='wc'
                value={values.wc}
                onDefaultChange={handleChange}
                name='wc'
                error={errors.wc}
            />
            <Input<number>
                label='wd'
                value={values.wd}
                onDefaultChange={handleChange}
                name='wd'
                error={errors.wd}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface CurveSectionProps {
  initialCurves: EngineeringCurveElement[]
}

const getPointOnProgress = (point: number, finalPoint: number, progress: number): number => point + (finalPoint - point) * (progress > 1 ? 1 : progress)

const CurveSection: FC<CurveSectionProps> = ({ initialCurves }) => {
  const [curves, setCurves] = useState<EngineeringCurveElement[]>(initialCurves)
  const [enableDescriptors, setEnableDescriptors] = useState<boolean>(false)
  const state = useCompGraphData()
  const formControls = curves.map(() => useRef<{ resetForm: (value?: EngineeringCurveElement) => void }>(null))

  useEffect(() => {
    state.scene.get().updateScene({
      elements: curves.map((c) => ({ ...c, enableDescriptors }))
    })
  }, [curves, state, enableDescriptors])

  const timeLine = useRef(new Timeline((t, fromControl) => {
    changeCountr(t / 2000)

    if (!fromControl) {
      setTimeout(() => {
        const barEl = document.getElementById('time-line-progress') as HTMLInputElement
        if (barEl !== null) {
          barEl.value = `${t}`
        }
      })
    }
  }, 2100))

  const changeCountr = useCallback((progress: number): void => {
    const xds = curves
      .map((curve) => [curve.a[0], curve.b[0], curve.c[0], curve.d[0]])
      .reduce((acc, x) => [...acc, ...x], [])
    const yds = curves
      .map((curve) => [curve.a[1], curve.b[1], curve.c[1], curve.d[1]])
      .reduce((acc, x) => [...acc, ...x], [])

    const xMin = xds.sort((x1, x2) => x1 - x2)[0]
    const xMax = xds.sort((x1, x2) => x2 - x1)[0]
    const yMin = yds.sort((y1, y2) => y1 - y2)[0]
    const yMax = yds.sort((y1, y2) => y2 - y1)[0]

    const width = Math.abs(xMax - xMin)
    const height = Math.abs(yMax - yMin)
    const curvesPerSide = (curves.length / 4)
    const destX = width / (Math.floor(curvesPerSide) + 1) / 3
    const destY = height / (Math.floor(curvesPerSide) + 1) / 3

    let pointsPassed = 0
    let onFirstSide = false
    let onSecondSide = false
    let onThirdSide = false
    let newDestY = destX
    const newCurves = curves.map<EngineeringCurveElement>((curve, inx) => {
      const side = Math.floor(inx / curvesPerSide)
      let c = {
        ...curve
      }

      if (side === 0) {
        const finalPointY = yMin
        const xStart = xMin
        // a = 2, b = -5;
        // b - a = -7
        // a + -7 = b
        c = {
          ...c,
          ...{
            a: [
              getPointOnProgress(curve.a[0], xStart + destX * pointsPassed, progress),
              getPointOnProgress(curve.a[1], finalPointY, progress)
            ],
            b: [
              getPointOnProgress(curve.b[0], xStart + destX * (pointsPassed + 1), progress),
              getPointOnProgress(curve.b[1], finalPointY, progress)
            ],
            c: [
              getPointOnProgress(curve.c[0], xStart + destX * (pointsPassed + 2), progress),
              getPointOnProgress(curve.c[1], finalPointY, progress)],
            d: [
              getPointOnProgress(curve.d[0], xStart + destX * (pointsPassed + 3), progress),
              getPointOnProgress(curve.d[1], finalPointY, progress)]
          }
        }
        pointsPassed += 3
      }

      if (side === 1) {
        if (!onFirstSide) {
          pointsPassed = 0
          onFirstSide = true
        }
        const finalPointX = xMax
        const yStart = yMin
        c = {
          ...c,
          ...{
            a: [
              getPointOnProgress(curve.a[0], finalPointX, progress),
              getPointOnProgress(curve.a[1], yStart + destY * pointsPassed, progress)
            ],
            b: [
              getPointOnProgress(curve.b[0], finalPointX, progress),
              getPointOnProgress(curve.b[1], yStart + destY * (pointsPassed + 1), progress)
            ],
            c: [
              getPointOnProgress(curve.c[0], finalPointX, progress),
              getPointOnProgress(curve.c[1], yStart + destY * (pointsPassed + 2), progress)
            ],
            d: [
              getPointOnProgress(curve.d[0], finalPointX, progress),
              getPointOnProgress(curve.d[1], yStart + destY * (pointsPassed + 3), progress)
            ]
          }
        }
        pointsPassed += 3
      }

      if (side === 2) {
        if (!onSecondSide) {
          pointsPassed = 0
          onSecondSide = true
        }
        const finalPointY = yMax
        const xStart = xMax
        c = {
          ...c,
          ...{
            a: [
              getPointOnProgress(curve.a[0], xStart - destX * pointsPassed, progress),
              getPointOnProgress(curve.a[1], finalPointY, progress)
            ],
            b: [
              getPointOnProgress(curve.b[0], xStart - destX * (pointsPassed + 1), progress),
              getPointOnProgress(curve.b[1], finalPointY, progress)
            ],
            c: [
              getPointOnProgress(curve.c[0], xStart - destX * (pointsPassed + 2), progress),
              getPointOnProgress(curve.c[1], finalPointY, progress)
            ],
            d: [
              getPointOnProgress(curve.d[0], xStart - destX * (pointsPassed + 3), progress),
              getPointOnProgress(curve.d[1], finalPointY, progress)
            ]
          }
        }
        pointsPassed += 3
      }

      if (side === 3) {
        if (!onThirdSide) {
          pointsPassed = 0
          newDestY = (Math.floor(curvesPerSide) + 1) === curves.length - inx ? destY : (height / (curves.length - inx) / 3)
          console.log('d', newDestY, destY, curves.length - inx)
          onThirdSide = true
        }
        const finalPointX = xMin
        const yStart = yMax
        c = {
          ...c,
          ...{
            a: [
              getPointOnProgress(curve.a[0], finalPointX, progress),
              getPointOnProgress(curve.a[1], yStart - newDestY * pointsPassed, progress)
            ],
            b: [
              getPointOnProgress(curve.b[0], finalPointX, progress),
              getPointOnProgress(curve.b[1], yStart - newDestY * (pointsPassed + 1), progress)
            ],
            c: [
              getPointOnProgress(curve.c[0], finalPointX, progress),
              getPointOnProgress(curve.c[1], yStart - newDestY * (pointsPassed + 2), progress)
            ],
            d: [
              getPointOnProgress(curve.d[0], finalPointX, progress),
              getPointOnProgress(curve.d[1], yStart - newDestY * (pointsPassed + 3), progress)
            ]
          }
        }
        pointsPassed += 3
      }

      return {
        ...c,
        wa: getPointOnProgress(curve.wa, 1, progress),
        wb: getPointOnProgress(curve.wb, 1, progress),
        wc: getPointOnProgress(curve.wc, 1, progress),
        wd: getPointOnProgress(curve.wd, 1, progress)
      }
    })

    setCurves(newCurves)
  }, [curves])

  const handlePlay = (): void => {
    timeLine.current.play()
  }

  const handlePause = (): void => {
    timeLine.current.pause()
  }

  const handleReset = (): void => {
    timeLine.current.reset()
    setCurves(initialCurves)
    initialCurves.forEach((curve, inx) => formControls[inx].current?.resetForm(curve))
  }

  useEffect(() => {
    timeLine.current.handleEndOfPlay(() => {
      curves.forEach((curve, inx) => formControls[inx].current?.resetForm(curve))
    })
  }, [curves])

  return (
      <div className={styles.section}>
        <h4>Curves:</h4>
        <div className={styles.checkboxSection}>
          <input
            onChange={(e) => setEnableDescriptors(e.target.checked)}
            type={'checkbox'}
            checked={enableDescriptors}
          />
          Show support lines
        </div>
        <div className={classNames(styles.rangeInput, styles.animationV3)}>
          <input
              type={'range'}
              id={'time-line-progress'}
              max={2000}
              defaultValue={0}
              onChange={(e) => {
                timeLine.current.setProgress(e.target.valueAsNumber)
              }}
          />
        </div>
        <div className={styles.control}>
          <div className={styles.btns}>
            <div className={styles.btn} onClick={handlePlay}>Play</div>
            <div className={styles.btn} onClick={handlePause}>Pause</div>
            <div className={styles.btn} onClick={handleReset}>Reset</div>
          </div>
        </div>
        <div>
          {
            curves.map((curve, inx) => (
                <CurveItem
                    formControlRef={formControls[inx]}
                    key={`curve-${inx}-${curve.id}`}
                    onChange={(curve) => {
                      setCurves(prevState => ([...[...prevState].slice(0, inx), curve, ...[...prevState].slice(inx + 1)]))
                    }}
                    {...curve}
                />
            ))
          }
        </div>
      </div>
  )
}

export const Lab3Content: FC = () => {
  const state = useCompGraphData()
  const [enablePic, setEnablePic] = useState<boolean>(true)
  const { values, handleChange, errors } = useFormik({
    initialValues: {
      scale: 12,
      shiftX: 10,
      shiftY: 10,
      curves
    },
    onSubmit: () => console.log('Submit!'),
    validateOnChange: true,
    validationSchema: yup.object().shape({
      scale: yup.number(),
      shiftX: yup.number(),
      shiftY: yup.number()
    })
  })

  useEffect(() => {
    const scene: Partial<Scene> = {
      scale: parseFloat(values.scale.toString()),
      shiftX: parseFloat(values.shiftX.toString()),
      shiftY: parseFloat(values.shiftY.toString()),
      disableGrid: false
    }

    state.scene.get().updateScene(scene)
  }, [state, values])

  return (
    <>
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
       { enablePic && (
          <div className={styles.pic}>
            <img src={picImg} alt={'Scope'} />
          </div>
       )}
      <div className={styles.checkboxSection}>
        <input
            onChange={(e) => setEnablePic(e.target.checked)}
            type={'checkbox'}
            checked={enablePic}
        />
        Show support pic
      </div>
      <CurveSection initialCurves={curves} />
      <ManipulateContent />
    </>
  )
}
