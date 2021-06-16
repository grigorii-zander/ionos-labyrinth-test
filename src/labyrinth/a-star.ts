/* eslint-disable security/detect-object-injection */

type Grid = Point[][]

export class Point {
  private readonly grid: Point[][]

  constructor(grid: Point[][]) {
    this.grid = grid
  }

  static moves = [
    [-1, 0],
    [0, -1],
    [1, 0],
    [0, 1],
  ]

  i = 0
  j = 0

  // score
  f = 0
  // cost
  g = 0
  // distance
  h = 0

  adjacent: Point[] | null = null
  prev: Point | null = null
  isWall: boolean

  getAdjacent(): Point[] {
    if (!this.adjacent) {
      this.populateAdjacent()
    }
    return this.adjacent as Point[]
  }

  populateAdjacent() {
    this.adjacent = []
    for (let i = 0; i < 4; i++) {
      const node = this.getPoint(this.i + Point.moves[i][0], this.j + Point.moves[i][1])
      if (node !== null) {
        if (!node.isWall) {
          this.adjacent.push(node)
        }
      }
    }
  }

  getPoint(i: number, j: number): Point | null {
    if (i < 0 || i >= this.grid.length || j < 0 || j >= this.grid[0].length) {
      return null
    }
    return this.grid[i][j] || null
  }
}

const heuristic = (a: Point, b: Point) => {
  return Math.abs(a.i - b.i) + Math.abs(a.j - b.j)
}

const remove = <T>(arr: T[], item: T): T[] => {
  const i = arr.findIndex(s => s === item)
  if (i !== -1) {
    arr.splice(i, 1)
  }
  return arr
}

export const aStar = (grid: Grid, startPoint: Point, endPoint: Point) => {
  const openSet: Point[] = [startPoint]
  const closedSet: Point[] = []

  let lastChecked: Point = startPoint
  let done = false
  let haveSolution = false

  while (!done) {
    // no solution case
    if (!openSet.length) {
      done = true
      break
    }

    let bestCandidate = 0
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[bestCandidate].f) {
        bestCandidate = i
      }

      if (openSet[i].f === openSet[bestCandidate].f) {
        if (openSet[i].g > openSet[bestCandidate].g) {
          bestCandidate = i
        }
      }
    }

    const current: Point = openSet[bestCandidate]
    lastChecked = current
    if (current === endPoint) {
      haveSolution = true
      break
    }

    remove(openSet, current)
    closedSet.push(current)

    const adjacent = current.getAdjacent()
    for (let i = 0; i < adjacent.length; i++) {
      const item = adjacent[i]

      if (!closedSet.includes(item)) {
        const gScore = current.g + heuristic(item, current)
        if (!openSet.includes(item)) {
          openSet.push(item)
        } else if (gScore >= item.g) {
          continue
        }
        item.g = gScore
        item.h = heuristic(item, endPoint)
        item.f = item.g + item.h
        item.prev = current
      }
    }
  }

  if (haveSolution) {
    const path: string[] = []
    let temp = endPoint
    while (temp.prev) {
      if (temp.i < temp.prev.i && temp.j === temp.prev.j) {
        path.push('up')
      } else if (temp.i === temp.prev.i && temp.j < temp.prev.j) {
        path.push('left')
      } else if (temp.i === temp.prev.i && temp.j > temp.prev.j) {
        path.push('right')
      } else if (temp.i > temp.prev.i && temp.j === temp.prev.j) {
        path.push('down')
      }
      temp = temp.prev
    }
    return path.reverse()
  }

  return null
}
