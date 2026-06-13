import { useRef, useMemo } from 'react';
import { Download, Share2, X, Image, Printer, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';

const KnowledgePoster = () => {
  const { 
    posters, 
    currentPosterId, 
    selectPoster,
    dynasties,
    generatePoster
  } = useAppStore();
  const posterRef = useRef<HTMLDivElement>(null);

  const currentPoster = useMemo(() => 
    posters.find(p => p.id === currentPosterId),
    [posters, currentPosterId]
  );

  const handleDownload = async () => {
    if (!posterRef.current || !currentPoster) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const posterEl = posterRef.current;
      const rect = posterEl.getBoundingClientRect();
      const scale = 2;
      
      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;
      ctx.scale(scale, scale);

      ctx.fillStyle = currentPoster.backgroundColor;
      ctx.fillRect(0, 0, rect.width, rect.height);

      const exportPoster = async () => {
        let y = 40;
        const padding = 40;
        const contentWidth = rect.width - padding * 2;

        ctx.fillStyle = currentPoster.accentColor;
        ctx.fillRect(padding, y, 4, 60);
        
        ctx.fillStyle = currentPoster.textColor;
        ctx.font = 'bold 28px serif';
        ctx.fillText(currentPoster.title, padding + 16, y + 25);
        
        ctx.font = '14px serif';
        ctx.globalAlpha = 0.7;
        ctx.fillText(currentPoster.subtitle, padding + 16, y + 50);
        ctx.globalAlpha = 1;
        
        y += 90;

        for (const section of currentPoster.sections) {
          ctx.fillStyle = currentPoster.accentColor;
          ctx.font = 'bold 16px serif';
          ctx.fillText(section.title, padding, y);
          
          y += 28;
          
          ctx.fillStyle = currentPoster.textColor;
          ctx.font = '13px serif';
          ctx.globalAlpha = 0.85;
          
          const lines = section.content.split('\n');
          for (const line of lines) {
            const words = line.split('');
            let currentLine = '';
            
            for (const char of words) {
              const testLine = currentLine + char;
              const metrics = ctx.measureText(testLine);
              
              if (metrics.width > contentWidth && currentLine) {
                ctx.fillText(currentLine, padding, y);
                y += 22;
                currentLine = char;
              } else {
                currentLine = testLine;
              }
            }
            
            if (currentLine) {
              ctx.fillText(currentLine, padding, y);
              y += 22;
            }
          }
          
          ctx.globalAlpha = 1;
          y += 16;
          
          if (y > rect.height - 60) break;
        }

        ctx.fillStyle = currentPoster.accentColor;
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        ctx.arc(rect.width - 60, rect.height - 60, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.fillStyle = currentPoster.textColor;
        ctx.globalAlpha = 0.5;
        ctx.font = '11px serif';
        ctx.textAlign = 'center';
        ctx.fillText('诗史智学 · 以诗证史 · 以史解诗', rect.width / 2, rect.height - 30);
        ctx.textAlign = 'left';
        ctx.globalAlpha = 1;

        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${currentPoster.title}-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      };

      await exportPoster();
    } catch (error) {
      console.error('Failed to download poster:', error);
      alert('海报下载失败，请重试');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!currentPoster) {
    const latestPoster = posters[posters.length - 1];
    
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-sm mb-4">
                <Image className="w-4 h-4" />
                知识海报
              </div>
              <h1 className="title-display text-4xl text-ink-400 mb-3">
                诗史画卷 · 知识典藏
              </h1>
              <p className="text-ink-200 max-w-xl mx-auto">
                完成朝代拼图后，自动生成精美的知识海报，可下载保存
              </p>
            </div>

            {posters.length > 0 && (
              <div className="mb-8 animate-fade-in-up">
                <h3 className="title-display text-lg text-ink-400 mb-4">
                  已生成的海报
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {posters.map((poster, index) => {
                    const dynasty = dynasties.find(d => d.id === poster.dynastyId);
                    return (
                      <div
                        key={poster.id}
                        onClick={() => selectPoster(poster.id)}
                        className="card cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div 
                          className="h-32 rounded-lg mb-3 flex items-center justify-center"
                          style={{ backgroundColor: poster.backgroundColor }}
                        >
                          <span 
                            className="title-display text-2xl"
                            style={{ color: poster.textColor }}
                          >
                            {poster.title}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: dynasty?.color }}
                          />
                          <span className="text-xs text-ink-100">
                            {new Date(poster.createdAt).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="card animate-fade-in-up">
              <h3 className="title-display text-lg text-ink-400 mb-4">
                选择朝代生成海报
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {dynasties.map(dynasty => (
                  <button
                    key={dynasty.id}
                    onClick={() => generatePoster(dynasty.id)}
                    className="p-4 rounded-xl bg-paper-50 border border-paper-200 hover:border-purple-300 transition-all duration-300 text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                        style={{ backgroundColor: dynasty.color + '20', color: dynasty.color }}
                      >
                        {dynasty.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-ink-300">{dynasty.name}</p>
                        <p className="text-xs text-ink-100">
                          {dynasty.poemIds.length} 首诗词
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-sm text-purple-600">
                      <Sparkles className="w-4 h-4" />
                      生成海报
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const dynasty = dynasties.find(d => d.id === currentPoster.dynastyId);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => selectPoster(null)}
              className="inline-flex items-center gap-2 text-ink-200 hover:text-ink-300 transition-colors"
            >
              <X className="w-5 h-5" />
              返回
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2 bg-paper-100 text-ink-300 rounded-lg hover:bg-paper-200 transition-colors"
              >
                <Printer className="w-4 h-4" />
                打印
              </button>
              <button
                onClick={handleDownload}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                下载海报
              </button>
            </div>
          </div>

          <div 
            ref={posterRef}
            className="card p-8 mb-6"
            style={{ 
              backgroundColor: currentPoster.backgroundColor,
              color: currentPoster.textColor,
            }}
          >
            <div className="border-l-4 pl-4 mb-8" style={{ borderColor: currentPoster.accentColor }}>
              <h2 className="title-display text-3xl mb-2">
                {currentPoster.title}
              </h2>
              <p className="text-sm opacity-75">
                {currentPoster.subtitle}
              </p>
            </div>

            <div className="space-y-6">
              {currentPoster.sections.map((section, index) => (
                <div 
                  key={section.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <h3 
                    className="text-lg font-medium mb-3"
                    style={{ color: currentPoster.accentColor }}
                  >
                    {section.title}
                  </h3>
                  <div className="text-sm leading-relaxed whitespace-pre-line opacity-90">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            <div 
              className="mt-8 pt-6 border-t text-center text-xs opacity-50"
              style={{ borderColor: currentPoster.accentColor + '30' }}
            >
              诗史智学 · 以诗证史 · 以史解诗
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleDownload}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              下载海报图片
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-paper-100 text-ink-300 rounded-lg hover:bg-paper-200 transition-colors inline-flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              分享
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgePoster;
