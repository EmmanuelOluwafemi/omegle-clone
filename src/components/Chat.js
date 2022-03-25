import { selectHMSMessages, useHMSActions, useHMSStore} from '@100mslive/react-sdk';
import React, { useState } from 'react'

import { AiOutlineSend } from 'react-icons/ai';

const Chat = () => {

    const hmsActions = useHMSActions();
    const storeMessages = useHMSStore(selectHMSMessages);
    const [message, setMessage] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()

        hmsActions.sendBroadcastMessage(message);
        setMessage('');
    }

  return (
    <div className='absolute bottom-full right-7 w-72 h-96 bg-gray-900 rounded shadow-xl p-6 pb-0'>
        {
            storeMessages.length > 0 ?
            <div className='w-full h-5/6 flex flex-col justify-end items-center'>
                {
                    storeMessages.map((message) => (
                        <div className='w-full flex flex-col items-start justify-start mb-4' key={message.id}>
                            <p className={
                                message.senderName === "You" ? 
                                'block w-full text-gray-300 text-sm mb-1 text-right' : 
                                'block w-full text-gray-300 text-sm mb-1 text-left'
                            }>{message.senderName}</p>
                            <p className={
                                message.senderName === "You" ? 
                                'block w-full text-white text-xs mb-1 text-right' : 
                                'block w-full text-white text-xs mb-1 text-left'
                            }>{message.message}</p>
                        </div>
                    ))
                }
            </div>:
            <div className='w-full h-5/6 flex flex-col justify-center items-center'>
                <p className='text-gray-300 text-sm'>There are no messages here.</p>
            </div>
        }

        <form onSubmit={handleSubmit} className='w-full border-t-2 border-gray-700 h-1/6 flex items-center gap-4'>
            <input value={message} onChange={(e) => setMessage(e.target.value)} className='w-full h-full border-none outline-none bg-transparent text-white' placeholder='Write something here' />
            <AiOutlineSend size="1.5rem" className='text-white cursor-pointer' />
        </form>
    </div>
  )
}

export default Chat