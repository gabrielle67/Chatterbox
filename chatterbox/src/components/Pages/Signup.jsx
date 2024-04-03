import axios from "axios";
import Header from "../Header";
import { useContext, useState } from "react"
import { UserContext } from "../UserContext";

export default function SignupAndLogin(){
    const[username, setUsername] = useState('');
    const[password, setPassword] = useState('');
    const[IsLoginOrSignUp, setIsLoginOrSignUp] = useState('login')
    const[IsDuplicateUser, setIsDuplicateUser] = useState(false)
    const[IsNotUser, setIsNotUser] = useState(false);
    const {setUsername:setLoggedInUsername, setId} = useContext(UserContext);

    async function handleSubmit(ev){
        ev.preventDefault();
        try{
            const url = IsLoginOrSignUp === 'signup' ? 'signup' : 'login';
            const {data} = await axios.post(url, {username, password});
            console.log(data);
            setLoggedInUsername(username);
            setId(data.id);
        } catch (error) {
            console.log(error);
            if (error.response && error.response.status === 400 && error.response.data.error) {
                setIsDuplicateUser(true);
               console.log('duplicate!');
            } else if (error.response && error.response.status === 404 && error.response.data.error) {
                setIsNotUser(true);
               console.log('user not found!');
            } else {
                // Handle other errors (e.g., network error)
                console.log('Sign up failed. Please try again later.');
        }
    }
}

    return (
        <div className="bg-black-50 h-screen flex flex-col justify-center items-center">
        <Header size="large" />
        <form className="w-64 mx-auto rounded-md mt-9" onSubmit={handleSubmit}>
            <input
                value={username} 
                onChange={e => setUsername(e.target.value)}
                type="text" 
                placeholder="username" 
                className="block w-full rounded-lg p-2 mb-4 border"/>
            <input value={password} 
                onChange={e => setPassword(e.target.value)}
                type="password" 
                placeholder="password" 
                className="block w-full rounded-lg p-2 mb-4 border"/>
            <button className="bg-blue-500 text-white block w-full rounded-lg p-2  mb-2">
                {IsLoginOrSignUp === 'signup' ? 'Sign Up' : 'Login'}
            </button>
            <div className="text-center mt-2">
                {IsLoginOrSignUp === 'signup' && (
                    <div className="mt-4">
                        {IsDuplicateUser === true && (
                            <div>
                                Username already exists!
                            </div>
                        )}
                        Already have an account?{"\n"}
                        <button onClick={() => setIsLoginOrSignUp('login')}>
                            Login here
                        </button> 
                    </div>
                )}
                {IsLoginOrSignUp === 'login' && (
                    <div>
                        <button 
                        onClick={()=> {
                            setUsername("Guest");
                            setPassword("GuestPassword!");
                        }}
                        className="bg-blue-500 text-white block w-full rounded-lg p-2">
                            Use Demo Credentials
                        </button>
                        <div className="mt-4">
                            {IsNotUser === true && (
                                <div>
                                    User Not Found!
                                </div>
                            )}
                            <div>
                                Don't have an account?{"\n"}
                            </div>
                            <button onClick={() => setIsLoginOrSignUp('signup')}>
                                Sign up here
                            </button>
                        </div> 
                    </div>
                )}
            </div>
        </form>
    </div>
    
    )
}