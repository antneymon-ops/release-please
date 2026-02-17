export const CustomRules = {
  antiPatterns: [
    {
      id: "god-object",
      name: "God Object Detection",
      description: "Detects classes with too many responsibilities",
      severity: "CRITICAL",
      thresholds: {
        maxMethods: 20,
        maxLines: 500,
      },
    },
    {
      id: "long-method",
      name: "Long Method",
      description: "Detects methods that are too long",
      severity: "HIGH",
      thresholds: {
        maxLines: 50,
      },
    },
    {
      id: "magic-number",
      name: "Magic Number",
      description: "Detects unexplained numeric literals",
      severity: "MEDIUM",
      excludeValues: [0, 1, -1, 100, 1000],
    },
    {
      id: "duplicate-code",
      name: "Duplicate Code",
      description: "Detects duplicated code blocks",
      severity: "HIGH",
      thresholds: {
        minChunkSize: 6,
      },
    },
    {
      id: "complex-conditional",
      name: "Complex Conditional",
      description: "Detects overly complex conditional statements",
      severity: "MEDIUM",
      thresholds: {
        maxLogicalOperators: 3,
      },
    },
    {
      id: "long-parameter-list",
      name: "Long Parameter List",
      description: "Detects functions with too many parameters",
      severity: "MEDIUM",
      thresholds: {
        maxParameters: 5,
      },
    },
    {
      id: "deep-nesting",
      name: "Deep Nesting",
      description: "Detects deeply nested code blocks",
      severity: "MEDIUM",
      thresholds: {
        maxNestingLevel: 4,
      },
    },
    {
      id: "circular-dependency",
      name: "Circular Dependency",
      description: "Detects potential circular dependencies",
      severity: "MEDIUM",
    },
  ],
  codeSmells: [
    {
      id: "feature-envy",
      name: "Feature Envy",
      description: "Method uses more features from another class",
      severity: "MEDIUM",
    },
    {
      id: "inappropriate-intimacy",
      name: "Inappropriate Intimacy",
      description: "Classes that know too much about each other",
      severity: "MEDIUM",
    },
    {
      id: "lazy-class",
      name: "Lazy Class",
      description: "Class that doesn't do enough to justify existence",
      severity: "LOW",
    },
    {
      id: "dead-code",
      name: "Dead Code",
      description: "Unused code that should be removed",
      severity: "MEDIUM",
    },
  ],
};

export type RuleId = string;
export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
