import LoginComponent from "@/components/auth/login-form";
import { verifyEnadEmail } from "@enadhq/commerce/backend";
import { VerifyStatus } from "@enadhq/commerce/storefront";

type Params = { lang: string; slug: string[] };

export default async function VerifyAccountPage(props: {
  params: Promise<Params>;
  searchParams: Promise<any>;
}) {
  const searchParams = await props.searchParams;

  let verifyStatus = {
    status: "idle",
    statusMessage: "",
  } as VerifyStatus;
  if (searchParams.token) {
    const response = await verifyEnadEmail(searchParams.token);
    console.log("verify response", response);
    if ("code" in response && response.code === 500) {
      verifyStatus.status = "error";
      verifyStatus.statusMessage = response.details?.[0] || "";
    }
    if ("code" in response && response.code === 400) {
      verifyStatus.status = "error";
      verifyStatus.statusMessage = "Inaktuell verifieringslänk.";
    }
    if ("code" in response && response.code === 200) {
      verifyStatus.status = "success";
      verifyStatus.statusMessage =
        "E-postverifiering lyckades|Din e-post har verifierats.";
    }
  } else {
    verifyStatus.status = "error";
    verifyStatus.statusMessage =
      "Ingen verifieringslänk angiven. Vänligen kontrollera ditt email för en giltig länk.";
  }

  return <LoginComponent verifyStatus={verifyStatus}></LoginComponent>;
}
