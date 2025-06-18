import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function NameIcon({ className }: Props) {
  return (
    <svg
      className={cn(className, "stroke-current")}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_118_1664)">
        <path
          d="M1.3125 3.06192H12.6875C12.6875 3.06192 13.5625 3.06192 13.5625 3.93692V10.0619C13.5625 10.0619 13.5625 10.9369 12.6875 10.9369H1.3125C1.3125 10.9369 0.4375 10.9369 0.4375 10.0619V3.93692C0.4375 3.93692 0.4375 3.06192 1.3125 3.06192Z"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.9375 9.18692V4.81192"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.0625 4.81192H4.8125"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.0625 9.18692H4.8125"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_118_1664">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
