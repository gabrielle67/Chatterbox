import { useContext } from "react";
import { UserContext } from "./context/UserContext";
import Chat from "./pages/Chat";
import SignupAndLogin from "./pages/Signup";

export default function Routes() {
    const {username, id} = useContext(UserContext);

    if(username) {
        return <Chat />
    }
    return(
        <SignupAndLogin />
    )
}