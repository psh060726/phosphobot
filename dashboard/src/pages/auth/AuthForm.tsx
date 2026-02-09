import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { type FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // 페이지 제목
  const getTitle = () => {
    if (location.pathname.includes("sign-in")) {
      return "Sign in to Roboseasy";
    }
    if (location.pathname.includes("sign-up")) {
      return "Create your Roboseasy account";
    }
    return "Welcome to Roboseasy";
  };

  const getSubtitle = () => {
    if (location.pathname.includes("sign-up")) {
      return "Create an account to control robots and train AI easily.";
    }
    return "Easy robot control & AI training platform.";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast.error("Email and password are required.");
      setIsLoading(false);
      return;
    }

    try {
      if (location.pathname.includes("sign-up")) {
        await signup(email, password);
        toast.success(
          "Account created! Please check your email for the confirmation code.",
        );
        navigate(`/sign-up/confirm?email=${encodeURIComponent(email)}`, {
          replace: true,
        });
        return;
      }

      if (location.pathname.includes("sign-in")) {
        await login(email, password);
        toast.success("Welcome back to Roboseasy!");
        navigate(from, { replace: true });
        return;
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-purple-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          {/* 브랜드 */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-purple-700">
              Roboseasy
            </h1>
            <p className="text-sm text-muted-foreground">
              {getSubtitle()}
            </p>
          </div>

          {/* 페이지 제목 */}
          <CardTitle className="text-center text-xl font-semibold pt-4">
            {getTitle()}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              disabled={isLoading}
            />

            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>

          <div className="mt-4 space-y-2 text-center text-sm text-muted-foreground">
            <a
              href="/auth/forgot-password"
              className="underline hover:text-purple-600"
            >
              Forgot password?
            </a>

            <div>
              {location.pathname.includes("sign-in")
                ? "Don't have an account?"
                : "Already have an account?"}{" "}
              <a
                href={
                  location.pathname.includes("sign-in")
                    ? "/sign-up"
                    : "/sign-in"
                }
                className="underline hover:text-purple-600"
              >
                {location.pathname.includes("sign-in")
                  ? "Sign up"
                  : "Sign in"}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
