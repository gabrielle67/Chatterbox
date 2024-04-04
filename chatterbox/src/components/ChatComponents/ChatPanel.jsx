export function ChatPanel({ selectedUserId, singleMessage, messageRef, sendMessage, newMessage, setNewMessage, id, selectedUsername, isSelectedOnline }) {

    const status = isSelectedOnline === true ? 'online' : 'offline';
    return(
        <div className="flex flex-col w-2/3">
                <div className="bg-[#dbf0e5c3] flex-row p-2">
                    <div className="text-black flex-col">
                        <div>
                            {selectedUsername}
                        </div>
                        
                        <div className="text-xs italic">
                            {selectedUsername !== null ? status : ''}
                        </div>
                    </div>
                </div>
                    <div className="flex-grow p-2 bg-blue-100">
                        {!selectedUserId && (
                            <div className="flex h-full flex-grow items-center justify-center">
                                <div className="text-gray-400"> &larr; Select a user </div>
                            </div>
                        )}
                        {!!selectedUserId && (
                        <div className="relative h-full">
                            <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                                {singleMessage.map(message => (
                                    <div key={message._id} className={`${message.sender === id ? 'chat chat-end' : 'chat chat-start'}`}>
                                        <div className={`chat-bubble ${message.sender === id ? 'bg-[#20857C] text-white' : 'bg-gray-200 text-gray-500'}`}>
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
                        <form className="flex gap-2 p-2 text-black bg-blue-100" onSubmit={sendMessage}>
                            <input type="text" 
                                value={newMessage}
                                onChange={ev => setNewMessage(ev.target.value)}
                                placeholder="type your message here" 
                                className="bg-white flex-grow border rounded-md p-2"/>
                            <button type="submit" className="bg-[#dbf0e5] p-2 text-black rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                            </button>
                        </form>
                        }
                </div>
    )
}
