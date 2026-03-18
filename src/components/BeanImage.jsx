export default function BeanImage() {
  return (
    <img
      className="hero-bean"
      src="/bean-macro.png"
      alt="Macro shot of a coffee bean"
      loading="lazy"
      decoding="async"
      fetchpriority="low"
    />
  );
}
