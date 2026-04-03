import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import ClientOnly from '@/components/ClientOnly';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// Floating Math Symbols Component
function FloatingSymbols() {
  const symbols = ['∑', '∫', 'π', 'λ', 'Δ', '√', '∞', '∂'];
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {symbols.map((symbol, i) => {
        const angle = (i / symbols.length) * Math.PI * 2;
        const radius = 4;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle * 0.5) * 2;
        const z = Math.sin(angle) * radius;

        return (
          <Float
            key={i}
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={0.5}
          >
            <Text
              position={[x, y, z]}
              fontSize={0.8}
              color="#ff6e00"
              anchorX="center"
              anchorY="middle"
              fillOpacity={0.3}
            >
              {symbol}
            </Text>
          </Float>
        );
      })}
    </group>
  );
}

// 3D Grid Background
function GridBackground() {
  return (
    <>
      <gridHelper args={[30, 30, '#ff6e00', '#333']} position={[0, -3, 0]} />
      <FloatingSymbols />
    </>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([titleRef.current, subtitleRef.current, ctaRef.current], {
        opacity: 0,
        y: 50,
      });
      gsap.set(badgeRef.current, { opacity: 0, x: -30 });

      // Animation timeline
      const tl = gsap.timeline({ delay: 0.3 });

      tl.to(badgeRef.current, {
        opacity: 1,
        x: 0,
        duration: 0.6,
        ease: 'expo.out',
      })
        .to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'expo.out',
        }, '-=0.3')
        .to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'expo.out',
        }, '-=0.5')
        .to(ctaRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'expo.out',
        }, '-=0.4');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToVisualization = () => {
    const element = document.querySelector('#visualization');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <ClientOnly fallback={<div className="h-full w-full" />}>
          <ErrorBoundary fallback={<div className="h-full w-full" />}>
            <Canvas
              camera={{ position: [0, 0, 10], fov: 60 }}
              gl={{ antialias: true, alpha: true }}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <GridBackground />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.5}
              />
            </Canvas>
          </ErrorBoundary>
        </ClientOnly>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1a1a]/50 to-[#1a1a1a] z-10" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 grid-bg opacity-30 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6e00]/10 border border-[#ff6e00]/30 mb-8"
        >
          <Sparkles className="w-4 h-4 text-[#ff6e00]" />
          <span className="text-sm text-[#ff6e00] font-medium">
            线性代数可视化平台
          </span>
        </div>

        {/* Title */}
        <h1
          ref={titleRef}
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-6 leading-tight"
        >
          让数学
          <br />
          <span className="text-gradient glow-text">直观可见</span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          通过交互式3D可视化，探索矩阵变换、向量空间与线性映射的美妙世界。
          <br className="hidden sm:block" />
          让抽象的数学概念变得触手可及。
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={scrollToVisualization}
            className="btn-primary text-lg px-8 py-6 group"
          >
            开始探索
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button
            variant="outline"
            className="btn-secondary text-lg px-8 py-6"
            onClick={() => {
              const modal = document.createElement('div');
              modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80';
              modal.innerHTML = `
                <div class="bg-[#2a2a2a] rounded-xl p-8 max-w-md text-center">
                  <h3 class="text-xl font-bold text-white mb-4">演示视频</h3>
                  <p class="text-gray-400 mb-6">演示视频功能即将上线，敬请期待！</p>
                  <button class="px-6 py-2 bg-[#ff6e00] text-white rounded-lg hover:bg-[#ff8533] transition-colors" onclick="this.closest('.fixed').remove()">关闭</button>
                </div>
              `;
              document.body.appendChild(modal);
              modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
              });
            }}
          >
            <Play className="mr-2 w-5 h-5" />
            观看演示
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: '10+', label: '可视化工具' },
            { value: '50+', label: '学习模块' },
            { value: '3D', label: '交互体验' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#ff6e00]">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-gray-500 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a1a1a] to-transparent z-20" />
    </section>
  );
}
