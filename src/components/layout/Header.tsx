import { Link, useLocation } from 'react-router-dom';
import { BookOpen, History, ScrollText, Home, Trophy, GitCompare, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/timeline', label: '时间轴', icon: History },
    { path: '/compare', label: '朝代对比', icon: GitCompare },
    { path: '/challenge', label: '每日挑战', icon: Zap },
    { path: '/progress', label: '仪表盘', icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-50 bg-paper-50/95 backdrop-blur-sm border-b border-paper-300 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-cinnabar-300 to-cinnabar-400 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <ScrollText className="w-6 h-6 text-paper-50" />
            </div>
            <div>
              <h1 className="title-display text-2xl text-ink-400 leading-none">诗史智学</h1>
              <p className="text-xs text-ink-100 mt-0.5">以诗证史 · 以史解诗</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300',
                    isActive
                      ? 'bg-cinnabar-50 text-cinnabar-300 font-medium'
                      : 'text-ink-200 hover:bg-paper-200 hover:text-ink-300'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <nav className="flex md:hidden items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'p-2 rounded-lg transition-all duration-300',
                    isActive
                      ? 'bg-cinnabar-50 text-cinnabar-300'
                      : 'text-ink-200 hover:bg-paper-200'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
