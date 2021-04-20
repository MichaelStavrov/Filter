import s from "./spinner.module.css";

export function Spinner() {
  return (
    <div className={s.spinner}>
      {Array.from({ length: 12 }).map((_, i) => (
        <div className={s.div} key={i}></div>
      ))}
    </div>
  );
}
