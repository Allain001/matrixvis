import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Calculator, 
  Rotate3D, 
  Box, 
  GitBranch, 
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const modules = [
  {
    id: 1,
    title: '基础概念',
    description: '向量、矩阵和基本运算。从零开始理解线性代数的核心元素。',
    icon: BookOpen,
    difficulty: '入门',
    color: '#22c55e',
    topics: ['向量定义', '矩阵表示', '基本运算'],
  },
  {
    id: 2,
    title: '矩阵运算',
    description: '加法、乘法与分解技术。掌握矩阵的各种运算方法。',
    icon: Calculator,
    difficulty: '初级',
    color: '#3b82f6',
    topics: ['矩阵加法', '矩阵乘法', 'LU分解'],
  },
  {
    id: 3,
    title: '线性变换',
    description: '旋转、缩放与投影。可视化理解矩阵的几何意义。',
    icon: Rotate3D,
    difficulty: '中级',
    color: '#f59e0b',
    topics: ['旋转变换', '缩放变换', '投影变换'],
  },
  {
    id: 4,
    title: '向量空间',
    description: '基、维度与子空间。探索抽象的向量空间结构。',
    icon: Box,
    difficulty: '中级',
    color: '#8b5cf6',
    topics: ['基与维度', '子空间', '直和分解'],
  },
  {
    id: 5,
    title: '特征值问题',
    description: '特征向量与对角化。揭示矩阵的不变性质。',
    icon: GitBranch,
    difficulty: '高级',
    color: '#ec4899',
    topics: ['特征值', '特征向量', '对角化'],
  },
  {
    id: 6,
    title: '实际应用',
    description: '在ML、图形学中的应用。看到线性代数的实际价值。',
    icon: Layers,
    difficulty: '高级',
    color: '#ff6e00',
    topics: ['机器学习', '计算机图形', '数据压缩'],
  },
];

const difficultyColors: Record<string, string> = {
  '入门': 'bg-green-500/20 text-green-400 border-green-500/30',
  '初级': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  '中级': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  '高级': 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function LearningModules() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    try {
      gsap.registerPlugin(ScrollTrigger);
    } catch (error) {
      console.warn('GSAP ScrollTrigger registration failed:', error);
    }
    const ctx = gsap.context(() => {
      // Title animation
      gsap.from(titleRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'expo.out',
      });

      // Cards stagger animation
      gsap.from(cardsRef.current.filter(Boolean), {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 60,
        rotateX: 15,
        stagger: 0.1,
        duration: 0.6,
        ease: 'expo.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="learning"
      ref={sectionRef}
      className="relative min-h-screen py-20 bg-[#1a1a1a]"
    >
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />
      
      {/* Floating Math Symbols */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['∑', '∫', 'π', 'λ'].map((symbol, i) => (
          <div
            key={i}
            className="absolute text-[#ff6e00]/5 text-9xl font-mono animate-float"
            style={{
              left: `${15 + i * 25}%`,
              top: `${20 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          >
            {symbol}
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6e00]/10 border border-[#ff6e00]/30 mb-6">
            <Sparkles className="w-4 h-4 text-[#ff6e00]" />
            <span className="text-sm text-[#ff6e00] font-medium">学习路径</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            系统学习线性代数
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            从基础概念到高级应用，循序渐进地掌握线性代数的核心知识。
            每个模块都配有交互式可视化工具。
          </p>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 perspective-1000">
          {modules.map((module, index) => {
            const Icon = module.icon;
            return (
              <div
                key={module.id}
                ref={(el) => { cardsRef.current[index] = el; }}
                className="group preserve-3d"
              >
                <Card className="h-full glass-card border-white/10 hover:border-[#ff6e00]/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#ff6e00]/10">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                        style={{ backgroundColor: `${module.color}20` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: module.color }} />
                      </div>
                      <Badge
                        variant="outline"
                        className={`${difficultyColors[module.difficulty]} text-xs`}
                      >
                        {module.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-[#ff6e00] transition-colors">
                      {module.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {module.description}
                    </p>
                    
                    {/* Topics */}
                    <div className="flex flex-wrap gap-2">
                      {module.topics.map((topic, i) => (
                        <span
                          key={i}
                          className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-500"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                    
                    {/* Action Button */}
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-[#ff6e00] hover:bg-[#ff6e00]/10 group/btn"
                      onClick={() => {
                        const modal = document.createElement('div');
                        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80';
                        modal.innerHTML = `
                          <div class="bg-[#2a2a2a] rounded-xl p-8 max-w-md text-center">
                            <h3 class="text-xl font-bold text-white mb-4">${module.title}</h3>
                            <p class="text-gray-400 mb-6">该模块内容正在开发中，敬请期待！</p>
                            <button class="px-6 py-2 bg-[#ff6e00] text-white rounded-lg hover:bg-[#ff8533] transition-colors" onclick="this.closest('.fixed').remove()">关闭</button>
                          </div>
                        `;
                        document.body.appendChild(modal);
                        modal.addEventListener('click', (e) => {
                          if (e.target === modal) modal.remove();
                        });
                      }}
                    >
                      开始学习
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-4">想要深入学习？</p>
          <Button
            className="btn-primary"
            onClick={() => {
              const modal = document.createElement('div');
              modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80';
              modal.innerHTML = `
                <div class="bg-[#2a2a2a] rounded-xl p-8 max-w-md text-center">
                  <h3 class="text-xl font-bold text-white mb-4">完整课程</h3>
                  <p class="text-gray-400 mb-6">完整课程即将上线，敬请期待！</p>
                  <button class="px-6 py-2 bg-[#ff6e00] text-white rounded-lg hover:bg-[#ff8533] transition-colors" onclick="this.closest('.fixed').remove()">关闭</button>
                </div>
              `;
              document.body.appendChild(modal);
              modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
              });
            }}
          >
            查看完整课程
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
