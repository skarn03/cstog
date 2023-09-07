
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../models/AuthContext';
import useFetch from '../../Hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading.';
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [dob, setDOB] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const { sendRequest, isLoading } = useFetch();

    const auth = useContext(AuthContext);

    const navigate = useNavigate();

    // State to hold errors
    const [errors, setErrors] = useState('');
    const handleToggleChange = () => {
        setIsSignUp(!isSignUp);
    };

    const validateEmail = (email) => {
        if (email.length <= 6) {
            setEmailError('Too short');
        } else if (
            !email.match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            )
        ) {
            setEmailError('Missing or invalid Character');
        } else {
            setEmailError('');
            return true;
        }
    };

    const validatePassword = (password) => {
        if (
            !password.match(/^(?=.*[A-Z])(?=.*[!@#$%^&*./])(?=.{8,32})/)
        ) {
            setPasswordError(
                'Atleast One number , special character,  uppercase letter'
            );
        } else {
            setPasswordError('');
            return true;
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        validateEmail(email);
        validatePassword(password);
        const formData = { name, email, password, dob };
        if (isSignUp) {
            // Call the sign-up function here (e.g., signUpUser)
            signUpUser(formData);
        } else {
            // Call the login function here (e.g., loginUser)
            loginUser(formData);
        }
    };

    const signUpUser = async () => {
        try {
            const responseData = await sendRequest(
                process.env.REACT_APP_BACKEND_URL + '/users/signup',
                'POST',
                JSON.stringify({
                    name: name,
                    DOB: dob,
                    email: email,
                    password: password
                }),
                {
                    'Content-Type': 'application/json',
                }

            );
            auth.login(responseData.user.id, responseData.token);
            navigate('/');
        } catch (error) {
            setErrors(error.message || 'An error occurred during Signup');
        }
    };

    const loginUser = async () => {
        // Implement your login logic here
        try {
            const responseData = await sendRequest(
                process.env.REACT_APP_BACKEND_URL + '/users/login',
                'POST',
                JSON.stringify({
                    email: email,
                    password: password
                }),
                {
                    'Content-Type': 'application/json',
                }

            );
            auth.login(responseData.user.id, responseData.token);
            navigate('/');
        } catch (error) {
            setErrors(error.message || 'An error occurred during Signup');
        }

    };
    useEffect(() => {
        // Set overflow to hidden when component mounts
        document.body.style.overflow = 'hidden';

        // Revert overflow to visible when component unmounts
        return () => {
            document.body.style.overflow = 'visible';
        };
    }, []);
    return (
        <div className="min-h-screen flex items-center md:mb-14 justify-center  bg-gray-900 py-0 align-top px-4 sm:px-6 lg:px-8">

            {isLoading &&
                <Loading>

                </Loading>}
            <div className="max-w-md w-full h-full space-y-8 mb-28 md:mb-28">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        {isSignUp ? 'Sign up' : 'Log in'}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {isSignUp && (
                        <div>
                            <label htmlFor="name" className="sr-only">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <p className="text-red-300 mt-4">{emailError}</p>

                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <p className="text-red-300 mt-4">{passwordError}</p>

                    </div>
                    {isSignUp && (
                        <div>
                            <label htmlFor="dob" className="sr-only">
                                Date of Birth
                            </label>
                            <input
                                id="dob"
                                name="dob"
                                type="date"
                                autoComplete="dob"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Date of Birth"
                                value={dob}
                                onChange={(e) => setDOB(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="flex items-center flex-col justify-between">
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {isSignUp ? 'Sign up' : 'Log in'}
                        </button>
                        <button
                            type="button"
                            className=" flex py-4 justify-center pr-5 ml-4 text-lg text-indigo-100 hover:text-indigo-300 focus:outline-none"
                            onClick={handleToggleChange}
                        >
                            {isSignUp ? 'Log in' : 'Sign up'}
                        </button>
                    </div>
                </form>
                {errors && (
                    <p className="text-red-200 text-xl mt-4 flex justify-center ">{errors}</p>
                )}

            </div>
        </div>
    );
};

export default Login;
