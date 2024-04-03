import { useContext, useEffect, useState, useRef } from "react"
import Icon from "./Icon";
import Header from "./Header";
import { UserContext } from "./UserContext";
import axios from "axios";
import _ from "lodash";
import User from "./User";

export default function Chat(){
    const [ws, setWs] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [offlineUsers,setOfflineUsers] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const {username, id} = useContext(UserContext);
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
        } else {
            setMessages(prev => ([...prev, {...messageData}]));
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

    //avoid displaying duplicate message
    const singleMessage = _.uniqBy(messages, '_id');


    return (
        <div>
            <div className="flex h-screen">
                <div className="bg-blue-50 w-1/3">
                    <Header />
                    {Object.keys(onlineUsersNotCurr).map(userId => (
                        <User
                        key={userId}
                        id={userId}
                        online={true}
                        username={onlineUsersNotCurr[userId]}
                        onClick={() => {setSelectedUserId(userId);console.log({userId})}}
                        selected={userId === selectedUserId} />
                    ))}
                    {Object.keys(offlineUsers).map(userId => (
                        <User
                        key={userId}
                        id={userId}
                        online={false}
                        username={offlineUsers[userId].username}
                        onClick={() => setSelectedUserId(userId)}
                        selected={userId === selectedUserId} />
                    ))}
                </div>
                <div className="flex flex-col bg-blue-100 w-2/3 p-2">
                    <div className="flex-grow">
                        {!selectedUserId && (
                            <div className="flex h-full flex-grow items-center justify-center">
                                <div className="text-gray-400"> &larr; Select a user </div>
                            </div>
                        )}
                        {!!selectedUserId && (
                        <div className="relative h-full">
                            <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                                {singleMessage.map(message => (
                                    <div key={message._id} className={`${message.sender === id ? 'text-right' : 'text-left'}`}>
                                        <div className={`inline-block p-2 my-2 rounded-sm text-sm ${message.sender === id ? 'bg-blue-500 text-white' : 'bg-white text-gray-500'}`}>
                                            {message.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messageRef} />
                            </div>
                        </div>
                        )}
                    </div>
                    {!!selectedUserId &&
                        <form className="flex gap-2" onSubmit={sendMessage}>
                            <input type="text" 
                                value={newMessage}
                                onChange={ev => setNewMessage(ev.target.value)}
                                placeholder="type your message here" 
                                className="bg-white flex-grow border rounded-sm p-2"/>
                            <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                            </button>
                        </form>
                        }
                </div>
            </div>
        </div>
    )
}