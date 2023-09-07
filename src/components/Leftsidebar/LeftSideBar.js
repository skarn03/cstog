import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../models/AuthContext';
const LeftSidebar = ({ handleSidebarToggle }) => {
    const [isMobileDevice, setIsMobileDevice] = useState(false);
    const [activeOption, setActiveOption] = useState('home');
    const navigate = useNavigate();
    const auth = useContext(AuthContext);
    useEffect(() => {
        const handleScreenSizeChange = (event) => {
            setIsMobileDevice(event.matches);
        };

        const mediaQuery = window.matchMedia("(max-width: 767px)");
        setIsMobileDevice(mediaQuery.matches);
        mediaQuery.addEventListener("change", handleScreenSizeChange);

        return () => {
            mediaQuery.removeEventListener("change", handleScreenSizeChange);
        };
    }, []);

    const handleHomeClick = () => {
        setActiveOption('home');
        toggleSideBar();
        navigate('/');
    };

    const toggleSideBar = () => {
        if (isMobileDevice) {
            handleSidebarToggle();
        }
    };

    const handleProfileClick = () => {
        setActiveOption('profile');
        toggleSideBar();
        navigate('/user/' + auth.userID);

        // Add logic for handling the 'Profile' click here.
    };

    const handleCreateProjectClick = () => {
        setActiveOption('create-project');
        toggleSideBar();
        navigate('/create');
        // Add logic for handling the 'Create Project' click here.
    };

    const handleSettingsClick = () => {
        setActiveOption('settings');
        toggleSideBar();
        navigate('/settings')
        // Add logic for handling the 'Settings' click here.
    };

    const handleProjectsClick = () => {
        setActiveOption('projects');
        toggleSideBar();
        navigate('/projectlist');
        // Add logic for handling the 'Projects' click here.
    };

    const handleLogoutClick = () => {
        auth.logout();
        navigate('/');
        // Add logic for handling the 'Logout' click here.
    };
    return (
        <div className="bg-gray-900 normal mr-2 h-screen w-full px-3 py-8 flex flex-col justify-between">
            {/* Home Option */}
            <div>
                <button
                    onClick={handleHomeClick}
                    className={`flex items-center text-white text-xl mb-8 ${activeOption === 'home' ? 'text-indigo-500' : ''
                        }`}
                >
                    <svg
                        className={`w-6 h-6 mr-2 fill-current ${activeOption === 'home' ? 'text-indigo-500' : 'text-white'
                            }`}
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M10 18L1 9h3V6h6v3h6l-9 9zM9 9h2v5H9V9zm3 0h2v5h-2V9z" />
                    </svg>
                    Home
                </button>

                {/* Profile Option */}
                <button
                    onClick={handleProfileClick}
                    className={`flex items-center text-white text-xl mb-8 ${activeOption === 'profile' ? 'text-indigo-500' : ''
                        }`}
                >
                    <svg
                        className={`w-6 h-6 mr-2 fill-current ${activeOption === 'profile' ? 'text-indigo-500' : 'text-white'
                            }`}
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M10 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0 2c-1.85 0-3.41.89-4.45 2.2C6.14 16.09 7.48 17 10 17s3.86-.91 4.45-2.8c-1.04-1.31-2.6-2.2-4.45-2.2zM10 9c1.66 0 2.99-1.34 2.99-3S11.66 3 10 3 7 4.34 7 6s1.34 3 3 3zm0 2c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z" />
                    </svg>
                    Profile
                </button>

                {/* Create Project Option */}
                <button
                    onClick={handleCreateProjectClick}
                    className={`flex items-center text-white text-xl mb-8 ${activeOption === 'create-project' ? 'text-indigo-500' : ''
                        }`}
                >
                    <svg
                        className={`w-6 h-6 mr-2 fill-current ${activeOption === 'create-project' ? 'text-indigo-500' : 'text-white'
                            }`}
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M9 1l7 5-7 5-7-5 7-5zm7 5v8l-7 5V6l7-5z" />
                    </svg>
                    Create Project
                </button>
                <button
                    onClick={handleProjectsClick}
                    className={`flex items-center text-white text-xl mb-8 ${activeOption === 'projects' ? 'text-indigo-500' : ''
                        }`}
                >
                    <svg
                        className={`w-6 h-6 mr-2 fill-current ${activeOption === 'projects' ? 'text-indigo-500' : 'text-white'
                            }`}
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M10 3a7 7 0 0 0-7 7h2a5 5 0 0 1 10 0h2a7 7 0 0 0-7-7zm-2 7H7a5 5 0 0 1 6 0h-1a4 4 0 0 0-4 4H8a2 2 0 1 1 0-4z" />
                        <path d="M2 10h1a8 8 0 0 1 16 0h1a9 9 0 0 0-18 0z" />
                    </svg>
                    Projects
                </button>
            </div>
            <div className='mb-20 md:mb-15'>
                <button
                    onClick={handleSettingsClick}
                    className={`flex items-center text-white text-xl mb-8 ${activeOption === 'settings' ? 'text-indigo-500' : ''
                        }`}
                >
                    <svg
                        className={`w-6 h-6 mr-2 fill-current ${activeOption === 'settings' ? 'text-indigo-500' : 'text-white'
                            }`}
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M14.07 3.93l1.4-1.4 1.42 1.42-1.4 1.4-1.42-1.42zm2.83 6.36l1.42 1.42-1.4 1.4-1.42-1.42 1.4-1.4zm-2.83 5.65l1.42 1.42-1.4 1.4-1.42-1.42 1.4-1.4zM10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-14a6 6 0 1 1 0 12 6 6 0 0 1 0-12z" />
                    </svg>
                    Settings
                </button>

                {/* Logout Option */}
                <button
                    onClick={handleLogoutClick}
                    className={`flex items-center text-white text-xl ${activeOption === 'logout' ? 'text-indigo-500' : ''
                        }`}
                >
                    <svg
                        className={`w-6 h-6 mr-2 fill-current ${activeOption === 'logout' ? 'text-indigo-500' : 'text-white'
                            }`}
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-2.83-8.64a.75.75 0 0 1 1.06-1.06l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06L9.44 10H3.75A.75.75 0 0 1 3 9.25v-1.5A.75.75 0 0 1 3.75 7h5.69l-1.22-1.22a.75.75 0 0 1 1.06-1.06l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06L9.44 10H3.75a.75.75 0 0 1-.75-.75v-1.5c0-.41.34-.75.75-.75h5.69l-1.22-1.22a.75.75 0 0 1 1.06-1.06l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06L9.44 10H3.75a.75.75 0 0 1-.75-.75v-1.5c0-.41.34-.75.75-.75h5.69l-1.22-1.22a.75.75 0 0 1 1.06-1.06l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06L9.44 10H3.75A.75.75 0 0 1 3 9.25v-1.5A.75.75 0 0 1 3.75 7h5.69l-1.22-1.22a.75.75 0 0 1 1.06-1.06l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06L9.44 10H3.75a.75.75 0 0 1-.75-.75v-1.5c0-.41.34-.75.75-.75h5.69l-1.22-1.22a.75.75 0 0 1 1.06-1.06l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06L9.44 10H3.75A.75.75 0 0 1 3 9.25v-1.5A.75.75 0 0 1 3.75 7h5.69l-1.22-1.22a.75.75 0 0 1 1.06-1.06l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06L9.44 10H3.75a.75.75 0 0 1-.75-.75v-1.5c0-.41.34-.75.75-.75h5.69l-1.22-1.22a.75.75 0 0 1 1.06-1.06l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06L9.44 10H3.75a.75.75 0 0 1-.75-.75v-1.5c0-.41.34-.75.75-.75h5.69l-1.22-1.22a.75.75 0 0 1 1.06-1.06l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06L9.44 10H3.75A.75.75 0 0 1 3 9.25v-1.5A.75.75 0 0 1 3.75 7h5.69l-1.22-1.22a.75.75 0 0 1 1.06-1.06l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06L9.44 10H3.75a.75.75 0 0 1-.75-.75v-1.5c0-.41.34-.75.75-.75h5.69l-1.22-1.22a.75.75 0 0 1 1.06-1.06l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06L9.44 10H3.75a.75.75 0 0 1-.75-.75v-1.5c0-.41.34-.75.75-.75h5.69l-1.22-1.22a.75.75 0 0 1 1.06-1.06l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06L9.44 10H3.75a.75.75 0 0 1-.75-.75v-1.5A.75.75 0 0 1 3.75 7h5.69l-1.22-1.22a.75.75 0 0 1 1.06-1.06l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06z" />
                    </svg>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default LeftSidebar
