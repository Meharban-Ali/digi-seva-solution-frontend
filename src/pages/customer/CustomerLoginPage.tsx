import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { getDiagnosticErrorMessage } from "@/lib/errorUtils";
import { SeoHead } from "@/components/common/SeoHead";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, KeyRound, ArrowRight, ShieldCheck, RefreshCw, User, CheckCircle2 } from "lucide-react";

export function CustomerLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { sendOtp, verifyOtp, isAuthenticated } = useCustomerAuth();

  const [step, setStep] = useState<"EMAIL" | "OTP">("EMAIL");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Resend Countdown
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/customer/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (searchParams.get("reason") === "session_expired") {
      toast.error(t("customerAuth.sessionExpired", "Your session has expired. Please log in again."));
    }
  }, [searchParams, t]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      await sendOtp(email.trim());
      setStep("OTP");
      setCountdown(60);
      toast.success(t("customerAuth.otpSent", "Verification OTP sent to your email address!"));
    } catch (err: unknown) {
      toast.error(getDiagnosticErrorMessage(err, "Failed to send OTP. Please check your email."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;

    setIsLoading(true);
    try {
      await verifyOtp(email.trim(), otpCode.trim(), name.trim() || undefined);
      toast.success(t("customerAuth.loginSuccess", "Logged in successfully!"));
      navigate("/customer/dashboard", { replace: true });
    } catch (err: unknown) {
      toast.error(getDiagnosticErrorMessage(err, "Invalid verification OTP code."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setIsLoading(true);
    try {
      await sendOtp(email.trim());
      setCountdown(60);
      toast.success(t("customerAuth.otpResent", "Fresh verification OTP sent!"));
    } catch (err: unknown) {
      toast.error(getDiagnosticErrorMessage(err, "Failed to resend OTP."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <SeoHead
        title="Customer Login - Digi Seva Solution"
        description="Log in to your Digi Seva Solution customer portal to track appointments, enquiries, and document checklists."
        path="/customer/login"
      />

      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-orange-50 text-[#0B2046] px-3.5 py-1 rounded-full text-xs font-bold border border-orange-200/80 shadow-2xs">
            <ShieldCheck className="h-4 w-4 text-orange-500" />
            <span>Digi Seva Customer Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {step === "EMAIL" ? "Sign In / Register" : "Enter Verification OTP"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {step === "EMAIL"
              ? "Access your appointments, enquiries, and document submission checklist."
              : `We've sent a 6-digit code to ${email}`}
          </p>
        </div>

        <Card className="border border-slate-200/90 shadow-xl bg-white rounded-2xl overflow-hidden">
          <CardHeader className="bg-white text-slate-900 p-6 border-b border-slate-200/80">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-extrabold text-[#0B2046] flex items-center gap-2">
                {step === "EMAIL" ? (
                  <>
                    <Mail className="h-5 w-5 text-orange-500" /> Step 1: Email Address
                  </>
                ) : (
                  <>
                    <KeyRound className="h-5 w-5 text-orange-500" /> Step 2: Verification Code
                  </>
                )}
              </CardTitle>

              {step === "OTP" && (
                <button
                  type="button"
                  onClick={() => setStep("EMAIL")}
                  className="text-xs text-orange-600 hover:text-orange-700 underline font-bold"
                >
                  Change Email
                </button>
              )}
            </div>
            <CardDescription className="text-slate-500 text-xs mt-1">
              Passwordless secure login via email OTP
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 space-y-5">
            {step === "EMAIL" ? (
              <form onSubmit={handleSendOtpSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="customerEmail" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-orange-500" /> Email Address *
                  </label>
                  <input
                    id="customerEmail"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.name@gmail.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="customerName" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-orange-500" /> Full Name (Optional)
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-[11px] text-slate-400">
                    If this is your first time logging in, your name will be saved to your profile.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full font-extrabold bg-accent hover:bg-accent-dark text-white py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Send Login OTP <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="otpInput" className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="h-3.5 w-3.5 text-orange-500" /> 6-Digit OTP Code *
                  </label>
                  <input
                    id="otpInput"
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    className="w-full text-center tracking-[0.4em] font-mono text-xl font-bold py-3 bg-slate-50 border border-slate-300 rounded-xl shadow-2xs focus:outline-none focus:ring-2 focus:ring-orange-500 text-[#0B2046]"
                  />
                  <p className="text-xs text-slate-500 text-center">
                    Check your email inbox or spam folder for the code.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || otpCode.length !== 6}
                  className="w-full font-extrabold bg-accent hover:bg-accent-dark text-white py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Verify Code & Log In <CheckCircle2 className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    disabled={countdown > 0 || isLoading}
                    onClick={handleResendOtp}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline disabled:opacity-50 disabled:no-underline"
                  >
                    {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP Code"}
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-xs text-slate-400">
          🔒 Secure OTP verification. Your data is isolated and protected.
        </div>
      </div>
    </div>
  );
}

export default CustomerLoginPage;
