import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SexAtBirth } from '../../generated/prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.patient.findMany({
      orderBy: {
        fullName: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        medicalRecord: true,
        medications: true,
      },
    });

    if (!patient) {
      throw new NotFoundException('Paciente não encontrado.');
    }

    return patient;
  }

  async create(dto: CreatePatientDto) {
    const user = await this.prisma.user.create({
      data: {
        email: `patient-${crypto.randomUUID()}@healthos.local`,
        displayName: dto.fullName,
        role: 'OWNER',
      },
    });

    return this.prisma.patient.create({
      data: {
        userId: user.id,
        fullName: dto.fullName,
        birthDate: new Date(`${dto.birthDate}T00:00:00.000Z`),
        sexAtBirth: dto.sexAtBirth as SexAtBirth,
        cpf: dto.cpf,
        bloodType: dto.bloodType,
        heightCm: dto.heightCm,
      },
    });
  }

  async update(id: string, dto: UpdatePatientDto) {
    await this.findOne(id);

    return this.prisma.patient.update({
      where: { id },
      data: {
        fullName: dto.fullName,
        birthDate: dto.birthDate
          ? new Date(`${dto.birthDate}T00:00:00.000Z`)
          : undefined,
        sexAtBirth: dto.sexAtBirth
          ? (dto.sexAtBirth as SexAtBirth)
          : undefined,
        cpf: dto.cpf,
        bloodType: dto.bloodType,
        heightCm: dto.heightCm,
      },
    });
  }

  async remove(id: string) {
    const patient = await this.findOne(id);

    await this.prisma.user.delete({
      where: {
        id: patient.userId,
      },
    });

    return {
      deleted: true,
      id,
    };
  }
}
