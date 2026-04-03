import { useEffect } from 'react';
import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import Innovation from './sections/Innovation';
import MatrixVisualization from './sections/MatrixVisualization';
import ExperimentLab from './sections/ExperimentLab';
import LearningModules from './sections/LearningModules';
import CTA from './sections/CTA';
import Footer from './sections/Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function App() {
  useEffect(() => {
    try {
      gsap.registerPlugin(ScrollTrigger);
    } catch (error) {
      console.warn('GSAP ScrollTrigger registration failed:', error);
    }
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Initialize GSAP defaults
    gsap.defaults({
      ease: 'expo.out',
      duration: 0.8,
    });

    try {
      // Refresh ScrollTrigger on load
      ScrollTrigger.refresh();
    } catch (error) {
      console.warn('GSAP ScrollTrigger refresh failed:', error);
    }

    return () => {
      try {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      } catch (error) {
        console.warn('GSAP ScrollTrigger cleanup failed:', error);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Innovation />
        <MatrixVisualization />
        <ExperimentLab />
        <LearningModules />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

export default App;
