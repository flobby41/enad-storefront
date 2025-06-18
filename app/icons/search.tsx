import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function SearchIcon({ className }: Props) {
  return (
    <svg
      className={cn(className, "stroke-current")}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 10.8615C1 13.4791 2.05357 15.9895 3.92893 17.8404C5.8043 19.6913 8.34784 20.7311 11 20.7311C13.6522 20.7311 16.1957 19.6913 18.0711 17.8404C19.9464 15.9895 21 13.4791 21 10.8615C21 8.24395 19.9464 5.73358 18.0711 3.88267C16.1957 2.03176 13.6522 0.991928 11 0.991928C8.34784 0.991928 5.8043 2.03176 3.92893 3.88267C2.05357 5.73358 1 8.24395 1 10.8615Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 23.6918L18.071 17.8401"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
