import { MARKETS } from "@/constants/markets";
import {
  ForgotPasswordForm,
  getMarketData,
  NewPasswordForm,
} from "@enadhq/commerce/storefront";

type Params = {
  lang: string;
  slug: string[];
};

export default async function ResetPasswordPage(props: {
  params: Promise<Params>;
  searchParams: Promise<any>;
}) {
  const { selectedMarket } = await getMarketData(MARKETS);
  const searchParams = await props.searchParams;

  return (
    <main className="container mx-auto px-4 max-w-2xl py-12">
      <div className="min-h-[50vh]">
        {searchParams.token ? (
          <NewPasswordForm
            token={searchParams.token}
            market={selectedMarket}
            style={{
              card: "w-full! rounded-none",
              cardTitle: "text-left! uppercase",
              cardDescription: "text-left!",
              forgotPasswordButton:
                "text-white rounded-none text-left uppercase justify-start h-11",
              inputField: "rounded-none h-11 p-3 text-base",
              label: "font-medium uppercase",
            }}
            translations={{
              account: {
                resetPaswordHere: "Återställ ditt lösenord här",
                resetPasword: "Återställ lösenord",
                confirmNewPassword: "Bekräfta nytt lösenord",
                forgotPassword: "Glömt lösenord",
                newPassword: "Nytt lösenord",
                enterNewPassword: "Ange ditt nya lösenord",
                login: "Logga in",
                passwordResetted: "Lösenordet har återställts",
                passwordLinkExpired:
                  "Länken för att återställa lösenordet har gått ut",
                passwordsDoesNotMatch: "Lösenorden matchar inte",
                passwordRequirements: "Lösenordet måste uppfylla kraven",
                passwordMinLength: "Lösenordet måste vara minst 8 tecken långt",
              },
            }}
          />
        ) : (
          <ForgotPasswordForm
            market={selectedMarket}
            showLabels={false}
            style={{
              card: "w-full! rounded-none",
              cardTitle: "text-left! uppercase",
              cardDescription: "text-left!",
              forgotPasswordButton:
                "text-white rounded-none text-left uppercase justify-start h-11",
              inputField: "rounded-none h-11 p-3 text-base",
              label: "font-medium uppercase",
            }}
            translations={{
              account: {
                emailValidation: "Vänligen ange en giltig e-postadress.",
                login: "Logga in",
                emailNotVerified: "Din e-postadress har inte verifierats.",
                forgotPassword: "Glömt ditt lösenord?",
                rememberYourAccount: "Kommer du ihåg ditt lösenord?",
                resetPassword: "Återställ lösenord",
                email: "E-post",
                verifyAccountEmail: "Verifiera din e-postadress",
                confirmEmail: "Bekräfta din e-post",
                resendEmailAgain: "Skicka e-post igen",
                verifyEmail: "Verifiera e-post",
                controllPasswordEmail:
                  'Kontrollera din e-post för återställningslänken. Om du inte har fått den, klicka på "Skicka verifiering igen" nedan.',
                checkEmail: "Kontrollera din e-post",
                emailNotFoundTitle: "E-postadress hittades inte",
                signUp: "Registrera dig",
              },
            }}
          />
        )}
      </div>
    </main>
  );
}
