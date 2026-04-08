// 模拟 TTS 服务，实际项目中可替换为调用后端接口

export type TTSState = 'idle' | 'loading' | 'playing' | 'paused';

type StateCallback = (state: TTSState) => void;
type SubtitleCallback = (text: string) => void;

class TTSService {
  private state: TTSState = 'idle';
  private stateListeners: Set<StateCallback> = new Set();
  private subtitleListeners: Set<SubtitleCallback> = new Set();
  
  private currentText: string = '';
  private timer: number | null = null;
  private currentIndex: number = 0;
  private sentences: string[] = [];

  public play(text: string) {
    this.stop();
    this.currentText = text;
    this.setState('loading');
    
    // 模拟网络请求延迟
    setTimeout(() => {
      this.setState('playing');
      // 简单的按标点符号分句模拟
      this.sentences = text.split(/(?<=[。！？，；])/).filter(s => s.trim().length > 0);
      this.currentIndex = 0;
      this.readNextSentence();
    }, 600);
  }

  public stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.setState('idle');
    this.emitSubtitle('');
  }

  private readNextSentence() {
    if (this.currentIndex >= this.sentences.length) {
      this.stop();
      return;
    }

    const sentence = this.sentences[this.currentIndex];
    // 累加显示之前的句子和当前句子
    const displaySubtitle = this.sentences.slice(0, this.currentIndex + 1).join('');
    this.emitSubtitle(displaySubtitle);
    
    // 模拟阅读时间：每个字大约 250ms
    const readTime = Math.max(1000, sentence.length * 250);
    
    this.timer = window.setTimeout(() => {
      this.currentIndex++;
      this.readNextSentence();
    }, readTime);
  }

  public onStateChange(callback: StateCallback) {
    this.stateListeners.add(callback);
    return () => this.stateListeners.delete(callback);
  }

  public onSubtitleUpdate(callback: SubtitleCallback) {
    this.subtitleListeners.add(callback);
    return () => this.subtitleListeners.delete(callback);
  }

  private setState(newState: TTSState) {
    this.state = newState;
    this.stateListeners.forEach(cb => cb(this.state));
  }

  private emitSubtitle(text: string) {
    this.subtitleListeners.forEach(cb => cb(text));
  }
}

export const ttsService = new TTSService();
