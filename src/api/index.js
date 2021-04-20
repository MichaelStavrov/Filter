export async function fetchSubjects() {
  const response = await fetch("https://api.repetit.ru/public/subjects");
  const data = await response.json();
  return data;
}

export async function fetchAreas() {
  const response = await fetch(" https://api.repetit.ru/public/areas");
  const data = await response.json();
  return data;
}

export async function fetchDistricts(id) {
  const response = await fetch(
    `https://api.repetit.ru/public/districts?areaId=${id}`
  );
  const data = await response.json();
  return data;
}

export async function fetchTeacherIds(subjectId, areaId, districtId) {
  const response = await fetch(
    `https://api.repetit.ru/public/search/teacherIds?subjectId=${subjectId}&areaId=${areaId}&districtId=${districtId}`
  );
  const data = await response.json();
  return data;
}

export async function fetchTeachersShort(ids) {
  if (ids.length === 0) {
    return [];
  }
  const stringIds = ids.reduce((acc, id) => (acc += `ids=${id}&`), "");
  const response = await fetch(
    `https://api.repetit.ru/public/teachers/short?&${stringIds}`
  );
  const data = await response.json();
  return data;
}
