import { Button } from "@/components/ui/button";
import {
  LoginForm,
  SuperLink,
  VerifyStatus,
} from "@enadhq/commerce/storefront";

export default function LoginComponent({
  verifyStatus,
}: {
  verifyStatus?: VerifyStatus;
}) {
  return (
    <main className="container mx-auto px-4 max-w-lg py-12">
      <div className="space-y-6 min-h-[50vh] bg-white border border-gray-200 rounded-none p-8">
        <h1 className="text-2xl font-bold tracking-tight uppercase">
          Logga in
        </h1>
        <LoginForm
          loginRedirect={"/account/"}
          verifyStatus={verifyStatus}
          style={{
            card: "",
            inputField: "rounded-none h-auto p-3 text-base",
            label: "font-medium uppercase text-xs font-bold",
            loginButton: "rounded-none uppercase h-[44px] font-bold",
          }}
          translations={{
            email: "E-post",
            password: "Lösenord",
            loginButton: "Logga in",
            userNotFound: "Användaren hittades inte",
            wrongPassword: "Fel lösenord",
            emailVerificationLinkCreated: "E-postverifieringslänk skapad",
            emailValidation: "Vänligen ange en giltig e-postadress",
            passwordValidation: "Lösenordet måste vara minst 10 tecken långt",
            haveNoAccount: "Har du inget konto?",
            createAccount: "Bli kund",
            forgotYourPassword: "Glömt ditt lösenord?",
            resetPasswordHere: "Återställ här",
            userPendingState:
              "Ditt konto är under granskning. Du kan inte logga in just nu.",
            emailNotVerified:
              "Din e-post är inte verifierad. Vänligen kontrollera din inkorg för verifieringslänken.",
          }}
          settings={{
            showCreateAccount: false,
            showForgotPassword: true,
          }}
        />
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h2 className="text-2xl font-bold mb-4 uppercase">Bli kund</h2>
          <p className="mb-4">
            Ansök om kundkonto hos oss för att ta del av våra medlemsförmåner.
          </p>
          <p className="mb-6">
            Som inloggad medlem kan du se din köphistorik, ändra dina uppgifter
            och mycket mer.
          </p>
          <Button asChild className="w-full">
            <SuperLink href="/signup/" className="">
              Ansök om konto
            </SuperLink>
          </Button>
        </div>
      </div>
      <div className="mt-8 text-center">
        <SuperLink href="/" className="text-sm underline">
          Tillbaka till butiken
        </SuperLink>
      </div>
    </main>
  );
}
