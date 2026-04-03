import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Line } from '@react-three/drei';
import * as THREE from 'three';

interface AxisProps {
  direction: [number, number, number];
  color: string;
  label: string;
}

function Axis({ direction, color, label }: AxisProps) {
  const endPoint: [number, number, number] = [
    direction[0] * 5,
    direction[1] * 5,
    direction[2] * 5,
  ];

  return (
    <group>
      <Line
        points={[[0, 0, 0], endPoint]}
        color={color}
        lineWidth={3}
      />
      <Text
        position={[
          direction[0] * 5.5,
          direction[1] * 5.5,
          direction[2] * 5.5,
        ]}
        fontSize={0.5}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        {label}
      </Text>
      {/* Arrow head */}
      <mesh position={endPoint} lookAt={[0, 0, 0]}>
        <coneGeometry args={[0.1, 0.3, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

interface Vector3DProps {
  origin?: [number, number, number];
  direction: [number, number, number];
  color?: string;
  label?: string;
  animated?: boolean;
}

export function Vector3D({
  origin = [0, 0, 0],
  direction,
  color = '#ff6e00',
  label,
  animated = false,
}: Vector3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const endPoint: [number, number, number] = [
    origin[0] + direction[0],
    origin[1] + direction[1],
    origin[2] + direction[2],
  ];

  useFrame((state) => {
    if (animated && meshRef.current) {
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group>
      <Line
        points={[origin, endPoint]}
        color={color}
        lineWidth={4}
      />
      <mesh ref={meshRef} position={endPoint} lookAt={origin}>
        <coneGeometry args={[0.15, 0.4, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {label && (
        <Text
          position={[
            endPoint[0] + 0.3,
            endPoint[1] + 0.3,
            endPoint[2] + 0.3,
          ]}
          fontSize={0.3}
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

interface TransformedGridProps {
  matrix?: number[][];
  showOriginal?: boolean;
}

function TransformedGrid({ matrix = [[1, 0], [0, 1]], showOriginal = true }: TransformedGridProps) {
  const groupRef = useRef<THREE.Group>(null);

  const originalLines = useMemo(() => {
    const lines = [];
    for (let i = -5; i <= 5; i++) {
      lines.push(
        { start: [-5, i, 0], end: [5, i, 0] },
        { start: [i, -5, 0], end: [i, 5, 0] }
      );
    }
    return lines;
  }, []);

  const transformPoint = (x: number, y: number): [number, number, number] => {
    const m = matrix;
    if (m.length === 2) {
      return [
        m[0][0] * x + m[0][1] * y,
        m[1][0] * x + m[1][1] * y,
        0,
      ];
    }
    return [x, y, 0];
  };

  return (
    <group ref={groupRef}>
      {/* Original grid */}
      {showOriginal && originalLines.map((line, i) => (
        <Line
          key={`orig-${i}`}
          points={[line.start as [number, number, number], line.end as [number, number, number]]}
          color="#333"
          lineWidth={1}
          transparent
          opacity={0.3}
        />
      ))}
      
      {/* Transformed grid */}
      {originalLines.map((line, i) => {
        const start = transformPoint(line.start[0], line.start[1]);
        const end = transformPoint(line.end[0], line.end[1]);
        return (
          <Line
            key={`trans-${i}`}
            points={[start, end]}
            color="#ff6e00"
            lineWidth={2}
            transparent
            opacity={0.6}
          />
        );
      })}
    </group>
  );
}

interface CoordinateSystemProps {
  matrix?: number[][];
  vectors?: Array<{
    direction: [number, number, number];
    color?: string;
    label?: string;
  }>;
  showGrid?: boolean;
  showAxes?: boolean;
  animated?: boolean;
  className?: string;
}

function Scene({
  matrix,
  vectors = [],
  showGrid = true,
  showAxes = true,
  animated = false,
}: CoordinateSystemProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (animated && groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
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
      
      {showAxes && (
        <>
          <Axis direction={[1, 0, 0]} color="#ff4444" label="X" />
          <Axis direction={[0, 1, 0]} color="#44ff44" label="Y" />
          <Axis direction={[0, 0, 1]} color="#4444ff" label="Z" />
        </>
      )}
      
      {matrix && <TransformedGrid matrix={matrix} />}
      
      {vectors.map((v, i) => (
        <Vector3D
          key={i}
          direction={v.direction}
          color={v.color || '#ff6e00'}
          label={v.label}
        />
      ))}
    </group>
  );
}

export default function CoordinateSystem({
  matrix,
  vectors,
  showGrid = true,
  showAxes = true,
  animated = false,
  className = '',
}: CoordinateSystemProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [8, 8, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Scene
          matrix={matrix}
          vectors={vectors}
          showGrid={showGrid}
          showAxes={showAxes}
          animated={animated}
        />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
        />
      </Canvas>
    </div>
  );
}
