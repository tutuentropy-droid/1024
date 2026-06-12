import DynastyTimeline from '@/components/features/DynastyTimeline';

const TimelinePage = () => {
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="title-display text-4xl text-ink-400 mb-4">
              历史时间轴
            </h1>
            <p className="text-ink-200 max-w-2xl mx-auto">
              沿着历史长河，探索每个朝代的诗词文化与历史事件。
              点击朝代节点，了解更多详细内容。
            </p>
          </div>
          
          <DynastyTimeline />
        </div>
      </div>
    </div>
  );
};

export default TimelinePage;
