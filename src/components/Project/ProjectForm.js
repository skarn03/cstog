import React, { useContext, useState } from 'react';
import useFetch from '../../Hooks/useFetch';
import { AuthContext } from '../../models/AuthContext';
import { useNavigate } from 'react-router';
import { useImage } from '../../Hooks/useImage';
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
const ProjectForm = () => {
    const [projectData, setProjectData] = useState({
        title: '',
        description: '',
        frontendTools: '',
        backendTools: '',
        otherTools: '',
        languages: '', // Added languages field
        projectPicture: '',
        projectPictureId:'',
    });

    const [frontendSuggestions, setFrontendSuggestions] = useState([]);
    const [backendSuggestions, setBackendSuggestions] = useState([]);
    const [languageSuggestions, setLanguagesSuggestions] = useState([]);
    const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
    const { sendRequest ,isLoading } = useFetch();
    const navigate = useNavigate();
    const [file, setFile] = useState('');
    //function that returns an object with cloudinary cloud image id and string
    const { uploadImage } = useImage();
    const auth = useContext(AuthContext);
    
    
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setProjectData({ ...projectData, projectPicture: reader.result });
        };
        if (file) {
            reader.readAsDataURL(file);
            setFile(file);
        }
    };

    const handleInputChange = (event, fieldName) => {
        const { value } = event.target;
        setProjectData({ ...projectData, [fieldName]: value });
        updateSuggestions(value, fieldName);
    };

    const updateSuggestions = (input, fieldName) => {
        if (input) {
            const inputParts = input.split(',').map(part => part.trim());
            const lastPart = inputParts[inputParts.length - 1];

            const suggestedTools = fieldName === 'frontendTools'
                ? popularFrontendTools
                : fieldName === 'backendTools'
                    ? popularBackendTools
                    : fieldName === 'languages'?popularLanguages :[];

            const filteredSuggestions = suggestedTools.filter(tool =>
                tool.toLowerCase().includes(lastPart.toLowerCase())
            );

            if (fieldName === 'frontendTools') {
                setFrontendSuggestions(filteredSuggestions);
            } else if (fieldName === 'backendTools') {
                setBackendSuggestions(filteredSuggestions);
            } else if (fieldName === 'languages'){
                setLanguagesSuggestions(filteredSuggestions);
            }
        } else {
            setFrontendSuggestions([]);
            setBackendSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion, fieldName) => {
        const lastCommaIndex = projectData[fieldName].lastIndexOf(',');
        const previousInput = projectData[fieldName].substring(0, lastCommaIndex + 1);
        const updatedInput = previousInput + suggestion + ', ';

        setProjectData({ ...projectData, [fieldName]: updatedInput });
        setFrontendSuggestions([]);
        setBackendSuggestions([]);
        setLanguagesSuggestions([]);
    };

    const handleKeyDown = (event, suggestions, fieldName) => {
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            setSelectedSuggestionIndex(prevIndex =>
                prevIndex > 0 ? prevIndex - 1 : prevIndex
            );
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            setSelectedSuggestionIndex(prevIndex =>
                prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
            );
        } else if (event.key === 'Enter' && selectedSuggestionIndex !== -1) {
            event.preventDefault();
            handleSuggestionClick(suggestions[selectedSuggestionIndex], fieldName);
            setSelectedSuggestionIndex(-1);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Remove duplicates using Set
        const frontendToolsArray = [...new Set(projectData.frontendTools.split(',').map(tool => tool.trim()))];
        const backendToolsArray = [...new Set(projectData.backendTools.split(',').map(tool => tool.trim()))];
        const otherToolsArray = [...new Set(projectData.otherTools.split(',').map(tool => tool.trim()))];
        const languagesArray = [...new Set(projectData.languages.split(',').map(tool => tool.trim()))];
    
        const updatedProjectData = {
            ...projectData,
            frontendTools: frontendToolsArray,
            backendTools: backendToolsArray,
            otherTools: otherToolsArray,
            languages: languagesArray,
        };
    

        //back-end fetch
        try {
            const image = await uploadImage(file);
            if (!image) {
            }
            updatedProjectData.projectPicture = image.img || "";
            updatedProjectData.projectPictureId = image.id || "";

            const responseData = await sendRequest(
                process.env.REACT_APP_BACKEND_URL + '/projects/create',
                'POST',
                JSON.stringify(
                    updatedProjectData),
                {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + auth.token
                }

            );
                navigate('/project/'+ responseData._id);
        } catch (error) {

        }

        // Here, you can handle the form submission and save the updatedProjectData to your backend or perform other actions.
    };

    return (
        <div className="min-h-screen bg-gray-800 flex items-top py-2 justify-center px-4 md:py-4 sm:px-6 lg:px-8">
          {isLoading && 
            <Loading>
                
            </Loading>}
            <div className="max-w-4xl w-full p-6 bg-gray-700 rounded-lg shadow-lg">
                <h2 className="text-3xl font-extrabold text-white mb-6">Create New Project</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Title and Description fields */}
                    {/* ... */}
                    <div>
                        <label htmlFor="title" className="block text-xl font-semibold text-white mb-2">
                            Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            autoComplete="off"
                            required
                            className="input-field w-full h-10 bg-gray-700 border rounded-lg border-gray-600 text-white px-4 py-2 focus:outline-none focus:border-indigo-500"
                            placeholder="Title"
                            value={projectData.title}
                            onChange={(event) => handleInputChange(event, 'title')}
                        />
                    </div>

                    {/* Description Input */}
                    <div>
                        <label htmlFor="description" className="block text-xl font-semibold text-white mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            required
                            className="input-field w-full bg-gray-700 border rounded-lg border-gray-600 text-white px-4 py-2 focus:outline-none focus:border-indigo-500"
                            placeholder="Description"
                            value={projectData.description}
                            onChange={(event) => handleInputChange(event, 'description')}
                        />
                    </div>
                    <div className="relative">
                        <label htmlFor="languages" className="block text-xl font-semibold text-white mb-2">
                            Languages (separate with commas):
                        </label>
                        <input
                            type="text"
                            id="languages"
                            name="languages"
                            className="input-field w-full h-10 bg-gray-700 border rounded-lg border-gray-600 text-white px-4 py-2 focus:outline-none focus:border-indigo-500"
                            placeholder="Type Languages"
                            value={projectData.languages}
                            onChange={(event) => handleInputChange(event, 'languages')}
                            onKeyDown={(event) =>
                                handleKeyDown(event, languageSuggestions, 'languages')
                            }
                        />
                        {languageSuggestions.length > 0 && (
                            <ul className="suggestions-list absolute mt-2 w-full bg-gray-800 border border-gray-600 rounded-lg z-10">
                                {languageSuggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        className={`suggestion text-white px-4 py-2 cursor-pointer ${selectedSuggestionIndex === index
                                            ? 'bg-indigo-300 text-[#e8d2d2]'
                                            : 'hover:bg-gray-200'
                                            }`}
                                        onClick={() =>
                                            handleSuggestionClick(suggestion, 'languages')
                                        }
                                        onMouseEnter={() => setSelectedSuggestionIndex(index)}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    {/* Frontend Tools Input */}
                    <div className="relative">
                        <label htmlFor="frontendTools" className="block text-xl font-semibold text-white mb-2">
                            Frontend Tools (separate with commas):
                        </label>
                        <input
                            type="text"
                            id="frontendTools"
                            name="frontendTools"
                            className="input-field w-full h-10 bg-gray-700 border rounded-lg border-gray-600 text-white px-4 py-2 focus:outline-none focus:border-indigo-500"
                            placeholder="Type frontend tools"
                            value={projectData.frontendTools}
                            onChange={(event) => handleInputChange(event, 'frontendTools')}
                            onKeyDown={(event) =>
                                handleKeyDown(event, frontendSuggestions, 'frontendTools')
                            }
                        />
                        {frontendSuggestions.length > 0 && (
                            <ul className="suggestions-list absolute mt-2 w-full bg-gray-800 border border-gray-600 rounded-lg z-10">
                                {frontendSuggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        className={`suggestion text-white px-4 py-2 cursor-pointer ${selectedSuggestionIndex === index
                                            ? 'bg-indigo-300 text-[#e8d2d2]'
                                            : 'hover:bg-gray-200'
                                            }`}
                                        onClick={() =>
                                            handleSuggestionClick(suggestion, 'frontendTools')
                                        }
                                        onMouseEnter={() => setSelectedSuggestionIndex(index)}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                   

                    {/* Backend Tools Input */}
                    <div className="relative">
                        <label htmlFor="backendTools" className="block text-xl font-semibold text-white mb-2">
                            Backend Tools (separate with commas):
                        </label>
                        <input
                            type="text"
                            id="backendTools"
                            name="backendTools"
                            className="input-field w-full h-10 bg-gray-700 border rounded-lg border-gray-600 text-white px-4 py-2 focus:outline-none focus:border-indigo-500"
                            placeholder="Type backend tools"
                            value={projectData.backendTools}
                            onChange={(event) => handleInputChange(event, 'backendTools')}
                            onKeyDown={(event) =>
                                handleKeyDown(event, backendSuggestions, 'backendTools')
                            }
                        />
                        {backendSuggestions.length > 0 && (
                            <ul className="suggestions-list absolute mt-2 w-full bg-gray-800 border border-gray-600 rounded-lg">
                                {backendSuggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        className={`suggestion px-4 py-2 cursor-pointer ${selectedSuggestionIndex === index
                                            ? 'bg-indigo-600 text-white'
                                            : 'hover:bg-gray-700'
                                            }`}
                                        onClick={() =>
                                            handleSuggestionClick(suggestion, 'backendTools')
                                        }
                                        onMouseEnter={() => setSelectedSuggestionIndex(index)}
                                    >
                                        {suggestion}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Other Tools Input */}
                    <div>
                        <label htmlFor="otherTools" className="block text-xl font-semibold text-white mb-2">
                            Other Tools (separate with commas):
                        </label>
                        <input
                            type="text"
                            id="otherTools"
                            name="otherTools"
                            className="input-field w-full h-10 bg-gray-700 border rounded-lg border-gray-600 text-white px-4 py-2 focus:outline-none focus:border-indigo-500"
                            placeholder="Type other tools"
                            value={projectData.otherTools}
                            onChange={(event) => handleInputChange(event, 'otherTools')}
                        />
                        {/* ... Suggestions rendering for otherTools field */}
                    </div>

                    {/* Project Picture Input */}
                    <div className='h-100'>
                        <label htmlFor="projectPicture" className="block text-xl font-semibold text-white mb-2">
                            Project Thumbnail:
                        </label>
                        <input
                            id="projectPicture"
                            name="projectPicture"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        {projectData.projectPicture && (
                            <div className="mt-4 h-40 md:h-55">
                                <img
                                    src={projectData.projectPicture}
                                    alt="Project Preview"
                                    className="w-full h-40 object-cover rounded-5xl md:h-55"
                                />
                            </div>
                        )}
                        <label
                            htmlFor="projectPicture"
                            className="mt-2 inline-block cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Upload Image
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
                        >
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectForm;
