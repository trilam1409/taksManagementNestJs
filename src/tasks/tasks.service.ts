import {Injectable, NotFoundException} from '@nestjs/common';
import {TaskRepository} from "./task.repository";
import {InjectRepository} from '@nestjs/typeorm';
import {Task} from './task.entity';
import {TaskStatus} from "./task-status.enum";
import {CreateTaskDto} from './dto/create-task.dto';
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {User} from "../auth/user.entity";

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {
  }


  async getTasks(taskDto: GetTasksFilterDto, user: User): Promise<Task[]>{
    return await this.taskRepository.getTask(taskDto, user)
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({id, userId: user.id});

    if (!found) {
      throw new NotFoundException(`${id} not found`)
    }
    return found;
  }


  async createTask(
      createTaskDto: CreateTaskDto,
      user: User
  ): Promise<Task>{
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    const task = await this.taskRepository.delete({id, userId: user.id});
    if (!task.affected) {
      throw new NotFoundException(`${id} not found`)
    }
  }

  async updateTask(id: number, newStatus: TaskStatus, user: User): Promise<Task>{
    const task = await this.getTaskById(id, user);
    task.status = newStatus;
    await task.save();
    return task;
  }

}
