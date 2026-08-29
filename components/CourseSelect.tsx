'use client';

const baseInputClasses =
  'mt-1 w-full rounded-md border bg-background px-3 py-2 text-foreground focus:ring-1 focus:outline-none';
const normalBorder = 'border-guild-green/30 focus:border-guild-green focus:ring-guild-green';
const errorBorder = 'border-red-400 focus:border-red-400 focus:ring-red-400';
const labelClasses = 'text-sm font-medium text-muted';
const errorTextClasses = 'mt-1 text-sm text-red-400';

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

type CourseSelectProps = {
  department: string;
  course: string;
  onDepartmentChange: (value: string) => void;
  onCourseChange: (value: string) => void;
  departmentError?: string;
  courseError?: string;
};

export function CourseSelect({
  department,
  course,
  onDepartmentChange,
  onCourseChange,
  departmentError,
  courseError,
}: CourseSelectProps) {
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
          onChange={(e) => onDepartmentChange(e.target.value)}
          className={`${baseInputClasses} ${departmentError ? errorBorder : normalBorder}`}
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
        {departmentError && <p className={errorTextClasses}>{departmentError}</p>}
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
          value={course}
          onChange={(e) => onCourseChange(e.target.value)}
          className={`${baseInputClasses} ${courseError ? errorBorder : normalBorder}`}
        >
          <option value="" disabled>
            {department ? 'Select course' : 'Select department first'}
          </option>
          {(departments[department] ?? []).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {courseError && <p className={errorTextClasses}>{courseError}</p>}
      </div>
    </div>
  );
}