import { useContext } from "react";
import SignupAndLogin from "./components/Pages/Signup";
import { UserContext } from "./components/UserContext";
import Chat from "./components/Pages/Chat";

export default function Routes() {
    const {username, id} = useContext(UserContext);

    if(username) {
        return <Chat />
    }
    return(
        <SignupAndLogin />
    )
}