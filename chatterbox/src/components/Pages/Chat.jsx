import { useContext, useEffect, useState, useRef } from "react"
import { LeftPanel } from "../ChatComponents/LeftPanel";
import { UserContext } from "../UserContext";
import { ContactPanel } from "../ChatComponents/ContactPanel";
import { ChatPanel } from "../ChatComponents/ChatPanel";
 // import { connectToWS, sendMessage } from "./Axios";
import axios from "axios";
import _ from "lodash";

//TODO fix look into React timeout

export default function Chat(){
    const [ws, setWs] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [offlineUsers,setOfflineUsers] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const {username, id, setId, setUsername} = useContext(UserContext);
    const [isSelectedOnline, setIsSelectedOnline] = useState(true);
    const [selectedUsername, setSelectedUsername] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const messageRef = useRef();

    useEffect(() => {
        connectToWS();
    }, []);

    function connectToWS() {
        const ws = new WebSocket('ws://localhost:4000');
        setWs(ws);
        ws.addEventListener('message', handleMessage);
        ws.addEventListener('close', () => {
            setTimeout(() => {
                console.log('Disconnected. Trying to reconnect');
                connectToWS();
            }, 1000);
        });
    }

    function showOnline(userArray) {
        const users = {};
        userArray.forEach(({userId,username}) => {
            users[userId] = username;
        });
        setOnlineUsers(users);
    }

    function handleMessage(e) {
        const messageData = JSON.parse(e.data);
        console.log(e, messageData);
        if ('online' in messageData) {
            showOnline(messageData.online);
        } else if ('text' in messageData){
            if (messageData.sender === selectedUserId) {
            setMessages(prev => ([...prev, {...messageData}]));
            }
        }
    }

    function sendMessage(e) {
        e.preventDefault();
        console.log('message sent');
        ws.send(JSON.stringify({
            recipient: selectedUserId,
            text: newMessage
        }));
        setNewMessage('');
        setMessages(prev => ([...prev,{
            text: newMessage, 
            sender: id,
            recipient: selectedUserId,
            _id: Date.now()
        }]));
    }
    // create autoscroll
    useEffect(() => {
        const div = messageRef.current;
        if (div){
            div.scrollIntoView({behavior: 'smooth', block: 'end'});
        }
    }, [messages]);

    // determine online and offline users
    useEffect(() => {
        axios.get('/users').then(res => {
          const offlineUsersArr = res.data
            .filter(u => u._id !== id)
            .filter(u => !Object.keys(onlineUsers).includes(u._id));
          const offlineUsers = {};
          offlineUsersArr.forEach(u => {
            offlineUsers[u._id] = u;
          });
          setOfflineUsers(offlineUsers);
        });
      }, [onlineUsers]);


    useEffect(() => {
        if (selectedUserId) {

            axios.get('/messages/' + selectedUserId).then(res => {
                setMessages(res.data);
            })
        }
    }, [selectedUserId]);

    // get list of all users aside from current users
    const onlineUsersNotCurr = {...onlineUsers};
    delete onlineUsersNotCurr[id];
    delete onlineUsersNotCurr['undefined'];

    //avoid displaying duplicate message
    const singleMessage = _.uniqBy(messages, '_id');

    return (
        <div>
            <div className="flex h-screen">
                <LeftPanel ws={ws} username={username} setWs={setWs} setId={setId} setUsername={setUsername} id={id}/>
                <ContactPanel onlineUsersNotCurr={onlineUsersNotCurr} selectedUserId={selectedUserId} setSelectedUserId={setSelectedUserId} offlineUsers={offlineUsers} setSelectedUsername={setSelectedUsername} setIsSelectedOnline={setIsSelectedOnline}/>
                <ChatPanel selectedUserId={selectedUserId} singleMessage={singleMessage} messageRef={messageRef} sendMessage={sendMessage} newMessage={newMessage} setNewMessage={setNewMessage} id={id} selectedUsername={selectedUsername} isSelectedOnline={isSelectedOnline}/>
            </div>
        </div>
    )
}