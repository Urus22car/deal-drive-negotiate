import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Car } from "lucide-react";
import { toast } from "sonner";

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

  const handleSendSignInOtp = () => {
    if (!signInData.phone || signInData.phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setSignInOtpSent(true);
    toast.success("OTP sent to your phone!");
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signInData.phone || !signInData.otp) {
      toast.error("Please fill in all fields");
      return;
    }

    if (signInData.otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    toast.success("Welcome back!");
    navigate("/");
  };

  const handleSendSignUpOtp = () => {
    if (!signUpData.name || !signUpData.phone || signUpData.phone.length < 10) {
      toast.error("Please enter name and valid phone number");
      return;
    }
    setSignUpOtpSent(true);
    toast.success("OTP sent to your phone!");
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signUpData.name || !signUpData.phone || !signUpData.otp) {
      toast.error("Please fill in all fields");
      return;
    }

    if (signUpData.otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    toast.success("Account created successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Car className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="text-3xl font-bold">AutoDeal</span>
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
                    placeholder="+91 XXXXXXXXXX"
                    value={signInData.phone}
                    onChange={(e) => setSignInData({ ...signInData, phone: e.target.value })}
                    required
                    disabled={signInOtpSent}
                  />
                </div>
                {!signInOtpSent ? (
                  <Button type="button" onClick={handleSendSignInOtp} className="w-full" size="lg">
                    Send OTP
                  </Button>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="signin-otp">Enter OTP</Label>
                      <div className="flex justify-center mt-2">
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
                    <Button type="submit" className="w-full" size="lg">
                      Verify & Sign In
                    </Button>
                  </>
                )}
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signUpData.name}
                    onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                    required
                    disabled={signUpOtpSent}
                  />
                </div>
                <div>
                  <Label htmlFor="signup-phone">Phone Number</Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="+91 XXXXXXXXXX"
                    value={signUpData.phone}
                    onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                    required
                    disabled={signUpOtpSent}
                  />
                </div>
                {!signUpOtpSent ? (
                  <Button type="button" onClick={handleSendSignUpOtp} className="w-full" size="lg">
                    Send OTP
                  </Button>
                ) : (
                  <>
                    <div>
                      <Label htmlFor="signup-otp">Enter OTP</Label>
                      <div className="flex justify-center mt-2">
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
                    <Button type="submit" className="w-full" size="lg">
                      Verify & Create Account
                    </Button>
                  </>
                )}
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              className="text-sm"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
