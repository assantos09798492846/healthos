import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service';

import {
  ClinicalParseResult,
  ClinicalPersistResult,
  ParsedLabResult,
} from './clinical-parser.types';

@Injectable()
export class ClinicalParserService {
  constructor(private readonly prisma: PrismaService) {}

  async preview(
    jobId: string,
  ): Promise<ClinicalParseResult> {
    const job = await this.getCompletedJob(jobId);

    const results = this.parse(
      job.extractedText as string,
    );

    return {
      jobId: job.id,
      documentId: job.document.id,
      patientId: job.document.patientId,
      totalDetected: results.length,
      results,
    };
  }

  async persist(
    jobId: string,
  ): Promise<ClinicalPersistResult> {
    const job = await this.getCompletedJob(jobId);

    const results = this.parse(
      job.extractedText as string,
    );

    if (results.length === 0) {
      throw new UnprocessableEntityException(
        'Nenhum resultado laboratorial foi identificado para persistência.',
      );
    }

    const existingResults =
      await this.prisma.labResult.count({
        where: {
          sourceDocumentId: job.document.id,
        },
      });

    if (existingResults > 0) {
      throw new ConflictException(
        'Este documento já possui resultados laboratoriais persistidos.',
      );
    }

    const persisted =
      await this.prisma.$transaction(async (tx) => {
        const created = [];

        for (const result of results) {
          const labResult =
            await tx.labResult.create({
              data: {
                patientId:
                  job.document.patientId,

                sourceDocumentId:
                  job.document.id,

                testCode:
                  result.testCode,

                testName:
                  result.testName,

                category:
                  result.category,

                valueNumber:
                  result.valueNumber,

                valueText:
                  result.valueText,

                unit:
                  result.unit,

                referenceLow:
                  result.referenceLow,

                referenceHigh:
                  result.referenceHigh,

                referenceText:
                  result.referenceText,

                interpretation:
                  result.interpretation,

                rawData: {
                  source: 'CLINICAL_PARSER',
                  processingJobId: job.id,
                  sourceText:
                    result.sourceText,
                },
              },
            });

          created.push(labResult);
        }

        return created;
      });

    return {
      jobId: job.id,
      documentId: job.document.id,
      patientId: job.document.patientId,
      detected: results.length,
      persisted: persisted.length,
    };
  }

  private async getCompletedJob(
    jobId: string,
  ) {
    const job =
      await this.prisma.documentProcessingJob.findUnique({
        where: {
          id: jobId,
        },
        include: {
          document: {
            select: {
              id: true,
              patientId: true,
              documentDate: true,
            },
          },
        },
      });

    if (!job) {
      throw new NotFoundException(
        'Processamento não encontrado.',
      );
    }

    if (job.status !== 'COMPLETED') {
      throw new UnprocessableEntityException(
        `O processamento precisa estar COMPLETED. Status atual: ${job.status}.`,
      );
    }

    if (!job.extractedText?.trim()) {
      throw new UnprocessableEntityException(
        'O processamento não possui texto extraído.',
      );
    }

    return job;
  }

  private parse(
    text: string,
  ): ParsedLabResult[] {
    const normalizedText =
      this.normalizeText(text);

    const results: ParsedLabResult[] = [];

    const patterns =
      this.getExamPatterns();

    for (const pattern of patterns) {
      const matches =
        normalizedText.matchAll(
          pattern.regex,
        );

      for (const match of matches) {
        const rawValue =
          match.groups?.value;

        const unit =
          match.groups?.unit?.trim();

        if (!rawValue) {
          continue;
        }

        const normalizedValue =
          rawValue
            .replace(/\s/g, '')
            .replace(',', '.');

        const numericValue =
          Number.parseFloat(
            normalizedValue.replace(
              /[<>]/g,
              '',
            ),
          );

        results.push({
          testName:
            pattern.testName,

          testCode:
            pattern.testCode,

          category:
            pattern.category,

          valueNumber:
            Number.isFinite(
              numericValue,
            )
              ? numericValue
              : undefined,

          valueText:
            rawValue.trim(),

          unit,

          sourceText:
            match[0].slice(
              0,
              1000,
            ),
        });
      }
    }

    return this.removeDuplicates(
      results,
    );
  }

