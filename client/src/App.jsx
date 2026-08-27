import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense } from 'react';

// Lazy load pages for performance
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const WhatWeDo = lazy(() => import('./pages/WhatWeDo'));
const Events = lazy(() => import('./pages/Events'));
const Stories = lazy(() => import('./pages/Stories'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Volunteer = lazy(() => import('./pages/Volunteer'));
const Contact = lazy(() => import('./pages/Contact'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Refunds = lazy(() => import('./pages/Refunds'));

// Lazy load admin pages
const AdminLogin = lazy(() => import('./pages/Admin/AdminLogin'));
const AdminSignup = lazy(() => import('./pages/Admin/AdminSignup'));

const AdminLayout = lazy(() => import('./pages/Admin/AdminLayout'));
const AdminOverview = lazy(() => import('./pages/Admin/Overview'));
const AdminEvents = lazy(() => import('./pages/Admin/Events'));
const AdminRewardedChildren = lazy(() => import('./pages/Admin/RewardedChildren'));
const AdminDonations = lazy(() => import('./pages/Admin/Donations'));
const AdminVolunteers = lazy(() => import('./pages/Admin/Volunteers'));
const AdminGallery = lazy(() => import('./pages/Admin/AdminGallery'));
const AdminMessages = lazy(() => import('./pages/Admin/Messages'));
const AdminSettings = lazy(() => import('./pages/Admin/Settings'));

import DonationModal from './components/DonationModal';

const LoadingFallback = () => (
  <div className="flex-center" style={{ height: '100vh', width: '100vw' }}>
    <div style={{ border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
  </div>
);

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/what-we-do" element={<WhatWeDo />} />
          <Route path="/events" element={<Events />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refunds" element={<Refunds />} />
          
          {/* Admin Public Routes */}
          <Route path="/admin/login" element={
            <Suspense fallback={<div className="flex-center" style={{ height: '100vh' }}><div className="loader"></div></div>}>
              <AdminLogin />
            </Suspense>
          } />
          <Route path="/admin/signup" element={
            <Suspense fallback={<div className="flex-center" style={{ height: '100vh' }}><div className="loader"></div></div>}>
              <AdminSignup />
            </Suspense>
          } />

          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="rewarded-children" element={<AdminRewardedChildren />} />
            <Route path="donations" element={<AdminDonations />} />
            <Route path="volunteers" element={<AdminVolunteers />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Suspense>
      <DonationModal />
    </Router>
  );
}

export default App;
