import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-paper-100">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="py-6 border-t border-paper-300 bg-paper-50/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-ink-100 text-sm">
            诗史智学 · 以诗证史，以史解诗
          </p>
          <p className="text-ink-100/60 text-xs mt-1">
            读一首诗，懂一段史
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
