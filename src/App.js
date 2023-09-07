import './App.css';
import React, { Suspense, useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { AuthContext } from './models/AuthContext';
import { useAuth } from './Hooks/useAuth';
import Loading from './components/Loading/Loading.';
const Home = React.lazy(() => import('./components/Home/Home'));
const LeftSidebar = React.lazy(() => import('./components/Leftsidebar/LeftSideBar'));
const ProjectForm = React.lazy(() => import('./components/Project/ProjectForm'));
const Project = React.lazy(() => import('./components/Projects/Project'));
const UserProfile = React.lazy(() => import('./components/profile/UserProfile'));
const UserSettings = React.lazy(() => import('./components/Settings/UserSetting'));
const ProjectList = React.lazy(() => import('./components/ProjectList/ProjectList'));
const Login = React.lazy(() => import('./components/Login/Login'));

function App() {
  const auth = useContext(AuthContext);
  const { token, login, logout, userID } = useAuth();

  let routes;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScreenSizeChange = (event) => {
      setIsSidebarOpen(event.matches);
    };

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsSidebarOpen(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleScreenSizeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenSizeChange);
    };
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  if (token) {
    routes = (
      <React.Fragment>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<Project />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/create" element={<ProjectForm />} />
        <Route path="/settings" element={<UserSettings />} />
        <Route path="/projectlist" element={<ProjectList />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </React.Fragment>
    );
  } else {
    routes = (
      <React.Fragment>
        <Route path="/" element={<Login />} />
      </React.Fragment>
    );
  }

  if (token) {
    return (
      <AuthContext.Provider value={{ isLoggedIn: !!token, token: token, userID: userID, login: login, logout: logout }}>
        <Router>
          <div className='bg-gray-700 text-white main-container flex flex-col h-full'>
            <div className='h-16 overflow-hidden fixed w-full z-20'>
              <Navbar handleSidebarToggle={handleSidebarToggle} />
            </div>
            <div className='flex flex-row '>
              <div className='w-55 md:w-64 fixed z-40 mt-16' id='lefter'>
                {isSidebarOpen &&
                  <LeftSidebar handleSidebarToggle={handleSidebarToggle} />
                }
              </div>
              <div className=' w-full mt-16  pr-0 md:ml-60  md: min-h-screen md:h-screen '>
                <Suspense fallback={
                  <div className="center">
                  </div>}>
                  <Routes>
                    {routes}
                  </Routes>
                </Suspense>
              </div>
            </div>
          </div>
        </Router>
      </AuthContext.Provider>
    );
  } else {
    return (
      <AuthContext.Provider value={{ isLoggedIn: !!token, token: token, userID: userID, login: login, logout: logout }}>
        <Router>
          <Suspense fallback={
            <div className="center">
            </div>}>
            <Routes>
              {routes}
            </Routes>
          </Suspense>
        </Router>
      </AuthContext.Provider>
    );
  }
}

export default App;
