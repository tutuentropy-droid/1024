import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { HomePage, TimelinePage, CardPage, QuizPage, ProgressPage, GroupPage, SocialPage } from '@/pages';
import CrossDynastyComparison from '@/components/features/CrossDynastyComparison';
import DailyChallenge from '@/components/features/DailyChallenge';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/card" element={<CardPage />} />
          <Route path="/card/:poemId" element={<CardPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/compare" element={<CrossDynastyComparison />} />
          <Route path="/challenge" element={<DailyChallenge />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/group" element={<GroupPage />} />
          <Route path="/social" element={<SocialPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  );
}
