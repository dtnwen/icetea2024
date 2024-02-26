type HeaderMenu = {
  label: string;
  href: string;
};

export const menuLinks: HeaderMenu[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Debug Contracts",
    href: "/debug",
  },
];

export default menuLinks;
