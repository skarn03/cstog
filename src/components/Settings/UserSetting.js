import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../models/AuthContext';
import useFetch from '../../Hooks/useFetch';
import Loading from '../Loading/Loading.';
export default function UserSettings() {
    const [user, setUser] = useState({});
    const [editing, setEditing] = useState(null); // Store the field being edited
    const [editedUser, setEditedUser] = useState({});
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const auth = useContext(AuthContext);
    const { sendRequest ,isLoading } = useFetch();
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const url = process.env.REACT_APP_BACKEND_URL + '/users/settings/' + auth.userID;

                const responseData = await sendRequest(url, 'GET', null, {
                    Authorization: 'Bearer ' + auth.token,
                });
                setUser(responseData.user);
            } catch (error) {
            }
        };
        fetchUser();
    }, [auth.token, sendRequest]);

    const handleEditField = (fieldName) => {
        setEditedUser({ ...user });
        setEditing(fieldName);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setEditedUser((prevEditedUser) => ({
            ...prevEditedUser,
            [name]: value,
        }));
    };





    const handleSaveClick = async () => {
        try {


            const url = process.env.REACT_APP_BACKEND_URL + '/users/updateSettings';

            const updatedUser = { ...editedUser };

            if (newPassword !== '' && confirmNewPassword !== '' && newPassword === confirmNewPassword) {
                updatedUser.newPassword = newPassword;
                updatedUser.confirmNewPassword = confirmNewPassword;
            } else if (newPassword !== '' || confirmNewPassword !== '') {
                setMessage("New passwords do not match");
                return; // Stop the function here
            }

            if (oldPassword !== '') {
                updatedUser.oldPassword = oldPassword;
            }

            // Client-side validation for email format
            if (editedUser.email && !isValidEmail(editedUser.email)) {
                setMessage("Invalid email format");
                return; // Stop the function here
            }

            const responseData = await sendRequest(
                url,
                'PATCH',
                JSON.stringify(updatedUser),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token,
                }
            );

            let message = '';

            if (editedUser.name !== user.name) {
                message += `Name changed from ${user.name} to ${editedUser.name}\n`;
            }

            if (editedUser.email !== user.email) {
                message += `Email changed from ${user.email} to ${editedUser.email}\n`;
            }

            if (editedUser.DOB !== user.DOB) {
                message += `Date of Birth changed from ${user.DOB} to ${editedUser.DOB}\n`;
            }

            if (message !== '') {
                setMessage(message);
            }

            setUser(responseData.user);
            setEditing(null); // Clear the editing field
            setNewPassword('');
            setConfirmNewPassword('');
            setOldPassword('');
        } catch (error) {
            setMessage(" " + error.message);
        }
    };

    const isValidEmail = (email) => {
        // Simple email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <div className="container mt-6 mx-auto p-8 min-h-screen bg-gray-700 rounded-lg shadow-md text-neutral-400">
              {isLoading && 
            <Loading>
                
            </Loading>}
            <h2 className="text-2xl font-semibold mb-4">User Settings</h2>

            {message && (
                <div className="bg-green-100 border border-green-500 text-green-800 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold"></strong>
                    <span className="block sm:inline">{message}</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setMessage(null)}>
                        <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <title>Close</title>
                            <path d="M14.348 14.849a1 1 0 01-1.414 0L10 11.414l-2.93 2.93a1 1 0 01-1.414-1.414l2.93-2.93-2.93-2.93a1 1 0 111.414-1.414l2.93 2.93 2.93-2.93a1 1 0 111.414 1.414l-2.93 2.93 2.93 2.93a1 1 0 010 1.414z" />
                        </svg>
                    </span>
                </div>
            )}

            <div className="mb-6">
                <div className="mb-4">
                    <p className="text-lg mb-2">Name:</p>
                    <div className="relative">
                        {editing === 'name' ? (
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    name="name"
                                    value={editedUser.name || user.name}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 w-full rounded border focus:ring focus:ring-blue-300 transition duration-300"
                                />
                                <button className="ml-2 text-blue-500" onClick={handleSaveClick}>
                                    Save
                                </button>
                                <button className="ml-2 text-gray-500" onClick={() => setEditing(null)}>
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <p className="py-2 px-4 bg-white rounded border">{user.name}</p>
                                <button className="ml-2 text-blue-500" onClick={() => handleEditField('name')}>
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mb-4 ">
                    <p className="text-lg mb-2">Email:</p>
                    <div className="relative ">
                        {editing === 'email' ? (
                            <div className="flex items-center flex-col">
                                <input
                                    type="email"
                                    name="email"
                                    value={editedUser.email || user.email}
                                    onChange={handleInputChange}
                                    className=" text-cyan-800 px-4 py-2 w-full rounded border focus:ring focus:ring-blue-300 transition duration-300"
                                />
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder="Old Password"
                                    className="px-4 py-2 w-full rounded border focus:ring focus:ring-blue-300 transition duration-300"
                                />
                                <button className="ml-2 text-blue-500" onClick={handleSaveClick}>
                                    Save
                                </button>
                                <button className="ml-2 text-gray-500" onClick={() => setEditing(null)}>
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <p className="py-2 px-4 bg-white rounded border">{user.email}</p>
                                <button className="ml-2 text-blue-500" onClick={() => handleEditField('email')}>
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mb-4">
                    <p className="text-lg mb-2">Password:</p>
                    <div className="relative">
                        {editing === 'password' ? (
                            <div className="flex flex-col">
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="New Password"
                                    className="px-4 py-2 w-full rounded border focus:ring focus:ring-blue-300 transition duration-300 mb-2"
                                />
                                <input
                                    type="password"
                                    name="confirmNewPassword"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    placeholder="Confirm New Password"
                                    className="px-4 py-2 w-full rounded border focus:ring focus:ring-blue-300 transition duration-300 mb-2"
                                />
                                <input
                                    type="password"
                                    name="oldPassword"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    placeholder="Old Password"
                                    className="px-4 py-2 w-full rounded border focus:ring focus:ring-blue-300 transition duration-300 mb-2"
                                />
                                <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600 transition duration-300" onClick={handleSaveClick}>
                                    Save
                                </button>
                                <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition duration-300" onClick={() => setEditing(null)}>
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <p className="py-2 px-4 bg-white rounded border">************</p>
                                <button className="ml-2 text-blue-500" onClick={() => handleEditField('password')}>
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mb-4">
                    <p className="text-lg mb-2">Date of Birth:</p>
                    <div className="relative">
                        {editing === 'DOB' ? (
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    name="DOB"
                                    value={editedUser.DOB || user.DOB}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 w-full rounded border focus:ring focus:ring-blue-300 transition duration-300"
                                />
                                <button className="ml-2 text-blue-500" onClick={handleSaveClick}>
                                    Save
                                </button>
                                <button className="ml-2 text-gray-500" onClick={() => setEditing(null)}>
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <p className="py-2 px-4 bg-white rounded border">{user.DOB}</p>
                                <button className="ml-2 text-blue-500" onClick={() => handleEditField('DOB')}>
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
