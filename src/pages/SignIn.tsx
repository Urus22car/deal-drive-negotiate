import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/autobargain-logo.png";

const SignIn = () => {
  const navigate = useNavigate();
  const [signInData, setSignInData] = useState({
    phone: "",
    otp: ""
  });
  const [signUpData, setSignUpData] = useState({
    name: "",
    phone: "",
    otp: ""
  });
  const [signInOtpSent, setSignInOtpSent] = useState(false);
  const [signUpOtpSent, setSignUpOtpSent] = useState(false);

  const handleSendSignInOtp = async () => {
    if (!signInData.phone || signInData.phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: signInData.phone,
      });

      if (error) throw error;
      
      setSignInOtpSent(true);
      toast.success("OTP sent to your phone!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signInData.phone || !signInData.otp) {
      toast.error("Please fill in all fields");
      return;
    }

    if (signInData.otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: signInData.phone,
        token: signInData.otp,
        type: 'sms'
      });

      if (error) throw error;

      toast.success("Welcome back!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP");
    }
  };

  const handleSendSignUpOtp = async () => {
    if (!signUpData.name || !signUpData.phone || signUpData.phone.length < 10) {
      toast.error("Please enter name and valid phone number");
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: signUpData.phone,
        options: {
          data: {
            name: signUpData.name
          }
        }
      });

      if (error) throw error;

      setSignUpOtpSent(true);
      toast.success("OTP sent to your phone!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send OTP");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signUpData.name || !signUpData.phone || !signUpData.otp) {
      toast.error("Please fill in all fields");
      return;
    }

    if (signUpData.otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: signUpData.phone,
        token: signUpData.otp,
        type: 'sms'
      });

      if (error) throw error;

      toast.success("Account created successfully!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4 justify-center">
            <img src={logo} alt="AutoBargain" className="h-16" />
          </div>
          <p className="text-muted-foreground">Your trusted car marketplace</p>
        </div>

        <Card className="p-6">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <Label htmlFor="signin-phone">Phone Number</Label>
                  <Input
                    id="signin-phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={signInData.phone}
                    onChange={(e) => setSignInData({ ...signInData, phone: e.target.value })}
                    disabled={signInOtpSent}
                    required
                  />
                </div>

                {!signInOtpSent ? (
                  <Button 
                    type="button" 
                    className="w-full" 
                    onClick={handleSendSignInOtp}
                  >
                    Send OTP
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="signin-otp">Enter OTP</Label>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={signInData.otp}
                          onChange={(value) => setSignInData({ ...signInData, otp: value })}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Verify & Sign In
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        setSignInOtpSent(false);
                        setSignInData({ ...signInData, otp: "" });
                      }}
                    >
                      Change Phone Number
                    </Button>
                  </>
                )}
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name">Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signUpData.name}
                    onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                    disabled={signUpOtpSent}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="signup-phone">Phone Number</Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={signUpData.phone}
                    onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                    disabled={signUpOtpSent}
                    required
                  />
                </div>

                {!signUpOtpSent ? (
                  <Button 
                    type="button" 
                    className="w-full"
                    onClick={handleSendSignUpOtp}
                  >
                    Send OTP
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="signup-otp">Enter OTP</Label>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={signUpData.otp}
                          onChange={(value) => setSignUpData({ ...signUpData, otp: value })}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Verify & Sign Up
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        setSignUpOtpSent(false);
                        setSignUpData({ ...signUpData, otp: "" });
                      }}
                    >
                      Change Phone Number
                    </Button>
                  </>
                )}
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
