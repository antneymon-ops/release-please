export interface QualityMetrics {
  bugs: number;
  vulnerabilities: number;
  codeSmells: number;
  coverage: number;
  duplicatedLinesDensity: number;
  ncloc: number;
  complexity: number;
}

export class MetricsCalculator {
  static parseMetrics(data: any): QualityMetrics {
    const measures = data.component?.measures || [];
    const metrics: any = {};

    measures.forEach((measure: any) => {
      metrics[measure.metric] = parseFloat(measure.value) || 0;
    });

    return {
      bugs: metrics.bugs || 0,
      vulnerabilities: metrics.vulnerabilities || 0,
      codeSmells: metrics.code_smells || 0,
      coverage: metrics.coverage || 0,
      duplicatedLinesDensity: metrics.duplicated_lines_density || 0,
      ncloc: metrics.ncloc || 0,
      complexity: metrics.complexity || 0,
    };
  }

  static formatMetrics(metrics: QualityMetrics): string {
    return `
Quality Metrics:
- Bugs: ${metrics.bugs}
- Vulnerabilities: ${metrics.vulnerabilities}
- Code Smells: ${metrics.codeSmells}
- Coverage: ${metrics.coverage.toFixed(2)}%
- Duplicated Lines: ${metrics.duplicatedLinesDensity.toFixed(2)}%
- Lines of Code: ${metrics.ncloc}
- Complexity: ${metrics.complexity}
    `.trim();
  }

  static calculateHealthScore(metrics: QualityMetrics): {
    score: number;
    grade: string;
  } {
    let score = 100;

    // Deduct points for issues
    score -= metrics.bugs * 5;
    score -= metrics.vulnerabilities * 10;
    score -= metrics.codeSmells * 0.5;

    // Deduct for low coverage
    if (metrics.coverage < 80) {
      score -= (80 - metrics.coverage) * 0.5;
    }

    // Deduct for duplication
    score -= metrics.duplicatedLinesDensity * 2;

    score = Math.max(0, Math.min(100, score));

    let grade: string;
    if (score >= 90) grade = "A";
    else if (score >= 80) grade = "B";
    else if (score >= 70) grade = "C";
    else if (score >= 60) grade = "D";
    else grade = "F";

    return { score: Math.round(score), grade };
  }
}
