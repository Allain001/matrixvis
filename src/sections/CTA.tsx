import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function CTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      gsap.registerPlugin(ScrollTrigger);
    } catch (error) {
      console.warn('GSAP ScrollTrigger registration failed:', error);
    }
    const ctx = gsap.context(() => {
      // Content animation
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        ease: 'expo.out',
      });

      // Rotating rays
      if (raysRef.current) {
        gsap.to(raysRef.current, {
          rotation: 90,
          duration: 60,
          repeat: -1,
          ease: 'none',
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* Radial Rays Background */}
      <div
        ref={raysRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ transformOrigin: 'center center' }}
      >
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-[150%] bg-gradient-to-b from-transparent via-[#ff6e00]/20 to-transparent"
            style={{
              transform: `rotate(${i * 30}deg)`,
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff6e00]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff6e00]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['∑', '∫', 'π', 'λ', 'Δ', '√'].map((symbol, i) => (
          <div
            key={i}
            className="absolute text-[#ff6e00]/10 text-2xl font-mono"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          >
            {symbol}
          </div>
        ))}
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
          准备好探索
          <br />
          <span className="text-gradient">线性代数了吗？</span>
        </h2>
        
        <p className="text-xl text-gray-400 mb-10 max-w-xl mx-auto">
          开始您的交互式数学之旅，让抽象的数学概念变得直观可见。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button
            className="btn-primary text-lg px-10 py-6 group animate-pulse-glow"
            onClick={() => {
              const element = document.querySelector('#visualization');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            免费开始使用
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
                  <h3 class="text-xl font-bold text-white mb-4">文档中心</h3>
                  <p class="text-gray-400 mb-6">详细文档即将上线，敬请期待！</p>
                  <button class="px-6 py-2 bg-[#ff6e00] text-white rounded-lg hover:bg-[#ff8533] transition-colors" onclick="this.closest('.fixed').remove()">关闭</button>
                </div>
              `;
              document.body.appendChild(modal);
              modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
              });
            }}
          >
            <BookOpen className="mr-2 w-5 h-5" />
            查看文档
          </Button>
        </div>

        {/* Secondary Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              const modal = document.createElement('div');
              modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80';
              modal.innerHTML = `
                <div class="bg-[#2a2a2a] rounded-xl p-8 max-w-md text-center">
                  <h3 class="text-xl font-bold text-white mb-4">联系我们</h3>
                  <p class="text-gray-400 mb-6">联系功能即将上线，敬请期待！</p>
                  <button class="px-6 py-2 bg-[#ff6e00] text-white rounded-lg hover:bg-[#ff8533] transition-colors" onclick="this.closest('.fixed').remove()">关闭</button>
                </div>
              `;
              document.body.appendChild(modal);
              modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.remove();
              });
            }}
            className="text-gray-500 hover:text-[#ff6e00] transition-colors flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            联系团队
          </a>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
    </section>
  );
}
