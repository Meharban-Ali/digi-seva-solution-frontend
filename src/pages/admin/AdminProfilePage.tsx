import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema, ChangePasswordFormData } from "@/schemas/authSchema";
import { changeAdminPassword, uploadAdminProfileAvatar, updateAdminProfile } from "@/features/auth/authApi";
import { useAuthStore } from "@/features/auth/authStore";
import { getDiagnosticErrorMessage } from "@/lib/errorUtils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  ShieldCheck,
  Lock,
  ArrowRight,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Camera,
  Upload,
  Loader2,
  Trash2,
} from "lucide-react";
import { AxiosError } from "axios";
import { ApiResponse } from "@/types/api";
import { toast } from "sonner";

export function AdminProfilePage() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (JPEG, PNG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size must be less than 5 MB.");
      return;
    }

    setUploadingImage(true);
    try {
      const updatedUser = await uploadAdminProfileAvatar(file);
      updateUser(updatedUser);
      toast.success("Profile picture updated successfully!");
    } catch (err) {
      const msg = getDiagnosticErrorMessage(err) || "Failed to upload profile picture.";
      toast.error(msg);
    } finally {
      setUploadingImage(false);
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  const handleRemovePhoto = async () => {
    if (!user?.profileImageUrl) return;

    setUploadingImage(true);
    try {
      const updatedUser = await updateAdminProfile({ profileImageUrl: "" });
      updateUser(updatedUser);
      toast.success("Profile picture removed successfully!");
    } catch (err) {
      const msg = getDiagnosticErrorMessage(err) || "Failed to remove profile picture.";
      toast.error(msg);
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmit: SubmitHandler<ChangePasswordFormData> = async (formData) => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const message = await changeAdminPassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });

      if (user && (user.isFirstLogin || user.firstLogin)) {
        updateUser({
          ...user,
          isFirstLogin: false,
          firstLogin: false,
        });
      }

      const msg = message || t("adminAuth.passwordChangedSuccess");
      setSuccessMessage(msg);
      toast.success(msg);
      reset();
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse<unknown>>;
      const msg =
        axiosErr.response?.data?.message ||
        getDiagnosticErrorMessage(err) ||
        "Failed to change password. Please check your current password.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input for Avatar Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <User className="h-6 w-6 text-primary" />
          {t("adminProfile.title")}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t("adminProfile.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Interactive Profile & Photo Details Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="bg-slate-900 text-white p-5 pb-6">
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
                {/* Interactive Avatar Container with Camera Hover Overlay */}
                <div className="relative group shrink-0">
                  <div className="h-20 w-20 rounded-full border-2 border-white/80 shadow-lg overflow-hidden bg-primary flex items-center justify-center relative">
                    {user?.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user?.fullName || "Admin Profile"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="font-black text-white text-2xl">
                        {user?.fullName?.charAt(0) || "A"}
                      </span>
                    )}

                    {/* Loading Overlay */}
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Camera Icon Overlay Trigger */}
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    disabled={uploadingImage}
                    aria-label="Upload profile picture"
                    title="Upload profile picture"
                    className="absolute bottom-0 right-0 p-1.5 rounded-full bg-accent hover:bg-accent-dark text-white shadow-md border-2 border-slate-900 transition-transform group-hover:scale-110 focus:outline-none"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="min-w-0">
                  <CardTitle className="text-base font-bold text-white leading-snug truncate">
                    {user?.fullName || "Partner Admin"}
                  </CardTitle>
                  <p className="text-xs text-slate-400 font-mono truncate">{user?.email}</p>
                  
                  {/* Photo Actions */}
                  <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-2">
                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      disabled={uploadingImage}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-300 hover:text-white transition-colors"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{user?.profileImageUrl ? "Change Photo" : "Upload Photo"}</span>
                    </button>

                    {user?.profileImageUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        disabled={uploadingImage}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 transition-colors ml-2"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t("adminProfile.fullNameLabel")}
                </span>
                <p className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  {user?.fullName || "Operating Partner"}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t("adminProfile.emailLabel")}
                </span>
                <p className="font-semibold text-slate-800 text-sm flex items-center gap-2 font-mono">
                  <Mail className="h-4 w-4 text-primary" />
                  {user?.email}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t("adminProfile.roleLabel")}
                </span>
                <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-bold text-xs mt-1">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  {t("adminProfile.roleValue")}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Password Rotation Form */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="border-b border-slate-100 p-5 sm:p-6">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <KeyRound className="h-5 w-5 text-primary" />
                <span>{t("adminProfile.securityCardTitle")}</span>
              </div>
              <CardDescription className="text-xs text-slate-500">
                {t("adminProfile.securityCardSubtitle")}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 sm:p-6 space-y-4">
              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Success Banner */}
              {successMessage && (
                <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Current/Old Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {t("adminAuth.oldPasswordLabel")} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      {...register("oldPassword")}
                      placeholder="Enter current password"
                      className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border rounded-lg text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.oldPassword ? "border-rose-500" : "border-slate-300"
                      }`}
                    />
                  </div>
                  {errors.oldPassword && (
                    <p className="text-xs text-rose-600 font-medium">
                      {t(errors.oldPassword.message as string)}
                    </p>
                  )}
                </div>

                {/* New Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {t("adminAuth.newPasswordLabel")} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      {...register("newPassword")}
                      placeholder="At least 8 characters (uppercase, lowercase, number)"
                      className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border rounded-lg text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.newPassword ? "border-rose-500" : "border-slate-300"
                      }`}
                    />
                  </div>
                  {errors.newPassword && (
                    <p className="text-xs text-rose-600 font-medium">
                      {t(errors.newPassword.message as string)}
                    </p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    {t("adminAuth.confirmPasswordLabel")} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      {...register("confirmPassword")}
                      placeholder="Re-enter new password"
                      className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border rounded-lg text-slate-900 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.confirmPassword ? "border-rose-500" : "border-slate-300"
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-rose-600 font-medium">
                      {t(errors.confirmPassword.message as string)}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="font-bold bg-primary hover:bg-primary/90 text-white"
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
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AdminProfilePage;
