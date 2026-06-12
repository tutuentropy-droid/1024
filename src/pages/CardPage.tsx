import FlipCard from '@/components/features/FlipCard';

const CardPage = () => {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="title-display text-3xl text-ink-400 mb-2">
            诗词学习
          </h1>
          <p className="text-ink-200">
            点击卡片翻转，了解诗词背后的历史故事
          </p>
        </div>
        
        <FlipCard />
      </div>
    </div>
  );
};

export default CardPage;
