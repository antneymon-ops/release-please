export const QualityGates = {
  default: {
    name: "SonarQube Default",
    conditions: [
      {
        metric: "new_coverage",
        operator: "LT",
        value: "80",
        error: true,
      },
      {
        metric: "new_duplicated_lines_density",
        operator: "GT",
        value: "3",
        error: true,
      },
      {
        metric: "new_maintainability_rating",
        operator: "GT",
        value: "1",
        error: true,
      },
      {
        metric: "new_reliability_rating",
        operator: "GT",
        value: "1",
        error: true,
      },
      {
        metric: "new_security_rating",
        operator: "GT",
        value: "1",
        error: true,
      },
    ],
  },
  strict: {
    name: "Strict Quality Gate",
    conditions: [
      {
        metric: "new_coverage",
        operator: "LT",
        value: "90",
        error: true,
      },
      {
        metric: "new_duplicated_lines_density",
        operator: "GT",
        value: "2",
        error: true,
      },
      {
        metric: "new_blocker_violations",
        operator: "GT",
        value: "0",
        error: true,
      },
      {
        metric: "new_critical_violations",
        operator: "GT",
        value: "0",
        error: true,
      },
      {
        metric: "new_major_violations",
        operator: "GT",
        value: "5",
        error: true,
      },
    ],
  },
  relaxed: {
    name: "Relaxed Quality Gate",
    conditions: [
      {
        metric: "new_coverage",
        operator: "LT",
        value: "60",
        error: true,
      },
      {
        metric: "new_duplicated_lines_density",
        operator: "GT",
        value: "5",
        error: true,
      },
      {
        metric: "new_blocker_violations",
        operator: "GT",
        value: "0",
        error: true,
      },
    ],
  },
};

export type QualityGateType = keyof typeof QualityGates;
