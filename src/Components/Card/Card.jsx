import s from "./card.module.css";

export function Card({ photo, firstName, patrName, subject, price }) {
  return (
    <div className={s.item}>
      <div className={s.photoWrapper}>
        <img className={s.photo} src={photo} alt="avatar" />
      </div>
      <div className={s.info}>
        <span className={s.fullName}>
          {firstName} {patrName}
        </span>
        <span className={s.subject}>{subject}</span>
        <span className={s.price}> от {price} р</span>
      </div>
    </div>
  );
}
