import { useState, useRef } from 'react';
import { BookOpen, Download, FileText, AlertCircle, Quote, CheckCircle, Clock, Target, Award, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store';
import { getDynastyById, getPoemById } from '@/data';
import { cn } from '@/lib/utils';

const AlmanacGenerator = () => {
  const { 
    dynasties, 
    almanacs, 
    userProgress,
    wrongQuestions,
    notes,
    poemQuotes,
    generateAlmanac, 
    markAlmanacDownloaded,
    addNote,
    addPoemQuote
  } = useAppStore();
  
  const [selectedDynastyId, setSelectedDynastyId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [newQuotePoemId, setNewQuotePoemId] = useState('');
  const [newQuoteLine, setNewQuoteLine] = useState('');
  const [newQuoteNote, setNewQuoteNote] = useState('');
  const almanacRef = useRef<HTMLDivElement>(null);

  const completedDynasties = userProgress.completedDynasties.map(id => 
    dynasties.find(d => d.id === id)
  ).filter(Boolean);

  const selectedAlmanac = almanacs.find(a => a.dynastyId === selectedDynastyId);
  const selectedDynasty = selectedDynastyId ? getDynastyById(selectedDynastyId) : null;

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedDynastyId) return;
    addNote({
      content: newNote.trim(),
      dynastyId: selectedDynastyId,
    });
    setNewNote('');
  };

  const handleAddQuote = () => {
    if (!newQuotePoemId || !newQuoteLine.trim() || !selectedDynastyId) return;
    const poem = getPoemById(newQuotePoemId);
    if (!poem) return;
    
    addPoemQuote({
      poemId: newQuotePoemId,
      line: newQuoteLine.trim(),
      author: poem.author,
      dynastyId: selectedDynastyId,
      note: newQuoteNote.trim() || undefined,
    });
    setNewQuotePoemId('');
    setNewQuoteLine('');
    setNewQuoteNote('');
  };

  const handleGenerateAlmanac = () => {
    if (!selectedDynastyId) return;
    generateAlmanac(selectedDynastyId);
  };

  const handleDownloadPDF = async (almanacId: string) => {
    const almanac = almanacs.find(a => a.id === almanacId);
    if (!almanac) return;

    try {
      let pdfContent = '';
      pdfContent += '%PDF-1.4\n';
      pdfContent += '1 0 obj\n';
      pdfContent += '<< /Type /Catalog /Pages 2 0 R >>\n';
      pdfContent += 'endobj\n';
      pdfContent += '2 0 obj\n';
      pdfContent += '<< /Type /Pages /Kids [3 0 R] /Count 1 >>\n';
      pdfContent += 'endobj\n';
      
      let contentStream = 'BT\n';
      contentStream += '/F1 24 Tf\n';
      contentStream += '50 800 Td\n';
      contentStream += `(${almanac.dynastyName}学习年鉴) Tj\n`;
      contentStream += '0 -30 Td\n';
      contentStream += '/F1 12 Tf\n';
      contentStream += `(${almanac.period}) Tj\n`;
      contentStream += '0 -50 Td\n';
      
      contentStream += '/F1 16 Tf\n';
      contentStream += '(学习统计) Tj\n';
      contentStream += '0 -25 Td\n';
      contentStream += '/F1 12 Tf\n';
      contentStream += `(已学诗词: ${almanac.stats.poemsStudied}首) Tj\n`;
      contentStream += '0 -20 Td\n';
      contentStream += `(测试次数: ${almanac.stats.quizzesTaken}次) Tj\n`;
      contentStream += '0 -20 Td\n';
      contentStream += `(平均正确率: ${almanac.stats.averageAccuracy.toFixed(1)}%) Tj\n`;
      contentStream += '0 -20 Td\n';
      contentStream += `(学习时长: ${Math.floor(almanac.stats.studyTime / 60)}分${almanac.stats.studyTime % 60}秒) Tj\n`;
      contentStream += '0 -40 Td\n';
      
      if (almanac.notes.length > 0) {
        contentStream += '/F1 16 Tf\n';
        contentStream += '(我的笔记) Tj\n';
        contentStream += '0 -25 Td\n';
        contentStream += '/F1 12 Tf\n';
        almanac.notes.forEach((note, i) => {
          const safeContent = note.content.replace(/[()]/g, '');
          contentStream += `${i + 1}. ${safeContent} Tj\n`;
          contentStream += '0 -20 Td\n';
        });
        contentStream += '0 -20 Td\n';
      }
      
      if (almanac.wrongQuestions.length > 0) {
        contentStream += '/F1 16 Tf\n';
        contentStream += '(错题回顾) Tj\n';
        contentStream += '0 -25 Td\n';
        contentStream += '/F1 12 Tf\n';
        almanac.wrongQuestions.forEach((q, i) => {
          const safeQ = q.question.replace(/[()]/g, '');
          const safeA = q.correctAnswer.replace(/[()]/g, '');
          contentStream += `${i + 1}. ${safeQ} Tj\n`;
          contentStream += '0 -15 Td\n';
          contentStream += `(正确答案: ${safeA}) Tj\n`;
          contentStream += '0 -20 Td\n';
        });
        contentStream += '0 -20 Td\n';
      }
      
      if (almanac.poemQuotes.length > 0) {
        contentStream += '/F1 16 Tf\n';
        contentStream += '(诗词摘抄) Tj\n';
        contentStream += '0 -25 Td\n';
        contentStream += '/F1 12 Tf\n';
        almanac.poemQuotes.forEach((quote, i) => {
          const safeLine = quote.line.replace(/[()]/g, '');
          const safeAuthor = quote.author.replace(/[()]/g, '');
          contentStream += `${i + 1}. "${safeLine}" - ${safeAuthor} Tj\n`;
          contentStream += '0 -20 Td\n';
        });
      }
      
      contentStream += 'ET\n';
      
      const contentStreamLength = contentStream.length;
      
      pdfContent += `3 0 obj\n`;
      pdfContent += '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\n';
      pdfContent += 'endobj\n';
      pdfContent += `4 0 obj\n`;
      pdfContent += `<< /Length ${contentStreamLength} >>\n`;
      pdfContent += 'stream\n';
      pdfContent += contentStream;
      pdfContent += 'endstream\n';
      pdfContent += 'endobj\n';
      pdfContent += '5 0 obj\n';
      pdfContent += '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\n';
      pdfContent += 'endobj\n';
      
      const xrefPos = pdfContent.length;
      pdfContent += 'xref\n';
      pdfContent += '0 6\n';
      pdfContent += '0000000000 65535 f \n';
      pdfContent += '0000000009 00000 n \n';
      pdfContent += '0000000058 00000 n \n';
      pdfContent += '0000000115 00000 n \n';
      pdfContent += `0000000${210 + contentStreamLength.toString().length} 00000 n \n`;
      pdfContent += `0000000${260 + contentStreamLength + contentStream.length.toString().length} 00000 n \n`;
      pdfContent += 'trailer\n';
      pdfContent += '<< /Size 6 /Root 1 0 R >>\n';
      pdfContent += 'startxref\n';
      pdfContent += `${xrefPos}\n`;
      pdfContent += '%%EOF\n';

      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${almanac.dynastyName}学习年鉴-${new Date(almanac.generatedAt).toLocaleDateString('zh-CN')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      markAlmanacDownloaded(almanacId);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('PDF生成失败，请重试');
    }
  };

  const dynastyWrongQuestions = selectedDynastyId 
    ? wrongQuestions.filter(q => q.dynastyId === selectedDynastyId)
    : [];

  const dynastyNotes = selectedDynastyId
    ? notes.filter(n => n.dynastyId === selectedDynastyId)
    : [];

  const dynastyPoems = selectedDynastyId
    ? getPoemById(selectedDynastyId) ? [getPoemById(selectedDynastyId)!] : []
    : [];

  const dynastyPoemIds = selectedDynastyId
    ? dynasties.find(d => d.id === selectedDynastyId)?.poemIds || []
    : [];

  const dynastyPoemQuotes = poemQuotes.filter(q => dynastyPoemIds.includes(q.poemId));

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-jade-50 text-jade-600 rounded-full text-sm mb-4">
              <BookOpen className="w-4 h-4" />
              学习年鉴
            </div>
            <h1 className="title-display text-4xl text-ink-400 mb-3">
              诗史年鉴 · 学习典藏
            </h1>
            <p className="text-ink-200 max-w-xl mx-auto">
              记录学习历程，整理笔记错题，珍藏诗词佳句，生成可下载的PDF年鉴
            </p>
          </div>

          {completedDynasties.length === 0 ? (
            <div className="card text-center py-16 animate-fade-in-up">
              <div className="w-20 h-20 mx-auto mb-6 bg-paper-200 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-ink-100" />
              </div>
              <h3 className="title-display text-xl text-ink-300 mb-2">
                还没有完成的朝代
              </h3>
              <p className="text-ink-100 mb-6 max-w-sm mx-auto">
                完成一个朝代的学习后，即可生成专属的学习年鉴
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="card sticky top-24">
                  <h3 className="title-display text-lg text-ink-400 mb-4">
                    选择朝代
                  </h3>
                  <div className="space-y-2">
                    {completedDynasties.map((dynasty, index) => {
                      if (!dynasty) return null;
                      const hasAlmanac = almanacs.some(a => a.dynastyId === dynasty.id);
                      return (
                        <button
                          key={dynasty.id}
                          onClick={() => setSelectedDynastyId(dynasty.id)}
                          className={cn(
                            'w-full p-4 rounded-xl text-left transition-all duration-300',
                            selectedDynastyId === dynasty.id
                              ? 'bg-gradient-to-r from-jade-50 to-jade-100 border-2 border-jade-300'
                              : 'bg-paper-50 border border-paper-200 hover:border-jade-200'
                          )}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                              style={{ backgroundColor: dynasty.color + '20', color: dynasty.color }}
                            >
                              {dynasty.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-ink-300">{dynasty.name}</p>
                              <p className="text-xs text-ink-100">
                                {dynasty.poemIds.length} 首诗词
                              </p>
                            </div>
                            {hasAlmanac && (
                              <CheckCircle className="w-5 h-5 text-jade-400" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                {selectedDynastyId && selectedDynasty ? (
                  <div className="space-y-6">
                    <div className="card animate-fade-in-up">
                      <h3 className="title-display text-lg text-ink-400 mb-4 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-cinnabar-300" />
                        {selectedDynasty.name} - 年鉴内容预览
                      </h3>

                      <div 
                        ref={almanacRef}
                        className="bg-white rounded-xl border border-paper-200 p-6 mb-6"
                      >
                        <div className="border-b-2 border-jade-200 pb-4 mb-6">
                          <h2 className="title-display text-3xl text-ink-400 mb-2">
                            {selectedDynasty.name}学习年鉴
                          </h2>
                          <p className="text-ink-200">
                            {selectedDynasty.startYear > 0 ? '公元' : '公元前'}
                            {Math.abs(selectedDynasty.startYear)}年 - 
                            {selectedDynasty.endYear > 0 ? '公元' : '公元前'}
                            {Math.abs(selectedDynasty.endYear)}年
                          </p>
                          <p className="text-xs text-ink-100 mt-2">
                            生成时间: {new Date().toLocaleDateString('zh-CN')}
                          </p>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-medium text-ink-400 mb-3 flex items-center gap-2">
                            <Target className="w-4 h-4 text-jade-500" />
                            学习统计
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-jade-50 rounded-lg">
                              <p className="text-2xl font-bold text-ink-400">
                                {dynastyPoemIds.filter(id => userProgress.poemProgress[id]?.isStudied).length}
                              </p>
                              <p className="text-xs text-ink-100">已学诗词</p>
                            </div>
                            <div className="p-3 bg-amber-50 rounded-lg">
                              <p className="text-2xl font-bold text-ink-400">
                                {userProgress.quizResults.filter(r => 
                                  r.questionDetails.some(d => dynastyPoemIds.includes(d.poemId))
                                ).length}
                              </p>
                              <p className="text-xs text-ink-100">测试次数</p>
                            </div>
                            <div className="p-3 bg-rose-50 rounded-lg">
                              <p className="text-2xl font-bold text-ink-400">
                                {dynastyWrongQuestions.length}
                              </p>
                              <p className="text-xs text-ink-100">错题数量</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                              <p className="text-2xl font-bold text-ink-400">
                                {dynastyNotes.length}
                              </p>
                              <p className="text-xs text-ink-100">笔记数量</p>
                            </div>
                          </div>
                        </div>

                        {dynastyNotes.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-medium text-ink-400 mb-3 flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-cinnabar-500" />
                              我的笔记
                            </h4>
                            <div className="space-y-2">
                              {dynastyNotes.map((note, i) => (
                                <div key={note.id} className="p-3 bg-paper-50 rounded-lg">
                                  <p className="text-sm text-ink-300">{i + 1}. {note.content}</p>
                                  <p className="text-xs text-ink-100 mt-1">
                                    {new Date(note.createdAt).toLocaleDateString('zh-CN')}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {dynastyWrongQuestions.length > 0 && (
                          <div className="mb-6">
                            <h4 className="font-medium text-ink-400 mb-3 flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-rose-500" />
                              错题回顾
                            </h4>
                            <div className="space-y-2">
                              {dynastyWrongQuestions.map((q, i) => (
                                <div key={q.id} className="p-3 bg-rose-50 rounded-lg">
                                  <p className="text-sm text-ink-300 font-medium">{i + 1}. {q.question}</p>
                                  <p className="text-xs text-rose-600 mt-1">
                                    你的答案: {q.userAnswer}
                                  </p>
                                  <p className="text-xs text-jade-600">
                                    正确答案: {q.correctAnswer}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {dynastyPoemQuotes.length > 0 && (
                          <div>
                            <h4 className="font-medium text-ink-400 mb-3 flex items-center gap-2">
                              <Quote className="w-4 h-4 text-purple-500" />
                              诗词摘抄
                            </h4>
                            <div className="space-y-2">
                              {dynastyPoemQuotes.map((quote, i) => (
                                <div key={quote.id} className="p-3 bg-purple-50 rounded-lg">
                                  <p className="text-sm text-ink-300 italic">
                                    「{quote.line}」
                                  </p>
                                  <p className="text-xs text-ink-200 mt-1">—— {quote.author}</p>
                                  {quote.note && (
                                    <p className="text-xs text-ink-100 mt-1">笔记: {quote.note}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="card">
                          <h4 className="font-medium text-ink-400 mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            添加笔记
                          </h4>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                              placeholder="记录你的学习心得..."
                              className="flex-1 px-3 py-2 rounded-lg bg-paper-100 border border-paper-200 text-sm text-ink-300 focus:outline-none focus:border-jade-300"
                              onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                            />
                            <button
                              onClick={handleAddNote}
                              disabled={!newNote.trim()}
                              className="px-4 py-2 bg-jade-400 text-white rounded-lg hover:bg-jade-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                              添加
                            </button>
                          </div>
                        </div>

                        <div className="card">
                          <h4 className="font-medium text-ink-400 mb-3 flex items-center gap-2">
                            <Quote className="w-4 h-4 text-purple-500" />
                            添加诗词摘抄
                          </h4>
                          <div className="space-y-3">
                            <select
                              value={newQuotePoemId}
                              onChange={(e) => setNewQuotePoemId(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-paper-100 border border-paper-200 text-sm text-ink-300 focus:outline-none focus:border-purple-300"
                            >
                              <option value="">选择诗词</option>
                              {dynastyPoemIds.map(poemId => {
                                const poem = getPoemById(poemId);
                                if (!poem) return null;
                                return (
                                  <option key={poemId} value={poemId}>
                                    《{poem.title}》- {poem.author}
                                  </option>
                                );
                              })}
                            </select>
                            <input
                              type="text"
                              value={newQuoteLine}
                              onChange={(e) => setNewQuoteLine(e.target.value)}
                              placeholder="输入要摘抄的诗句..."
                              className="w-full px-3 py-2 rounded-lg bg-paper-100 border border-paper-200 text-sm text-ink-300 focus:outline-none focus:border-purple-300"
                            />
                            <input
                              type="text"
                              value={newQuoteNote}
                              onChange={(e) => setNewQuoteNote(e.target.value)}
                              placeholder="添加感悟笔记（可选）..."
                              className="w-full px-3 py-2 rounded-lg bg-paper-100 border border-paper-200 text-sm text-ink-300 focus:outline-none focus:border-purple-300"
                            />
                            <button
                              onClick={handleAddQuote}
                              disabled={!newQuotePoemId || !newQuoteLine.trim()}
                              className="w-full px-4 py-2 bg-purple-400 text-white rounded-lg hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                              添加摘抄
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={handleGenerateAlmanac}
                          className="flex-1 btn-primary inline-flex items-center justify-center gap-2"
                        >
                          <Sparkles className="w-4 h-4" />
                          {selectedAlmanac ? '重新生成年鉴' : '生成学习年鉴'}
                        </button>
                        {selectedAlmanac && (
                          <button
                            onClick={() => handleDownloadPDF(selectedAlmanac.id)}
                            className="flex-1 px-4 py-2 bg-jade-500 text-white rounded-lg hover:bg-jade-600 transition-colors inline-flex items-center justify-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            下载PDF
                          </button>
                        )}
                      </div>
                    </div>

                    {almanacs.filter(a => a.dynastyId === selectedDynastyId).length > 0 && (
                      <div className="card animate-fade-in-up">
                        <h3 className="title-display text-lg text-ink-400 mb-4 flex items-center gap-2">
                          <Award className="w-5 h-5 text-gold-400" />
                          历史生成记录
                        </h3>
                        <div className="space-y-3">
                          {almanacs
                            .filter(a => a.dynastyId === selectedDynastyId)
                            .sort((a, b) => b.generatedAt - a.generatedAt)
                            .map((almanac, index) => (
                              <div 
                                key={almanac.id}
                                className="flex items-center justify-between p-4 rounded-lg bg-paper-50 border border-paper-200"
                                style={{ animationDelay: `${index * 50}ms` }}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-jade-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-jade-500" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-ink-300">
                                      {almanac.dynastyName}年鉴
                                    </p>
                                    <p className="text-xs text-ink-100 flex items-center gap-2">
                                      <Clock className="w-3 h-3" />
                                      {new Date(almanac.generatedAt).toLocaleString('zh-CN')}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {almanac.isDownloaded && (
                                    <span className="text-xs text-jade-500 flex items-center gap-1">
                                      <CheckCircle className="w-3 h-3" />
                                      已下载
                                    </span>
                                  )}
                                  <button
                                    onClick={() => handleDownloadPDF(almanac.id)}
                                    className="p-2 text-ink-200 hover:text-jade-500 transition-colors"
                                  >
                                    <Download className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="card text-center py-16">
                    <div className="w-20 h-20 mx-auto mb-6 bg-paper-200 rounded-full flex items-center justify-center">
                      <Target className="w-10 h-10 text-ink-100" />
                    </div>
                    <h3 className="title-display text-xl text-ink-300 mb-2">
                      选择一个朝代
                    </h3>
                    <p className="text-ink-100">
                      从左侧选择已完成的朝代，生成你的专属学习年鉴
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlmanacGenerator;
