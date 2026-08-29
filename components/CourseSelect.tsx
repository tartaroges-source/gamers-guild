'use client';

import { useState } from 'react';

const inputClasses =
  'mt-1 w-full rounded-md border border-guild-green/30 bg-background px-3 py-2 text-foreground focus:border-guild-green focus:ring-1 focus:ring-guild-green focus:outline-none';
const labelClasses = 'text-sm font-medium text-muted';

const departments: Record<string, string[]> = {
  COE: ['BSCPE', 'BSIE', 'BSECE'],
  CCS: ['BSIT', 'BSCS'],
  BSBA: ['BSA', 'Marketing', 'Financial Management'],
  COED: [
    'BS Secondary Education - Major in Math',
    'BS Secondary Education - Major in Social Science',
    'BS Secondary Education - Major in English',
    'BS Secondary Education - Major in Filipino',
    'Elementary Education',
  ],
  CHAS: ['BSN', 'BSPSY'],
};

export function CourseSelect() {
  const [department, setDepartment] = useState('');

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="department" className={labelClasses}>
          Department
        </label>
        <select
          id="department"
          name="department"
          required
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className={inputClasses}
        >
          <option value="" disabled>
            Select department
          </option>
          {Object.keys(departments).map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="course" className={labelClasses}>
          Course
        </label>
        <select
          id="course"
          name="course"
          required
          disabled={!department}
          className={inputClasses}
          defaultValue=""
        >
          <option value="" disabled>
            {department ? 'Select course' : 'Select department first'}
          </option>
          {(departments[department] ?? []).map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}