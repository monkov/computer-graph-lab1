import { BaseElement, BaseElementProps } from './BaseElement'
import { Drawable, FractalPos, Pos } from '../../core/types'

interface FractalProps extends BaseElementProps {
  k: FractalPos[]
  iterations: number
}

export default class Fractal extends BaseElement implements Drawable {
  private readonly k: FractalPos[] = []
  private readonly iterations: number

  constructor ({ iterations, k, ctx, filters, id, dimensions }: FractalProps) {
    super({ ctx, dimensions, filters, id })

    this.iterations = iterations
    this.k = k
  }

  private getRandomRuleByProb (): FractalPos | null {
    let requiredProb = Math.random()
    for (let i = 0; i < this.k.length; i++) {
      const rule = this.k[i]
      if (requiredProb < rule[6]) {
        return rule
      }

      requiredProb -= rule[6]
    }

    return null
  }

  public draw (props: any): void {
    let currentX = Math.random()
    let currentY = Math.random()

    this.ctx.beginPath()
    this.ctx.fillStyle = '#000'

    for (let i = 0; i < this.iterations; i++) {
      const rule = this.getRandomRuleByProb()
      if (rule === null) {
        // We didn't find a rule, skip
        continue
      }
      // x' = ax + by + c
      const x1 = currentX * rule[0] + currentY * rule[1] + rule[4]
      // y' = dx + ey + f
      const y1 = currentX * rule[2] + currentY * rule[3] + rule[5]
      currentX = x1
      currentY = y1

      this.ctx.fillRect(...this.filters(currentX, currentY), 0.4, 0.4)
    }
    this.ctx.stroke()
  }

  public getStartAndEndPos (): [Pos, Pos] {
    return [[NaN, NaN], [NaN, NaN]]
  }
}
