import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export default function UserIcon({ className }: Props) {
  return (
    <svg
      className={cn(className, "stroke-current")}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 23.1926C3 20.8367 3.94821 18.5774 5.63604 16.9116C7.32387 15.2458 9.61305 14.3099 12 14.3099C14.3869 14.3099 16.6761 15.2458 18.364 16.9116C20.0518 18.5774 21 20.8367 21 23.1926H3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 7.4012C6.5 8.84087 7.07946 10.2216 8.11091 11.2396C9.14236 12.2576 10.5413 12.8295 12 12.8295C13.4587 12.8295 14.8576 12.2576 15.8891 11.2396C16.9205 10.2216 17.5 8.84087 17.5 7.4012C17.5 5.96152 16.9205 4.58082 15.8891 3.56282C14.8576 2.54482 13.4587 1.97291 12 1.97291C10.5413 1.97291 9.14236 2.54482 8.11091 3.56282C7.07946 4.58082 6.5 5.96152 6.5 7.4012Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.261 4.6456C8.11246 5.51742 9.13332 6.2108 10.2625 6.68427C11.3917 7.15774 12.6061 7.40158 13.833 7.4012C15.0767 7.40192 16.3075 7.15205 17.45 6.6669"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
