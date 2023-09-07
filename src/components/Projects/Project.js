import React, { useState, useEffect, useContext } from 'react';
import useFetch from '../../Hooks/useFetch';
import { GiTechnoHeart } from 'react-icons/gi';
import { useParams } from 'react-router';
import { AuthContext } from '../../models/AuthContext';
import Loading from '../Loading/Loading.';
import { useImage } from '../../Hooks/useImage';
import { useNavigate } from 'react-router';
export default function Project({ projectId, userId }) {
  const [project, setProject] = useState(null);
  const [requestSent, setRequestSent] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState('/path/to/default/profileImage.jpg');
  const [editedProject, setEditedProject] = useState(null);
  const { sendRequest,isLoading } = useFetch();
  const { id } = useParams();
  const auth = useContext(AuthContext);
  const [selectedFile, setSelectedFile] = useState(null); // New state for selected file
  const { uploadImage } = useImage();
  const navigate = useNavigate();
  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDelete = async () => {
    try {
      // Implement your delete request here
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/projects/${project._id}`,
        'DELETE',
        null,
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
      // Handle the successful deletion
      // Redirect or show a message to the user
      navigate('/');
    } catch (error) {
    }
  };
  const fetchProject = async (projectId) => {
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/projects/${projectId}`,
        'GET',
        null,
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
      setProject(responseData); // Update the state with the fetched project
      setEditedProject(responseData); // Initialize editedProject state with the fetched project
    } catch (error) {
    }
  };

  const handleJoin = async (projectId) => {
    // Handle the join button click and send a join request
    try {
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

  const handleEdit = () => {
    // Enable edit mode and initialize editedProject with current project values
    setEditMode(true);
    setEditedProject(project);
  };

  const handleCancelEdit = () => {
    // Cancel edit mode
    setEditMode(false);
  };
  const arraysAreEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  };

  const handleSaveChanges = async () => {

    try {
      const changesMade = isProjectEdited(editedProject, project);


      const image = await uploadImage(selectedFile);
      if (!changesMade && image.id == '') {
        // No changes made, so simply exit the edit mode
        setEditMode(false);
        return;
      }
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL + `/projects/${project._id}`,
        'PATCH',
        JSON.stringify({
          title: editedProject.title,
          frontend: editedProject.frontend,
          backend: editedProject.backend,
          other: editedProject.other,
          description: editedProject.description,
          languages: editedProject.languages,
          projectPicture: image.img,
          projectPictureId: image.id
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + auth.token,
        }
      );
      editedProject.projectPicture = image.img;
      setProject({ ...project, ...editedProject });
      setEditMode(false);
    } catch (error) {
    }
  };

  // Helper function to check if any changes are made to the project
  const isProjectEdited = (newProject, originalProject) => {
    return (
      newProject.title !== originalProject.title ||
      !arraysAreEqual(newProject.frontend, originalProject.frontend) ||
      !arraysAreEqual(newProject.backend, originalProject.backend) ||
      !arraysAreEqual(newProject.other, originalProject.other) ||
      !arraysAreEqual(newProject.languages, originalProject.languages) ||
      newProject.description !== originalProject.description
    );
  };
  useEffect(() => {
    if (id) {
      fetchProject(id); // Pass the id as a parameter to the fetchProject function
    }
  }, [id]);

  const isCreator = project && project.creator === auth.userID;
  // ...

  return (
    project && (
      <div className="bg-gray-800 text-white min-h-screen py-8 px-8">
        {isLoading && 
            <Loading>
                
            </Loading>}
        <div className="container mx-auto">
          <div className="max-w-screen-xl mx-auto bg-gray-700 rounded-lg shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg hover:border-blue-600 transition duration-300">
            {editMode ? (
              <div className="mb-6">
                <input type="file" onChange={handleFileSelect} className="mb-2" />
                {selectedFile && (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Selected"
                    className="w-full max-h-72 rounded-lg object-cover mb-4"
                    onChange={(e) =>
                      setEditedProject({
                        ...editedProject,
                        image: e.target.files[0],
                      })
                    }
                  />
                )}
              </div>
            ) : (
              <img
                src={project.projectPicture}
                alt="Project"
                className="w-full max-h-72 rounded-lg object-cover mb-6"
              />
            )}
            <h2 className="text-3xl font-semibold mb-4">
              {editMode ? (
                <input
                  type="text"
                  value={editedProject.title}
                  onChange={(e) =>
                    setEditedProject({
                      ...editedProject,
                      title: e.target.value,
                    })
                  }
                  className="bg-gray-800 text-white p-2 rounded-md mb-2"
                />
              ) : (
                project.title
              )}
            </h2>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Frontend Tools</h3>
              <div className="flex flex-wrap">
                {editMode ? (
                  <input
                    type="text"
                    value={editedProject.frontend.join(', ')}
                    onChange={(e) =>
                      setEditedProject({
                        ...editedProject,
                        frontend: e.target.value.split(',').map((item) => item.trim()),
                      })
                    }
                    className="bg-gray-800 text-white p-2 rounded-md mr-2 mb-2 hover:bg-gray-900 transition duration-300"
                  />
                ) : (
                  project.frontend.map((tool) => (
                    <span
                      key={tool}
                      className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm mr-2 mb-2 hover:bg-blue-700 transition duration-300"
                    >
                      {tool}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Backend Tools</h3>
              <div className="flex flex-wrap">
                {editMode ? (
                  <input
                    type="text"
                    value={editedProject.backend.join(', ')}
                    onChange={(e) =>
                      setEditedProject({
                        ...editedProject,
                        backend: e.target.value.split(',').map((item) => item.trim()),
                      })
                    }
                    className="bg-gray-800 text-white p-2 rounded-md mr-2 mb-2 hover:bg-gray-900 transition duration-300"
                  />
                ) : (
                  project.backend.map((tool) => (
                    <span
                      key={tool}
                      className="bg-green-600 text-white px-3 py-1 rounded-full text-sm mr-2 mb-2 hover:bg-green-700 transition duration-300"
                    >
                      {tool}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Other Tools</h3>
              <div className="flex flex-wrap">
                {editMode ? (
                  <input
                    type="text"
                    value={editedProject.other.join(', ')}
                    onChange={(e) =>
                      setEditedProject({
                        ...editedProject,
                        other: e.target.value.split(',').map((item) => item.trim()),
                      })
                    }
                    className="bg-gray-800 text-white p-2 rounded-md mr-2 mb-2 hover:bg-gray-900 transition duration-300"
                  />
                ) : (
                  project.other.map((tool) => (
                    <span
                      key={tool}
                      className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-sm mr-2 mb-2 hover:bg-yellow-600 transition duration-300"
                    >
                      {tool}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Languages</h3>
              <div className="flex flex-wrap">
                {editMode ? (
                  <input
                    type="text"
                    value={editedProject.languages.join(', ')}
                    onChange={(e) =>
                      setEditedProject({
                        ...editedProject,
                        languages: e.target.value.split(',').map((item) => item.trim()),
                      })
                    }
                    className="bg-gray-800 text-white p-2 rounded-md mr-2 mb-2 hover:bg-gray-900 transition duration-300"
                  />
                ) : (
                  project.languages.map((language) => (
                    <span
                      key={language}
                      className="bg-red-600 text-white px-3 py-1 rounded-full text-sm mr-2 mb-2 hover:bg-red-700 transition duration-300"
                    >
                      {language}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div className="mb-6 break-words">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              {editMode ? (
                <textarea
                  value={editedProject.description}
                  onChange={(e) =>
                    setEditedProject({
                      ...editedProject,
                      description: e.target.value,
                    })
                  }
                  className="bg-gray-800 w-full h-40 text-white p-2 rounded-md mb-2 hover:bg-gray-900 transition duration-300 resize-none"
                  style={{ verticalAlign: "top", overflow: "auto" }}
                />
              ) : (
                <p className="text-gray-400 leading-relaxed font-mono ">
                  {project.description}
                </p>
              )}

            </div>
            <div className="mt-6 flex justify-between">
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition duration-300"
              >
                <span className="flex items-center">
                  <GiTechnoHeart className="mr-1" />
                  GitHub
                </span>
              </a>
              {auth.userID == project.creator ? ( // Check if the user is the creator
                <div className="ml-10 md:ml-150">
                  {editMode ? (
                    <div className="pl-4 flex flex-col md:flex-row h-30">
                      <button
                        onClick={handleSaveChanges}
                        className="bg-green-700 text-white py-2 mb-3 px-4 rounded-md hover:bg-green-800 transition duration-300"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-600 w mb-3 text-white py-2 px-4 rounded-md ml-2 hover:bg-gray-700 transition duration-300"
                      >
                        Cancel
                      </button>
                      {editMode && (
                        <button
                          onClick={handleDelete}
                          className="bg-red-600 text-white py-2 px-4 rounded-md ml-2 hover:bg-red-700 transition duration-300"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={handleEdit}
                      className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-300"
                    >
                      Edit
                    </button>
                  )}
                </div>
              ) : project.pendingUser.includes(auth.userID) ? ( // Check if the user is pending
                <div className="ml-10 md:ml-150">
                  <button
                    className="bg-gray-600 text-white py-2 px-4 rounded-md cursor-not-allowed"
                    disabled
                  >
                    Pending
                  </button>
                </div>
              ) : project.joinedUser.includes(auth.userID) ? ( // Check if the user is joined
                <div className="ml-10 md:ml-150">
                  <button
                    className="bg-green-700 text-white py-2 px-4 rounded-md cursor-not-allowed"
                    disabled
                  >
                    Joined
                  </button>
                </div>
              ) : ( // User is not creator, not pending, not joined
                <div className="ml-10 md:ml-150">
                  {requestSent ? (
                    <button
                      className="bg-gray-600 text-white py-2 px-4 rounded-md cursor-not-allowed"
                      disabled
                    >
                      Request Sent
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleJoin(project._id)
                      }}
                      className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                      Join
                    </button>
                  )}
                </div>
              )}
              <div>

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

