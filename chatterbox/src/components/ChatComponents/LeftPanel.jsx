import Header from '../Header';
import axios from "axios";

function logout(setWs, setId, setUsername) {
    axios.post('/logout').then(() => {
        setWs(null);
        setId(null);
        setUsername(null);
    });
}

export function LeftPanel({ username, setWs, setId, setUsername }) {

    const handleLogout = () => {
        logout(setWs, setId, setUsername);
    };

    // TODO stylize guest and logout button

    return (
        <div className="flex flex-col bg-[#20857c5c]">
            <div className="flex-grow p-2" >
                <div className="p-2 text-center flex items-center flex-col">
                    <span className="mr-2 text-sm text-gray-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                        </svg>
                        {username}
                    </span>
                    <button 
                        onClick={handleLogout} 
                        className="text-sm bg-blue-100 py-1 px-2 text-gray-500 border rounded-sm">
                            log out
                    </button>
                </div>
            </div>
            <div>
                <Header size='small'/>
            </div>
        </div>
    )
}