import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, ChangePasswordFormData } from "@/schemas/authSchema";
import { changeAdminPassword } from "@/features/auth/authApi";
import { useAuthStore } from "@/features/auth/authStore";
import { getDiagnosticErrorMessage } from "@/lib/errorUtils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, ShieldAlert, ArrowRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function ChangePasswordPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<ChangePasswordFormData> = async (formData) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await changeAdminPassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      // Update user state to reflect isFirstLogin = false
      if (user) {
        updateUser({
          ...user,
          isFirstLogin: false,
          firstLogin: false,
        });
      }

      toast.success(t("adminAuth.passwordChangedSuccess"));

      // Redirect to dashboard
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      const msg = getDiagnosticErrorMessage(err, "Failed to change password");
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-slate-800 bg-slate-950 text-slate-100">
        <CardHeader className="space-y-2 text-center pb-6 border-b border-slate-800">
          <div className="mx-auto bg-amber-500/20 text-amber-400 border border-amber-500/30 p-3 rounded-xl w-fit shadow-md mb-1">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl font-black text-white tracking-tight">
            {t("adminAuth.changePassTitle")}
          </CardTitle>
          <CardDescription className="text-xs text-slate-400">
            {t("adminAuth.changePassSubtitle")}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Current/Old Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {t("adminAuth.oldPasswordLabel")} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  {...register("oldPassword")}
                  placeholder="e.g. Admin@12345"
                  className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-900 border rounded-lg text-white shadow-xs focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.oldPassword ? "border-rose-500" : "border-slate-800"
                  }`}
                />
              </div>
              {errors.oldPassword && (
                <p className="text-xs text-rose-400 font-medium">
                  {t(errors.oldPassword.message as string)}
                </p>
              )}
            </div>

            {/* New Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {t("adminAuth.newPasswordLabel")} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  {...register("newPassword")}
                  placeholder="At least 8 characters"
                  className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-900 border rounded-lg text-white shadow-xs focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.newPassword ? "border-rose-500" : "border-slate-800"
                  }`}
                />
              </div>
              {errors.newPassword && (
                <p className="text-xs text-rose-400 font-medium">
                  {t(errors.newPassword.message as string)}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                {t("adminAuth.confirmPasswordLabel")} <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="Re-enter new password"
                  className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-900 border rounded-lg text-white shadow-xs focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.confirmPassword ? "border-rose-500" : "border-slate-800"
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-rose-400 font-medium">
                  {t(errors.confirmPassword.message as string)}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full font-bold bg-amber-600 hover:bg-amber-500 text-white mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                  Updating Password...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {t("adminAuth.updatePasswordButton")}
                  <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ChangePasswordPage;
