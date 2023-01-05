import { Drawable, Pos } from '../types'
import { BaseElement, BaseElementProps } from './BaseElement'

interface GridProps extends BaseElementProps {
  scale: number
}

export default class Grid extends BaseElement implements Drawable {
  public id: string = 'grid'
  private readonly scale: number

  constructor ({ scale, ctx, filters, id, dimensions }: GridProps) {
    super({ ctx, dimensions, filters, id })

    this.scale = scale
  }

  public draw (): (Pos | null) {
    const [width] = this.dimensions
    this.ctx.beginPath()
    this.ctx.strokeStyle = 'grey'

    this.ctx.lineWidth = 1

    for (let i = 0; i < width; i += 1) {
      if (i === 1) {
        this.ctx.stroke()
        this.ctx.lineWidth = 0.25
      }

      this.ctx.moveTo(...this.filters(0, i))
      this.ctx.lineTo(...this.filters(width, i))

      this.ctx.moveTo(...this.filters(i, 0))
      this.ctx.lineTo(...this.filters(i, width))
    }

    this.ctx.stroke()
    this.ctx.lineWidth = 1

    return null
  }

  getStartAndEndPos (): [Pos, Pos] {
    return [[0, 0], this.dimensions]
  }
}
