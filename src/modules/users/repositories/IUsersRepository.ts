import User from '@modules/users/infra/typeorm/entities/User';
import ICreatrUserDTO from '@modules/users/dtos/ICreateUserDTO';

export default interface IUsersRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(data: ICreatrUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
