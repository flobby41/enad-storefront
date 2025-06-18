import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/lib/utils";

import {
  useAddGiftCard,
  useAddVoucher,
  useRemoveGiftCard,
  useRemoveVoucher,
} from "@enadhq/commerce/brink";
import {
  AlertCircle,
  BadgeCheckIcon,
  BadgePercentIcon,
  GiftIcon,
  X,
} from "lucide-react";
import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

type Props = {
  activeCodes: string[];
  activeGiftCards: string[];
  restartCheckout?: boolean;
  hidden?: boolean;
  locale: string;
};

const Voucher = ({
  activeCodes,
  activeGiftCards,
  restartCheckout,
  hidden,
  locale,
}: Props) => {
  const discountRef = useRef<HTMLInputElement>(null);
  const giftCardRef = useRef<HTMLInputElement>(null);
  const giftCardPinRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const setErrorMessageWithDelay = (message: string) => {
    setErrorMessage(message);
    // setTimeout(() => {
    //   setErrorMessage('')
    // }, 5000)
  };

  const { mutateAsync: addVoucher, status: addStatus } = useAddVoucher();
  const { mutateAsync: removeVoucher, status: removeStatus } =
    useRemoveVoucher();

  const { mutateAsync: addGiftCard, status: addGiftCardStatus } =
    useAddGiftCard();
  const { mutateAsync: removeGiftCard, status: removeGiftCardStatus } =
    useRemoveGiftCard();

  const handleVoucher = async () => {
    if (discountRef.current && discountRef.current.value) {
      try {
        await addVoucher(discountRef.current.value);
        setErrorMessage("");
        // toast.success(
        //   `${t('voucher.promoCode')} "${discountRef.current.value}" ${t(
        //     'voucher.added'
        //   )}`
        // )
        discountRef.current.value = "";
      } catch (error: any) {
        // Hantera specifika fel utan att kasta dem
        const errorMessage = error?.error?.message;

        switch (errorMessage) {
          case "MISSING_DISCOUNT_CODE":
            setErrorMessageWithDelay(t("error.missingDiscount"));
            break;
          case "CONDITION_DISCOUNT_CODE":
            setErrorMessageWithDelay(t("error.conditionDiscount"));
            break;
          case "CONDITION_DISCOUNT_EXTERNAL":
            setErrorMessageWithDelay(t("error.conditionDiscountExternal"));
            break;
          case "EXPIRED_DISCOUNT_CODE":
            setErrorMessageWithDelay(t("error.expiredDiscount"));
            break;
          case "ALREADY_ADDED_DISCOUNT_CODE":
            setErrorMessageWithDelay(t("error.alreadyAddedDiscount"));
            break;
          case "INACTIVE_DISCOUNT_CODE":
            setErrorMessageWithDelay(t("error.discountIsInactive"));
            break;
          case "BAD_REQUEST":
            setErrorMessageWithDelay(t("error.discountBadRequest"));
            break;
          default:
            toast.error(errorMessage || "An unexpected error occurred");
        }
      }
    }
  };

  const handleGiftCard = async () => {
    setErrorMessage("");

    if (
      giftCardRef.current &&
      giftCardRef.current.value &&
      giftCardPinRef.current &&
      giftCardPinRef.current.value
    ) {
      giftCardRef.current.value = giftCardRef.current.value
        .replaceAll(" ", "")
        .trim();
      giftCardPinRef.current.value = giftCardPinRef.current.value
        .replaceAll(" ", "")
        .trim();
      await addGiftCard(
        {
          giftCardCode: giftCardRef.current.value,
          pin: giftCardPinRef.current.value,
        },
        {
          onError: (error: {
            error: {
              message:
                | string
                | number
                | bigint
                | boolean
                | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | ReactPortal
                | Promise<
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactPortal
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | null
                    | undefined
                  >
                | null
                | undefined;
            };
          }) => {
            console.log(error);
            const errorMessage = error?.error?.message;

            switch (errorMessage) {
              case "unable to add/update card":
                setErrorMessageWithDelay(t("error.unableAddUpdateGiftcard"));
                break;
              case "requested gift card has insufficient balance":
                setErrorMessageWithDelay(
                  t("error.giftCardInsufficientBalance")
                );
                break;
              default:
                setErrorMessageWithDelay(
                  (errorMessage as string) || "An unexpected error occurred"
                );
            }
          },
          onSuccess: () => {
            // toast.success(
            //   `${t('giftCard.giftCard')} "${giftCardRef.current?.value}" ${t(
            //     'voucher.added'
            //   )}`
            // )
            setErrorMessage("");
            if (giftCardRef.current) giftCardRef.current.value = "";
            if (giftCardPinRef.current) giftCardPinRef.current.value = "";
          },
        }
      );
    }
  };

  const handleRemoveVoucher = (code: string) => {
    removeVoucher(code, {
      onSuccess: async () => {
        // toast.success(
        //   `${t('voucher.promoCode')} "${code}" ${t('voucher.removed')}`
        // )
        setErrorMessage("");
      },
      onError: (error: {
        error: {
          message:
            | string
            | number
            | bigint
            | boolean
            | ReactElement<unknown, string | JSXElementConstructor<any>>
            | Iterable<ReactNode>
            | ReactPortal
            | Promise<
                | string
                | number
                | bigint
                | boolean
                | ReactPortal
                | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | null
                | undefined
              >
            | null
            | undefined;
        };
      }) => {
        toast.error(error.error.message);
      },
    });
  };

  const handleRemoveGiftCard = (code: string) => {
    removeGiftCard(code, {
      onSuccess: () => {
        // toast.success(`${t('giftcard')} ${code} ${t('voucher.removed')}`)
        setErrorMessage("");
      },
      onError: (error: {
        error: {
          message:
            | string
            | number
            | bigint
            | boolean
            | ReactElement<unknown, string | JSXElementConstructor<any>>
            | Iterable<ReactNode>
            | ReactPortal
            | Promise<
                | string
                | number
                | bigint
                | boolean
                | ReactPortal
                | ReactElement<unknown, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | null
                | undefined
              >
            | null
            | undefined;
        };
      }) => {
        toast.error(error.error.message);
      },
    });
  };

  const { t } = useTranslation(locale);

  return (
    <div>
      <div>
        {activeCodes.length > 0 && (
          <div>
            {activeCodes.map((code, index) => (
              <div className="flex justify-between py-2 mt-4" key={index}>
                <div className="flex items-center text-sm">
                  <BadgeCheckIcon className="h-4 w-4 text-green mr-2" />
                  {t("voucher.used")}:{" "}
                  <span className="ml-0.5 font-semibold "> {code}</span>
                </div>
                <Button
                  onClick={() => {
                    handleRemoveVoucher(code);
                  }}
                  className="h-7 w-7 p-0 text-base -mr-2"
                  variant={"ghost"}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        {activeGiftCards.length > 0 && (
          <div>
            {activeGiftCards.map((code, index) => (
              <div className="flex justify-between py-2" key={index}>
                <div className="flex items-center text-sm">
                  <BadgeCheckIcon className="h-4 w-4 text-green mr-2" />
                  {t("giftCard.used")}:{" "}
                  <span className="ml-0.5 font-semibold "> {code}</span>
                </div>
                <Button
                  onClick={() => {
                    handleRemoveGiftCard(code);
                  }}
                  className="h-7 w-7 p-0 text-base -mr-2"
                  variant={"ghost"}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Accordion type="single" collapsible className="w-full ">
        <AccordionItem className="w-full border-none" value="item-0">
          <AccordionTrigger className="justify-start text-sm normal-case py-3 w-full tracking-normal text-darkGrey font-semibold">
            <span className="mr-2 w-full text-left flex items-center">
              <BadgePercentIcon className="w-4 mr-2" />
              {t("voucher.promoCode")}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-0 lg:space-x-2 lg:space-y-0 space-y-2 mt-0.5 lg:flex-row flex-col">
              <Input
                ref={discountRef}
                className="h-11 rounded-[2px] text-base lg:text-sm w-full focus-visible:ring-2 focus-visible:border-black "
                placeholder={t("voucher.placeholder")}
              />
              <Button
                variant="secondary"
                status={addStatus}
                className="w-full md:w-auto"
                onClick={handleVoucher}
              >
                {t("voucher.apply")}
              </Button>
            </div>
            <p className="mt-1.5 text-sm">{t("voucher.terms")}</p>
            {errorMessage && (
              <Alert variant="destructive" className="mt-3">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="line">
                  {errorMessage?.split("|")?.[0]}
                </AlertTitle>
                <AlertDescription className="">
                  {errorMessage?.split("|")?.[1]}
                </AlertDescription>
              </Alert>
            )}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          className="w-full border-b-0 border-t border-[#eeeeee]"
          value="item-1"
        >
          <AccordionTrigger className="justify-start text-sm normal-case py-3 w-full tracking-normal text-darkGrey font-semibold">
            <span className="mr-2 w-full text-left flex items-center">
              <GiftIcon className="w-4 mr-2" />
              {t("giftCard.giftCard")}
            </span>
          </AccordionTrigger>
          <AccordionContent>
            {hidden ? (
              <div className="p-4 border border-middleGrey w-full flex gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>
                  <p className="text-sm text-darkgrey">
                    {t("giftcard.message")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex md:flex-row flex-col space-x-0 lg:space-x-2 gap-2 md:gap-0 items-center mt-0.5">
                <Input
                  ref={giftCardRef}
                  className="h-11 rounded-[2px] text-base lg:text-sm md:max-w-[200px] focus-visible:ring-2 focus-visible:border-black"
                  placeholder={t("giftCard.code")}
                />
                <Input
                  ref={giftCardPinRef}
                  className="h-11 rounded-[2px] text-base lg:text-sm md:max-w-[200px] focus-visible:ring-2 focus-visible:border-black "
                  placeholder={t("giftCard.pin")}
                />
                <Button
                  variant="secondary"
                  status={addGiftCardStatus}
                  onClick={handleGiftCard}
                  className="w-full md:w-auto"
                >
                  {t("voucher.apply")}
                </Button>
              </div>
            )}
            {errorMessage && (
              <Alert variant="destructive" className="mt-3">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="">
                  {errorMessage?.split("|")?.[0]}
                </AlertTitle>
                <AlertDescription className="">
                  {errorMessage?.split("|")?.[1]}
                </AlertDescription>
                <Button
                  onMouseDown={() => setErrorMessage("")}
                  className="link p-0 h-auto w-auto absolute top-2 right-2 text-red"
                  variant={"link"}
                  size={"sm"}
                >
                  <X className="w-4 h-4" />
                </Button>
              </Alert>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
export default Voucher;
