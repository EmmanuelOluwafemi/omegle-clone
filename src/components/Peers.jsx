import { selectPeers, useHMSActions, useHMSStore } from '@100mslive/react-sdk';
import React, { useState } from 'react'

import { MdOutlineCallEnd } from 'react-icons/md';
import { supabase } from '../utils/client';
import Footer from './Footer';
import Peer from './Peer'

const Peers = ({ setLoading }) => {
    const [joining, setJoining] = useState(false)
    const peers = useHMSStore(selectPeers);
    const hmsActions = useHMSActions();

    async function leaveRoom() {
        await hmsActions.leave()
        await supabase.rpc('decrement', { x: 1, row_id: localStorage.getItem("columnId") })
    }
    
  return (
      <>
          {
              peers.length === 1 || joining ?
              <div className='bg-black w-full h-full flex items-center justify-center'>
                <p className='text-3xl text-white text-center'>Looking for peer...</p>
                <button 
                    onClick={() => leaveRoom()} 
                    className='bg-red-600 px-4 py-4 rounded ml-4'
                >
                    <MdOutlineCallEnd className='text-white w-6' />
                </button>
              </div>:
              <div className='w-full h-full relative flex flex-col'>
                  {/* tiles */}
                  <div className='w-full h-[90%] flex flex-1 flex-col md:flex-row px-9 md:px-24 py-12 gap-4'>
                      {
                          peers
                          .map((peer) => (
                              <Peer peer={peer} key={peer.id} />
                          ))
                      }
                  </div>
      
                  {/* footer */}
                  <Footer setLoading={setLoading} setJoining={setJoining} />
              </div>
          }
        </>
    )
}

export default Peers