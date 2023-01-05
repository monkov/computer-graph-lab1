import { FiltersFunc, FiltersFuncExec, Matrix, Pos } from './types'

export const createFilter = (exec: FiltersFuncExec, disableForGrid: boolean = false, id?: string): FiltersFunc => ({ id, exec, disableForGrid })

export const createRotationFilter = (shiftX: number, shiftY: number, angle: number): FiltersFunc =>
  createFilter((x: number, y: number) => Filters.rotation(x, y, shiftX, shiftY, angle), true, Filters.ROTATION)

export const createAffineFilter = (xx: number, xy: number, yx: number, yy: number, ox: number, oy: number): FiltersFunc =>
  createFilter((x: number, y: number) => Filters.affineTransform(x, y, xx, xy, yx, yy, ox, oy), false, Filters.ROTATION)

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class Filters {
  public static readonly ROTATION = 'rotation'
  public static readonly AFFINE = 'affine'

  public static scale (x: number, y: number, scale: number): Pos {
    return [x * scale, y * scale]
  }

  public static reverse (x: number, y: number, width: number, height: number): Pos {
    return [x, height - y]
  }

  public static shift (x: number, y: number, shiftX: number, shiftY: number): Pos {
    console.log(shiftY, shiftX)
    return [x + shiftX, y + shiftY]
  }

  public static transform (matrix: Matrix, x: number, y: number): Pos {
    return [
      ((x * matrix[0][0] + y * matrix[1][0] + matrix[2][0]) / (x * matrix[0][2] + y * matrix[1][2] + matrix[2][2])),
      ((x * matrix[0][1] + y * matrix[1][1] + matrix[2][1]) / (x * matrix[0][2] + y * matrix[1][2] + matrix[2][2]))
    ]
  }

  public static rotation (x: number, y: number, shiftX: number, shiftY: number, angle: number): Pos {
    return Filters.transform(
      [
        [
          Math.cos(angle),
          Math.sin(angle),
          0
        ],
        [
          -Math.sin(angle),
          Math.cos(angle),
          0
        ],
        [
          -shiftX * (Math.cos(angle) - 1) + shiftY * Math.sin(angle),
          -shiftX * Math.sin(angle) - shiftY * (Math.cos(angle) - 1),
          1
        ]
      ],
      x,
      y
    )
  }

  public static affineTransform (x: number, y: number, xx: number, xy: number, yx: number, yy: number, ox: number, oy: number): Pos {
    return Filters.transform(
      [
        [xx, xy, 0],
        [yx, yy, 0],
        [ox, oy, 1]
      ],
      x, y)
  }
}
