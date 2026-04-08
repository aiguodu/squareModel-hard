import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ttsService, TTSState } from '../services/ttsService';
import { Volume2, Loader2, Pause } from 'lucide-react';
import { cn } from '../lib/utils';

export const SubtitleOverlay: React.FC = () => {
  const [text, setText] = useState('');
  const [state, setState] = useState<TTSState>('idle');

  useEffect(() => {
    const unsubState = ttsService.onStateChange(setState);
    const unsubSubtitle = ttsService.onSubtitleUpdate(setText);
    return () => {
      unsubState();
      unsubSubtitle();
    };
  }, []);

  // 只要不是 idle 状态，或者有文字，就显示字幕框
  const isVisible = state !== 'idle' || text.length > 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[500px]"
        >
          <div className="bg-slate-900/70 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/10 flex gap-4 items-start">
            <div className="mt-1 shrink-0">
              {state === 'loading' && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
              {state === 'playing' && <Volume2 className="w-5 h-5 text-blue-400 animate-pulse" />}
              {state === 'paused' && <Pause className="w-5 h-5 text-slate-400" />}
              {state === 'idle' && <Volume2 className="w-5 h-5 text-slate-500" />}
            </div>
            <div className="flex-1 max-h-[100px] overflow-y-auto pr-2 custom-scrollbar">
              <p className="text-white/90 text-sm md:text-base leading-relaxed font-medium">
                {text || "..."}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
