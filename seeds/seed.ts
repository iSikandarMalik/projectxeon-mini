import { connectionSource } from '../src/config/typeorm';
import { Company } from '../src/modules/company/entities/company.entity';
import { User } from '../src/modules/user/entities/user.entity';

async function seed() {
  await connectionSource.initialize();

  try {
    const companyRepository = connectionSource.getRepository(Company);
    const company = companyRepository.create({
      name: 'Thirteenx',
      business_email: 'admin@thirteenx.ai',
      company_id: 'e35dca25-2586-45fb-9ffd-edc691aeac9c',
      status: false,
      active: false,
    });
    await companyRepository.save(company);

    const userRepository = connectionSource.getRepository(User);
    const user = userRepository.create({
      user_id: 'c5a5bd32-d35f-4b74-8c11-9454a63d25f8',
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@thirteenx.ai',
      password: '$2a$10$f0tAWNGdqtrCd1bdorvoquFedv3C5s15Gr1bt/DBXuJGE1vj/izUW',
      status: false,
      role: 'super',
      company,
    });
    await userRepository.save(user);

    console.log('Seeding completed.');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await connectionSource.destroy();
    process.exit(0);
  }
}

seed().catch((error) => {
  console.error('Seeding encountered an error:', error);
  process.exit(1);
});
