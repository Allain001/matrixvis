import { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import MatrixEditor from '@/components/ui-custom/MatrixEditor';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ClientOnly from '@/components/ClientOnly';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Eye, Rotate3D, Calculator } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Vector3DProps {
  origin?: [number, number, number];
  direction: [number, number, number];
  color?: string;
  label?: string;
}

function Vector3D({ origin = [0, 0, 0], direction, color = '#ff6e00', label }: Vector3DProps) {
  const endPoint: [number, number, number] = [
    origin[0] + direction[0],
    origin[1] + direction[1],
    origin[2] + direction[2],
  ];

  return (
    <group>
      <Line
        points={[origin, endPoint]}
        color={color}
        lineWidth={4}
      />
      <mesh position={endPoint} lookAt={origin}>
        <coneGeometry args={[0.12, 0.35, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {label && (
        <Text
          position={[
            endPoint[0] + 0.3,
            endPoint[1] + 0.3,
            endPoint[2],
          ]}
          fontSize={0.35}
          color={color}
          anchorX="left"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
}

interface TransformedObjectProps {
  matrix: number[][];
  showOriginal?: boolean;
  showVectors?: boolean;
}

function TransformedObject({ matrix, showOriginal = true, showVectors = true }: TransformedObjectProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const originalMeshRef = useRef<THREE.Mesh>(null);

  const applyTransform = (x: number, y: number, z: number): [number, number, number] => {
    const m = matrix;
    if (m.length === 2) {
      return [
        m[0][0] * x + m[0][1] * y,
        m[1][0] * x + m[1][1] * y,
        z,
      ];
    }
    return [
      (m[0]?.[0] || 1) * x + (m[0]?.[1] || 0) * y + (m[0]?.[2] || 0) * z,
      (m[1]?.[0] || 0) * x + (m[1]?.[1] || 1) * y + (m[1]?.[2] || 0) * z,
      (m[2]?.[0] || 0) * x + (m[2]?.[1] || 0) * y + (m[2]?.[2] || 1) * z,
    ];
  };

  // Create transformed geometry
  const transformedCorners = [
    applyTransform(1, 1, 0),
    applyTransform(-1, 1, 0),
    applyTransform(-1, -1, 0),
    applyTransform(1, -1, 0),
  ];

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group>
      {/* Original square */}
      {showOriginal && (
        <group ref={originalMeshRef}>
          <Line
            points={[[1, 1, 0], [-1, 1, 0], [-1, -1, 0], [1, -1, 0], [1, 1, 0]]}
            color="#444"
            lineWidth={2}
            transparent
            opacity={0.5}
          />
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[2, 2]} />
            <meshBasicMaterial color="#333" transparent opacity={0.2} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* Transformed shape */}
      <group ref={meshRef}>
        <Line
          points={[transformedCorners[0], transformedCorners[1], transformedCorners[2], transformedCorners[3], transformedCorners[0]]}
          color="#ff6e00"
          lineWidth={3}
        />
        <mesh position={[
          (transformedCorners[0][0] + transformedCorners[2][0]) / 2,
          (transformedCorners[0][1] + transformedCorners[2][1]) / 2,
          0,
        ]}>
          <planeGeometry args={[
            Math.abs(transformedCorners[0][0] - transformedCorners[1][0]),
            Math.abs(transformedCorners[0][1] - transformedCorners[3][1]),
          ]} />
          <meshBasicMaterial 
            color="#ff6e00" 
            transparent 
            opacity={0.3} 
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Corner points */}
        {transformedCorners.map((corner, i) => (
          <mesh key={i} position={corner}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#ff6e00" />
          </mesh>
        ))}
      </group>

      {/* Basis vectors */}
      {showVectors && (
        <>
          <Vector3D
            direction={[matrix[0][0], matrix[1][0], 0]}
            color="#ff4444"
            label="e₁'"
          />
          <Vector3D
            direction={[matrix[0][1], matrix[1][1], 0]}
            color="#44ff44"
            label="e₂'"
          />
        </>
      )}
    </group>
  );
}

function Scene({ matrix, showOriginal, showGrid, showVectors }: {
  matrix: number[][];
  showOriginal: boolean;
  showGrid: boolean;
  showVectors: boolean;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {showGrid && (
        <Grid
          position={[0, 0, 0]}
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#333"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#ff6e00"
          fadeDistance={25}
          fadeStrength={1}
          infiniteGrid
        />
      )}
      
      {/* Coordinate axes */}
      <Line points={[[-6, 0, 0], [6, 0, 0]]} color="#ff4444" lineWidth={2} />
      <Line points={[[0, -6, 0], [0, 6, 0]]} color="#44ff44" lineWidth={2} />
      <Line points={[[0, 0, -6], [0, 0, 6]]} color="#4444ff" lineWidth={2} />
      
      {/* Axis labels */}
      <Text position={[6.3, 0, 0]} fontSize={0.4} color="#ff4444" anchorX="left">X</Text>
      <Text position={[0, 6.3, 0]} fontSize={0.4} color="#44ff44" anchorY="bottom">Y</Text>
      <Text position={[0, 0, 6.3]} fontSize={0.4} color="#4444ff" anchorX="center">Z</Text>
      
      <TransformedObject matrix={matrix} showOriginal={showOriginal} showVectors={showVectors} />
      
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={20}
      />
    </>
  );
}

export default function MatrixVisualization() {
  const [matrix, setMatrix] = useState<number[][]>([[1, 0], [0, 1]]);
  const [showOriginal, setShowOriginal] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showVectors, setShowVectors] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      gsap.registerPlugin(ScrollTrigger);
    } catch (error) {
      console.warn('GSAP ScrollTrigger registration failed:', error);
    }
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 30%',
          toggleActions: 'play none none reverse',
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'expo.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Auto-rotate matrix when animating
  useEffect(() => {
    if (!isAnimating) return;

    let angle = 0;
    const interval = setInterval(() => {
      angle += 0.02;
      const newMatrix = [
        [Math.cos(angle), -Math.sin(angle)],
        [Math.sin(angle), Math.cos(angle)],
      ];
      setMatrix(newMatrix);
    }, 16);

    return () => clearInterval(interval);
  }, [isAnimating]);

  return (
    <section
      id="visualization"
      ref={sectionRef}
      className="relative min-h-screen py-20 bg-[#0f0f0f]"
    >
      {/* Background Grid */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div ref={contentRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6e00]/10 border border-[#ff6e00]/30 mb-6">
            <Rotate3D className="w-4 h-4 text-[#ff6e00]" />
            <span className="text-sm text-[#ff6e00] font-medium">交互式可视化</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            实时见证矩阵变换的力量
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            调整变换矩阵的值，即时观察向量空间如何扭曲、旋转和缩放。
            理解线性变换的本质。
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-2 space-y-6">
            <MatrixEditor
              initialMatrix={matrix}
              onChange={setMatrix}
              onAnimate={setIsAnimating}
              size={2}
            />

            {/* Display Options */}
            <div className="glass-card rounded-xl p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                显示选项
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-original" className="text-gray-300 cursor-pointer">
                    显示原图形
                  </Label>
                  <Switch
                    id="show-original"
                    checked={showOriginal}
                    onCheckedChange={setShowOriginal}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-grid" className="text-gray-300 cursor-pointer">
                    显示网格
                  </Label>
                  <Switch
                    id="show-grid"
                    checked={showGrid}
                    onCheckedChange={setShowGrid}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-vectors" className="text-gray-300 cursor-pointer">
                    显示基向量
                  </Label>
                  <Switch
                    id="show-vectors"
                    checked={showVectors}
                    onCheckedChange={setShowVectors}
                  />
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="glass-card rounded-xl p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                当前变换
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">类型:</span>
                  <span className="text-white">
                    {Math.abs(matrix[0][1]) > 0.1 || Math.abs(matrix[1][0]) > 0.1
                      ? '剪切变换'
                      : matrix[0][0] === matrix[1][1] && matrix[0][0] !== 1
                      ? '均匀缩放'
                      : matrix[0][0] !== 1 || matrix[1][1] !== 1
                      ? '非均匀缩放'
                      : '旋转变换'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">行列式:</span>
                  <span className="text-[#ff6e00] font-mono">
                    {(matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]).toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">面积变化:</span>
                  <span className="text-white">
                    {Math.abs(matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) > 1
                      ? '放大'
                      : Math.abs(matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]) < 1
                      ? '缩小'
                      : '不变'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Canvas */}
          <div className="lg:col-span-3">
            <div className="glass-card rounded-xl overflow-hidden relative" style={{ height: '600px' }}>
              <ClientOnly
                fallback={
                  <div className="h-full w-full flex items-center justify-center text-sm text-gray-400">
                    3D 视图加载中…
                  </div>
                }
              >
                <ErrorBoundary
                  fallback={
                    <div className="h-full w-full flex items-center justify-center text-sm text-gray-400">
                      当前环境无法渲染 3D 视图
                    </div>
                  }
                >
                  <Canvas
                    camera={{ position: [6, 6, 6], fov: 50 }}
                    gl={{ antialias: true, alpha: true }}
                  >
                    <Scene
                      matrix={matrix}
                      showOriginal={showOriginal}
                      showGrid={showGrid}
                      showVectors={showVectors}
                    />
                  </Canvas>
                </ErrorBoundary>
              </ClientOnly>
              
              {/* Overlay Instructions */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
                <div className="text-xs text-gray-500">
                  <p>🖱️ 拖拽旋转视角</p>
                  <p>🖱️ 滚轮缩放</p>
                </div>
                <div className="glass px-3 py-1 rounded-full text-xs text-gray-400">
                  3D 交互视图
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
