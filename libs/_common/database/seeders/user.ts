import { User } from 'src/user/models/user.model.js';
import { UserFactory, UsersFactory } from 'src/user/factories/user.factory';
import { buildRepository } from '../database-repository.builder';
import { IRepository } from '../repository.interface';
import { SecurityGroup } from 'src/security-group/entity/security-group.model';

export const seed = async ({ truncate, count }) => {
  const securityGroupRepository = new (buildRepository(SecurityGroup))() as IRepository<
    SecurityGroup
  >;
  const userRepository = new (buildRepository(User))() as IRepository<User>;

  // Remove all records
  if (truncate) await userRepository.truncateModel();

  // Check super admin role existence
  const superAdminRole = await securityGroupRepository.findOne({
    name: 'SuperAdmin'
  });
  if (!superAdminRole) {
    console.log('ERROR: Please seed roles first');
    process.exit(1);
  }

  // Seed super admin
  let superAdmin = await userRepository.findOne({ roleId: superAdminRole.id });
  if (!superAdmin)
    superAdmin = (await UserFactory(false, {
      roleId: superAdminRole.id,
      email: 'admin@instcare.com',
      isBlocked: false
    })) as User;

  // Seed users
  return [...(await UsersFactory(count - 1)), superAdmin];
};
