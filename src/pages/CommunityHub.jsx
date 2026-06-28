import React from 'react';
import { CommunityProvider } from '../communityhub/context/CommunityContext';
import CommunityHubLayout from '../communityhub/components/CommunityHubLayout';
import { Routes, Route } from 'react-router-dom';
import Feed from '../communityhub/pages/Feed';
import Communities from '../communityhub/pages/Communities';
import CommunityDetail from '../communityhub/pages/CommunityDetail';
import CommunityChat from '../communityhub/pages/CommunityChat';
import News from '../communityhub/pages/News';
import Notifications from '../communityhub/pages/Notifications';
import DirectMessages from '../communityhub/pages/DirectMessages';
import UserDashboard from '../communityhub/pages/UserDashboard';

export default function CommunityHub() {
  return (
    <CommunityProvider>
      <CommunityHubLayout>
        <Routes>
          <Route index element={<Feed />} />
          <Route path="communities" element={<Communities />} />
          <Route path="community/:id" element={<CommunityDetail />} />
          <Route path="community/:id/chat" element={<CommunityChat />} />
          <Route path="news" element={<News />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="messages" element={<DirectMessages />} />
          <Route path="dashboard" element={<UserDashboard />} />
        </Routes>
      </CommunityHubLayout>
    </CommunityProvider>
  );
}
