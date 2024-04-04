import Header from '../Header';
import axios from "axios";

function logout(setWs, setId, setUsername) {
    axios.post('/logout').then(() => {
        setWs(null);
        setId(null);
        setUsername(null);
    });
}

// async function totalMsg(userId) {
//     try {
//         const response = await axios.get(`/messages/total/${userId}`);
//         return response.data.totalMessagesSent;
//     } catch (error) {
//         console.error('Could not fetch total messages', error);
//         return 0;
//     }
// }


export function LeftPanel({ ws, username, setWs, setId, setUsername, id }) {
    
    const handleLogout = () => {
        logout(setWs, setId, setUsername);
    };

    // TODO total messages sent
    // TODO other stats?

    return (
        <div className="flex flex-col bg-[#20857c5c]">
            <div className="flex-grow p-2" >
                <div className="p-2 flex items-center flex-col">
                    <div className="mr-2 text-sm text-gray-300 flex items-center flex-col">
                        <button className="btn" 
                                style={{
                                    backgroundColor: 'transparent',
                                    border: 'none'}}
                                onClick={()=>document.getElementById('my_modal_1').showModal()}>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </div>
                            </button>
                            <dialog id="my_modal_1" className="modal">
                                <div className="modal-box bg-[#051217] w-21">
                                <form method="dialog">
                                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <h3 className="font-bold text-lg">Profile</h3>
                                <div className="py-4">
                                    <div className='pb-2'>
                                        Username: {username}
                                    </div>
                                    {/* <div>
                                        Total Messages Sent: {totalMessagesSent}
                                    </div> */}
                                </div>
                                    <button 
                                        onClick={handleLogout} 
                                        className="btn text-sm bg-[#20857c5c]">
                                            log out
                                    </button>
                                </div>
                                <form method="dialog" className="modal-backdrop">
                                    <button>close</button>
                                </form>
                            </dialog>
                    <div>
                        Profile
                    </div>
                    </div>
                </div>
            </div>
            <div>
                <Header size='small'/>
            </div>
        </div>
    )
}