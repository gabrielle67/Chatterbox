import axios from "axios";
import { useContext, useState } from "react"
import { UserContext } from "./UserContext";

export default function SignupAndLogin(){
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[IsLoginOrSignUp, setIsLoginOrSignUp] = useState('signup')
    const {setUsername:setLoggedInUsername, setId} = useContext(UserContext);

    async function handleSubmit(ev){
        ev.preventDefault();
        const url = IsLoginOrSignUp === 'signup' ? 'signup' : 'login';
        const {data} = await axios.post(url, {username, password});
        setLoggedInUsername(username);
        setId(data.id);
    }
    return(
        <div className="bg-blue-50 h-screen flex items-center">
            <form className="w-64 mx-auto mb-12" onSubmit={handleSubmit}>
                <input value={username} 
                    onChange={e => setUsername(e.target.value)}
                    type="text" 
                    placeholder="username" 
                    className="block w-full rounded-sm p-2 mb-2 border"/>
                <input value={password} 
                    onChange={e => setPassword(e.target.value)}
                    type="password" 
                    placeholder="password" 
                    className="block w-full rounded-sm p-2 mb-2 border"/>
                <button className="bg-blue-500 text-white block w-full rounded-sm p-2">
                    {IsLoginOrSignUp === 'signup' ? 'Sign Up' : 'Login'}
                </button>
                <div className="text-center mt-2">
                    {IsLoginOrSignUp === 'signup' && (
                        <div>
                                already have an account? 
                            <button onClick={() => setIsLoginOrSignUp('login')}>
                                Login here
                            </button> 
                        </div>
                    )}
                    {IsLoginOrSignUp === 'login' && (
                        <div>
                            don't have an account?
                        <button onClick={() => setIsLoginOrSignUp('signup')}>
                            Sign up here
                        </button> 
                    </div>
                    )}
                    </div>
            </form>
        </div>
    )
}