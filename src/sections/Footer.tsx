import { useRef, useEffect } from 'react';
import { Sigma, Github, Twitter, Youtube, Mail } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const footerLinks = {
  product: {
    title: '产品',
    links: [
      { label: '功能', href: '#visualization' },
      { label: '学习', href: '#learning' },
      { label: '更新', href: '#' },
    ],
  },
  resources: {
    title: '资源',
    links: [
      { label: '文档', href: '#' },
      { label: '教程', href: '#' },
      { label: 'API', href: '#' },
    ],
  },
  company: {
    title: '公司',
    links: [
      { label: '关于', href: '#' },
      { label: '联系', href: '#' },
      { label: '招聘', href: '#' },
    ],
  },
};

const socialLinks = [
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Mail, href: '#', label: 'Email' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      gsap.registerPlugin(ScrollTrigger);
    } catch (error) {
      console.warn('GSAP ScrollTrigger registration failed:', error);
    }
    const ctx = gsap.context(() => {
      // Line draw animation
      gsap.from(lineRef.current, {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
        scaleX: 0,
        duration: 0.8,
        ease: 'expo.out',
      });

      // Content fade in
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'expo.out',
        delay: 0.2,
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '#') {
      e.preventDefault();
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80';
      modal.innerHTML = `
        <div class="bg-[#2a2a2a] rounded-xl p-8 max-w-md text-center">
          <h3 class="text-xl font-bold text-white mb-4">即将上线</h3>
          <p class="text-gray-400 mb-6">该功能正在开发中，敬请期待！</p>
          <button class="px-6 py-2 bg-[#ff6e00] text-white rounded-lg hover:bg-[#ff8533] transition-colors" onclick="this.closest('.fixed').remove()">关闭</button>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
      });
    } else if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#1a1a1a] pt-16 pb-8"
    >
      {/* Top Line */}
      <div
        ref={lineRef}
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ff6e00]/50 to-transparent origin-left"
      />

      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <a href="#hero" className="flex items-center gap-2 group mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#ff6e00] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Sigma className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Linea<span className="text-[#ff6e00]">Vis</span>
              </span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              让数学直观可见。通过交互式3D可视化，探索线性代数的美妙世界。
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    onClick={(e) => handleLinkClick(e, social.href)}
                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#ff6e00]/20 hover:text-[#ff6e00] transition-all duration-300 hover:rotate-[360deg]"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="text-white font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="text-gray-400 text-sm hover:text-[#ff6e00] transition-colors relative group"
                    >
                      {link.label}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#ff6e00] transition-all duration-300 group-hover:w-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 LineaVis. 保留所有权利。
            </p>
            <div className="flex gap-6 text-sm">
              <a
                href="#"
                onClick={(e) => handleLinkClick(e, '#')}
                className="text-gray-500 hover:text-[#ff6e00] transition-colors"
              >
                隐私政策
              </a>
              <a
                href="#"
                onClick={(e) => handleLinkClick(e, '#')}
                className="text-gray-500 hover:text-[#ff6e00] transition-colors"
              >
                服务条款
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
