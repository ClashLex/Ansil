import TechText from "./TechText";

export default function Hero() {
  return (
    <section className="hero">
      <h1 className="hero-title">
        <span className="sr-only">Ansil Muhammed</span>
        <TechText
          text={"Ansil\nMuhammed"}
          className="hero-tech-text"
          fontFamily="'Instrument Serif', serif"
          fontStyle="italic"
          fontWeight={400}
          fontSize={150}
          letterSpacing={-0.02}
          color="#1A1A1A"
          accentColor="#A855F7"
          reach={220}
          lineStyle="dashed"
          reveal="letter"
        />
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
