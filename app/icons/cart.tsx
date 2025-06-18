import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function CartIcon({ className }: Props) {
  return (
    <svg
      className={cn(className, "stroke-current")}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_78_1250)">
        <path
          d="M2.37799 9.11534H19.378C19.378 9.11534 20.378 9.11534 20.378 10.1023V22.9328C20.378 22.9328 20.378 23.9197 19.378 23.9197H2.37799C2.37799 23.9197 1.37799 23.9197 1.37799 22.9328V10.1023C1.37799 10.1023 1.37799 9.11534 2.37799 9.11534Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.37799 7.14142V5.66097C6.37799 4.48306 6.8521 3.35339 7.69601 2.52049C8.53992 1.68758 9.68452 1.21965 10.878 1.21965C12.0715 1.21965 13.2161 1.68758 14.06 2.52049C14.9039 3.35339 15.378 4.48306 15.378 5.66097V7.14142"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20.208 2.25596C20.3955 2.07093 20.6498 1.96699 20.915 1.96699C21.1802 1.96699 21.4345 2.07093 21.622 2.25596L22.329 2.95473C22.5165 3.13981 22.6218 3.3908 22.6218 3.65251C22.6218 3.91422 22.5165 4.16521 22.329 4.35029L19.794 6.85224C19.6065 7.03734 19.3522 7.14136 19.087 7.14141H17.378V5.45667C17.378 5.19494 17.4834 4.94394 17.671 4.75889L20.208 2.25596Z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_78_1250">
          <rect width="24" height="23.6871" transform="translate(0 0.726171)" />
        </clipPath>
      </defs>
    </svg>
  );
}
