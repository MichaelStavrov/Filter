import s from "./app.module.css";
import { Filter } from "./Components/Filter/Filter";

export function App() {
  return (
    <div className={s.wrapper}>
      <Filter />
    </div>
  );
}
