import React, { useContext, useEffect, useState } from 'react';
import { FaDesktop, FaFileCode, FaServer, FaToolbox, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useFetch from '../../Hooks/useFetch';
import { AuthContext } from '../../models/AuthContext';
import Loading from '../Loading/Loading.';
const popularFrontendTools = [
    'React', 'Vue', 'Angular', 'Svelte', 'Ember', 'Backbone', 'Preact', 'Next.js', 'Nuxt.js', 'Gatsby', 'Alpine.js',
    'Stencil', 'Polymer', 'Riot.js', 'Mithril', 'Marko', 'Aurelia', 'Inferno', 'Dojo', 'Lit', 'Quasar', 'Stimulus', 'Emotion', 'Chakra UI', 'Material-UI', 'Ant Design', 'Tailwind CSS', 'Bulma', 'Foundation', 'Semantic UI', 'Bootstrap', 'UIKit', 'Spectre.css', 'Shoelace'
];

const popularBackendTools = [
    'Node.js', 'Express', 'Django', 'Ruby on Rails', 'Flask', 'Spring Boot', 'Laravel', 'ASP.NET', 'Phoenix', 'Koa',
    'FastAPI', 'AdonisJS', 'NestJS', 'Hapi', 'Gin', 'Echo', 'Vapor', 'Slim', 'Rocket', 'Actix', 'Tokio', 'Zola', 'Rouille', 'Iron', 'Colossus', 'Warp', 'Tokio', 'Tower', 'Kitura', 'Perfect', 'Swifton', 'Vapor', 'Play Framework', 'Ratpack', 'Micronaut', 'Grails'
];

const popularLanguages = [
    'JavaScript', 'Python', 'Java', 'C#', 'Ruby', 'PHP', 'Swift', 'Go', 'TypeScript', 'Rust', 'Kotlin', 'Scala',
    'Dart', 'Haskell', 'Lua', 'Perl', 'R', 'Elixir', 'Clojure', 'Groovy', 'Julia', 'Objective-C', 'F#', 'OCaml', 'Pascal', 'Fortran', 'Ada', 'Scheme', 'Prolog', 'Erlang', 'Lisp', 'COBOL', 'Bash', 'Shell', 'PowerShell', 'SQL', 'PL/SQL', 'VBScript', 'MATLAB', 'Assembly'
];

export default function ProjectsList() {
    const { sendRequest,isLoading } = useFetch();
    const [projects, setProjects] = useState([]);
    const auth = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState(''); // Added state for search query
    const [selectedFrontendTools, setSelectedFrontendTools] = useState([]);
    const [selectedBackendTools, setSelectedBackendTools] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [page, setPage] = useState(1); // Add page state variable
    const handleToggleAdvancedSearch = () => {
        setShowAdvancedSearch((prev) => !prev);
    };

    const handleJoinProject = async (project) => {
        try {
            const projectId = project._id;
            const url = `${process.env.REACT_APP_BACKEND_URL}/projects/addPending/${projectId}`;

            const responseData = await sendRequest(url, 'PATCH', null, {
                Authorization: 'Bearer ' + auth.token,
                'Content-Type': 'application/json',
            });
            project.pendingUser.push(auth.userID);
            // Update joinedProjects state to reflect the joined project
        } catch (error) {
        }
    };
    const fetchProjects = async () => {
        try {
            const url = process.env.REACT_APP_BACKEND_URL + `/projects/suggestedproject?page=${page}`;

            const responseData = await sendRequest(url, 'GET', null, {
                Authorization: 'Bearer ' + auth.token,
            });

            if (page === 1) {
                setProjects(responseData.projects); // Replace projects on page 1
            } else {
                // Append new projects to the existing list
                setProjects([...projects, ...responseData.projects]);
            }
        } catch (error) {
        }
    };
    useEffect(() => {
        fetchProjects();
    }, [page]); // Trigger fetchProjects when the page changes

    const handleSearch = async () => {
        // Log the searched text and selected filters

        const url = process.env.REACT_APP_BACKEND_URL + '/projects/suggestedproject/filter/xyz';

        try {
            const responseData = await sendRequest(url, 'POST', JSON.stringify({
                keyword: searchQuery,
                frontend: selectedFrontendTools,
                backend: selectedBackendTools,
                language: selectedLanguages
            }), {
                Authorization: 'Bearer ' + auth.token,
                'Content-Type': 'application/json',
            });


            // Update the projects state with the filtered projects
            setProjects(responseData.projects);
        } catch (error) {
        }
    };

    const handleNextPage = () => {
        setPage(page + 1); // Increment the page number
    };

    const handleKeyPress = event => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };
    return (
        <div className="bg-gray-700 text-white min-h-screen py-4 pr-4 md:pr-8 pl-4 md:pl-8">
        
            {isLoading && 
            <Loading>

            </Loading>}
            <div className="mb-8 flex items-center flex-col md:flex-row">
                <input
                    type="text"
                    className="bg-gray-800 md:w-full text-white w-full p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <div className="md:w-40 mt-2 md:mt-0 flex justify-between w-full md:flex md:justify-normal">
                    <button
                        className="md:ml-4 ml-1 mt-2 w-20 bg-indigo-500 text-white py-1 md:px-4 rounded-md hover:bg-indigo-600 transition duration-300"
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                    <button
                        className="md:ml-4 mr-1 mt-2 w-32 bg-zinc-500 border-l-orange-300 text-white py-1 px-0 rounded-md hover:bg-gray-600 transition duration-300"
                        onClick={handleToggleAdvancedSearch}
                    >
                        {showAdvancedSearch ? 'Hide' : 'Advanced Search'}
                    </button>
                </div>
            </div>
            {showAdvancedSearch && (
                <div className="mb-8 flex items-center">
                    <div className="mr-4">
                        <h3 className="text-lg font-semibold">Frontend :</h3>
                        {/* Similar logic for frontend tools */}
                        {popularFrontendTools.map((tool) => (
                            <label key={tool} className="flex items-center mt-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedFrontendTools.includes(tool)}
                                    onChange={() => {
                                        if (selectedFrontendTools.includes(tool)) {
                                            setSelectedFrontendTools(selectedFrontendTools.filter((t) => t !== tool));
                                        } else {
                                            setSelectedFrontendTools([...selectedFrontendTools, tool]);
                                        }
                                    }}
                                />
                                <div className="w-5 h-5 border border-gray-400 rounded-sm flex-shrink-0 relative">
                                    <div
                                        className={`w-3 h-3 bg-blue-500 rounded-sm absolute left-1 top-1 transition-opacity ${selectedFrontendTools.includes(tool) ? 'opacity-100' : 'opacity-0'
                                            }`}
                                    ></div>
                                </div>
                                <span className="ml-2">{tool}</span>
                            </label>
                        ))}
                    </div>
                    <div className="mr-4">
                        <h3 className="text-lg font-semibold">Backend :</h3>
                        {popularBackendTools.map((tool) => (
                            <label key={tool} className="flex items-center mt-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedBackendTools.includes(tool)}
                                    onChange={() => {
                                        if (selectedBackendTools.includes(tool)) {
                                            setSelectedBackendTools(selectedBackendTools.filter((t) => t !== tool));
                                        } else {
                                            setSelectedBackendTools([...selectedBackendTools, tool]);
                                        }
                                    }}
                                />
                                <div className="w-5 h-5 border border-gray-400 rounded-sm flex-shrink-0 relative">
                                    <div
                                        className={`w-3 h-3 bg-blue-500 rounded-sm absolute left-1 top-1 transition-opacity ${selectedBackendTools.includes(tool) ? 'opacity-100' : 'opacity-0'
                                            }`}
                                    ></div>
                                </div>
                                <span className="ml-2">{tool}</span>
                            </label>
                        ))}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Languages:</h3>
                        {popularLanguages.map((language) => (
                            <label key={language} className="flex items-center mt-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedLanguages.includes(language)}
                                    onChange={() => {
                                        if (selectedLanguages.includes(language)) {
                                            setSelectedLanguages(selectedLanguages.filter((lang) => lang !== language));
                                        } else {
                                            setSelectedLanguages([...selectedLanguages, language]);
                                        }
                                    }}
                                />
                                <div className="w-5 h-5 border border-gray-400 rounded-sm flex-shrink-0 relative">
                                    <div
                                        className={`w-3 h-3 bg-blue-500 rounded-sm absolute left-1 top-1 transition-opacity ${selectedLanguages.includes(language) ? 'opacity-100' : 'opacity-0'
                                            }`}
                                    ></div>
                                </div>
                                <span className="ml-2">{language}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
            <div className="container mx-auto grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md p-6 w-full hover:shadow-lg transition duration-300 transform hover:scale-105"
                    >
                        <div className="flex flex-col items-center mb-4">
                            <div className="w-full h-40 md:h-60 rounded-lg overflow-hidden mr-3">
                                <Link to={'/project/' + project._id}>
                                    <img
                                        src={project.projectPicture}
                                        alt="Project"
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                            </div>
                            <h2 className="text-xl font-semibold pt-4">{project.title}</h2>
                        </div>
                        <p className="text-gray-400 mb-4 break-words">
                            {project.description.length > 50
                                ? project.description.substring(0, 50) + '....'
                                : project.description}
                        </p>
                        <div className="flex items-center mb-2">
                            <FaDesktop className="text-blue-400 text-lg mr-2" />
                            {project.frontend.slice(0, 3).map((tool, toolIndex) => (
                                <span
                                    key={tool}
                                    className="bg-gray-700 px-2 py-1 rounded-full text-sm mr-2"
                                >
                                    {tool}
                                    {toolIndex === 2 && project.frontend.length > 3 && (
                                        <span className="ml-1">...</span>
                                    )}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center mb-2">
                            <FaServer className="text-green-400 text-lg mr-2" />
                            {project.backend.slice(0, 3).map((tool, toolIndex) => (
                                <span
                                    key={tool}
                                    className="bg-gray-700 px-2 py-1 rounded-full text-sm mr-2"
                                >
                                    {tool}
                                    {toolIndex === 2 && project.backend.length > 3 && (
                                        <span className="ml-1">...</span>
                                    )}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center mb-2">
                            <FaToolbox className="text-yellow-400 text-lg mr-2" />
                            {project.other.slice(0, 3).map((tool, toolIndex) => (
                                <span
                                    key={tool}
                                    className="bg-gray-700 px-2 py-1 rounded-full text-sm mr-2"
                                >
                                    {tool}
                                    {toolIndex === 2 && project.other.length > 3 && (
                                        <span className="ml-1">...</span>
                                    )}
                                </span>
                            ))}
                        </div>
                        <div className="flex items-center">
                            <FaFileCode className="text-red-300 text-lg mr-2" />
                            {project.languages.slice(0, 3).map((language, languageIndex) => (
                                <span
                                    key={language}
                                    className="bg-gray-700 px-2 py-1 rounded-full text-sm mr-2"
                                >
                                    {language}
                                    {languageIndex === 2 && project.languages.length > 3 && (
                                        <span className="ml-1">...</span>
                                    )}
                                </span>
                            ))}
                        </div>
                        <div className="mt-4 flex justify-between">
                            <a
                                href={project.githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-300 transition duration-300"
                            >
                                <span className="flex items-center">
                                    <FaGithub className="mr-1" />
                                    GitHub
                                </span>
                            </a>
                            {/* Conditionally render the "Join" button */}
                            {project.creator == auth.userID ? (
                                <span className="text-gray-400">You created this project</span>
                            ) : project.joinedUser.includes(auth.userID) ? (
                                <span className="text-gray-400">Joined </span>
                            ) : project.pendingUser.includes(auth.userID) ? (
                                <span className="text-gray-400">Pending</span>
                            ) : (
                                <button
                                    onClick={() => {
                                        handleJoinProject(project);
                                    }}
                                    className={`py-2 px-4 rounded-md transition duration-300 ${project.pendingUser.includes(auth.userID) ||
                                        project.joinedUser.includes(auth.userID)
                                        ? 'bg-gray-500 cursor-not-allowed text-gray-300'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    disabled={
                                        project.pendingUser.includes(auth.userID) ||
                                        project.joinedUser.includes(auth.userID)
                                    }
                                >
                                    {project.pendingUser.includes(auth.userID) ? 'Pending' : 'Join'}
                                </button>
                            )}

                        </div>
                    </div>
                ))}
              
            </div>
            <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleNextPage}
                        className="py-2 px-4 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
                    >
                        Next
                    </button>
                </div>
        </div>
    );

}
