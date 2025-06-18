import { MARKETS } from "@/constants/markets"
import { getAttributes } from "@enadhq/commerce/backend"
import { EnadAttribute, ResponseItemsWithPagignation } from "@enadhq/commerce/enad"
import { getMarketData, SignupOrganizationForm } from "@enadhq/commerce/storefront"

export default async function SignupPage() {
  const { selectedMarket, markets } = await getMarketData(MARKETS)
  const attributes = (await getAttributes({
    page: 1,
    pageSize: 20,
    template_key: "business-sector",
    search: "",
  })) as ResponseItemsWithPagignation<EnadAttribute>

  return (
    <div className="container mx-auto px-4 max-w-2xl py-12">
      <SignupOrganizationForm
        market={selectedMarket}
        showLabels={true}
        userStatus={"pending"}
        organisationStatus={"pending"}
        attributes={attributes ? attributes : null}
        allowedCountries={
          markets?.map((m) => ({
            code: m.country,
            name: m.name,
          })) ?? []
        }
        settings={{
          showLoginButton: true,
          showOrganizationSignup: true,
          showPlaceholders: false,
          showAttributePicker: true,
        }}
        style={{
          card: "w-full!",
          cardTitle: "text-left! uppercase",
          signupButton: "text-white rounded-none uppercase h-11",
          inputField: "rounded-none h-11 p-3 text-base",
          label: "text-xs font-bold uppercase",
          countrySelectButton: "rounded-none h-11 p-3 text-base [&_span]:rounded-none",
        }}
        translations={{
          validation: {
            email: "Ogiltig e-postadress",
            passwordMin: "Lösenordet måste vara minst 10 tecken långt",
            passwordsDoesNotMatch: "Lösenorden matchar inte",
            privacyPolicyLink: "integritetspolicy",
            privacyPolicy: "integritetspolicyn",
            acceptPrivacy: "Jag accepterar",
            userAlreadyExists: "Ett konto med denna e-postadress finns redan",
            enter: "Ange",
            passwordRequirements: "Lösenordskrav",
            passwordCriteriaMin: "Minst 10 tecken",
            passwordCriteriaNumber: "Innehåller minst en siffra",
            passwordCriteriaSpecial: "Innehåller specialtecken (rekommenderas)",
            submitButton: "Ansök om konto",
          },
          account: {
            login: "Logga in",
            createAccount: "Ansök om konto",
            alreadyHaveAccount: "Har du redan ett konto?",
            firstName: "Förnamn",
            lastName: "Efternamn",
            email: "E-postadress",
            password: "Lösenord",
            phoneNumber: "Telefonnummer",
            confirmPassword: "Bekräfta lösenord",
            verifyAccountEmail:
              "Tack för din ansökan! Vi har skickat ett e-postmeddelande för att bekräfta ditt konto.",
            confirmEmail: "Bekräfta din e-postadress",
            acceptSmsNotifications: "Jag accepterar SMS-notifikationer",
            acceptEmailNotifications: "Jag accepterar e-postnotifikationer",
            acceptPostalNotifications: "Jag accepterar postnotifikationer",
            communicationPreferences: "NOTIFIKATIONER",
          },
          organization: {
            name: "Företagsnamn",
            organisationNumber: "Organisationsnummer",
            tax_id_vat_number: "Momsregistreringsnummer",
            invoice_email: "Faktura e-post",
            phone: "Telefonnummer",
            external_ref: "Extern referens",
            contact_name: "Kontaktperson",
            attribute: "Bransch",
            billing_address: {
              street_address: "Gatuadress",
              house_number: "Husnummer",
              city: "Stad",
              postal_code: "Postnummer",
              country: "Land",
              state_province: "Län",
              phone: "Telefonnummer",
              co_address: "C/O adress",
              name: "Namn",
            },
          },
        }}
      />
    </div>
  )
}
