import * as fs from "fs/promises";
import { logger } from "./utils/logger.js";

export interface AntiPattern {
  name: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  description: string;
  location: {
    file: string;
    line?: number;
    column?: number;
  };
  recommendation: string;
}

export class AntiPatternDetector {
  async analyze(filePath: string): Promise<AntiPattern[]> {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const patterns: AntiPattern[] = [];

      logger.info({ filePath }, "Analyzing file for anti-patterns");

      // Detect various anti-patterns
      patterns.push(...this.detectGodObject(content, filePath));
      patterns.push(...this.detectMagicNumbers(content, filePath));
      patterns.push(...this.detectLongMethods(content, filePath));
      patterns.push(...this.detectDuplicateCode(content, filePath));
      patterns.push(...this.detectComplexConditionals(content, filePath));
      patterns.push(...this.detectCircularDependencies(content, filePath));
      patterns.push(...this.detectLongParameterLists(content, filePath));
      patterns.push(...this.detectDeepNesting(content, filePath));

      logger.info(
        { filePath, patternCount: patterns.length },
        "Anti-pattern analysis complete"
      );

      return patterns;
    } catch (error) {
      logger.error({ error, filePath }, "Failed to analyze file");
      throw new Error(
        `Failed to analyze ${filePath}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private detectGodObject(content: string, filePath: string): AntiPattern[] {
    const lines = content.split("\n");
    const patterns: AntiPattern[] = [];

    // Count methods (public, private, protected functions)
    const methodRegex =
      /^\s*(public|private|protected|async|static)?\s*(async)?\s+(\w+)\s*\(/gm;
    const methods = content.match(methodRegex) || [];

    // Count class definitions
    const classRegex = /^\s*class\s+\w+/gm;
    const classes = content.match(classRegex) || [];

    if (methods.length > 20 && classes.length > 0) {
      patterns.push({
        name: "God Object",
        severity: "CRITICAL",
        description: `Class has ${methods.length} methods (threshold: 20). This violates Single Responsibility Principle.`,
        location: { file: filePath, line: 1 },
        recommendation:
          "Apply Single Responsibility Principle. Extract related methods into separate classes or modules. Consider using composition over inheritance.",
      });
    }

    if (lines.length > 500) {
      patterns.push({
        name: "God Object / Large File",
        severity: "HIGH",
        description: `File has ${lines.length} lines (threshold: 500). File is too large and complex.`,
        location: { file: filePath, line: 1 },
        recommendation:
          "Break down into smaller, focused modules. Each module should have a single, well-defined responsibility.",
      });
    }

    return patterns;
  }

  private detectMagicNumbers(content: string, filePath: string): AntiPattern[] {
    const patterns: AntiPattern[] = [];
    const lines = content.split("\n");

    // Detect numeric literals that aren't 0, 1, -1, 100, 1000 (common constants)
    const magicNumberRegex = /[^a-zA-Z0-9_]((?!0\b|1\b|-1\b|100\b|1000\b)\d{2,})/g;

    lines.forEach((line, index) => {
      // Skip lines with comments
      if (line.trim().startsWith("//") || line.trim().startsWith("*")) {
        return;
      }

      const matches = line.matchAll(magicNumberRegex);
      for (const match of matches) {
        patterns.push({
          name: "Magic Number",
          severity: "MEDIUM",
          description: `Magic number detected: ${match[1]}. Unexplained numeric literal reduces code readability.`,
          location: { file: filePath, line: index + 1 },
          recommendation:
            "Extract to named constant with descriptive name. Example: const MAX_RETRIES = 3;",
        });
      }
    });

    return patterns;
  }

  private detectLongMethods(content: string, filePath: string): AntiPattern[] {
    const patterns: AntiPattern[] = [];
    const lines = content.split("\n");

    let inMethod = false;
    let methodStart = 0;
    let methodName = "";
    let braceCount = 0;

    lines.forEach((line, index) => {
      const methodMatch = line.match(
        /^\s*(public|private|protected|async|static)*\s*(async)?\s*(\w+)\s*\(/
      );

      if (methodMatch && !inMethod) {
        inMethod = true;
        methodStart = index;
        methodName = methodMatch[3];
        braceCount = 0;
      }

      if (inMethod) {
        braceCount += (line.match(/{/g) || []).length;
        braceCount -= (line.match(/}/g) || []).length;

        if (braceCount === 0 && line.includes("}")) {
          const methodLength = index - methodStart;
          if (methodLength > 50) {
            patterns.push({
              name: "Long Method",
              severity: "HIGH",
              description: `Method '${methodName}' has ${methodLength} lines (threshold: 50). Long methods are hard to understand and maintain.`,
              location: { file: filePath, line: methodStart + 1 },
              recommendation:
                "Extract smaller methods with single responsibilities. Apply Extract Method refactoring pattern.",
            });
          }
          inMethod = false;
        }
      }
    });

    return patterns;
  }

  private detectDuplicateCode(content: string, filePath: string): AntiPattern[] {
    const patterns: AntiPattern[] = [];
    const lines = content.split("\n");
    const chunkSize = 6; // Look for 6+ duplicate lines

    const chunks = new Map<string, number[]>();

    for (let i = 0; i < lines.length - chunkSize; i++) {
      const chunk = lines
        .slice(i, i + chunkSize)
        .map((l) => l.trim())
        .filter((l) => l.length > 0)
        .join("\n");

      if (chunk.length < 50) continue; // Skip small chunks

      if (!chunks.has(chunk)) {
        chunks.set(chunk, []);
      }
      chunks.get(chunk)!.push(i);
    }

    chunks.forEach((locations) => {
      if (locations.length > 1) {
        patterns.push({
          name: "Duplicate Code",
          severity: "HIGH",
          description: `${chunkSize} lines duplicated ${locations.length} times. Code duplication increases maintenance burden.`,
          location: { file: filePath, line: locations[0] + 1 },
          recommendation:
            "Extract duplicate code into reusable function/method. Apply DRY (Don't Repeat Yourself) principle.",
        });
      }
    });

    return patterns;
  }

  private detectComplexConditionals(
    content: string,
    filePath: string
  ): AntiPattern[] {
    const patterns: AntiPattern[] = [];
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      // Count logical operators in if statements
      if (line.includes("if") && !line.trim().startsWith("//")) {
        const operators = (line.match(/&&|\|\|/g) || []).length;
        if (operators > 3) {
          patterns.push({
            name: "Complex Conditional",
            severity: "MEDIUM",
            description: `Conditional has ${operators} logical operators (threshold: 3). Complex conditionals are hard to understand.`,
            location: { file: filePath, line: index + 1 },
            recommendation:
              "Extract conditions into well-named boolean variables or predicate methods. Example: const isValid = checkA() && checkB();",
          });
        }
      }
    });

    return patterns;
  }

  private detectCircularDependencies(
    content: string,
    filePath: string
  ): AntiPattern[] {
    const patterns: AntiPattern[] = [];
    const imports = content.match(/import .+ from ['"](.+)['"]/g) || [];

    // Simple check: if file imports something that might import it back
    // Full circular dependency detection requires project-wide analysis
    imports.forEach((imp) => {
      const match = imp.match(/from ['"](.+)['"]/);
      if (match && match[1].includes("..")) {
        const lineNumber =
          content.substring(0, content.indexOf(imp)).split("\n").length;
        patterns.push({
          name: "Potential Circular Dependency",
          severity: "MEDIUM",
          description: `Import from parent directory: ${match[1]}. May indicate circular dependencies.`,
          location: { file: filePath, line: lineNumber },
          recommendation:
            "Review module structure. Consider dependency injection or reorganizing modules to break cycles.",
        });
      }
    });

    return patterns;
  }

  private detectLongParameterLists(
    content: string,
    filePath: string
  ): AntiPattern[] {
    const patterns: AntiPattern[] = [];
    const lines = content.split("\n");

    lines.forEach((line, index) => {
      // Match function/method declarations
      const funcMatch = line.match(/\w+\s*\([^)]+\)/);
      if (funcMatch) {
        const params = funcMatch[0].match(/,/g) || [];
        if (params.length >= 5) {
          patterns.push({
            name: "Long Parameter List",
            severity: "MEDIUM",
            description: `Function has ${params.length + 1} parameters (threshold: 5). Too many parameters make function calls error-prone.`,
            location: { file: filePath, line: index + 1 },
            recommendation:
              "Use parameter object pattern. Group related parameters into objects. Example: function process(options: ProcessOptions)",
          });
        }
      }
    });

    return patterns;
  }

  private detectDeepNesting(content: string, filePath: string): AntiPattern[] {
    const patterns: AntiPattern[] = [];
    const lines = content.split("\n");

    let currentIndent = 0;

    lines.forEach((line, index) => {
      const indent = line.search(/\S/);
      if (indent > 0) {
        currentIndent = Math.floor(indent / 2); // Assuming 2-space indent
      }

      if (currentIndent > 4) {
        patterns.push({
          name: "Deep Nesting",
          severity: "MEDIUM",
          description: `Nesting level ${currentIndent} detected (threshold: 4). Deep nesting reduces readability.`,
          location: { file: filePath, line: index + 1 },
          recommendation:
            "Extract nested blocks into separate methods. Use early returns to reduce nesting. Apply Guard Clauses pattern.",
        });
      }
    });

    return patterns;
  }
}
