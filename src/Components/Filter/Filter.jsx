import { useEffect, useState } from "react";
import s from "./filter.module.css";
import {
  fetchSubjects,
  fetchAreas,
  fetchDistricts,
  fetchTeacherIds,
  fetchTeachersShort,
} from "../../api";
import { Card } from "../Card/Card";
import { Datalist } from "../Datalist/Datalist";
import { Spinner } from "../Spinner/Spinner";

export function Filter() {
  const QUANTITY = 10;
  const [subjects, setSubjects] = useState([]);
  const [areas, setAreas] = useState([]);
  const [areaId, setAreaId] = useState(1);
  const [districts, setDistricts] = useState([]);
  const [dataForm, setDataForm] = useState({
    subject: "",
    area: "",
    district: "",
  });
  const [teachers, setTeachers] = useState([]);
  const [limit, setLimit] = useState(QUANTITY);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [isOver, setIsOver] = useState(false);

  useEffect(() => {
    fetchSubjects().then((r) => setSubjects(r));
    fetchAreas().then((r) => setAreas(r));
  }, []);

  useEffect(() => {
    fetchDistricts(areaId).then((r) => setDistricts(r));
  }, [areaId]);

  const { subject, area, district } = dataForm;

  function handleLoadMoreClick() {
    const next = limit + QUANTITY;
    fetchTeacherIds(subject, area, district)
      .then((ids) => {
        setLoading(true);
        return ids.slice(limit, next);
      })
      .then((ids) => {
        if (ids.length === 0) {
          setIsOver(true);
          setDisabled(true);
          return [];
        } else {
          setLimit(next);
          setDisabled(false);
        }
        return fetchTeachersShort(ids);
      })
      .then((teachers) => {
        setLoading(false);
        setTeachers((prev) => [...prev, ...teachers]);
      });
  }

  function handleSearchFormSubmit(e) {
    e.preventDefault();
    setIsOver(false);
    fetchTeacherIds(subject, area, district)
      .then((ids) => {
        if (ids.length === 0) {
          setEmpty(true);
        } else {
          setEmpty(false);
        }
        setLoading(true);
        setLimit(QUANTITY);
        setDisabled(false);
        return ids.slice(0, QUANTITY);
      })
      .then((ids) => fetchTeachersShort(ids))
      .then((teachers) => {
        setTeachers(teachers);
        setLoading(false);
      });
  }

  return (
    <div className={s.wrapper}>
      <form className={s.searchForm} onSubmit={handleSearchFormSubmit}>
        <div className={s.column}>
          <Datalist
            autoComplete={"off"}
            placeholder="Укажите предмет"
            name={"subject"}
            items={subjects}
            setItems={setSubjects}
            setDataForm={setDataForm}
          />
        </div>
        <div className={s.column}>
          <Datalist
            autoComplete={"off"}
            placeholder="Укажите город"
            name={"area"}
            items={areas}
            dataForm={dataForm}
            setItems={setAreas}
            setDataForm={setDataForm}
            setAreaId={setAreaId}
          />
        </div>
        <div className={s.column}>
          <Datalist
            autoComplete={"off"}
            placeholder="Укажите район"
            name={"district"}
            items={districts}
            dataForm={dataForm}
            setItems={setDistricts}
            setDataForm={setDataForm}
            areaId={areaId}
          />
        </div>
        <button className={s.buttonSearchForm} type="submit" disabled={loading}>
          Применить фильтр
        </button>
      </form>
      {empty && <div>По вашему запросу ничего не найдено</div>}
      {loading && <Spinner />}
      {teachers && teachers.length > 0 && (
        <div className={s.list}>
          {teachers.map((teacher) => (
            <Card
              photo={teacher.photoPathSquare}
              firstName={teacher.firstName}
              patrName={teacher.patrName}
              subject={teacher.teachingSubjects[0].subject.name}
              price={teacher.teachingSubjects[0].price}
              key={teacher.id}
            />
          ))}
        </div>
      )}
      {teachers.length > 0 && loading && <Spinner />}
      {isOver && <span>Больше нет</span>}
      {teachers && teachers.length > 0 && (
        <button
          className={s.buttonLoadMore}
          onClick={handleLoadMoreClick}
          disabled={disabled || loading}
          type="button"
        >
          Загрузить еще
        </button>
      )}
    </div>
  );
}
