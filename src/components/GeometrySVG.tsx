import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StepData } from '../data/steps';

interface GeometrySVGProps {
  stepData: StepData;
}

export const GeometrySVG: React.FC<GeometrySVGProps> = ({ stepData }) => {
  const { n, highlightTriangles, showLines, showAngles } = stepData.geometryParams;

  // 坐标系计算逻辑
  const coords = useMemo(() => {
    const a = 300; // 正方形边长
    const ox = 100; // X 偏移
    const oy = 80;  // Y 偏移，留出顶部空间

    // 基础点
    const A = { x: ox, y: oy };
    const B = { x: ox, y: oy + a };
    const C = { x: ox + a, y: oy + a };
    const D = { x: ox + a, y: oy };

    // 动点计算
    const P = { x: ox + a / n, y: oy };
    
    // BE 的长度 y = a * (n^2 - 1) / (n^2 + 1)
    const BE = a * (n * n - 1) / (n * n + 1);
    const E = { x: ox, y: oy + a - BE };
    
    const M_x = a * 2 * n / (n * n + 1);
    const M = { x: ox + M_x, y: E.y };
    
    // N 是 EF 和 BP 的交点
    // BP 直线方程 (相对于A): Y = -n * X + a (坐标系Y向下，所以是 Y = -n*X + a)
    // 实际坐标系中：B(ox, oy+a), P(ox+a/n, oy)
    // 斜率 k = (oy - (oy+a)) / (ox+a/n - ox) = -a / (a/n) = -n
    // 直线方程: y - (oy+a) = -n * (x - ox) => y = -n(x - ox) + oy + a
    // N 的 y 坐标等于 E 的 y 坐标
    const N_x = ox + (oy + a - E.y) / n;
    const N = { x: N_x, y: E.y };

    const F = { x: ox + a, y: E.y };

    // Q 是 PM 延长线与 CD 的交点
    // CQ = a * (n - 1) / (n + 1)
    const CQ = a * (n - 1) / (n + 1);
    const Q = { x: ox + a, y: oy + a - CQ };

    return { A, B, C, D, P, E, M, N, F, Q };
  }, [n]);

  const { A, B, C, D, P, E, M, N, F, Q } = coords;

  // 辅助函数：生成多边形路径
  const getPolygon = (points: {x: number, y: number}[]) => {
    return points.map(p => `${p.x},${p.y}`).join(' ');
  };

  // 辅助函数：计算两点之间的单位向量
  const getUnitVector = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    return { x: dx / len, y: dy / len };
  };

  // 计算直角标记的路径
  const getRightAnglePath = (vertex: {x: number, y: number}, p1: {x: number, y: number}, p2: {x: number, y: number}, size = 15) => {
    const v1 = getUnitVector(vertex, p1);
    const v2 = getUnitVector(vertex, p2);
    
    const pt1 = { x: vertex.x + v1.x * size, y: vertex.y + v1.y * size };
    const pt2 = { x: vertex.x + v2.x * size, y: vertex.y + v2.y * size };
    const pt3 = { x: pt1.x + v2.x * size, y: pt1.y + v2.y * size };
    
    return `M ${pt1.x} ${pt1.y} L ${pt3.x} ${pt3.y} L ${pt2.x} ${pt2.y}`;
  };

  // 辅助函数：判断是否需要高亮
  const isHighlighted = (name: string) => highlightTriangles?.includes(name);
  const isLineShown = (name: string) => showLines?.includes(name);
  const isAngleShown = (name: string) => showAngles?.includes(name);

  return (
    <div className="w-full h-full flex items-start pt-8 justify-center relative">
      <svg viewBox="0 0 500 500" className="w-full max-w-[450px] h-auto drop-shadow-sm">
        {/* 基础正方形 */}
        <polygon points={getPolygon([A, B, C, D])} fill="none" stroke="#334155" strokeWidth="2" />
        
        {/* 高亮三角形区域 */}
        <AnimatePresence>
          {isHighlighted('ABP') && (
            <motion.polygon
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              points={getPolygon([A, B, P])} fill="rgba(59, 130, 246, 0.1)"
            />
          )}
          {isHighlighted('MBP') && (
            <motion.polygon
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              points={getPolygon([M, B, P])} fill="rgba(59, 130, 246, 0.15)"
            />
          )}
          {isHighlighted('PMN') && (
            <motion.polygon
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              points={getPolygon([P, M, N])} fill="rgba(16, 185, 129, 0.15)"
            />
          )}
          {isHighlighted('MBE') && (
            <motion.polygon
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              points={getPolygon([M, B, E])} fill="rgba(245, 158, 11, 0.15)"
            />
          )}
          {isHighlighted('CBQ') && (
            <motion.polygon
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              points={getPolygon([C, B, Q])} fill="rgba(239, 68, 68, 0.1)"
            />
          )}
          {isHighlighted('MBQ') && (
            <motion.polygon
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              points={getPolygon([M, B, Q])} fill="rgba(239, 68, 68, 0.15)"
            />
          )}
          {isHighlighted('PDQ') && (
            <motion.polygon
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              points={getPolygon([P, D, Q])} fill="rgba(168, 85, 247, 0.15)"
            />
          )}
        </AnimatePresence>

        {/* 动态辅助线 */}
        <g stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5">
          {isLineShown('EF') && <motion.line x1={E.x} y1={E.y} x2={F.x} y2={F.y} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
          {isLineShown('BP') && <motion.line x1={B.x} y1={B.y} x2={P.x} y2={P.y} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
          {isLineShown('AP') && <motion.line x1={A.x} y1={A.y} x2={P.x} y2={P.y} stroke="#10b981" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
          {isLineShown('MP') && <motion.line x1={M.x} y1={M.y} x2={P.x} y2={P.y} stroke="#10b981" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
          {isLineShown('PN') && <motion.line x1={P.x} y1={P.y} x2={N.x} y2={N.y} stroke="#10b981" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
          {isLineShown('MN') && <motion.line x1={M.x} y1={M.y} x2={N.x} y2={N.y} stroke="#10b981" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
          {isLineShown('ME') && <motion.line x1={M.x} y1={M.y} x2={E.x} y2={E.y} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
          {isLineShown('MF') && <motion.line x1={M.x} y1={M.y} x2={F.x} y2={F.y} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
          {isLineShown('PQ') && <motion.line x1={P.x} y1={P.y} x2={Q.x} y2={Q.y} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
          {isLineShown('PD') && <motion.line x1={P.x} y1={P.y} x2={D.x} y2={D.y} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
          {isLineShown('DQ') && <motion.line x1={D.x} y1={D.y} x2={Q.x} y2={Q.y} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
          {isLineShown('MQ') && <motion.line x1={M.x} y1={M.y} x2={Q.x} y2={Q.y} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
          {isLineShown('BQ') && <motion.line x1={B.x} y1={B.y} x2={Q.x} y2={Q.y} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
          {isLineShown('CQ') && <motion.line x1={C.x} y1={C.y} x2={Q.x} y2={Q.y} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
        </g>

        {/* 角度标记 (简化版弧线) */}
        <AnimatePresence>
          {isAngleShown('A') && (
            <motion.path d={`M ${A.x} ${A.y+20} A 20 20 0 0 0 ${A.x+20} ${A.y}`} fill="none" stroke="#334155" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          )}
          {isAngleShown('D') && (
            <motion.path d={`M ${D.x-20} ${D.y} A 20 20 0 0 1 ${D.x} ${D.y+20}`} fill="none" stroke="#334155" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          )}
          {isAngleShown('BMP') && (
            <motion.path d={getRightAnglePath(M, P, B, 15)} fill="none" stroke="#334155" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          )}
          {isAngleShown('BMQ') && (
            <motion.path d={getRightAnglePath(M, Q, B, 15)} fill="none" stroke="#334155" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          )}
          {isAngleShown('C') && (
            <motion.path d={`M ${C.x-20} ${C.y} A 20 20 0 0 0 ${C.x} ${C.y-20}`} fill="none" stroke="#334155" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          )}
          {/* α 和 β 角 */}
          {isAngleShown('ABP') && (
            <motion.text x={B.x + 15} y={B.y - 40} fontSize="14" fill="#ef4444" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>α</motion.text>
          )}
          {isAngleShown('MBP') && (
            <motion.text x={B.x + 40} y={B.y - 25} fontSize="14" fill="#ef4444" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>α</motion.text>
          )}
          {isAngleShown('MBQ') && (
            <motion.text x={B.x + 60} y={B.y - 15} fontSize="14" fill="#3b82f6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>β</motion.text>
          )}
          {isAngleShown('CBQ') && (
            <motion.text x={B.x + 80} y={B.y - 5} fontSize="14" fill="#3b82f6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>β</motion.text>
          )}
        </AnimatePresence>

        {/* 顶点和标签 */}
        <g fill="#334155" className="font-serif italic text-lg">
          <circle cx={A.x} cy={A.y} r="3" /> <text x={A.x - 20} y={A.y + 5}>A</text>
          <circle cx={B.x} cy={B.y} r="3" /> <text x={B.x - 20} y={B.y + 5}>B</text>
          <circle cx={C.x} cy={C.y} r="3" /> <text x={C.x + 10} y={C.y + 5}>C</text>
          <circle cx={D.x} cy={D.y} r="3" /> <text x={D.x + 10} y={D.y + 5}>D</text>
          
          <motion.circle r="4" fill="#ef4444" animate={{ cx: P.x, cy: P.y }} /> 
          <motion.text animate={{ x: P.x - 5, y: P.y - 12 }}>P</motion.text>
          
          <motion.circle r="4" fill="#ef4444" animate={{ cx: M.x, cy: M.y }} /> 
          <motion.text animate={{ x: M.x + 8, y: M.y - 8 }}>M</motion.text>
          
          {stepData.id > 0 && (
            <>
              <motion.circle r="3" animate={{ cx: E.x, cy: E.y }} /> 
              <motion.text animate={{ x: E.x - 20, y: E.y + 5 }}>E</motion.text>
              
              <motion.circle r="3" animate={{ cx: F.x, cy: F.y }} /> 
              <motion.text animate={{ x: F.x + 10, y: F.y + 5 }}>F</motion.text>
              
              <motion.circle r="3" animate={{ cx: N.x, cy: N.y }} /> 
              <motion.text animate={{ x: N.x - 5, y: N.y - 10 }}>N</motion.text>
            </>
          )}

          {stepData.id >= 3 && (
            <>
              <motion.circle r="4" fill="#ef4444" animate={{ cx: Q.x, cy: Q.y }} /> 
              <motion.text animate={{ x: Q.x + 10, y: Q.y + 5 }}>Q</motion.text>
            </>
          )}
        </g>
      </svg>
    </div>
  );
};
