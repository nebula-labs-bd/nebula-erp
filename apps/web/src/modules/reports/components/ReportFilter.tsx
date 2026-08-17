import type { ReportPeriod, ReportPeriodType } from "../types/report.types";

type ReportFilterProps = {
  period: ReportPeriod;

  /** Called whenever the user changes the date range or period type. */
  onChange: (period: ReportPeriod) => void;

  /**
   * Whether to expose the period-type selector (monthly / yearly / custom).
   * The date inputs are always available; the type selector enables the
   * structure for future monthly and yearly report modes.
   */
  showTypeSelector?: boolean;
};

const PERIOD_TYPES: { value: ReportPeriodType; label: string }[] = [
  { value: "custom", label: "Custom" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

function inputClass(): string {
  return "rounded border border-[var(--nebula-border)] p-2";
}

export default function ReportFilter({
  period,
  onChange,
  showTypeSelector = false,
}: ReportFilterProps) {
  function update(patch: Partial<ReportPeriod>) {
    onChange({ ...period, ...patch });
  }

  return (
    <div className="flex flex-wrap items-end gap-4 rounded-lg border border-[var(--nebula-border)] bg-[var(--nebula-surface)] p-4">
      <div>
        <label className="block text-sm font-medium mb-1">Start Date</label>

        <input
          type="date"
          className={inputClass()}
          value={period.startDate}
          onChange={(event) => {
            update({ startDate: event.target.value });
          }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">End Date</label>

        <input
          type="date"
          className={inputClass()}
          value={period.endDate}
          onChange={(event) => {
            update({ endDate: event.target.value });
          }}
        />
      </div>

      {showTypeSelector && (
        <div>
          <label className="block text-sm font-medium mb-1">Period</label>

          <select
            className={inputClass()}
            value={period.type ?? "custom"}
            onChange={(event) => {
              update({ type: event.target.value as ReportPeriodType });
            }}
          >
            {PERIOD_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
