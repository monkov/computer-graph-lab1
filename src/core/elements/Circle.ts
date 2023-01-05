import { BaseElement, BaseElementProps } from './BaseElement'
import { Drawable, Pos } from '../types'

export interface CircleProps extends BaseElementProps {
  startAngle: number
  endAngle: number
  r: number
  centerX: number
  centerY: number
  reverse: boolean
}

export default class Circle extends BaseElement implements Drawable {
  private startAngle: number = 0
  private endAngle: number = 0
  private readonly r: number = 0
  private readonly centerX: number = 0
  private readonly centerY: number = 0
  private readonly reverse: boolean = false

  constructor ({ startAngle, endAngle, centerY, centerX, dimensions, ctx, filters, r, id, reverse }: CircleProps) {
    super({ dimensions, ctx, filters, id })
    this.endAngle = endAngle
    this.startAngle = startAngle
    this.centerX = centerX
    this.centerY = centerY
    this.r = r
    this.reverse = reverse
  }

  public getStartAndEndPos (): [Pos, Pos] {
    const startPos: Pos = [this.r * Math.cos(this.startAngle) + this.centerX, this.r * Math.sin(this.startAngle) + this.centerY]
    const endPos: Pos = [this.r * Math.cos(this.endAngle) + this.centerX, this.r * Math.sin(this.endAngle) + this.centerY]

    return [startPos, endPos]
  }

  public draw (props: any): void {
    this.ctx.beginPath()
    this.ctx.strokeStyle = '#000'

    if (this.reverse) {
      this.startAngle += Math.PI
      this.endAngle += Math.PI
    }

    const step = 0.005
    for (let i = this.startAngle; i < this.endAngle; i += step) {
      const l = i + step

      this.ctx.moveTo(...this.filters(this.r * Math.cos(i) + this.centerX, this.r * Math.sin(i) + this.centerY))
      this.ctx.lineTo(...this.filters(this.r * Math.cos(l) + this.centerX, this.r * Math.sin(l) + this.centerY))
      this.ctx.stroke()
    }
  }
}
