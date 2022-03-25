import { useHMSActions, useHMSStore, selectIsConnectedToRoom } from "@100mslive/react-sdk";

import { supabase } from "./utils/client";

import Peers from "./components/Peers";
import { useEffect, useState } from "react";

const endpoint = "https://prod-in.100ms.live/hmsapi/omegle.app.100ms.live/"

export const getToken = async (user_id, roomId) => {
    const response = await fetch(`${endpoint}api/token`,
        {
            method: "POST",
            body: JSON.stringify({
                user_id,
                role: "host",
                type: "app",
                room_id: roomId
            })
        }
    );
    const { token } = await response.json();
    return token;
}

function JoinForm() {
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom)

  const [loading, setLoading] = useState(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const leaveRoom = async () => {
        await hmsActions.leave()
        await supabase.rpc('decrement', { x: 1, row_id: localStorage.getItem("columnId") })
    }

    useEffect(() => {
        window.addEventListener("beforeunload", leaveRoom);
        window.addEventListener("unload", leaveRoom);
        return () => {
            window.removeEventListener("beforeunload", leaveRoom);
            window.addEventListener("unload", leaveRoom);
        };
      }, [leaveRoom]);

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
    }

    const handleJoin = async (e) => {
        e.preventDefault();
        setLoading(true)

        getRooms()
    };

  const getRooms = async () => {
      const {data} = await supabase.from("rooms").select().eq('num_in_room', 1)

      if(data.length > 0) {
          JoinRoom(data[0].roomId, data[0].id)
          localStorage.setItem("columnId", data[0].id)
      }
      else {
        const {data} = await supabase.from("rooms").select().eq('num_in_room', 0)
        JoinRoom(data[0].roomId, data[0].id)
      }

      setLoading(false)
  }

  return (
      <div className="w-screen h-screen bg-black">
          {
            isConnected ?
            <Peers setLoading={setLoading} />:
    
            <div className="h-full w-full flex align-center justify-center flex-col">
                <h2 className="text-4xl text-center font-bold text-white">Let's meet in 100ms</h2>
                <button onClick={handleJoin} className="bg-blue-600 max-w-fit mx-auto px-6 py-4 my-8 text-white text-2xl">{loading ? "Loading..." : "Join Room"}</button>
            </div>
          }
      </div>
  );
}

export default JoinForm;