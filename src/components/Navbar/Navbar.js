import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
const Navbar = ({ handleSidebarToggle }) => {
    const [isMobileDevice, setIsMobileDevice] = useState(false);

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


    return (

        <nav className="bg-gray-950 w-full flex flex-row h-full py-4 pb-0 justify-center md:h-18  md:items-center md:py-4 md:justify-center md:px-5 ">
            {isMobileDevice && ( // Conditionally render the button for mobile devices only
                <button
                    className="content pl-3 pb-3"
                    
                >
                    <label className="checkBox bg-neutral-200 border-cyan-400">
                        <input id="ch1" type="checkbox" onClick={() => {
                        handleSidebarToggle();
                    }}/>
                        <div className="transition"></div>
                    </label>
                </button>
            )}
            <div className="text-white font-bold text-2xl flex pr-4 justify-center md:text-3xl md:justify-center w-full md:w-auto">
                <Link to="/">
                    <div className="flex justify-center ">Cs2Gether</div>
                </Link>
            </div>
        </nav>
    );
};

const DropdownItem = ({ href, children }) => {
    return (
        <li className="hover:bg-gray-600 px-4 py-2 rounded-lg">
            <Link to={href}>{children}</Link>
        </li>
    );
};

export default Navbar;
