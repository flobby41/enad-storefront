import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function PrintIcon({ className }: Props) {
  return (
    <svg
      className={cn(className, "stroke-current")}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_118_1649)">
        <path
          d="M3.0625 10.0619H1.3125C1.08044 10.0619 0.857876 9.96973 0.693782 9.80564C0.529687 9.64154 0.4375 9.41898 0.4375 9.18692V4.81192C0.4375 4.57986 0.529687 4.3573 0.693782 4.1932C0.857876 4.02911 1.08044 3.93692 1.3125 3.93692H12.6875C12.9196 3.93692 13.1421 4.02911 13.3062 4.1932C13.4703 4.3573 13.5625 4.57986 13.5625 4.81192V9.18692C13.5625 9.41898 13.4703 9.64154 13.3062 9.80564C13.1421 9.96973 12.9196 10.0619 12.6875 10.0619H10.9375"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M2.1875 5.68692H3.0625"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.0625 7.43692H10.9375V13.5619H3.0625V7.43692Z"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.9375 3.93692H3.0625V1.31192C3.0625 1.07986 3.15469 0.857296 3.31878 0.693202C3.48288 0.529107 3.70544 0.43692 3.9375 0.43692H10.0625C10.2946 0.43692 10.5171 0.529107 10.6812 0.693202C10.8453 0.857296 10.9375 1.07986 10.9375 1.31192V3.93692Z"
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_118_1649">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
