import React, { useContext, useEffect, useState } from 'react';
import useFetch from '../../Hooks/useFetch';
import { AuthContext } from '../../models/AuthContext';
import Chatroom from '../Chatroom/Chatroom';
import Loading from '../Loading/Loading.';

export default function ProjectList() {
    const { sendRequest,isLoading } = useFetch();
    const auth = useContext(AuthContext);
    const [projects, setProjects] = useState({ joinedProjects: [], userProjects: [] });
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [isProjectListOpen, setIsProjectListOpen] = useState(true);

    const fetchProjectList = async () => {
        try {
            const url = process.env.REACT_APP_BACKEND_URL + '/projects/getuserproject/allprojects';
            const responseData = await sendRequest(url, 'GET', null, {
                Authorization: 'Bearer ' + auth.token,
            });
            setProjects(responseData);
            if (responseData.joinedProjects.length > 0) {
                setSelectedProjectId(responseData.userProjects[0]._id);
            }
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchProjectList();
    }, []);

    const handleProjectClick = (projectId) => {
        setIsProjectListOpen(false); // Close the ProjectList
        setSelectedProjectId(projectId); // Set the selected project ID
    };

    const toggleProjectList = () => {
        setIsProjectListOpen(!isProjectListOpen);
    };
    return (
        <div className='flex flex-row h-screen overflow-hidden bg-[#2c3968]'>
            {/* Toggle button for ProjectList */}
            {isLoading && 
            <Loading>
                
            </Loading>}
            <div className='md:ml-3 p-2 cursor-pointer' onClick={toggleProjectList}>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className={`bg-gray-600 h-6 w-6 transition-transform transform ${isProjectListOpen ? 'rotate-0' : 'rotate-180'}`}
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                >
                    <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M5 15l7-7 7 7'
                    />
                </svg>
            </div>

            {/* ProjectList */}
            <div
                className={`w-full md:w-${isProjectListOpen ? 'full' : '1/4'} ml-0 pr-0 px-6 md:px-0 py-6 ${isProjectListOpen ? 'block' : 'hidden md:block'
                    } transition-all duration-300`}
            >
                <div className='space-y-8 '>
                    <h2 className='text-xl font-semibold mb-4'>Joined Projects</h2>
                    <ul className='space-y-4'>
                        {projects.joinedProjects.map((project) => (
                            <li
                                key={project.id}
                                className={`flex items-center space-x-4 cursor-pointer p-2 rounded-lg ${selectedProjectId === project._id
                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                    : 'hover:bg-gray-200'
                                    }`}
                                onClick={() => handleProjectClick(project._id)}
                            >
                                <img src={project.projectPicture} alt={project.title} className='w-12 h-12 rounded-full' />
                                <span className='text-gray-800'>{project.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className='mt-8'>
                    <h2 className='text-xl font-semibold mb-4'>Your Projects</h2>
                    <ul className='space-y-4 md:mr-4'>
                        {projects.userProjects.map((project) => (
                            <li
                                key={project.id}
                                className={`flex items-center space-x-4 cursor-pointer p-2 rounded-lg ${selectedProjectId === project._id
                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                    : 'hover:bg-gray-200'
                                    }`}
                                onClick={() => handleProjectClick(project._id)}
                            >
                                <img src={project.projectPicture} alt={project.title} className='w-12 h-12 rounded-full' />
                                <span className='text-gray-800'>{project.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Chatroom */}
            <div className={`ml-0 mt-0 w-full h-full ${isProjectListOpen ? 'hidden' : 'md:w-3/4'} transition-all duration-300`}>
                <Chatroom projectId={selectedProjectId} />
            </div>
        </div>
    );

}
