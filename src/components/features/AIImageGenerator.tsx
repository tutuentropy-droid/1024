import { useState, useCallback } from 'react';
import { Image, Heart, Loader2, Palette, X, Sparkles, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';
import { getPoemById, getDynastyByPoemId } from '@/data';
import type { AIImage } from '@/types';

interface AIImageGeneratorProps {
  poemId: string;
}

const styleOptions: { value: AIImage['style']; label: string; description: string }[] = [
  { value: 'ink', label: '水墨画', description: '中国传统水墨风格' },
  { value: 'watercolor', label: '水彩画', description: '梦幻水彩风格' },
  { value: 'oil', label: '油画', description: '古典油画风格' },
  { value: 'anime', label: '动漫', description: '现代动漫风格' },
  { value: 'realistic', label: '写实', description: '写实摄影风格' },
];

const AIImageGenerator = ({ poemId }: AIImageGeneratorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<AIImage['style']>('ink');
  const aiImages = useAppStore((state) => state.getAIImagesByPoemId(poemId));
  const currentGeneratingImage = useAppStore((state) => state.currentGeneratingImage);
  const generateAIImage = useAppStore((state) => state.generateAIImage);
  const toggleAIImageFavorite = useAppStore((state) => state.toggleAIImageFavorite);

  const poem = getPoemById(poemId);
  const dynasty = poem ? getDynastyByPoemId(poem.id) : null;

  const handleGenerate = useCallback(async () => {
    await generateAIImage(poemId, selectedStyle);
  }, [poemId, selectedStyle, generateAIImage]);

  const handleDownload = useCallback((image: AIImage) => {
    const link = document.createElement('a');
    link.href = image.imageUrl;
    link.download = `${poem?.title || 'poem'}-${image.style}.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [poem]);

  if (!poem || !dynasty) return null;

  return (
    <>
      <button
      onClick={() => setIsOpen(true)}
      className="btn-secondary inline-flex items-center gap-2 text-sm"
    >
      <Image className="w-4 h-4" />
      AI配图
    </button>

    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-ink-400/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        <div className="relative w-full max-w-4xl max-h-[85vh] bg-gradient-to-br from-paper-50 via-paper-100 to-paper-200 rounded-2xl shadow-card border border-paper-300 overflow-hidden animate-fade-in-up">
          <div className="sticky top-0 z-10 bg-gradient-to-r from-paper-100 to-paper-200 border-b border-paper-300 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: dynasty.color }}
              />
              <h2 className="title-display text-xl text-ink-400 flex items-center gap-2">
                AI意境配图
                <Sparkles className="w-4 h-4 text-gold-300" />
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg bg-paper-200 text-ink-200 hover:bg-paper-300 transition-all duration-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 pt-4 pb-2">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="title-display text-lg text-ink-400">
                《{poem.title}》
              </h3>
              <span
                className="stamp text-xs"
                style={{ transform: 'rotate(-2deg)' }}
              >
                {dynasty.name}
              </span>
            </div>
            <p className="text-sm text-ink-200 mb-2">
              {poem.author} · 「{poem.famousLine}」
            </p>
            <p className="text-xs text-ink-100 mb-4">
              选择风格，AI将为你生成与诗词意境和历史场景匹配的插画
            </p>
          </div>

          <div className="ink-divider mx-6" />

          <div className="px-6 py-4">
            <div className="mb-4">
              <h4 className="text-sm font-medium text-ink-300 mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                选择绘画风格
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
                {styleOptions.map((style) => (
                  <button
                  key={style.value}
                  onClick={() => setSelectedStyle(style.value)}
                  className={cn(
                    'p-3 rounded-xl border-2 transition-all duration-300 text-left',
                    selectedStyle === style.value
                      ? 'border-cobalt-300 bg-cobalt-50'
                      : 'border-paper-200 bg-paper-50 hover:border-paper-300'
                  )}
                >
                  <p className={cn(
                    'text-sm font-medium',
                    selectedStyle === style.value ? 'text-cobalt-300' : 'text-ink-300'
                  )}>
                    {style.label}
                  </p>
                  <p className="text-xs text-ink-100 mt-0.5">
                    {style.description}
                  </p>
                </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={currentGeneratingImage}
              className={cn(
                'w-full btn-primary py-3 flex items-center justify-center gap-2',
                currentGeneratingImage && 'opacity-70 cursor-not-allowed'
              )}
            >
              {currentGeneratingImage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  AI正在创作中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  生成意境配图
                </>
              )}
            </button>
          </div>

          {aiImages.length > 0 && (
            <div className="px-6 pb-6">
              <h4 className="text-sm font-medium text-ink-300 mb-3">
                已生成的图片 ({aiImages.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto scrollbar-hide">
                {[...aiImages].reverse().map((image) => (
                  <div
                    key={image.id}
                    className="relative group rounded-xl overflow-hidden border border-paper-200 bg-paper-50"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={image.imageUrl}
                        alt={`AI generated image for poem ${poem?.title || ''}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-400/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-paper-50 bg-100">
                          {styleOptions.find(s => s.value === image.style)?.label || image.style}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAIImageFavorite(image.id);
                            }}
                            className="p-1.5 rounded-lg bg-paper-50/20 text-paper-50 hover:bg-paper-50/30 transition-colors"
                          >
                            <Heart className={cn(
                              'w-4 h-4',
                              image.isFavorite && 'fill-current text-cinnabar-300'
                            )} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(image);
                            }}
                            className="p-1.5 rounded-lg bg-paper-50/20 text-paper-50 hover:bg-paper-50/30 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {aiImages.length === 0 && !currentGeneratingImage && (
            <div className="px-6 pb-8 text-center py-8">
              <Image className="w-12 h-12 text-ink-100 mx-auto mb-3" />
              <p className="text-ink-200">还没有生成的图片</p>
              <p className="text-xs text-ink-100 mt-1">
                点击上方按钮，让AI为你创作
              </p>
            </div>
          )}

          <div className="border-t border-paper-300 px-6 py-3 bg-paper-100 flex items-center justify-between">
            <p className="text-xs text-ink-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-300" />
              AI将根据诗词意境、历史背景和你选择的风格生成配图
            </p>
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default AIImageGenerator;
