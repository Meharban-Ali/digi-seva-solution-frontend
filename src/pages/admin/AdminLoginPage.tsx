import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, otpSchema, LoginFormData, OtpFormData } from "@/schemas/authSchema";
import { initiateAdminLogin, verifyAdminOtp } from "@/features/auth/authApi";
import { useAuthStore } from "@/features/auth/authStore";
import { getDiagnosticErrorMessage } from "@/lib/errorUtils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Lock, Mail, KeyRound, ArrowRight, AlertCircle, ArrowLeft, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { LoginBackground } from "@/components/auth/LoginBackground";

export function AdminLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [step, setStep] = useState<1 | 2>(1);
  const [userEmail, setUserEmail] = useState("");
  const [credentialsCache, setCredentialsCache] = useState<LoginFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [otpSentNotice, setOtpSentNotice] = useState<string | null>(null);
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(60);

  // Check URL reason parameter (e.g. idle_timeout, session_expired)
  useEffect(() => {
    const reason = searchParams.get("reason");
    if (reason === "inactivity" || reason === "idle_timeout") {
      setErrorMessage(t("idleTimeout.loggedOutMessage", "You were logged out due to inactivity."));
    } else if (reason === "session_expired") {
      setErrorMessage("Your session expired or became invalid. Please login again.");
    }
  }, [searchParams, t]);

  // 60-second visual cooldown timer for Resend OTP
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (step === 2 && cooldownSeconds > 0) {
      timer = setInterval(() => {
        setCooldownSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, cooldownSeconds]);

  // Form for Step 1 (Email & Password)
  const step1Form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Form for Step 2 (OTP Code)
  const step2Form = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otpCode: "",
    },
  });

  const [lastFailedStep, setLastFailedStep] = useState<1 | 2 | null>(null);

  // Submit Step 1: Initiate Login
  const onStep1Submit: SubmitHandler<LoginFormData> = async (formData) => {
    setLoading(true);
    setErrorMessage(null);
    setLastFailedStep(null);
    try {
      const msg = await initiateAdminLogin(formData);
      setUserEmail(formData.email);
      setCredentialsCache(formData);
      setOtpSentNotice(msg || "OTP sent to registered email address.");
      setCooldownSeconds(60);
      setStep(2);
    } catch (err) {
      setLastFailedStep(1);
      setErrorMessage(getDiagnosticErrorMessage(err, "Invalid email or password"));
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Action
  const handleResendOtp = async () => {
    if (cooldownSeconds > 0 || !credentialsCache || resendLoading) return;
    setResendLoading(true);
    setErrorMessage(null);
    try {
      const msg = await initiateAdminLogin(credentialsCache);
      const successMsg = msg || t("adminAuth.otpResentSuccess");
      setOtpSentNotice(successMsg);
      setCooldownSeconds(60);
      toast.success(successMsg);
    } catch (err) {
      const msg = getDiagnosticErrorMessage(err, "Failed to resend OTP");
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setResendLoading(false);
    }
  };

  // Submit Step 2: Verify OTP
  const onStep2Submit: SubmitHandler<OtpFormData> = async (formData) => {
    setLoading(true);
    setErrorMessage(null);
    setLastFailedStep(null);
    try {
      const authData = await verifyAdminOtp({
        email: userEmail,
        otpCode: formData.otpCode,
      });

      const token = authData.accessToken || authData.token || "";
      const user = authData.user || authData.adminUser;

      if (!token || !user) {
        throw new Error("Invalid response received from authentication server.");
      }

      // Save token and user in Zustand + localStorage
      setAuth(token, user);

      // Trigger success toast
      toast.success(t("adminAuth.loginSuccess", { name: user.fullName || "Partner" }));

      // Mandatory password change check for seeded/first-login admins
      const isFirstLogin = user.isFirstLogin ?? user.firstLogin ?? false;
      if (isFirstLogin) {
        navigate("/admin/change-password", { replace: true });
      } else {
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (err) {
      setLastFailedStep(2);
      const msg = getDiagnosticErrorMessage(err, "Invalid or expired OTP code");
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleRetrySubmit = () => {
    if (lastFailedStep === 1) {
      step1Form.handleSubmit(onStep1Submit)();
    } else if (lastFailedStep === 2) {
      step2Form.handleSubmit(onStep2Submit)();
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex items-center justify-center p-4 overflow-hidden selection:bg-accent selection:text-white">
      {/* Background Component Layer in src/components/auth/LoginBackground.tsx */}
      <LoginBackground />

      {/* Card Container with Traveling Light Border Effect & Ambient Glow */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-500 group">
        {/* Soft Ambient Background Glow (Pulses gently) */}
        <div className="absolute -inset-1 rounded-[1.4rem] bg-gradient-to-r from-accent/30 via-amber-500/20 to-accent-dark/30 blur-xl opacity-70 animate-pulse motion-reduce:animate-none -z-10" />

        {/* Traveling Light Border Outer Frame */}
        <div className="relative p-[1.5px] rounded-[1.25rem] overflow-hidden bg-slate-800/80 shadow-2xl">
          {/* Animated Rotating Conic-Gradient Light Beam */}
          <div
            aria-hidden="true"
            className="absolute inset-[-150%] animate-[spin_7s_linear_infinite] motion-reduce:animate-none bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0deg,transparent_270deg,#F95700_320deg,#F59E0B_345deg,#F95700_360deg)] opacity-90 pointer-events-none"
          />

          {/* Inner Card Content */}
          <Card className="w-full border-0 bg-slate-900/95 backdrop-blur-xl text-slate-100 relative z-10 rounded-[1.15rem]">
            {/* Accent Top Highlight Bar */}
            <div className="h-1 w-full bg-gradient-to-r from-accent via-amber-400 to-accent-dark" />

            <CardHeader className="space-y-2 text-center pb-6 border-b border-slate-800/80">
              <div className="mx-auto bg-accent text-white p-3 rounded-xl w-fit shadow-lg shadow-accent/20 mb-1 ring-1 ring-white/10">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <CardTitle className="text-2xl font-black text-white tracking-tight">
                {t("adminAuth.title")}
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                {t("adminAuth.subtitle")}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Error Banner Display with Try Again Retry Button */}
              {errorMessage && (
                <div className="p-3.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-200 text-xs space-y-2 animate-in fade-in">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="flex-1 leading-relaxed">{errorMessage}</span>
                  </div>
                  {lastFailedStep && (
                    <div className="pl-6 pt-0.5">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleRetrySubmit}
                        disabled={loading}
                        className="text-xs py-1 h-7 border-rose-700 text-rose-200 hover:bg-rose-900/80 font-bold flex items-center gap-1.5"
                      >
                        <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
                        <span>{loading ? t("errors.retrying", "Retrying...") : t("errors.tryAgain", "Try Again")}</span>
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 1: Credential Input Form */}
              {step === 1 ? (
                <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-4">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {t("adminAuth.step1Title")}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      {t("adminAuth.emailLabel")}
                    </label>
                    <div className="relative">
                      <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        {...step1Form.register("email")}
                        placeholder={t("adminAuth.emailPlaceholder")}
                        className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-950/80 border rounded-lg text-white shadow-xs focus:outline-none focus:ring-2 focus:ring-accent ${
                          step1Form.formState.errors.email ? "border-rose-500" : "border-slate-800"
                        }`}
                      />
                    </div>
                    {step1Form.formState.errors.email && (
                      <p className="text-xs text-rose-400 font-medium">
                        {t(step1Form.formState.errors.email.message as string)}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      {t("adminAuth.passwordLabel")}
                    </label>
                    <div className="relative">
                      <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="password"
                        {...step1Form.register("password")}
                        placeholder={t("adminAuth.passwordPlaceholder")}
                        className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-950/80 border rounded-lg text-white shadow-xs focus:outline-none focus:ring-2 focus:ring-accent ${
                          step1Form.formState.errors.password ? "border-rose-500" : "border-slate-800"
                        }`}
                      />
                    </div>
                    {step1Form.formState.errors.password && (
                      <p className="text-xs text-rose-400 font-medium">
                        {t(step1Form.formState.errors.password.message as string)}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full font-bold bg-accent hover:bg-accent-dark text-white mt-2 shadow-md transition-all duration-200"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                        Validating...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {t("adminAuth.loginButton")}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </form>
              ) : (
                /* Step 2: OTP Verification Form */
                <form onSubmit={step2Form.handleSubmit(onStep2Submit)} className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span>{t("adminAuth.step2Title")}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setErrorMessage(null);
                      }}
                      className="text-xs text-primary-light hover:underline flex items-center gap-1 font-semibold capitalize"
                    >
                      <ArrowLeft className="h-3 w-3" />
                      {t("adminAuth.backToStep1")}
                    </button>
                  </div>

                  {otpSentNotice && (
                    <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{otpSentNotice}</span>
                    </div>
                  )}

                  {/* OTP Field with strict non-autofill attributes */}
                  <div className="space-y-1.5">
                    <label htmlFor="otpCode" className="text-xs font-semibold text-slate-300">
                      {t("adminAuth.otpLabel")}
                    </label>
                    <div className="relative">
                      <KeyRound className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        id="otpCode"
                        type="tel"
                        maxLength={6}
                        autoComplete="one-time-code"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        {...step2Form.register("otpCode")}
                        placeholder={t("adminAuth.otpPlaceholder")}
                        className={`w-full pl-9 pr-3.5 py-2 text-base font-mono tracking-widest text-center bg-slate-950/80 border rounded-lg text-white shadow-xs focus:outline-none focus:ring-2 focus:ring-primary ${
                          step2Form.formState.errors.otpCode ? "border-rose-500" : "border-slate-800"
                        }`}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-400">{t("adminAuth.otpHint")}</span>
                      {/* Resend OTP Button & Cooldown */}
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={cooldownSeconds > 0 || resendLoading}
                        className={`font-bold flex items-center gap-1.5 transition-colors ${
                          cooldownSeconds > 0 || resendLoading
                            ? "text-slate-500 cursor-not-allowed"
                            : "text-primary-light hover:text-white underline cursor-pointer"
                        }`}
                      >
                        <RefreshCw className={`h-3 w-3 ${resendLoading ? "animate-spin" : ""}`} />
                        {cooldownSeconds > 0
                          ? t("adminAuth.resendOtpIn", { seconds: cooldownSeconds })
                          : t("adminAuth.resendOtp")}
                      </button>
                    </div>

                    {step2Form.formState.errors.otpCode && (
                      <p className="text-xs text-rose-400 font-medium">
                        {t(step2Form.formState.errors.otpCode.message as string)}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full font-bold bg-emerald-600 hover:bg-emerald-500 text-white mt-2 shadow-md transition-all duration-200"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                        Verifying OTP...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        {t("adminAuth.verifyOtpButton")}
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginPage;
