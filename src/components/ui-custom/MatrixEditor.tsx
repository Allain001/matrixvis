import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RotateCcw, Play, Pause, Grid3X3, Grid2X2 } from 'lucide-react';

interface MatrixEditorProps {
  initialMatrix?: number[][];
  onChange?: (matrix: number[][]) => void;
  onAnimate?: (playing: boolean) => void;
  size?: 2 | 3;
  allowSizeToggle?: boolean;
  className?: string;
}

const PRESETS = {
  identity: {
    name: '单位矩阵',
    '2x2': [[1, 0], [0, 1]],
    '3x3': [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
  },
  rotation45: {
    name: '旋转45°',
    '2x2': [[0.707, -0.707], [0.707, 0.707]],
    '3x3': [[0.707, -0.707, 0], [0.707, 0.707, 0], [0, 0, 1]],
  },
  rotation90: {
    name: '旋转90°',
    '2x2': [[0, -1], [1, 0]],
    '3x3': [[0, -1, 0], [1, 0, 0], [0, 0, 1]],
  },
  scale2x: {
    name: '缩放2倍',
    '2x2': [[2, 0], [0, 2]],
    '3x3': [[2, 0, 0], [0, 2, 0], [0, 0, 1]],
  },
  shearX: {
    name: 'X轴剪切',
    '2x2': [[1, 1], [0, 1]],
    '3x3': [[1, 1, 0], [0, 1, 0], [0, 0, 1]],
  },
  shearY: {
    name: 'Y轴剪切',
    '2x2': [[1, 0], [1, 1]],
    '3x3': [[1, 0, 0], [1, 1, 0], [0, 0, 1]],
  },
  reflectionX: {
    name: 'X轴反射',
    '2x2': [[1, 0], [0, -1]],
    '3x3': [[1, 0, 0], [0, -1, 0], [0, 0, 1]],
  },
  reflectionY: {
    name: 'Y轴反射',
    '2x2': [[-1, 0], [0, 1]],
    '3x3': [[-1, 0, 0], [0, 1, 0], [0, 0, 1]],
  },
};

export default function MatrixEditor({
  initialMatrix,
  onChange,
  onAnimate,
  size = 2,
  allowSizeToggle = true,
  className = '',
}: MatrixEditorProps) {
  const defaultMatrix = size === 2 
    ? [[1, 0], [0, 1]] 
    : [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  
  const [matrix, setMatrix] = useState<number[][]>(initialMatrix || defaultMatrix);
  const [isAnimating, setIsAnimating] = useState(false);
  const [editorSize, setEditorSize] = useState<2 | 3>(size);

  const handleChange = useCallback((row: number, col: number, value: string) => {
    const numValue = parseFloat(value) || 0;
    const newMatrix = matrix.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? numValue : c))
    );
    setMatrix(newMatrix);
    onChange?.(newMatrix);
  }, [matrix, onChange]);

  const applyPreset = useCallback((presetKey: keyof typeof PRESETS) => {
    const preset = PRESETS[presetKey];
    const newMatrix = preset[editorSize === 2 ? '2x2' : '3x3'];
    setMatrix(newMatrix);
    onChange?.(newMatrix);
  }, [editorSize, onChange]);

  const reset = useCallback(() => {
    setMatrix(defaultMatrix);
    onChange?.(defaultMatrix);
  }, [defaultMatrix, onChange]);

  const toggleAnimation = useCallback(() => {
    const newState = !isAnimating;
    setIsAnimating(newState);
    onAnimate?.(newState);
  }, [isAnimating, onAnimate]);

  const toggleSize = useCallback(() => {
    const newSize = editorSize === 2 ? 3 : 2;
    setEditorSize(newSize);
    const newMatrix = newSize === 2 
      ? [[1, 0], [0, 1]] 
      : [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    setMatrix(newMatrix);
    onChange?.(newMatrix);
  }, [editorSize, onChange]);

  const determinant = editorSize === 2
    ? matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
    : null;

  return (
    <div className={`glass-card rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">变换矩阵</h3>
        <div className="flex gap-2">
          {allowSizeToggle && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSize}
              className="h-8 w-8 text-gray-400 hover:text-white"
            >
              {editorSize === 2 ? <Grid2X2 className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAnimation}
            className="h-8 w-8 text-gray-400 hover:text-white"
          >
            {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={reset}
            className="h-8 w-8 text-gray-400 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Matrix Grid */}
      <div className="relative mb-4">
        <div className="absolute left-0 top-0 bottom-0 w-2 border-l-2 border-t-2 border-b-2 border-[#ff6e00] rounded-l" />
        <div className="absolute right-0 top-0 bottom-0 w-2 border-r-2 border-t-2 border-b-2 border-[#ff6e00] rounded-r" />
        <div className={`grid gap-2 ${editorSize === 2 ? 'grid-cols-2' : 'grid-cols-3'} px-4 py-2`}>
          {matrix.map((row, i) =>
            row.map((val, j) => (
              <Input
                key={`${i}-${j}`}
                type="number"
                value={val}
                onChange={(e) => handleChange(i, j, e.target.value)}
                className="w-full h-12 text-center bg-black/30 border-white/10 text-white font-mono text-lg focus:border-[#ff6e00] focus:ring-[#ff6e00]/20"
                step="0.1"
              />
            ))
          )}
        </div>
      </div>

      {/* Determinant */}
      {determinant !== null && (
        <div className="mb-4 p-2 bg-black/30 rounded-lg">
          <span className="text-sm text-gray-400">行列式: </span>
          <span className="text-lg font-mono text-[#ff6e00]">{determinant.toFixed(3)}</span>
        </div>
      )}

      {/* Presets */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 uppercase tracking-wider">预设变换</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <Button
              key={key}
              variant="outline"
              size="sm"
              onClick={() => applyPreset(key as keyof typeof PRESETS)}
              className="text-xs bg-transparent border-white/10 text-gray-300 hover:bg-[#ff6e00]/20 hover:border-[#ff6e00]/50 hover:text-white"
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
