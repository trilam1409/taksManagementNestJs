import {EntityRepository, Repository} from "typeorm";
import {UserEntity} from "./user.entity";

@EntityRepository()
export class UserRepository extends Repository<UserEntity> {

}
