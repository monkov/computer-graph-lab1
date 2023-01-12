import {
  CircleElement,
  Drawable,
  Element,
  ElementRules,
  ElementType,
  LineElement,
  NicomedesCarhoidElement,
  Scene
} from './types'
import Line from './elements/Line'
import { BaseElementProps } from './elements/BaseElement'
import Circle from './elements/Circle'
import NicomedesCarhoid from './elements/NicomedesCarhoid'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class Builder {
  private readonly config: Scene
  private readonly base: BaseElementProps
  private readonly buildedElements: Drawable[] = []

  constructor (config: Scene, base: BaseElementProps) {
    this.config = config
    this.base = base
  }

  public build (element: Element): Drawable | null {
    let result: Drawable | null = null
    if (Builder.isLine(element)) {
      result = this.buildLine(element, this.base)
    }

    if (Builder.isCircle(element)) {
      result = this.buildCircle(element, this.base)
    }

    if (Builder.isNicomedesCarhoid(element)) {
      result = this.buildNicomedesCarhoid(element, this.base)
    }

    if (result !== null) {
      this.buildedElements.push(result)
    }

    return result
  }

  private static isLine (element: Element): element is LineElement {
    return element.type === ElementType.LINE
  }

  private buildLine (line: LineElement, base: BaseElementProps): Line {
    let start = line.start
    let end = line.end
    if (line.bindRules !== undefined && line.bindRules.length !== 0) {
      line.bindRules.forEach(({ rule, element }) => {
        const motherElement = this.buildedElements.find((el) => el.id === element)
        if (motherElement === undefined) {
          return
        }
        const [startPos, endPos] = motherElement.getStartAndEndPos()
        if (rule === ElementRules.BindStartToStart) {
          start = startPos
        }

        if (rule === ElementRules.BindEndToEnd) {
          end = endPos
        }

        if (rule === ElementRules.BindStartToEnd) {
          start = endPos
        }

        if (rule === ElementRules.BindEndToStart) {
          end = startPos
        }
      })
    }
    console.log('el', start, end)

    return new Line({
      id: line.id,
      start,
      end,
      dimensions: base.dimensions,
      filters: base.filters,
      ctx: base.ctx
    })
  }

  private static isCircle (element: Element): element is CircleElement {
    return element.type === ElementType.CIRCLE
  }

  private buildCircle (circle: CircleElement, base: BaseElementProps): Circle {
    return new Circle({
      id: circle.id,
      r: circle.r,
      reverse: circle.reverse,
      startAngle: circle.startAngle,
      endAngle: circle.endAngle,
      centerX: circle.centerX,
      centerY: circle.centerY,
      dimensions: base.dimensions,
      filters: base.filters,
      ctx: base.ctx
    })
  }

  private static isNicomedesCarhoid (element: Element): element is NicomedesCarhoidElement {
    return element.type === ElementType.NicomedesCarhoid
  }

  private buildNicomedesCarhoid (carhoid: NicomedesCarhoidElement, base: BaseElementProps): NicomedesCarhoid {
    return new NicomedesCarhoid({
      id: carhoid.id,
      a: carhoid.a,
      b: carhoid.b,
      enableTagnet: carhoid.enableTagnet,
      enableNormal: carhoid.enableNormal,
      enableAsymptotes: carhoid.enableAsymptotes,
      enablePDots: carhoid.enablePDots,
      testPos: carhoid.testPos,
      highlight: carhoid.highlight,
      ctx: base.ctx,
      filters: base.filters,
      dimensions: base.dimensions
    })
  }
}
