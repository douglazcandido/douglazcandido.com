import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "#sobre", label: "sobre" },
  { href: "#projetos", label: "projetos" },
  { href: "#skills", label: "skills" },
  { href: "#educacao", label: "educação" },
  { href: "#contato", label: "contato" },
];

export default function Nav() {
  return (
    <nav className="flex flex-wrap items-center justify-end gap-5 pt-6 sm:gap-7 sm:pt-7">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="group relative font-mono text-xs tracking-[0.1em] text-neutral-400 uppercase transition-colors hover:text-accent"
        >
          {link.label}
          <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100" />
        </a>
      ))}
      <ThemeToggle />
    </nav>
  );
}
