import { BookOpen, Compass, Calculator, Lightbulb, CheckCircle, Target } from 'lucide-react';
import React from 'react';

export interface StepData {
  id: number;
  title: string;
  icon: React.ElementType;
  desc: string;
  detail: string;
  tts: string;
  // 用于控制几何图形渲染的参数
  geometryParams: {
    n: number; // 比例参数 MN/BC = 1/n
    highlightTriangles?: string[]; // 需要高亮的三角形
    showLines?: string[]; // 需要显示的辅助线
    showAngles?: string[]; // 需要显示的角
  };
}

export const steps: StepData[] = [
  {
    id: 0,
    title: "解题思路：折叠与全等",
    icon: BookOpen,
    desc: "遇到折叠问题，核心是抓住“折叠前后的图形全等”。",
    detail: "折叠意味着轴对称，即 △ABP ≌ △MBP。由此可得线段相等 (AB=MB, AP=MP) 和角相等 (∠A = ∠BMP = 90°)。把握住这些隐藏的相等关系，是解决后续所有问题的基础。",
    tts: "同学们好！今天我们来看一道非常经典的“正方形折叠”问题。遇到折叠，大家脑海里一定要立刻跳出两个字：“全等”！折叠前后的两部分图形是完全一样的。把握住隐藏的相等线段和相等的角，难题就能迎刃而解。",
    geometryParams: {
      n: 2, // 默认比例
      highlightTriangles: ['ABP', 'MBP'],
      showLines: ['BP', 'AP', 'MP'],
      showAngles: ['A', 'BMP']
    }
  },
  {
    id: 1,
    title: "第(1)问：发现特殊三角形",
    icon: Compass,
    desc: "当 E 为 AB 中点时，探究 △PMN 的形状。",
    detail: "设正方形边长为 2a。E 为中点，则 AE=BE=a。在 Rt△MBE 中，MB=2a, BE=a，可得 ∠MBE=60°。由折叠知 ∠ABP=∠MBP=30°。推导可得 AP=MP=(2√3/3)a。又因为 EF ∥ AD，可证 △BEN ∽ △BAP，求出 EN，进而得到 MN = MP = PN，所以 △PMN 是等边三角形。",
    tts: "我们先看第一问。当 E 是 AB 中点时，我们在直角三角形 MBE 中，斜边 MB 等于正方形边长，是直角边 BE 的两倍。这说明什么？说明角 MBE 是 60 度！结合折叠的平分角性质，我们可以算出各个线段的长度，最后发现 PM, MN, PN 都相等，所以它是一个等边三角形。",
    geometryParams: {
      n: Math.sqrt(3), // E为中点时的特殊比例
      highlightTriangles: ['PMN', 'MBE'],
      showLines: ['EF', 'PM', 'PN', 'MN'],
      showAngles: ['MBE', 'ABP', 'MBP']
    }
  },
  {
    id: 2,
    title: "第(2)问：勾股定理建方程",
    icon: Calculator,
    desc: "利用 ME·MF = 10 求解正方形边长。",
    detail: "设边长为 a。在 Rt△MBE 中，ME = √(a² - 5²)。因为 EF=a，所以 MF = a - ME。代入已知条件 ME(a - ME) = 10，即 √(a²-25)(a - √(a²-25)) = 10。解这个无理方程，化简得 5a² = 225，解得 a = 3√5。",
    tts: "接着看第二问。已知 BE 等于 5，我们可以设正方形边长为 a。在直角三角形 MBE 中，用勾股定理表示出 ME。又因为 EF 的总长就是边长 a，所以 MF 也能用 a 表示出来。把它们代入题目给的乘积等于 10 的条件，解方程就能得到边长是 3倍根号5。",
    geometryParams: {
      n: 2,
      highlightTriangles: ['MBE'],
      showLines: ['EF', 'ME', 'MF'],
      showAngles: []
    }
  },
  {
    id: 3,
    title: "第(3)问：线段转化与设元",
    icon: Target,
    desc: "探究 MN/BC = 1/n 时的线段比例关系。",
    detail: "通过几何推导易证 MN = AP。已知 MN/BC = 1/n，且 AB = BC，所以 AP/AB = 1/n。设正方形边长为 a，则 AP = a/n。由折叠的性质可知，MP = AP = a/n。同时 DP = a - a/n = a(n-1)/n。",
    tts: "最精彩的第三问来了！题目给出了 MN 和 BC 的比值。其实通过推导我们会发现，MN 的长度就等于 AP！所以 AP 和边长 AB 的比值也是 n 分之 1。我们可以设正方形的边长为 a，那么 AP 就是 n 分之 a。根据折叠全等，MP 也是 n 分之 a。这样我们就把线段长度都表示出来了。",
    geometryParams: {
      n: 2,
      highlightTriangles: ['ABP'],
      showLines: ['EF', 'MN', 'AP', 'PM', 'PQ'],
      showAngles: ['ABP', 'MBP']
    }
  },
  {
    id: 4,
    title: "第(3)问：发现隐藏的“半角模型”",
    icon: Lightbulb,
    desc: "证明 △CBQ ≌ △MBQ。",
    detail: "因为 ∠BMP = ∠A = 90°，且 P, M, Q 共线，所以 ∠BMQ = 90°。在 Rt△CBQ 和 Rt△MBQ 中，BC=BM, BQ=BQ，所以 △CBQ ≌ △MBQ (HL)。因此 ∠CBQ = ∠MBQ = β。",
    tts: "接下来是破局的关键！大家看点 M 处的角，因为折叠，角 BMP 是 90 度，所以旁边的角 BMQ 也是 90 度。这就凑成了两个直角三角形 CBQ 和 MBQ。它们有一条公共斜边 BQ，还有相等的直角边 BC 和 BM。所以它们全等！",
    geometryParams: {
      n: 2,
      highlightTriangles: ['CBQ', 'MBQ'],
      showLines: ['BQ', 'PQ', 'MQ', 'CQ'],
      showAngles: ['BMQ', 'C']
    }
  },
  {
    id: 5,
    title: "第(3)问：勾股定理得出最终结论",
    icon: CheckCircle,
    desc: "在 Rt△PDQ 中利用勾股定理求解 CQ/BC。",
    detail: "设 CQ = x，由全等知 MQ = CQ = x。在 Rt△PDQ 中，PD = a(n-1)/n，DQ = a - x，斜边 PQ = PM + MQ = a/n + x。根据勾股定理：PD² + DQ² = PQ²，即 [a(n-1)/n]² + (a-x)² = (a/n + x)²。展开化简得：2ax(n+1)/n = 2a²(n-1)/n，解得 x = a(n-1)/(n+1)。即 CQ/BC = (n-1)/(n+1)。",
    tts: "既然全等，那么 MQ 就等于 CQ。我们设 CQ 的长度为 x，那么 MQ 也是 x。现在我们把目光转向右上角的直角三角形 PDQ。它的三条边都可以用 a 和 x 表示出来：PD 是 a 减去 n 分之 a，DQ 是 a 减去 x，斜边 PQ 是 n 分之 a 加上 x。利用勾股定理列出方程，经过化简，我们就能解出 x 的值。最终得出 CQ 比 BC 等于 n减1 比上 n加1。这道题就完美解决了！",
    geometryParams: {
      n: 2,
      highlightTriangles: ['PDQ'],
      showLines: ['PQ', 'MQ', 'CQ', 'PD', 'DQ'],
      showAngles: ['D']
    }
  }
];
