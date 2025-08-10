import { useCall } from "@/hooks/useCall";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

export const IncomingCallNotification = () => {
  const { call, answerCall } = useCall();

  if (!call?.isReceivingCall) return null;

  return (
    <div className="fixed top-5 right-5 bg-card p-4 rounded-lg shadow-lg flex items-center gap-4 z-50">
      <p>
        <span className="font-bold">{call.name}</span> is calling...
      </p>
      <Button
        size="icon"
        className="bg-customAccentOne hover:bg-customAccentOne/90"
        onClick={answerCall}
      >
        <Phone className="h-5 w-5" />
      </Button>
    </div>
  );
};
