import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateTeamMemberDto } from "./dto/create-team-member.dto";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";
import * as bcrypt from "bcryptjs";

const DEFAULT_PROVISIONAL_PASSWORD = "YieldProvisional123!";

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Team member with ID ${id} not found`);
    }

    return user;
  }

  async create(createTeamMemberDto: CreateTeamMemberDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: createTeamMemberDto.email },
    });

    if (existing) {
      throw new ConflictException("User with this email already exists");
    }

    const rawPassword = createTeamMemberDto.password || DEFAULT_PROVISIONAL_PASSWORD;
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    return this.prisma.user.create({
      data: {
        email: createTeamMemberDto.email,
        name: createTeamMemberDto.name,
        role: createTeamMemberDto.role || "user",
        status: createTeamMemberDto.status || "active",
        avatar: createTeamMemberDto.avatar,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, updateTeamMemberDto: UpdateTeamMemberDto) {
    await this.findOne(id);

    const dataToUpdate: any = {};
    if (updateTeamMemberDto.name !== undefined) dataToUpdate.name = updateTeamMemberDto.name;
    if (updateTeamMemberDto.role !== undefined) dataToUpdate.role = updateTeamMemberDto.role;
    if (updateTeamMemberDto.status !== undefined) dataToUpdate.status = updateTeamMemberDto.status;
    if (updateTeamMemberDto.avatar !== undefined) dataToUpdate.avatar = updateTeamMemberDto.avatar;

    if (updateTeamMemberDto.password) {
      dataToUpdate.password = await bcrypt.hash(updateTeamMemberDto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
