import type { Department, Province, District } from '../types/ubigeo';
import departmentsData from '../data/json/ubigeo_peru_2016_departamentos.json';
import provincesData from '../data/json/ubigeo_peru_2016_provincias.json';
import districtsData from '../data/json/ubigeo_peru_2016_distritos.json';

const departments: Department[] = departmentsData;
const provinces: Province[] = provincesData;
const districts: District[] = districtsData;

/** Get all departments (regions) sorted by name */
export function getAllDepartments(): Department[] {
  return [...departments].sort((a, b) => a.name.localeCompare(b.name));
}

/** Get all provinces sorted by name */
export function getAllProvinces(): Province[] {
  return [...provinces].sort((a, b) => a.name.localeCompare(b.name));
}

/** Get all districts sorted by name */
export function getAllDistricts(): District[] {
  return [...districts].sort((a, b) => a.name.localeCompare(b.name));
}

/** Find a department by its ID */
export function findDepartmentById(id: string): Department | undefined {
  return departments.find((d) => d.id === id);
}

/** Find a province by its ID */
export function findProvinceById(id: string): Province | undefined {
  return provinces.find((p) => p.id === id);
}

/** Find a district by its ID */
export function findDistrictById(id: string): District | undefined {
  return districts.find((d) => d.id === id);
}

/** Get provinces belonging to a specific department */
export function getProvincesByDepartmentId(departmentId: string): Province[] {
  return provinces
    .filter((p) => p.department_id === departmentId)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Get districts belonging to a specific province */
export function getDistrictsByProvinceId(provinceId: string): District[] {
  return districts
    .filter((d) => d.province_id === provinceId)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Get districts belonging to a specific department */
export function getDistrictsByDepartmentId(departmentId: string): District[] {
  return districts
    .filter((d) => d.department_id === departmentId)
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Search departments by name (case-insensitive) */
export function searchDepartments(query: string): Department[] {
  const q = query.trim().toLowerCase();
  if (!q) return getAllDepartments();
  return departments
    .filter((d) => d.name.toLowerCase().includes(q))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Search provinces by name (optionally filtered by department) */
export function searchProvinces(query: string, departmentId?: string): Province[] {
  const q = query.trim().toLowerCase();
  let result = departmentId
    ? provinces.filter((p) => p.department_id === departmentId)
    : provinces;
  if (q) {
    result = result.filter((p) => p.name.toLowerCase().includes(q));
  }
  return result.sort((a, b) => a.name.localeCompare(b.name));
}

/** Search districts by name (optionally filtered by province or department) */
export function searchDistricts(
  query: string,
  filters?: { provinceId?: string; departmentId?: string }
): District[] {
  const q = query.trim().toLowerCase();
  let result = districts;

  if (filters?.provinceId) {
    result = result.filter((d) => d.province_id === filters.provinceId);
  }
  if (filters?.departmentId) {
    result = result.filter((d) => d.department_id === filters.departmentId);
  }
  if (q) {
    result = result.filter((d) => d.name.toLowerCase().includes(q));
  }

  return result.sort((a, b) => a.name.localeCompare(b.name));
}

/** Build a hierarchical path [Department, Province, District] for a given district ID */
export function getDistrictHierarchy(districtId: string): {
  department: Department | undefined;
  province: Province | undefined;
  district: District | undefined;
} {
  const district = findDistrictById(districtId);
  const province = district ? findProvinceById(district.province_id) : undefined;
  const department = province ? findDepartmentById(province.department_id) : undefined;
  return { department, province, district };
}
