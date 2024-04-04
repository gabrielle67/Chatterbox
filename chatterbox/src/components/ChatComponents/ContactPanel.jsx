import User from "../User";

export function ContactPanel ({ onlineUsersNotCurr, selectedUserId, setSelectedUserId, offlineUsers, setSelectedUsername, setIsSelectedOnline }) {
    return (
        <div className="bg-[#dbf0e5c3] w-1/3 flex flex-col ">
                    <div className="text-[#624818] text-2xl font-bold text-center p-3">
                        Chats
                    </div>
                    <div className="overflow-y-scroll">
                    <div className="flex-grow">
                        {Object.keys(onlineUsersNotCurr).map(userId => (
                            <User
                            key={userId}
                            id={userId}
                            online={true}
                            username={onlineUsersNotCurr[userId]}
                            onClick={() => {setSelectedUserId(userId), 
                                            setSelectedUsername(onlineUsersNotCurr[userId]),
                                            setIsSelectedOnline(true)}}
                            selected={userId === selectedUserId} />
                        ))}
                        {Object.keys(offlineUsers).map(userId => (
                            <User
                            key={userId}
                            id={userId}
                            online={false}
                            username={offlineUsers[userId].username}
                            onClick={() => {setSelectedUserId(userId), 
                                            setSelectedUsername(offlineUsers[userId].username),
                                            setIsSelectedOnline(false)}}
                            selected={userId === selectedUserId} />
                        ))}
                    </div>
                    </div>
                </div>
    )
}