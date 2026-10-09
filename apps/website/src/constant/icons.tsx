type IconProps = {
  className?: string;
};

export function MenuIcon({ className }: IconProps) {
  return (
    <svg
      focusable="false"
      viewBox="0 0 24 24"
      className={className}
      fill={'white'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
    </svg>
  );
}
