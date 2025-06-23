"use client";

import { useRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabaseClient } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SignUp: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    console.log(email);
    console.log(password);

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast(`${error.message}`);
    } else {
      toast(`Confirmation link was sent to ${data.user?.email}`);
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-none border-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Sign up
          </CardTitle>
          <CardDescription className="text-center">
            Enter email and password to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                ref={emailRef}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-primary">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  ref={passwordRef}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>

            <Button type="submit" className="bg-primary w-full text-white">
              Sign up
            </Button>

            <Separator />

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="px-0 font-normal text-primary">
                Log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;
