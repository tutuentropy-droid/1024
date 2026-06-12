import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { HomePage, TimelinePage, CardPage, QuizPage, ProgressPage } from '@/pages';

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
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  );
}
