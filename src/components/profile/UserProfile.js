import React, { useState, useEffect, useContext } from 'react';
import useFetch from '../../Hooks/useFetch';
import { useParams, useNavigate } from 'react-router';
import { AuthContext } from '../../models/AuthContext';
import { FaCode, FaServer, FaCoffee } from 'react-icons/fa';
import Loading from '../Loading/Loading.';
export default function UserProfile() {
    const [user, setUser] = useState({});
    const { sendRequest,isLoading } = useFetch();
    const [projects, setProjects] = useState([]);
    const auth = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const url = process.env.REACT_APP_BACKEND_URL + '/users/profile/' + id;

            const responseData = await sendRequest(url, 'GET', null, {
                Authorization: 'Bearer ' + auth.token,
            });
            setUser(responseData.user);
            setProjects(responseData.user.projects);
        } catch (error) {
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const navigateToProject = (projectId) => {
        navigate(`/project/${projectId}`);
    };

    const limitText = (text, limit) => {
        if (text.length > limit) {
            return text.slice(0, limit) + '...';
        }
        return text;
    };

    return (
        <div className="ml-4 mr-4 min-h-screen bg-coffee-lighter bg-opacity-20 font-sans">
          {isLoading && 
            <Loading>
                
            </Loading>}
            <div className="bg-[#815B5B] p-6 mb-4 rounded-lg shadow-lg mx-auto w-full md:w-full lg:w-full xl:w-full">
                <div className="flex justify-center items-center">
                    <img
                        className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-4 rounded-full"
                        src={user.profilePic}
                        alt="Profile"
                    />
                </div>
                <h1 className="text-3xl font-semibold text-center mb-2 text-coffee-dark font-serif">{user.name}</h1>
                <p className="text-coffee-dark text-center mb-4 font-serif">{user.bio}</p>
                <p className="text-coffee text-center mb-2 font-serif">Date of Birth: {user.DOB}</p>
                {user.GitHub && (
                    <a
                        href={user.GitHub}
                        className="text-indigo-400 hover:text-indigo-600 text-center block mb-4 font-serif"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub Profile
                    </a>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 mx-auto px-2 md:p-5">
                {projects.map(project => (
                    <div
                        key={project._id}
                        className="bg-[#3A3845] p-6 rounded-lg shadow-lg cursor-pointer"
                        onClick={() => navigateToProject(project._id)}
                    >
                        <img
                            className="w-full h-32 md:h-40 object-cover rounded"
                            src={project.projectPicture}
                            alt={project.title}
                        />
                        <h2 className="text-lg font-semibold mt-2 text-[#C4C1A4] font-serif">{project.title}</h2>
                        <p className="text-coffe mb-2 break-words font-serif">
                            {limitText(project.description, 50)}
                        </p>
                        <div className="flex flex-col mt-2">
                            <div className="flex items-center space-x-2 mb-1.5">
                                <FaCode className="text-yellow-400" />
                                <span className="text-[#F8F0E5] text-sm font-serif">
                                    Front-end: {project.frontend.slice(0, 3).join('  ')}
                                    {project.frontend.length > 3 && '...'}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 mb-1.5">
                                <FaServer className="text-green-400" />
                                <span className="text-[#F8F0E5] text-sm font-serif">
                                    Back-end: {project.backend.slice(0, 3).join('  ')}
                                    {project.backend.length > 3 && '...'}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 mb-1.5">
                                <FaCoffee className="text-orange-400" />
                                <span className="text-[#F8F0E5] text-sm font-serif">
                                    Languages: {project.languages.slice(0, 3).join('  ')}
                                    {project.languages.length > 3 && '...'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
