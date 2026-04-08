import React, { useState, useEffect } from 'react';
import { GeometrySVG } from './components/GeometrySVG';
import { StepPanel } from './components/StepPanel';
import { SubtitleOverlay } from './components/SubtitleOverlay';
import { steps } from './data/steps';
import { ttsService } from './services/ttsService';
import { ChevronLeft, ChevronRight, RotateCcw, PlayCircle } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);

  // 当步骤改变时，自动播放 TTS
  useEffect(() => {
    ttsService.play(steps[currentStep].tts);
    return () => ttsService.stop();
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
  };

  const handleReplayTTS = () => {
    ttsService.play(steps[currentStep].tts);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200">
        
        {/* Header */}
        <header className="h-16 border-b border-slate-100 px-6 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full tracking-wider">
              几何动点
            </span>
            <h1 className="text-lg font-semibold text-slate-800">
              正方形折叠综合探究
            </h1>
          </div>
          <div className="text-sm text-slate-400 font-medium">
            Step {currentStep + 1} of {steps.length}
          </div>
        </header>

        {/* Main Content Area - Fixed Height 570px */}
        <main className="h-[570px] flex flex-col md:flex-row w-full relative">
          
          {/* Left: Geometry SVG Area (55%) */}
          <section className="w-full md:w-[55%] h-full bg-white relative overflow-hidden">
            <GeometrySVG stepData={steps[currentStep]} />
            <SubtitleOverlay />
          </section>

          {/* Right: Logic/Explanation Area (45%) */}
          <section className="w-full md:w-[45%] h-full bg-slate-50 p-4 md:p-6 border-l border-slate-100">
            <StepPanel stepData={steps[currentStep]} />
          </section>

        </main>

        {/* Footer Controls */}
        <footer className="h-20 border-t border-slate-100 bg-white px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors font-medium text-sm"
            >
              <RotateCcw size={18} />
              重新开始
            </button>
            <button
              onClick={handleReplayTTS}
              className="flex items-center gap-2 px-4 py-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors font-medium text-sm"
              title="重播讲解"
            >
              <PlayCircle size={18} />
              重播讲解
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all",
                currentStep === 0 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
              )}
            >
              <ChevronLeft size={18} />
              上一步
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm",
                currentStep === steps.length - 1
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95"
              )}
            >
              下一步
              <ChevronRight size={18} />
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
}
