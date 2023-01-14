import {
  ArrowsElement,
  CircleElement,
  Drawable,
  Element,
  ElementRules,
  ElementType, EngineeringCurveElement, FractalElement,
  LineElement,
  NicomedesCarhoidElement,
  Scene
} from './types'
import Line from './elements/Line'
import { BaseElementProps } from './elements/BaseElement'
import Circle from './elements/Circle'
import NicomedesCarhoid from './elements/NicomedesCarhoid'
import Arrows from './elements/Arrows'
import Fractal from './elements/Fractal'
import EngineeringCurve from './elements/EngineeringCurve'

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

    if (Builder.isArrows(element)) {
      result = this.buildArrows(element, this.base)
    }

    if (Builder.isFractal(element)) {
      result = this.buildFractal(element, this.base)
    }

    if (Builder.isEngineeringCurve(element)) {
      result = this.buildEngineeringCurve(element, this.base)
    }

    if (result !== null) {
      this.buildedElements.push(result)
    }

    return result
  }

  public static isLine (element: Element): element is LineElement {
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

  public static isCircle (element: Element): element is CircleElement {
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
      fill: circle.fill,
      centerY: circle.centerY,
      dimensions: base.dimensions,
      filters: base.filters,
      ctx: base.ctx
    })
  }

  public static isNicomedesCarhoid (element: Element): element is NicomedesCarhoidElement {
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

  public static isArrows (element: Element): element is ArrowsElement {
    return element.type === ElementType.ARROWS
  }

  private buildArrows (arrows: ArrowsElement, base: BaseElementProps): Arrows {
    return new Arrows({
      lab: arrows.lab,
      id: arrows.id,
      ctx: base.ctx,
      filters: base.filters,
      dimensions: base.dimensions
    })
  }

  public static isFractal (element: Element): element is FractalElement {
    return element.type === ElementType.FRACTAL
  }

  private buildFractal (fractal: FractalElement, base: BaseElementProps): Fractal {
    return new Fractal({
      id: fractal.id,
      k: fractal.k,
      iterations: fractal.iterations,
      ctx: base.ctx,
      filters: base.filters,
      dimensions: base.dimensions
    })
  }

  public static isEngineeringCurve (element: Element): element is EngineeringCurveElement {
    return element.type === ElementType.EngineeringCurve
  }

  private buildEngineeringCurve (engineeringCurve: EngineeringCurveElement, base: BaseElementProps): EngineeringCurve {
    let start = engineeringCurve.a
    let end = engineeringCurve.d
    if (engineeringCurve.bindRules !== undefined && engineeringCurve.bindRules.length !== 0) {
      engineeringCurve.bindRules.forEach(({ rule, element }) => {
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
    return new EngineeringCurve({
      id: engineeringCurve.id,
      a: start,
      b: engineeringCurve.b,
      c: engineeringCurve.c,
      d: end,
      wa: engineeringCurve.wa,
      wb: engineeringCurve.wb,
      wc: engineeringCurve.wc,
      wd: engineeringCurve.wd,
      enableDescriptors: engineeringCurve.enableDescriptors,
      ctx: base.ctx,
      filters: base.filters,
      dimensions: base.dimensions
    })
  }
}
