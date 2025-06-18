"use client";

import type React from "react";

import { useCustomerInformationCardData } from "@/hooks/useCustomerInformationCardData";
import { EnadOrganisation, EnadUser } from "@enadhq/commerce/enad";
import {
  CustomerInformationCard,
  MyInformation,
} from "@enadhq/commerce/storefront";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AccountSettings({
  market,
  user,
  organisations,
}: {
  market: any;
  user: EnadUser;
  organisations: EnadOrganisation[];
}) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to update the user profile
    setSuccessMessage("Profilen har uppdaterats");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setErrorMessage("Lösenordet måste vara minst 6 tecken långt");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Lösenorden matchar inte");
      return;
    }

    // In a real app, this would call an API to change the password
    setSuccessMessage("Lösenordet har uppdaterats");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrorMessage("");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const {
    selectedUser,
    selectedCompany,
    setSelectedUser,
    selectedBillingAddress,
    handleSelectBillingAddress,
    selectedShippingAddress,
    handleSelectShippingAddress,
    selectedCompanyObj,
    selectedUserObj,
    selectedBillingAddressObj,
    selectedShippingAddressObj,
    organisationUsers,
    handleCompanyChange,
  } = useCustomerInformationCardData(user, organisations);

  return (
    <div className="container mx-auto lg:px-6 px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/account" className="mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold uppercase">Kontoinställningar</h1>
      </div>

      {successMessage && (
        <div className="bg-green-50 text-green-600 p-4 mb-6 rounded">
          {successMessage}
        </div>
      )}
      <div className="space-y-6">
        <MyInformation
          market={market}
          settings={{
            notifications: {
              sms: true,
              email: true,
              postal: false,
            },
          }}
          translations={{
            emailValidation: "Vänligen ange en giltig e-postadress.",
            phoneValidation: "Vänligen ange ett giltigt telefonnummer.",
            saveChanges: "Spara ändringar",
            acceptSmsNotifications: "Acceptera SMS-notiser",
            acceptEmailNotifications: "Acceptera e-postnotiser",
            acceptPostalNotifications: "Acceptera postnotiser",
            communicationPreferences: "Kommunikationsinställningar",
            myCredentials: "Personuppgifter",
            myCredentialsDescription:
              "Hantera dina inloggningsuppgifter och personliga information.",
            firstName: "Förnamn",
            lastName: "Efternamn",
            address: "Adress",
            postalCode: "Postnummer",
            city: "Stad",
            email: "E-post",
            phoneNumber: "Telefonnummer",
            updatedInformation: "Din information har uppdaterats.",
            deleteAccount: {
              confirmText: "Skriv 'RADERA' för att bekräfta",
              deleteKeyword: "RADERA",
              deleteAccount: "Radera konto",
              areYouSure: "Är du säker på att du vill radera ditt konto?",
              deleteAccountDescription:
                "Att radera ditt konto är permanent och kan inte ångras.",
              cancel: "Avbryt",
            },
          }}
          style={{
            card: "rounded-none",
            input: "rounded-none",
            button: "rounded-none uppercase",
            countrySelectButton: "border-gray-300 h-auto rounded-none",
            cardTitle: "uppercase text-lg font-bold",
          }}
        />
        <CustomerInformationCard
          organisations={organisations}
          selectedCompany={selectedCompany}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          selectedBillingAddress={selectedBillingAddress}
          handleSelectBillingAddress={handleSelectBillingAddress}
          selectedShippingAddress={selectedShippingAddress}
          handleSelectShippingAddress={handleSelectShippingAddress}
          selectedCompanyObj={selectedCompanyObj}
          selectedUserObj={selectedUserObj}
          selectedBillingAddressObj={selectedBillingAddressObj}
          selectedShippingAddressObj={selectedShippingAddressObj}
          handleCompanyChange={handleCompanyChange}
          organisationUsers={organisationUsers?.items || []}
          style={{
            cardClassName: "rounded-none",
            selectClassName: "rounded-none",
            cardTitle: "uppercase text-lg font-bold",
          }}
          user={user}
          translations={{
            cardTitle: "Företagsinformation",
            cardDescription:
              "Hantera dina företagsuppgifter och faktureringsinformation.",
            company: "Företag",
            selectCompany: "Välj företag",
            selectUser: "Välj användare",
            billingInformation: "Faktureringsinformation",
            billingAddress: "Faktureringsadress",
            shippingInformation: "Leveransinformation",
            shippingAddress: "Leveransadress",
            selectShippingAddress: "Välj leveransadress",
            selectBillingAddress: "Välj faktureringsadress",
            organisationNumber: "Organisationsnummer",
            taxId: "Momsregistreringsnummer",
            invoice_email: "Faktura-e-post",
          }}
        />
      </div>
    </div>
  );
}
