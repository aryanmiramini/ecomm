import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UserRole } from '@prisma/client';

const logger = new Logger('SuperAdminBootstrap');

export async function ensureSuperAdmin(app: INestApplication): Promise<void> {
  const configService = app.get(ConfigService);
  const email = configService.get<string>('SUPER_ADMIN_EMAIL');
  const phone = configService.get<string>('SUPER_ADMIN_PHONE');
  const password = configService.get<string>('SUPER_ADMIN_PASSWORD');
  const firstName = configService.get<string>('SUPER_ADMIN_FIRST_NAME') ?? 'Super';
  const lastName = configService.get<string>('SUPER_ADMIN_LAST_NAME') ?? 'Admin';

  if (!email || !phone || !password) {
    logger.warn('Super admin credentials are not fully configured. Skipping bootstrap.');
    return;
  }

  const usersService = app.get(UsersService);
  const existingAdmin = await usersService.findOneByEmail(email);

  if (existingAdmin) {
    if (existingAdmin.role !== UserRole.ADMIN) {
      await usersService.update(existingAdmin.id, { role: UserRole.ADMIN }, { allowRoleChange: true });
      logger.log('Ensured existing super admin account has ADMIN role.');
    }
    return;
  }

  await usersService.create(
    {
      email,
      phone,
      password,
      firstName,
      lastName,
    },
    { role: UserRole.ADMIN },
  );

  logger.log(`Super admin account created for ${email}`);
}

