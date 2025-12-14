
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { CreateMenuPage } from './pages/CreateMenuPage';
import { RecipeDetailPage } from './pages/RecipeDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { HistoryPage } from './pages/HistoryPage';
import { GoogleAnalytics } from './components/analytics/GoogleAnalytics';
import { GoogleAds } from './components/analytics/GoogleAds';
import { BackToTop } from './components/ui/BackToTop';
import { UserSync } from './components/auth/UserSync';
import { CookieConsent } from './components/ui/CookieConsent';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <GoogleAnalytics />
            <GoogleAds />
            <UserSync />
            <BackToTop />
            <CookieConsent />
            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <>
                    <SignedIn>
                      <Layout>
                        <LandingPage />
                      </Layout>
                    </SignedIn>
                    <SignedOut>
                      <LandingPage />
                    </SignedOut>
                  </>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* Protected Routes */}
              <Route
                path="/create"
                element={
                  <>
                    <SignedIn>
                      <Layout>
                        <CreateMenuPage />
                      </Layout>
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />
              <Route
                path="/recipe/:slug"
                element={
                  <>
                    <SignedIn>
                      <Layout>
                        <RecipeDetailPage />
                      </Layout>
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />
              <Route
                path="/history"
                element={
                  <>
                    <SignedIn>
                      <Layout>
                        <HistoryPage />
                      </Layout>
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                  </>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <SignedIn>
                    <AdminLayout />
                  </SignedIn>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;

