import { ReactNode } from "react";

interface LinkCardProps {
  id: string;
  href: string;
  label: string;
  description: string;
  icon: ReactNode;
  onClick?: () => void;
}

export default function LinkCard({
  id,
  href,
  label,
  description,
  icon,
  onClick,
}: LinkCardProps) {
  const isMailto = href.startsWith("mailto:");

  return (
    <a
      id={id}
      href={href}
      target={isMailto ? undefined : "_blank"}
      rel={isMailto ? undefined : "noopener noreferrer"}
      className="link-card"
      data-label={label}
      onClick={onClick}
    >
      <div className="link-icon">{icon}</div>
      <div className="link-label">
        <span className="link-name">{label}</span>
        <span className="link-desc">{description}</span>
      </div>
      <span className="link-arrow">↗</span>
    </a>
  );
}
