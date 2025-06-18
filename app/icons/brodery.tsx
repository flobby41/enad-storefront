import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function BroderyIcon({ className }: Props) {
  return (
    <svg
      className={cn(className, "stroke-current")}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_118_1628)">
        <path
          d="M2.1875 0.4375C1.95544 0.4375 1.73288 0.529687 1.56878 0.693782C1.40469 0.857876 1.3125 1.08044 1.3125 1.3125V4.8125C1.3125 5.04456 1.40469 5.26712 1.56878 5.43122C1.73288 5.59531 1.95544 5.6875 2.1875 5.6875H5.25L6.5625 4.8125H7.4375C7.90163 4.8125 8.34675 4.99687 8.67494 5.32506C9.00313 5.65325 9.1875 6.09837 9.1875 6.5625V9.1875C9.1875 9.65163 9.00313 10.0967 8.67494 10.4249C8.34675 10.7531 7.90163 10.9375 7.4375 10.9375H1.75C1.4019 10.9375 1.06806 11.0758 0.821922 11.3219C0.575781 11.5681 0.4375 11.9019 0.4375 12.25C0.4375 12.5981 0.575781 12.9319 0.821922 13.1781C1.06806 13.4242 1.4019 13.5625 1.75 13.5625H11.8125C12.2766 13.5625 12.7217 13.3781 13.0499 13.0499C13.3781 12.7217 13.5625 12.2766 13.5625 11.8125V2.1875C13.5625 1.72337 13.3781 1.27825 13.0499 0.950063C12.7217 0.621874 12.2766 0.4375 11.8125 0.4375H2.1875Z"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.9375 5.6875V9.1875"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.9375 8.3125H5.25"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.5628 4.22917H11.2295C10.9974 4.22917 10.7749 4.13698 10.6108 3.97289C10.4467 3.8088 10.3545 3.58624 10.3545 3.35417C10.3545 3.12211 10.4467 2.89955 10.6108 2.73545C10.7749 2.57136 10.9974 2.47917 11.2295 2.47917H13.5628V4.22917Z"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.9375 0.4375V3.9375"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_118_1628">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
