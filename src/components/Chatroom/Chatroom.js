import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../models/AuthContext';
import useFetch from '../../Hooks/useFetch';
import { io } from 'socket.io-client';
import Loading from '../Loading/Loading.';
const Chatroom = ({ projectId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const auth = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const { sendRequest, isLoading } = useFetch();
    const [pendingUsers, setPendingUsers] = useState([]);
    const getPendingUsers = async (projectId) => {
        try {
            if (projectId) {
                const response = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + `/projects/getPendingUsers/${projectId}`,
                    'GET',
                    null,
                    {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth.token
                    }
                );



                setPendingUsers(response.pendingUsers);

            }
        } catch (error) {
            console.error("Error fetching pending users:", error);
            // Handle error (e.g., display an error message)
        }
    };
    const handleNewMessageChange = (event) => {
        setNewMessage(event.target.value);
    };

    useEffect(() => {
        const socket = io(process.env.REACT_APP_BACKEND_SOCKET || "http://localhost:5000");

        // Save the socket instance in state
        setSocket(socket);

        // Event handler for receiving messages
        socket.on('receiveMessage', (message) => {
            // Update the messages state with the received message
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        return () => {
            socket.disconnect();
        };
    }, [projectId])
    const handleSendMessage = async () => {
        if (newMessage.trim() !== '') {
            try {
                socket.emit('sendMessage', {
                    roomID: projectId,
                    message: {
                        sender: auth.userID,
                        text: newMessage
                    }
                });
                const response = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + '/message/create',
                    'POST',
                    JSON.stringify({
                        projectID: projectId,
                        sender: auth.userID,
                        text: newMessage,
                    }),
                    {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth.token
                    }
                );

                // Clear the input message
                setNewMessage('');
            } catch (error) {
                // Handle error (e.g., display an error message)
            }
            setMessages([...messages, { text: newMessage, sender: auth.userID }]);
            setNewMessage('');
        }
    };



    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };

    const getMessage = async (projectId) => {
        try {
            if (projectId) {
                const response = await sendRequest(
                    process.env.REACT_APP_BACKEND_URL + `/message/get/${projectId}`,
                    'GET',
                    null,
                    {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth.token
                    }
                );


                if (Array.isArray(response)) {
                    const extractedMessages = response.map((message) => ({
                        key: message._id,
                        sender: message.sender,
                        text: message.text,
                        id: message._id,
                    }));
                    setMessages(extractedMessages);
                } else {
                    console.error("Received response is not an array:", response);
                }
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
            // Handle error (e.g., display an error message)
        }
    };

    useEffect(() => {
        getMessage(projectId);
        getPendingUsers(projectId); // Fetch pending users when component 

        if (socket && projectId) {
            socket.emit('joinRoom', projectId);
        }

        // Clean up the room join when the component unmounts
    }, [projectId, socket]);

    // Scroll to the bottom of the chat area when a new message is added
    useEffect(() => {
        const chatArea = document.getElementById('chat-area');
        chatArea.scrollTop = chatArea.scrollHeight;
    }, [messages]);


    const renderPendingUsersDropdown = () => {
        return (
            <div className="relative mt-2">
                <button
                    onClick={() => {
                        // Toggle visibility of pending users list
                        const dropdown = document.getElementById('pending-users-dropdown');
                        const isOpen = dropdown.style.display === 'block';
                        dropdown.style.display = isOpen ? 'none' : 'block';
                    }}
                    className="text-blue-500 hover:underline cursor-pointer"
                >
                    Show Pending Users
                </button>
                <div
                    id="pending-users-dropdown"
                    className=" bg-slate-400 border border-gray-600 mt-2 rounded-lg shadow-lg p-2 absolute hidden"
                >
                    <p className="font-semibold">Pending Users:</p>
                    <ul>
                        {pendingUsers.map((user) => (
                            <li key={user.id} className="flex items-center justify-between mb-2">
                                <span>{user.name}</span>
                                <div>
                                    <button
                                        className="text-green-500 hover:text-green-700 mr-2"
                                        onClick={() => handleAcceptUser(user._id)}
                                    >
                                        ✓
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => handleRejectUser(user._id)}
                                    >
                                        ✗
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };
    const handleAcceptUser = async (userId) => {
        try {
            // Send a request to accept the user with the provided userId
            const response = await sendRequest(
                process.env.REACT_APP_BACKEND_URL + `/projects/acceptPending/${projectId}/${userId}`,
                'PATCH',
                null,
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );

            // Handle success (e.g., remove user from pendingUsers)
            if (response.message === 'User accepted') {
                setPendingUsers(pendingUsers.filter((user) => user.id !== userId));

                // Close and refresh the dropdown
                const dropdown = document.getElementById('pending-users-dropdown');
                dropdown.style.display = 'none';
                getPendingUsers(projectId); // Refresh pending users
            }
        } catch (error) {
            console.error("Error accepting user:", error);
            // Handle error (e.g., display an error message)
        }
    };

    const handleRejectUser = async (userId) => {
        try {
            // Send a request to reject the user with the provided userId
            const response = await sendRequest(
                process.env.REACT_APP_BACKEND_URL + `/projects/rejectPending/${projectId}/${userId}`,
                'PATCH',
                null,
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            );

            // Handle success (e.g., remove user from pendingUsers)
            if (response.message === 'User rejected') {
                setPendingUsers(pendingUsers.filter((user) => user.id !== userId));

                // Close and refresh the dropdown
                const dropdown = document.getElementById('pending-users-dropdown');
                dropdown.style.display = 'none';
                getPendingUsers(projectId); // Refresh pending users
            }
        } catch (error) {
            console.error("Error rejecting user:", error);
            // Handle error (e.g., display an error message)
        }
    };
    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            {isLoading &&
                <Loading>

                </Loading>}
            {renderPendingUsersDropdown()}

            <div id="chat-area" className="flex-grow  overflow-y-auto">
                <div className="p-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`mb-4 ${message.sender == auth.userID ? 'text-left text-black' : 'text-right'
                                }`}
                        >
                            <div
                                className={`p-2  mr-10 md:mr-0 rounded-lg ${message.sender === 'user'
                                    ? 'bg-gray-300 ml-auto'
                                    : 'bg-gray-400 mr-auto'
                                    }`}
                            >
                                <p className={` break-words ${message.sender == auth.userID ? ' text-[#1B1212]' : ' text-[#301934]'}`}>
                                    {message.text}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="p-4 bg-gray-800">
                <div className="flex">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={handleNewMessageChange}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your message..."
                        className="flex-grow border rounded-l p-2 bg-gray-700 text-white"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-500 text-white px-4 py-2 rounded-r"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>

    );
};

export default Chatroom;
