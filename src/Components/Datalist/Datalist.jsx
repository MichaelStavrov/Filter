import { useEffect, useState } from "react";
import { DebounceInput } from "react-debounce-input";
import cn from "classnames";
import s from "./datalist.module.css";
import { fetchAreas, fetchDistricts, fetchSubjects } from "../../api/index";
import iconArrow from "../../images/triangle.svg";

export function Datalist({
  autoComplete,
  placeholder,
  name,
  items,
  setDataForm,
  setAreaId,
  setItems,
  areaId,
}) {
  const [inFocus, setInFocus] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!value) {
      setDataForm((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }, [value, name, setDataForm, items]);

  function handleSelectClick(item) {
    setValue(item.name);
    if (name === "area") {
      setAreaId(item.id);
    }
    setDataForm((prev) => ({
      ...prev,
      [name]: item.id,
    }));
    setInFocus(false);
  }

  function filter(fn, value, ...args) {
    const rgxp = new RegExp(value, "gi");
    return fn(...args)
      .then((r) => r.filter((item) => item.name.match(rgxp)))
      .then((r) => setItems(r));
  }

  function handleInputChange(e) {
    setInFocus(true);
    const { value, name } = e.target;
    setValue(value);
    if (name === "subject") {
      filter(fetchSubjects, value);
    }
    if (name === "area") {
      filter(fetchAreas, value);
    }
    if (name === "district") {
      filter(fetchDistricts, value, areaId);
    }
  }

  document.addEventListener("click", (e) => {
    if (e.target.name !== name) {
      setInFocus(false);
    }
  });

  return (
    <>
      <label className={s.label}>
        <DebounceInput
          className={s.input}
          autoComplete={autoComplete || "off"}
          placeholder={placeholder || ""}
          name={name || ""}
          debounceTimeout={200}
          value={value}
          onChange={handleInputChange}
          onClick={() => setInFocus((prev) => !prev)}
        />
        <img
          className={cn({
            [s.iconArrow]: true,
            [s.iconTransform]: inFocus,
          })}
          src={iconArrow}
          alt="iconArrow"
        />
      </label>
      <ul className={s.list}>
        {items.length > 0 &&
          inFocus &&
          items.map((item) => (
            <li
              className={s.item}
              onClick={() => handleSelectClick(item)}
              key={item.id}
            >
              {item.name}
            </li>
          ))}
      </ul>
    </>
  );
}
