import { useEffect, useRef } from "react"
import { Cpu, Lightbulb, ShieldCheck, Workflow } from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

const highlights = [
  {
    icon: Lightbulb,
    title: "创新教学范式",
    desc: "把线性代数的抽象概念转化为可操控的 3D 场景，形成“看得见、拖得动、可验证”的学习闭环。",
  },
  {
    icon: Cpu,
    title: "技术深度可验证",
    desc: "矩阵 → 变换 → 几何 → 不变量，形成完整的数学-图形链路，内置行列式、特征值、正交性检测。",
  },
  {
    icon: Workflow,
    title: "实验任务驱动",
    desc: "以挑战任务引导学生构造满足条件的矩阵，强化推理、验证与反思。",
  },
  {
    icon: ShieldCheck,
    title: "稳定可部署",
    desc: "WebGL 容错渲染 + Streamlit 一键发布，适配教学展示与在线评审。",
  },
]

const pipeline = [
  "矩阵输入",
  "代数分析",
  "几何变换",
  "3D 渲染",
  "交互验证",
  "学习反馈",
]

export default function Innovation() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    try {
      gsap.registerPlugin(ScrollTrigger)
    } catch (error) {
      console.warn("GSAP ScrollTrigger registration failed:", error)
    }
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current.filter(Boolean), {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.6,
        ease: "expo.out",
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="innovation" ref={sectionRef} className="relative py-20 bg-[#0c0c0c]">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6e00]/10 border border-[#ff6e00]/30 mb-6">
            <span className="text-sm text-[#ff6e00] font-medium">创新与技术深度</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            国奖级评审关注点一站式覆盖
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            从创新性、技术深度到应用价值与稳定部署，构建完整的“可展示、可验证、可评估”作品体系。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {highlights.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                ref={(el) => {
                  cardRef.current[index] = el
                }}
                className="glass-card rounded-2xl p-6 border border-white/10"
              >
                <div className="w-12 h-12 rounded-xl bg-[#ff6e00]/15 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#ff6e00]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 glass-card rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-3">技术链路</h3>
            <p className="text-sm text-gray-400 mb-6">
              以数学不变量为核心，贯通算法与可视化，确保“看见的现象”有“可验证的数学解释”。
            </p>
            <div className="flex flex-wrap gap-3">
              {pipeline.map((step, i) => (
                <div
                  key={step}
                  className="px-4 py-2 rounded-full border border-white/10 text-sm text-gray-300 bg-white/5"
                >
                  <span className="text-[#ff6e00] font-semibold mr-2">{i + 1}</span>
                  {step}
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-3">评审可量化指标</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>实时矩阵演示与可验证计算：行列式、特征值、正交性</li>
              <li>多场景任务驱动：旋转、剪切、缩放、反射</li>
              <li>稳定交付：Streamlit 部署 + 失败兜底渲染</li>
              <li>教学价值：从概念到实验任务的闭环</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
