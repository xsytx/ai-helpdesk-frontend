import { clearPending, delay, updatePassword } from "@/features/auth/demoAuth";
import { useAuth } from "@/app/AuthContext";
import { useLocale } from "@/i18n/LocaleContext";
import { AuthLayout } from "@/shared/layout/AuthLayout";
import { Button } from "@/shared/ui/Button";
import { PasswordField } from "@/shared/ui/PasswordField";
import { FormEvent, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

export function ResetPasswordPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { email?: string; verified?: boolean } | null;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordError, setPasswordError] = useState<string>();
  const [confirmError, setConfirmError] = useState<string>();
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!state?.email || !state.verified) {
    return <Navigate to="/forgot-password" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setPasswordError(undefined);
    setConfirmError(undefined);
    if (password.length < 6) {
      setPasswordError(t("passwordTooShort"));
      return;
    }
    if (password !== confirm) {
      setConfirmError(t("passwordsDoNotMatch"));
      return;
    }
    setLoading(true);
    try {
      await delay();
      updatePassword(state.email!, password);
      clearPending();
      navigate("/login", { state: { notice: t("passwordUpdated") } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="mb-2 text-2xl font-bold text-primary">{t("resetPasswordTitle")}</h1>
      <p className="mb-6 text-sm text-label">{t("resetPasswordSubtitle")}</p>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <PasswordField
          id="new-password"
          label={t("newPassword")}
          name="new-password"
          autoComplete="new-password"
          placeholder={t("passwordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={passwordError}
        />
        <PasswordField
          id="confirm-password"
          label={t("confirmPassword")}
          name="confirm-password"
          autoComplete="new-password"
          placeholder={t("confirmPasswordPlaceholder")}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          error={confirmError}
        />
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? t("loading") : t("savePassword")}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm">
        <Link to="/login" className="font-semibold text-primary hover:underline">
          {t("backToLogin")}
        </Link>
      </p>
    </AuthLayout>
  );
}