  private normalizeText(
    text: string,
  ): string {
    return text
      .replace(/\r/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/[ ]{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  private getExamPatterns(): Array<{
    testName: string;
    testCode: string;
    category: string;
    regex: RegExp;
  }> {
    const numeric =
      '(?<value>[<>]?\\s*-?\\d+(?:[.,]\\d+)?)';

    const unit =
      '(?<unit>mg\\/dL|g\\/dL|ng\\/mL|pg\\/mL|µg\\/dL|ug\\/dL|µUI\\/mL|mUI\\/mL|UI\\/L|U\\/L|mmol\\/L|mEq\\/L|%|ng\\/dL|pg\\/dL)?';

    return [
      {
        testName: 'Glicemia',
        testCode: 'GLUCOSE',
        category: 'METABOLIC',
        regex: new RegExp(
          `\\b(?:glicemia|glicose)\\b[\\s\\S]{0,100}?resultado\\s*:?\\s*${numeric}\\s*${unit}`,
          'gi',
        ),
      },

      {
        testName:
          'Hemoglobina Glicada',
        testCode: 'HBA1C',
        category: 'METABOLIC',
        regex: new RegExp(
          `\\b(?:hemoglobina\\s+glicada|hba1c)\\b[\\s\\S]{0,150}?resultado\\s*:?\\s*${numeric}\\s*${unit}`,
          'gi',
        ),
      },

      {
        testName:
          'Colesterol Total',
        testCode:
          'TOTAL_CHOLESTEROL',
        category: 'LIPID',
        regex: new RegExp(
          `\\bcolesterol\\s+total\\b[\\s\\S]{0,100}?resultado\\s*:?\\s*${numeric}\\s*${unit}`,
          'gi',
        ),
      },

      {
        testName:
          'HDL Colesterol',
        testCode:
          'HDL_CHOLESTEROL',
        category: 'LIPID',
        regex: new RegExp(
          `\\b(?:colesterol\\s+hdl|hdl\\s+colesterol|hdl)\\b[\\s\\S]{0,100}?resultado\\s*:?\\s*${numeric}\\s*${unit}`,
          'gi',
        ),
      },

      {
        testName:
          'LDL Colesterol',
        testCode:
          'LDL_CHOLESTEROL',
        category: 'LIPID',
        regex: new RegExp(
          `\\b(?:colesterol\\s+ldl|ldl\\s+colesterol|ldl)\\b[\\s\\S]{0,100}?resultado\\s*:?\\s*${numeric}\\s*${unit}`,
          'gi',
        ),
      },

      {
        testName:
          'Triglicerídeos',
        testCode:
          'TRIGLYCERIDES',
        category: 'LIPID',
        regex: new RegExp(
          `\\btriglicer[ií]deos\\b[\\s\\S]{0,100}?resultado\\s*:?\\s*${numeric}\\s*${unit}`,
          'gi',
        ),
      },

      {
        testName: 'Creatinina',
        testCode: 'CREATININE',
        category: 'RENAL',
        regex: new RegExp(
          `\\bcreatinina\\b[\\s\\S]{0,100}?resultado\\s*:?\\s*${numeric}\\s*${unit}`,
          'gi',
        ),
      },

      {
        testName: 'Ureia',
        testCode: 'UREA',
        category: 'RENAL',
        regex: new RegExp(
          `\\bureia\\b[\\s\\S]{0,100}?resultado\\s*:?\\s*${numeric}\\s*${unit}`,
          'gi',
        ),
      },

      {
        testName: 'TSH',
        testCode: 'TSH',
        category: 'THYROID',
        regex: new RegExp(
          `\\b(?:tsh|horm[oô]nio\\s+tireoestimulante)\\b[\\s\\S]{0,120}?resultado\\s*:?\\s*${numeric}\\s*${unit}`,
          'gi',
        ),
      },

      {
        testName: 'T4 Livre',
        testCode: 'FREE_T4',
        category: 'THYROID',
        regex: new RegExp(
          `\\bt4\\s+livre\\b[\\s\\S]{0,120}?resultado\\s*:?\\s*${numeric}\\s*${unit}`,
          'gi',
        ),
      },

      {
        testName: 'Vitamina D',
        testCode: 'VITAMIN_D',
        category: 'VITAMIN',
        regex: new RegExp(
          `\\b(?:vitamina\\s+d|25[- ]?oh\\s+vitamina\\s+d)\\b[\\s\\S]{0,120}?resultado\\s*:?\\s*${numeric}\\s*${unit}`,
          'gi',
        ),
      },

      {
        testName:
          'Vitamina B12',
        testCode: 'VITAMIN_B12',
        category: 'VITAMIN',
        regex: new RegExp(
          `\\bvitamina\\s+b12\\b[\\s\\S]{0,120}?resultado\\s*:?\\s*${numeric}\\s*${unit}`,
          'gi',
        ),
      },

      {
        testName: 'Ferritina',
        testCode: 'FERRITIN',
        category: 'IRON',
        regex: new RegExp(
          `\\bferritina\\b[\\s\\S]{0,120}?resultado\\s*:?\\s*${numeric}\\s*${unit}`,
          'gi',
        ),
      },

      {
        testName: 'PSA Total',
        testCode: 'PSA_TOTAL',
        category: 'PROSTATE',
        regex: new RegExp(
          `\\bpsa\\s+total\\b[\\s\\S]{0,120}?resultado\\s*:?\\s*${numeric}\\s*${unit}`,
          'gi',
        ),
      },

      {
        testName:
          'Testosterona Total',
        testCode:
          'TESTOSTERONE_TOTAL',
        category: 'HORMONE',
        regex: new RegExp(
          `\\btestosterona\\s+total\\b[\\s\\S]{0,120}?resultado\\s*:?\\s*${numeric}\\s*${unit}`,
          'gi',
        ),
      },

      {
        testName:
          'Testosterona Livre',
        testCode:
          'TESTOSTERONE_FREE',
        category: 'HORMONE',
        regex: new RegExp(
          `\\btestosterona\\s+livre\\b[\\s\\S]{0,120}?resultado\\s*:?\\s*${numeric}\\s*${unit}`,
          'gi',
        ),
      },

      {
        testName: 'Insulina',
        testCode: 'INSULIN',
        category: 'METABOLIC',
        regex: new RegExp(
          `\\binsulina\\b[\\s\\S]{0,120}?resultado\\s*:?\\s*${numeric}\\s*${unit}`,
          'gi',
        ),
      },

      {
        testName: 'TGO / AST',
        testCode: 'AST',
        category: 'LIVER',
        regex: new RegExp(
          `\\b(?:tgo|ast|aspartato\\s+aminotransferase)\\b[\\s\\S]{0,120}?resultado\\s*:?\\s*${numeric}\\s*${unit}`,
          'gi',
        ),
      },

      {
        testName: 'TGP / ALT',
        testCode: 'ALT',
        category: 'LIVER',
        regex: new RegExp(
          `\\b(?:tgp|alt|alanina\\s+aminotransferase)\\b[\\s\\S]{0,120}?resultado\\s*:?\\s*${numeric}\\s*${unit}`,
          'gi',
        ),
      },

      {
        testName: 'Gama GT',
        testCode: 'GGT',
        category: 'LIVER',
        regex: new RegExp(
          `\\b(?:gama\\s*gt|ggt|gama\\s+glutamil)\\b[\\s\\S]{0,120}?resultado\\s*:?\\s*${numeric}\\s*${unit}`,
          'gi',
        ),
      },
    ];
  }

  private removeDuplicates(
    results: ParsedLabResult[],
  ): ParsedLabResult[] {
    const unique =
      new Map<
        string,
        ParsedLabResult
      >();

    for (const result of results) {
      const key = [
        result.testCode ??
          result.testName.toLowerCase(),
        result.valueText ?? '',
        result.unit ?? '',
      ].join('|');

      if (!unique.has(key)) {
        unique.set(
          key,
          result,
        );
      }
    }

    return [
      ...unique.values(),
    ];
  }
}