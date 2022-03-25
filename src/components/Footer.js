import { selectIsLocalAudioEnabled, selectIsLocalVideoEnabled, useHMSActions, useHMSStore } from '@100mslive/react-sdk';
import React, { useState } from 'react'

import Chat from './Chat';

import { BiMessage } from 'react-icons/bi';
import { BsCameraVideo, BsCameraVideoOff } from 'react-icons/bs';
import { FiMic, FiMicOff } from 'react-icons/fi';
import { GrUpdate } from 'react-icons/gr';
import { MdCallEnd } from 'react-icons/md';
import { supabase } from '../utils/client';
import { getToken } from '../JoinForm';

const Footer = ({ setLoading, setJoining }) => {
    const hmsActions = useHMSActions();
    const audioEnabled = useHMSStore(selectIsLocalAudioEnabled);
    const videoEnabled = useHMSStore(selectIsLocalVideoEnabled);

    const [showChat, setShowChat] = useState(false)

    async function toggleAudio() {
        await hmsActions.setLocalAudioEnabled(!audioEnabled);
    }

    async function toggleVideo() {
        await hmsActions.setLocalVideoEnabled(!videoEnabled);
    }

    async function changeRoom() {
        setJoining(true)
        await hmsActions.leave()
        await supabase.rpc('decrement', { x: 1, row_id: localStorage.getItem("columnId") })
        await getRooms()
    }

    async function leaveRoom() {
        await hmsActions.leave()
        await supabase.rpc('decrement', { x: 1, row_id: localStorage.getItem("columnId") })
    }

    const JoinRoom = async (roomId, id) => {
        const token = await getToken("stranger", roomId);

        hmsActions.join({
        userName: "stranger",
        authToken: token,
        settings: {
            isAudioMuted: true,
            isVideoMuted: true,
        },
        });

        (async function(){
            await supabase.rpc('increment', { x: 1, row_id: id })
        })();

        setJoining(false)
    }

    const getRooms = async () => {
        console.log("here")
        const {data} = await supabase.from("rooms").select().eq('num_in_room', 1)
  
        if(data.length > 1) {
            JoinRoom(data[1].roomId, data[1].id)
            localStorage.setItem("columnId", data[0].id)
        }
        else {
          const {data} = await supabase.from("rooms").select().eq('num_in_room', 0)
          JoinRoom(data[0].roomId, data[0].id)
        }
  
        setLoading(false)
    }

    return (
        <div className='w-full h-[10%] px-4 md:px-12 flex align-center justify-between relative'>
            <div></div>
            <div>
                <button 
                    onClick={() => toggleAudio()} 
                    className={audioEnabled ? 'px-4 py-4 rounded ml-4 text-white' : 'bg-white px-4 py-4 rounded ml-4 text-black'}
                >
                    {audioEnabled ? <FiMic /> : <FiMicOff />}
                </button>

                <button 
                    onClick={() => toggleVideo()} 
                    className={videoEnabled ? 'px-4 py-4 rounded ml-4 text-white' : 'bg-white px-4 py-4 rounded ml-4 text-black'}
                >
                    {videoEnabled ? <BsCameraVideo /> : <BsCameraVideoOff />}
                </button>

                <button 
                    onClick={() => changeRoom()} 
                    className='bg-white px-4 py-4 rounded ml-4 text-black'
                >
                    <GrUpdate className='text-white w-6' />
                </button>
                <button 
                    onClick={() => leaveRoom()} 
                    className='bg-red-600 px-4 py-4 rounded ml-4'
                >
                    <MdCallEnd className='text-white w-6' />
                </button>
            </div>
            <div>
                <button onClick={() => setShowChat(!showChat)} className='px-4 py-4 rounded ml-4 text-white'><BiMessage /></button>
            </div>

            {
                showChat &&
                <Chat />
            }
        </div>
    )
}

export default Footer