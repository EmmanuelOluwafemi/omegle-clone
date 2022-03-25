 import React, { useEffect, useRef } from 'react'

 import { useHMSStore, useHMSActions, selectCameraStreamByPeerID } from "@100mslive/react-sdk";

 import { RiShieldUserLine } from 'react-icons/ri';

const Peer = ({peer}) => {
    const videoRef = useRef(null);
    
    const hmsActions = useHMSActions();
    // get the camera track to render
    const videoTrack = useHMSStore(selectCameraStreamByPeerID(peer.id));

    useEffect(() => {
        if (videoRef.current && videoTrack) {
            if (videoTrack?.enabled) {
                hmsActions.attachVideo(videoTrack.id, videoRef.current);
            } else {
                hmsActions.detachVideo(videoTrack.id, videoRef.current);
            }
        }
    }, [videoTrack, hmsActions]);
  return (
    <div className='w-full h-full bg-gray-900 rounded-2xl'>
        {
            !videoTrack?.enabled ?
            <div className='w-full h-full flex items-center justify-center'>
                <RiShieldUserLine size="3rem" className='text-white' />
            </div>
            : <video className='h-full object-cover rounded-2xl' ref={videoRef} autoPlay muted playsInline></video>
        }
    </div>
  )
}

export default Peer