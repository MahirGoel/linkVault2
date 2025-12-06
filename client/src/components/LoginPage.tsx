import { Link as LinkIcon } from "lucide-react";
import { SiGoogle } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export function LoginPage() {
  const { login } = useAuth();

  const handleGoogleLogin = () => {
    // todo: replace with real Google OAuth
    login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
            <LinkIcon className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold">Welcome to LinkVault</h1>
          <p className="text-muted-foreground mt-2">
            Save, organize, and share your links
          </p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-12 gap-3"
            onClick={handleGoogleLogin}
            data-testid="button-google-login"
          >
            <SiGoogle className="w-5 h-5" />
            Continue with Google
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </Card>
    </div>
  );
}
