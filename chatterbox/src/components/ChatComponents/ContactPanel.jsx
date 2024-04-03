// TODO Stylize Chats text

import User from "../User";

export function ContactPanel ({ onlineUsersNotCurr, selectedUserId, setSelectedUserId, offlineUsers }) {
    return (
        <div className="bg-[#dbf0e5c3] w-1/3 flex flex-col">
                    <div className="text-black font-bold flex gap-2 p-4">
                        Chats
                    </div>
                    <div className="flex-grow">
                        {Object.keys(onlineUsersNotCurr).map(userId => (
                            <User
                            key={userId}
                            id={userId}
                            online={true}
                            username={onlineUsersNotCurr[userId]}
                            onClick={() => {setSelectedUserId(userId)}}
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
                    <div className="p-2 text-center flex items-center flex-col">
                    </div>
                </div>
    )
}