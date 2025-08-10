import { createContext } from "react";

export interface Call {
    isReceivingCall: boolean;
    from: string;
    name: string;
    signal: any;
}

export interface CallContextType {
    call: Call | null;
    callAccepted: boolean;
    myVideo: React.RefObject<HTMLVideoElement | null>;
    userVideo: React.RefObject<HTMLVideoElement | null>;
    stream: MediaStream | null;
    callUser: (id: string) => void;
    answerCall: () => void;
    leaveCall: () => void;
    isMuted: boolean;
    isVideoOff: boolean;
    toggleAudio: () => void;
    toggleVideo: () => void;
}

export const CallContext = createContext<CallContextType | null>(null);
