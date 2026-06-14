import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { HomePage, TimelinePage, CardPage, QuizPage, ProgressPage, GroupPage, SocialPage, AudioTheaterPage, TimeMachinePage, PoetryMapPage, VoiceLearnPage, WrongBookPage, TimeCapsulePage, DailyPoemPage, CreationWorkshopPage, RaceModePage, AchievementPage } from '@/pages';
import CrossDynastyComparison from '@/components/features/CrossDynastyComparison';
import DailyChallenge from '@/components/features/DailyChallenge';
import StudyBuddy from '@/components/features/StudyBuddy';

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
          <Route path="/theater" element={<AudioTheaterPage />} />
          <Route path="/timemachine" element={<TimeMachinePage />} />
          <Route path="/poetrymap" element={<PoetryMapPage />} />
          <Route path="/voicelearn" element={<VoiceLearnPage />} />
          <Route path="/wrongbook" element={<WrongBookPage />} />
          <Route path="/timecapsule" element={<TimeCapsulePage />} />
          <Route path="/dailypoem" element={<DailyPoemPage />} />
          <Route path="/creation" element={<CreationWorkshopPage />} />
          <Route path="/race" element={<RaceModePage />} />
          <Route path="/achievements" element={<AchievementPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
      <StudyBuddy />
    </Router>
  );
}
