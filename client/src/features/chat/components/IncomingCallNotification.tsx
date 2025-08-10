import { useCall } from "@/hooks/useCall";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff } from "lucide-react";

export const IncomingCallNotification = () => {
  const { call, answerCall, rejectCall } = useCall();

  if (!call?.isReceivingCall) return null;

  return (
    <div className="fixed top-5 right-5 bg-card p-4 rounded-lg shadow-lg border z-50 min-w-[280px]">
      <div className="flex flex-col gap-3">
      <p className="text-center">
        <span className="font-bold">{call.name}</span> is calling...
      </p>
      <div className="flex justify-center gap-3">
      <Button
        size="icon"
        className="bg-customAccentOne hover:bg-customAccentOne/90"
        onClick={answerCall}
        >
        <Phone className="h-5 w-5" />
      </Button>

      <Button
        size="icon"
        variant="destructive"
        className="flex item-center gap-2"
        onClick={rejectCall}
      >
        <PhoneOff className="h-5 w-5" />
      </Button>
      </div>
      </div>
    </div>
  );
};
