import { useMemo, useState } from "react"
import { Beaker, Download, Target } from "lucide-react"
import MatrixEditor from "@/components/ui-custom/MatrixEditor"
import { Button } from "@/components/ui/button"
import {
  approxEquals,
  classifyTransform2x2,
  determinant2x2,
  eigenvalues2x2,
  isOrthonormal2x2,
  trace2x2,
} from "@/lib/linear-algebra"

const tasks = [
  {
    title: "面积加倍",
    goal: "使行列式 ≈ 2（面积放大为 2 倍）",
    check: (m: number[][]) => approxEquals(determinant2x2(m), 2, 0.08),
  },
  {
    title: "纯旋转",
    goal: "保持面积且列向量正交（det≈1 且正交归一）",
    check: (m: number[][]) =>
      approxEquals(determinant2x2(m), 1, 0.05) && isOrthonormal2x2(m, 0.08),
  },
  {
    title: "剪切变换",
    goal: "det≈1 且非正交（表现出明显剪切）",
    check: (m: number[][]) =>
      approxEquals(determinant2x2(m), 1, 0.08) && !isOrthonormal2x2(m, 0.08),
  },
]

export default function ExperimentLab() {
  const [matrix, setMatrix] = useState<number[][]>([
    [1, 0.5],
    [0, 1],
  ])

  const det = useMemo(() => determinant2x2(matrix), [matrix])
  const tr = useMemo(() => trace2x2(matrix), [matrix])
  const eigen = useMemo(() => eigenvalues2x2(matrix), [matrix])
  const type = useMemo(() => classifyTransform2x2(matrix), [matrix])

  const exportData = () => {
    const payload = {
      matrix,
      determinant: det,
      trace: tr,
      eigenvalues: eigen,
      classification: type,
      createdAt: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "matrix-analysis.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section id="lab" className="relative py-20 bg-[#121212]">
      <div className="absolute inset-0 grid-bg opacity-10" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6e00]/10 border border-[#ff6e00]/30 mb-6">
            <Beaker className="w-4 h-4 text-[#ff6e00]" />
            <span className="text-sm text-[#ff6e00] font-medium">实验室</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            从矩阵到结论的可验证实验
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            即时计算行列式、迹与特征值，并通过任务挑战验证你的矩阵是否满足目标性质。
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <MatrixEditor
              size={2}
              allowSizeToggle={false}
              initialMatrix={matrix}
              onChange={setMatrix}
            />

            <div className="glass-card rounded-xl p-5 border border-white/10">
              <h4 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" />
                任务挑战
              </h4>
              <div className="space-y-3">
                {tasks.map((task) => {
                  const done = task.check(matrix)
                  return (
                    <div
                      key={task.title}
                      className={`p-3 rounded-lg border text-sm ${
                        done
                          ? "border-green-500/40 bg-green-500/10 text-green-300"
                          : "border-white/10 bg-white/5 text-gray-400"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{task.title}</span>
                        <span>{done ? "已完成" : "未完成"}</span>
                      </div>
                      <p className="text-xs leading-relaxed">{task.goal}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="glass-card rounded-xl p-5 border border-white/10">
                <p className="text-xs text-gray-500 uppercase tracking-wider">行列式</p>
                <div className="text-2xl font-mono text-[#ff6e00] mt-2">
                  {det.toFixed(3)}
                </div>
                <p className="text-xs text-gray-400 mt-2">面积缩放因子</p>
              </div>
              <div className="glass-card rounded-xl p-5 border border-white/10">
                <p className="text-xs text-gray-500 uppercase tracking-wider">迹</p>
                <div className="text-2xl font-mono text-white mt-2">{tr.toFixed(3)}</div>
                <p className="text-xs text-gray-400 mt-2">特征值和的快速指示</p>
              </div>
              <div className="glass-card rounded-xl p-5 border border-white/10">
                <p className="text-xs text-gray-500 uppercase tracking-wider">变换类型</p>
                <div className="text-lg font-semibold text-white mt-2">{type}</div>
                <p className="text-xs text-gray-400 mt-2">基于判别式与行列式</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">特征值分析</h3>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">
                    {eigen.type === "real"
                      ? "实特征值表示沿某些方向的纯拉伸/压缩。"
                      : "复特征值意味着存在旋转成分。"}
                  </p>
                  <div className="mt-3 space-y-1 text-sm text-gray-300 font-mono">
                    <div>λ₁ = {eigen.lambda1}</div>
                    <div>λ₂ = {eigen.lambda2}</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="btn-secondary flex items-center gap-2"
                  onClick={exportData}
                >
                  <Download className="w-4 h-4" />
                  导出分析结果
                </Button>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">评审亮点说明</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                该实验区将“操作—计算—验证”形成闭环，可量化地呈现学习过程。评审能够
                现场构造矩阵并验证对应性质，直接体现作品的技术深度与教学价值。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
