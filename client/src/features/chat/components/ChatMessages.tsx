
const ChatMessages = () => {
    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg max-w-xs md:max-w-md">
                <p className="text-foreground">How are you?</p>
            </div>
            </div>
            <div className="flex justify-end">
            <div className="bg-customAccentTwo text-white p-3 rounded-lg max-w-xs md:max-w-md">
                <p>I am fine, thanks for asking!</p>
            </div>
            </div>
            <div className="flex justify-start">
            <div className="bg-muted p-3 rounded-lg max-w-xs md:max-w-md">
                <p>What about you?</p>
            </div>
            </div>
            <div className="flex justify-end">
            <div className="bg-customAccentTwo text-white p-3 rounded-lg max-w-xs md:max-w-md">
                <p>Doing great!</p>
            </div>
            </div>
        </div>
    );
}

export default ChatMessages;