import {BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../auth/user.entity";

@Entity()
export class Task extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: string;

  @ManyToOne(type => User, user => user.task, {eager: false})
  user: User;

  @Column()
  userId: number;
}
