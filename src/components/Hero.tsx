import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-avatar-wrap">
        <Image
          src="/avatar.jpg"
          alt="Ansil Muhammed"
          width={112}
          height={112}
          className="hero-avatar"
          priority
        />
      </div>
      <h1 className="hero-title">
        <em>Ansil</em>
        <br />
        Muhammed
      </h1>
      <p className="hero-subtitle">Engineer · Builder · Open Source</p>
      <div className="hero-line" />
      <p className="hero-bio">
        Crafting software, shipping products,
        <br />
        and contributing to the open web.
      </p>
    </section>
  );
}
