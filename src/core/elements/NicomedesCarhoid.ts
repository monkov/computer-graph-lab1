import { BaseElement, BaseElementProps } from './BaseElement'
import { Drawable, Pos } from '../types'
import Circle from './Circle'

export interface NicomedesCarhoidProps extends BaseElementProps {
  a: number
  b: number
  enableTagnet?: boolean
  enableNormal?: boolean
  enableAsymptotes?: boolean
  enablePDots?: boolean
  testPos: number
  highlight?: {
    from: number
    to: number
  }
}

export default class NicomedesCarhoid extends BaseElement implements Drawable {
  private readonly a: number
  private readonly b: number
  private readonly highlight?: { from: number, to: number }
  private readonly testPos: number
  protected readonly enableTagnet: boolean
  protected readonly enableNormal: boolean
  protected readonly enableAsymptotes: boolean
  protected readonly enablePDots: boolean

  constructor ({ a, b, ctx, filters, id, dimensions, highlight, enableTagnet, enableNormal, enableAsymptotes, enablePDots, testPos }: NicomedesCarhoidProps) {
    super({ ctx, dimensions, filters, id })

    this.a = a
    this.b = b
    this.highlight = highlight
    this.enableTagnet = (enableTagnet === true)
    this.enableNormal = (enableNormal === true)
    this.enableAsymptotes = (enableAsymptotes === true)
    this.enablePDots = (enablePDots === true)
    this.testPos = testPos
  }

  draw (props: any): void {
    // NicomedesCarhoid
    const x0 = 0
    const y0 = 0
    const r = (this.a / Math.cos(0) + this.b)
    const x = x0 + r * Math.cos(0)
    const y = y0 + r * Math.sin(0)
    let prevPos: Pos = [x, y]

    for (let t = 0; t <= 2 * Math.PI; t += 0.01) {
      const r = (this.a / Math.cos(t) + this.b)
      const x = x0 + r * Math.cos(t)
      const y = y0 + r * Math.sin(t)

      if (t.toFixed(2) === '1.58' || t.toFixed(2) === '4.72') {
        prevPos = [x, y]
        continue
      }
      this.ctx.beginPath()
      this.ctx.lineWidth = 1
      if (this.highlight !== undefined) {
        if (t >= this.highlight.from && t <= this.highlight.to) {
          this.ctx.strokeStyle = '#0000ff'
        } else {
          this.ctx.strokeStyle = '#000000'
        }
      }
      this.ctx.moveTo(...this.filters(...prevPos))
      this.ctx.lineTo(...this.filters(x, y))
      this.ctx.stroke()
      prevPos = [x, y]
    }

    const t = this.testPos
    const rTangent = (this.a / Math.cos(t) + this.b)
    const xTangent = x0 + rTangent * Math.cos(t)
    const yTangent = y0 + rTangent * Math.sin(t)

    const drDt = (this.a * Math.sin(t)) / (Math.pow(Math.cos(t), 2))
    const dxDt = drDt * Math.cos(t) - rTangent * Math.sin(t)
    const dyDt = drDt * Math.sin(t) + rTangent * Math.cos(t)

    if (this.enableTagnet) {
      // Ver 1
      const der = dyDt / dxDt

      const y = yTangent + der * (0 - xTangent)

      this.ctx.beginPath()
      this.ctx.strokeStyle = '#f4a4d4'
      this.ctx.moveTo(...this.filters(xTangent, yTangent))
      this.ctx.lineTo(...this.filters(0, y))
      this.ctx.stroke()

      // Ver 2
      this.ctx.stroke()
      this.ctx.beginPath()
      this.ctx.strokeStyle = '#0000ff'
      this.ctx.moveTo(...this.filters(xTangent - dxDt, yTangent - dyDt))
      this.ctx.lineTo(...this.filters(xTangent + dxDt, yTangent + dyDt))
      this.ctx.stroke()
    }

    if (this.enableNormal) {
      // Normal ver 1
      const slope = this.a * Math.sin(t) / Math.pow(Math.cos(t), 2)
      const normalSlope = Math.pow(Math.cos(t), 2) / (this.a * Math.sin(t))

      const x1 = xTangent + rTangent / (normalSlope + slope)
      const y1 = yTangent + normalSlope * (x1 - xTangent)

      const x1y1Rad = Math.atan(y1 / x1)

      this.ctx.beginPath()
      this.ctx.moveTo(...this.filters(xTangent, yTangent))
      this.ctx.strokeStyle = '#ff0000'
      this.ctx.lineTo(...this.filters(10 * Math.cos(x1y1Rad), 10 * Math.sin(x1y1Rad)))
      this.ctx.stroke()

      // Normal ver 2

      const yNormalTemp = yTangent + dyDt / dxDt * (0 - xTangent)
      const rad = Math.atan(yNormalTemp - yTangent / -xTangent) + Math.PI / 2
      const xNormal = 10 * Math.cos(rad)
      const yNormal = 10 * Math.sin(rad)

      this.ctx.beginPath()
      this.ctx.moveTo(...this.filters(xTangent, yTangent))
      this.ctx.strokeStyle = '#ff00ff'
      this.ctx.lineTo(...this.filters(xNormal, yNormal))
      this.ctx.stroke()
    }

    if (this.enableAsymptotes && this.a !== 0) {
      // https://dic.academic.ru/dic.nsf/enc_mathematics/3492/%D0%9D%D0%98%D0%9A%D0%9E%D0%9C%D0%95%D0%94%D0%90
      this.ctx.beginPath()
      this.ctx.moveTo(...this.filters(this.a, this.dimensions[1]))
      this.ctx.strokeStyle = '#ebc600'
      this.ctx.lineTo(...this.filters(this.a, -this.dimensions[1]))
      this.ctx.stroke()
    }

    if (this.enablePDots) {
      for (let n = 0; n < 4; n++) {
        const t = (2 * n + 1) * Math.PI / 4
        const rPoint = this.a / Math.cos(t) + this.b
        const xPoint = rPoint * Math.cos(t)
        const yPoint = rPoint * Math.sin(t)

        new Circle({
          startAngle: 0,
          endAngle: 2 * Math.PI,
          centerX: xPoint,
          centerY: yPoint,
          dimensions: this.dimensions,
          ctx: this.ctx,
          filters: this.filters,
          id: 'i-c',
          r: 0.15,
          reverse: false
        }).draw({ color: 'red' })
      }
    }
  }

  getStartAndEndPos (): [Pos, Pos] {
    const x0 = 0
    const y0 = 0

    const rStart = this.a / Math.cos(0) + this.b
    const xStart = x0 + rStart * Math.cos(0)
    const yStart = y0 + rStart * Math.sin(0)

    const rEnd = this.a / Math.cos(2 * Math.PI) + this.b
    const xEnd = x0 + rEnd * Math.cos(2 * Math.PI)
    const yEnd = y0 + rEnd * Math.sin(2 * Math.PI)
    return [[xStart, yStart], [xEnd, yEnd]]
  }
}
