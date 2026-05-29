import { Outlet } from 'react-router-dom';
import StudySidebar from './StudySidebar';
import StudyBottomNav from './StudyBottomNav';

export default function StudyLayout() {
  return (
    <div className="app-layout study-layout">
      <div className="aurora-bg study-aurora">
        <div className="aurora-blob blob-1"></div>
        <div className="aurora-blob blob-2"></div>
        <div className="aurora-blob blob-3"></div>
      </div>
      <StudySidebar />
      <main className="main-content animate-fade-in">
        <Outlet />
      </main>
      <StudyBottomNav />
    </div>
  );
}
