import { useState, useEffect, useRef } from "react";
import SimplePeer from "simple-peer";
import { useSocket } from "@/hooks/useSocket";
import { useAuthStore } from "@/store/authStore";
import { CallContext } from "./CallContext";
import type { Call, CallContextType } from "./CallContext";

export const CallContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { socket } = useSocket();
    const { user: loggedInUser } = useAuthStore();

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [call, setCall] = useState<Call | null>(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    const [otherUserId, setOtherUserId] = useState<string | null>(null);

    const myVideo = useRef<HTMLVideoElement>(null);
    const userVideo = useRef<HTMLVideoElement>(null);
    const connectionRef = useRef<any>(null);

    // Get user's camera and microphone access on component mount
    useEffect(() => {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((currentStream) => {
            setStream(currentStream);
            if (myVideo.current) {
              myVideo.current.srcObject = currentStream;
            }
          })
          .catch((error) => {
            console.error("Error accessing media devices:", error);
          });
    }, []);

    // Listen for incoming calls
    useEffect(() => {
        if (!socket) return;
        socket.on("incoming-call", ({ from, name, signal }) => {
        setCall({ isReceivingCall: true, from, name, signal });
        setOtherUserId(from);
        });

        socket.on("call-rejected", () => {
          console.log("Call was rejected");
          setCall(null);
          setCallAccepted(false);
          setOtherUserId(null);
          if (connectionRef.current) {
            connectionRef.current.destroy();
            connectionRef.current = null;
          }
        });

        socket.on("call-ended", () => {
        setCallAccepted(false);
        setCall(null);
        setOtherUserId(null);
        if (connectionRef.current) {
            connectionRef.current.destroy();
            connectionRef.current = null;
          }
        });

        return () => {
          socket.off("incoming-call");
          socket.off("call-rejected");
          socket.off("call-ended");
        };
    }, [socket]);

    const callUser = (id: string) => {
        console.log("callUser called with:", id);
        console.log("stream:", stream);
        console.log("SimplePeer:", SimplePeer);

        
        if (!stream || !socket) {
          console.error("No stream available for call");
          return;
        }
        
        setOtherUserId(id);
        socket?.off("call-accepted");

        try {
          const peer = new SimplePeer({
            initiator: true,
            trickle: false,
            stream: stream,
          });
          console.log("Peer created successfully:", peer);
          
          peer.on("signal", (data) => {
        socket?.emit("call-user", {
            recipientId: id,
            signalData: data,
            from: loggedInUser?._id,
            name: loggedInUser?.fullName,
        });
    });
    
    peer.on("stream", (currentStream) => {
        if (userVideo.current) {
            userVideo.current.srcObject = currentStream;
        }
    });
    
    socket?.on("call-accepted", (signal) => {
        setCallAccepted(true);
        peer.signal(signal);
    });
    
    connectionRef.current = peer;
    } catch (error) {
    console.error("Error creating peer:", error);
    }
    };

    const answerCall = () => {
        if (!call || !stream) {
            console.error("No call to answer or stream not available");
            return;
        }

        setCallAccepted(true);

        setOtherUserId(call.from);

        setCall((prev) => (prev ? { ...prev, isReceivingCall: false } : null));
        const peer = new SimplePeer({ initiator: false, trickle: false, stream: stream! });

        peer.on("signal", (data) => {
        socket?.emit("answer-call", { signal: data, to: call!.from });
        });

        peer.on("stream", (currentStream) => {
        if (userVideo.current) {
            userVideo.current.srcObject = currentStream;
        }
        });

        peer.signal(call!.signal);
        connectionRef.current = peer;
    };

    const leaveCall = () => {

      if (connectionRef.current && connectionRef.current.peer) {
        socket?.emit("end-call", {
          to: connectionRef.current.peer,
        });
      } else if (call) {
        socket?.emit("end-call", {
          to: call.from,
        });
      }
      if(otherUserId) {
        socket?.emit("end-call", {
          to: otherUserId,
        });
      }
      setCallAccepted(false);
      setCall(null);
      setOtherUserId(null);
      socket?.off("call-accepted");
      if (connectionRef.current) {
        connectionRef.current.destroy();
        }
        connectionRef.current = null;
    };

    const rejectCall = () => {
      if (call) {
        socket?.emit("call-rejected", {
          to: call.from,
          from: loggedInUser?._id,
        });
      }

      setCall(null);
      setOtherUserId(null);
    };

    const toggleAudio = () => {
      if (stream) {
        setIsMuted((prevIsMuted) => {
          const newMutedState = !prevIsMuted;
          // Update the actual audio track based on the new state.
          stream.getAudioTracks().forEach((track) => {
            track.enabled = !newMutedState;
          });
          return newMutedState;
        });
      }
    };

    const toggleVideo = () => {
      if (stream) {
        setIsVideoOff((prevIsVideoOff) => {
          const newVideoOffState = !prevIsVideoOff;
          // Update the actual video track based on the new state.
          stream.getVideoTracks().forEach((track) => {
            track.enabled = !newVideoOffState;
          });
          return newVideoOffState;
        });
      }
    };

    const contextValue: CallContextType = {
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      callUser,
      answerCall,
      leaveCall,
      rejectCall,
      isMuted,
      isVideoOff,
      toggleAudio,
      toggleVideo,
    };

    return (
        <CallContext.Provider value={contextValue}>
            {children}
        </CallContext.Provider>
    );
};