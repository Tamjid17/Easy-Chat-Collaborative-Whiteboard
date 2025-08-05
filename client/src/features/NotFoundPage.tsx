import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFoundPage = () => {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-customBackground text-center p-4">
        <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-4xl font-bold text-customPrimary mb-2">
            404 - Page Not Found
        </h1>
        <p className="text-muted-foreground mb-6">
            The page you are looking for does not exist.
        </p>
        <Button asChild>
            <Link to="/">Go to Homepage</Link>
        </Button>
        </div>
    );
};

export default NotFoundPage;