import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StepData } from '../data/steps';
import { cn } from '../lib/utils';

interface StepPanelProps {
  stepData: StepData;
}

export const StepPanel: React.FC<StepPanelProps> = ({ stepData }) => {
  const Icon = stepData.icon;

  return (
    <div className="w-full h-full bg-slate-50 rounded-2xl p-6 md:p-8 flex flex-col shadow-inner border border-slate-100 overflow-y-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={stepData.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6"
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Icon size={24} />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">
              {stepData.title}
            </h2>
          </div>

          {/* Description */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
            <p className="text-slate-700 font-medium leading-relaxed">
              {stepData.desc}
            </p>
          </div>

          {/* Detail Proof */}
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
              推导过程
            </h3>
            <div className="text-slate-600 leading-loose text-sm md:text-base">
              {/* 简单的文本渲染，实际项目中可以使用 markdown 或 LaTeX 渲染器 */}
              {stepData.detail.split('。').filter(Boolean).map((sentence, idx) => (
                <p key={idx} className="mb-2 pl-3 border-l-2 border-blue-200">
                  {sentence}。
                </p>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
