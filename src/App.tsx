import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserProvider } from './context/UserContext';
import { Dashboard } from './pages/Dashboard';
import { Messages } from './pages/Messages';
import { Profile } from './pages/Profile';
import SellerSetting from './pages/SellerSetting';
import AuthLayout from './_auth/AuthLayout';
import SigninForm from './_auth/forms/SigninForm';
import SignupForm from './_auth/forms/SignupForm';
import './index.css';
import BuyerSetting from './pages/BuyerSetting';
import BuyerProfile from './pages/BuyerProfile';

// Protected route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to='/sign-in'
        replace
      />
    );
  }

  return <>{children}</>;
};

// Seller route wrapper component
const SellerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        Loading...
      </div>
    );
  }
  
  return user && user.is_seller ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

// Buyer route wrapper component
const BuyerRoute = ({ children, redirectPath }: { children: React.ReactNode, redirectPath?: string }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        Loading...
      </div>
    );
  }
  
  // Redirect to sign-in if not authenticated
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }
  
  // Redirect sellers to appropriate pages
  if (user.is_seller) {
    console.log('Seller trying to access buyer page, redirecting to:', redirectPath);
    // Use custom redirect path if provided, otherwise default to dashboard
    return <Navigate to={redirectPath || "/dashboard"} replace />;
  }
  
  // Allow access only to buyers
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <UserProvider>
          <Routes>
            {/* Public routes */}
            <Route
              path='/'
              element={
                <Navigate
                  to='/dashboard'
                  replace
                />
              }
            />
            
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/sign-in" element={<SigninForm />} />
              <Route path="/sign-up" element={<SignupForm />} />
            </Route>
            
            <Route
              path='/forgot-password'
              element={
                <div className='flex items-center justify-center h-screen bg-slate-950 text-white p-6'>
                  <div className='max-w-md w-full p-6 bg-slate-900 rounded-lg border border-slate-800'>
                    <h1 className='text-2xl font-bold mb-4'>Reset Password</h1>
                    <p className='text-slate-400 mb-6'>
                      This feature is coming soon. Please check back later.
                    </p>
                    <Link
                      to='/sign-in'
                      className='text-violet-400 hover:text-violet-300'>
                      Return to login
                    </Link>
                  </div>
                </div>
              }
            />

            {/* Protected routes */}
            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path='/messages'
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/:id'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            
            {/* Seller routes */}
            <Route
              path='/SellerSetting'
              element={
                <SellerRoute>
                  <SellerSetting />
                </SellerRoute>
              }
            />

            {/* Buyer routes */}
            <Route
              path='/BuyerSetting'
              element={
                <BuyerRoute redirectPath="/SellerSetting">
                  <BuyerSetting />
                </BuyerRoute>
              }
            />
            <Route
              path='/BuyerProfile'
              element={
                <BuyerRoute redirectPath="/profile">
                  <BuyerProfile />
                </BuyerRoute>
              }
            />
            <Route
              path='/BuyerProfile/:id'
              element={
                <BuyerRoute redirectPath="/profile">
                  <BuyerProfile />
                </BuyerRoute>
              }
            />
            {/* Fallback route */}
            <Route
              path='*'
              element={<div>404 - Page Not Found</div>}
            />
          </Routes>
        </UserProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
