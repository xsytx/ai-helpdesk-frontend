import { useAuth } from "@/app/AuthContext";
import { accountExists, delay, startVerification } from "@/features/auth/demoAuth";
import { useLocale } from "@/i18n/LocaleContext";
import { AuthLayout } from "@/shared/layout/AuthLayout";
import { isUniversityEmail } from "@/shared/lib/format";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { FormEvent, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

export function ForgotPasswordPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string>();
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEmailError(undefined);
    if (!isUniversityEmail(email)) {
      setEmailError(t("invalidEmail"));
      return;
    }
    if (!accountExists(email)) {
      setEmailError(t("accountNotFound"));
      return;
    }

    setLoading(true);
    try {
      await delay();
      startVerification({ email, purpose: "reset" });
      navigate("/verify", { state: { email: email.trim().toLowerCase(), purpose: "reset" } });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="mb-2 text-2xl font-bold text-primary">{t("forgotPassword")}</h1>
      <p className="mb-6 text-sm text-label">{t("forgotPasswordSubtitle")}</p>
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <Input
          label={t("email")}
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError}
        />
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? t("loading") : t("sendCode")}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-label">
        <Link to="/login" className="font-semibold text-primary hover:underline">
          {t("backToLogin")}
        </Link>
      </p>
    </AuthLayout>
  );
}
