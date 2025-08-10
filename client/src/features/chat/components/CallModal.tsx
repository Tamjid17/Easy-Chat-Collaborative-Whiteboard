import { useCall } from "@/hooks/useCall";
import {
  Mic,
  MicOff,
  PhoneOff,
  Video as VideoIcon,
  VideoOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const CallModal = () => {
  const { myVideo, userVideo, callAccepted, leaveCall, stream, isMuted, isVideoOff, toggleAudio, toggleVideo } = useCall();

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="relative w-full h-full">
        {/* My Video */}
        {stream && (
          <video
            ref={myVideo}
            autoPlay
            muted
            className="absolute bottom-4 right-4 w-48 h-auto rounded-lg"
          />
        )}

        {/* Other User's Video */}
        {callAccepted && (
          <video
            ref={userVideo}
            autoPlay
            className="w-full h-full object-cover"
          />
        )}

        {/* Call Controls */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
          <Button
            size="icon"
            className={cn(
              "rounded-full bg-gray-500 hover:bg-gray-600",
              isMuted && "bg-destructive hover:bg-destructive/90"
            )}
            onClick={toggleAudio}
          >
            {isMuted ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>
          <Button
            size="icon"
            onClick={toggleVideo}
            className={cn(
              "rounded-full bg-gray-500 hover:bg-gray-600",
              isVideoOff && "bg-destructive hover:bg-destructive/90"
            )}
          >
            {isVideoOff ? (
              <VideoOff className="h-6 w-6" />
            ) : (
              <VideoIcon className="h-6 w-6" />
            )}
          </Button>
          <Button
            size="icon"
            className="rounded-full bg-destructive hover:bg-destructive/90"
            onClick={leaveCall}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};
