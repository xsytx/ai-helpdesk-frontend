import { useAuth } from "@/app/AuthContext";
import {
  clearPending,
  createAccount,
  delay,
  readPending,
  startVerification,
  toUser,
  verifyCode,
  type VerifyPurpose,
} from "@/features/auth/demoAuth";
import { useLocale } from "@/i18n/LocaleContext";
import { AuthLayout } from "@/shared/layout/AuthLayout";
import { Button } from "@/shared/ui/Button";
import { OtpInput } from "@/shared/ui/OtpInput";
import { FormEvent, useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

export function VerifyCodePage() {
  const { isAuthenticated, login } = useAuth();
  const { t } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const pending = readPending();
  const fromState = location.state as { email?: string; purpose?: VerifyPurpose } | null;
  const email = fromState?.email ?? pending?.email ?? "";
  const purpose: VerifyPurpose = fromState?.purpose ?? pending?.purpose ?? "signup";
  const hasSession = Boolean((fromState?.email ?? pending?.email) && (fromState?.purpose ?? pending?.purpose));

  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [demoCode, setDemoCode] = useState(pending?.code);

  const maskedEmail = useMemo(() => email ?? "", [email]);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!hasSession) {
    return <Navigate to="/login" replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(undefined);
    if (code.length !== 6) {
      setError(t("codeIncomplete"));
      return;
    }
    setLoading(true);
    try {
      await delay();
      const verified = verifyCode(email, code);
      if (verified.purpose === "signup") {
        const account = createAccount({
          email: verified.email,
          username: verified.username ?? verified.email.split("@")[0] ?? "Student",
          password: verified.password ?? "",
        });
        clearPending();
        login(toUser(account), "demo-jwt-token");
        navigate("/");
        return;
      }
      navigate("/reset-password", { state: { email: verified.email, verified: true } });
    } catch {
      setError(t("wrongCode"));
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError(undefined);
    try {
      await delay(400);
      const next = startVerification({
        email,
        purpose,
        username: pending?.username,
        password: pending?.password,
      });
      setDemoCode(next.code);
      setCode("");
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthLayout>
      <h1 className="mb-2 text-2xl font-bold text-primary">{t("checkEmailTitle")}</h1>
      <p className="mb-6 text-sm text-label">
        {t("checkEmailSubtitle")} <span className="font-medium text-primary">{maskedEmail}</span>
      </p>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <OtpInput value={code} onChange={setCode} error={Boolean(error)} />
        {error ? (
          <p className="text-center text-xs text-error" role="alert">
            {error}
          </p>
        ) : null}
        {demoCode ? (
          <p className="rounded-xl bg-background-2 px-3 py-2 text-center text-xs text-label">
            {t("demoCodeHint")}: <span className="font-semibold text-primary">{demoCode}</span>
          </p>
        ) : null}
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? t("loading") : t("verify")}
        </Button>
      </form>
      <div className="mt-5 flex flex-col items-center gap-2 text-sm">
        <button
          type="button"
          onClick={handleResend}
          disabled={resending}
          className="font-medium text-primary-light hover:underline disabled:opacity-60"
        >
          {resending ? t("loading") : t("resendCode")}
        </button>
        <Link to="/login" className="text-label hover:underline">
          {t("backToLogin")}
        </Link>
      </div>
    </AuthLayout>
  );
}
