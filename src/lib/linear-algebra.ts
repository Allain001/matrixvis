export interface EigenResult2x2 {
  type: "real" | "complex"
  lambda1: string
  lambda2: string
}

export function determinant2x2(m: number[][]): number {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0]
}

export function trace2x2(m: number[][]): number {
  return m[0][0] + m[1][1]
}

export function eigenvalues2x2(m: number[][]): EigenResult2x2 {
  const tr = trace2x2(m)
  const det = determinant2x2(m)
  const disc = tr * tr - 4 * det

  if (disc >= 0) {
    const root = Math.sqrt(disc)
    const l1 = (tr + root) / 2
    const l2 = (tr - root) / 2
    return {
      type: "real",
      lambda1: l1.toFixed(3),
      lambda2: l2.toFixed(3),
    }
  }

  const real = tr / 2
  const imag = Math.sqrt(-disc) / 2
  const sign = imag >= 0 ? "+" : "-"
  const absImag = Math.abs(imag).toFixed(3)
  return {
    type: "complex",
    lambda1: `${real.toFixed(3)} ${sign} ${absImag}i`,
    lambda2: `${real.toFixed(3)} ${sign === "+" ? "-" : "+"} ${absImag}i`,
  }
}

export function classifyTransform2x2(m: number[][]): string {
  const det = determinant2x2(m)
  const tr = trace2x2(m)
  const disc = tr * tr - 4 * det

  if (Math.abs(det) < 1e-3) return "降维/投影（不可逆）"
  if (det < 0) return "反射（手性翻转）"
  if (disc < 0) return "旋转/旋转缩放"
  if (Math.abs(det - 1) < 0.05) return "面积保持变换"
  return det > 1 ? "面积放大" : "面积缩小"
}

export function isOrthonormal2x2(m: number[][], tol = 0.05): boolean {
  const c1 = [m[0][0], m[1][0]]
  const c2 = [m[0][1], m[1][1]]
  const dot = c1[0] * c2[0] + c1[1] * c2[1]
  const n1 = Math.hypot(c1[0], c1[1])
  const n2 = Math.hypot(c2[0], c2[1])
  return Math.abs(dot) < tol && Math.abs(n1 - 1) < tol && Math.abs(n2 - 1) < tol
}

export function approxEquals(value: number, target: number, tol = 0.05): boolean {
  return Math.abs(value - target) <= tol
}
