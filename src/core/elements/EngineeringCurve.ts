import { BaseElement, BaseElementProps } from './BaseElement'
import { Drawable, Pos } from '../../core/types'

interface EngineeringCurveProps extends BaseElementProps {
  a: Pos
  b: Pos
  c: Pos
  d: Pos
  wa: number
  wb: number
  wc: number
  wd: number
  enableDescriptors: boolean
}

export default class EngineeringCurve extends BaseElement implements Drawable {
  private readonly a: Pos
  private readonly b: Pos
  private readonly c: Pos
  private readonly d: Pos
  private readonly wa: number
  private readonly wb: number
  private readonly wc: number
  private readonly wd: number
  private readonly enableDescriptors: boolean
  constructor (props: EngineeringCurveProps) {
    super(props)

    this.a = props.a
    this.b = props.b
    this.c = props.c
    this.d = props.d
    this.wa = props.wa
    this.wb = props.wb
    this.wc = props.wc
    this.wd = props.wd
    this.enableDescriptors = props.enableDescriptors
  }

  private getPointX (u: number): number {
    return (this.a[0] * this.wa * Math.pow(1 - u, 3) + 3 * this.b[0] * this.wb * u * Math.pow(1 - u, 2) + 3 * this.c[0] * this.wc * Math.pow(u, 2) * (1 - u) + this.d[0] * this.wd * Math.pow(u, 3)) / (this.wa * Math.pow(1 - u, 3) + 3 * this.wb * u * Math.pow(1 - u, 2) + 3 * this.wc * Math.pow(u, 2) * (1 - u) + this.wd * Math.pow(u, 3))
  }

  private getPointY (u: number): number {
    return (this.a[1] * this.wa * Math.pow(1 - u, 3) + 3 * this.b[1] * this.wb * u * Math.pow(1 - u, 2) + 3 * this.c[1] * this.wc * Math.pow(u, 2) * (1 - u) + this.d[1] * this.wd * Math.pow(u, 3)) / (this.wa * Math.pow(1 - u, 3) + 3 * this.wb * u * Math.pow(1 - u, 2) + 3 * this.wc * Math.pow(u, 2) * (1 - u) + this.wd * Math.pow(u, 3))
  }

  public draw (props: any): void {
    this.ctx.beginPath()
    this.ctx.lineWidth = 2
    this.ctx.strokeStyle = '#000'

    for (let u = 0; u < 1; u += 0.01) {
      const x = this.getPointX(u)
      const y = this.getPointY(u)

      this.ctx.lineTo(...this.filters(x, y))
    }
    this.ctx.stroke()

    if (!this.enableDescriptors) {
      return
    }

    this.ctx.beginPath()
    this.ctx.lineWidth = 1

    this.ctx.strokeStyle = 'red'
    this.ctx.fillStyle = 'red'
    const aPoint = this.filters(this.a[0], this.a[1])
    this.ctx.fillRect(aPoint[0] - 1.5, aPoint[1] - 1.5, 3, 3)

    this.ctx.strokeStyle = '#00000080'
    this.ctx.moveTo(...this.filters(this.a[0], this.a[1]))
    this.ctx.lineTo(...this.filters(this.b[0], this.b[1]))

    const bPoint = this.filters(this.b[0], this.b[1])
    this.ctx.fillRect(bPoint[0] - 1.5, bPoint[1] - 1.5, 3, 3)

    this.ctx.moveTo(...this.filters(this.b[0], this.b[1]))
    this.ctx.lineTo(...this.filters(this.c[0], this.c[1]))

    const cPoint = this.filters(this.c[0], this.c[1])
    this.ctx.fillRect(cPoint[0] - 1.5, cPoint[1] - 1.5, 3, 3)

    this.ctx.moveTo(...this.filters(this.c[0], this.c[1]))
    this.ctx.lineTo(...this.filters(this.d[0], this.d[1]))

    const dPoint = this.filters(this.d[0], this.d[1])
    this.ctx.fillRect(dPoint[0] - 1.5, dPoint[1] - 1.5, 3, 3)

    this.ctx.stroke()
  }

  public getStartAndEndPos (): [Pos, Pos] {
    return [this.a, this.d]
  }
}
