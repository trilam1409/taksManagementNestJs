import {Injectable, NotFoundException} from '@nestjs/common';
import {TaskRepository} from "./task.repository";
import {InjectRepository} from '@nestjs/typeorm';
import {Task} from './task.entity';
import {TaskStatus} from "./task-status.enum";
import {CreateTaskDto} from './dto/create-task.dto';
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";

@Injectable()
export class TasksService {

  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {
  }


  async getTasks(taskDto: GetTasksFilterDto): Promise<Task[]>{
    return await this.taskRepository.getTask(taskDto)
  }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`${id} not found`)
    }
    return found;
  }


  async createTask(createTaskDto: CreateTaskDto): Promise<Task>{
    return this.taskRepository.createTask(createTaskDto);
  }

  async deleteTask(id: number): Promise<void> {
    const task = await this.taskRepository.delete(id);
    if (!task.affected) {
      throw new NotFoundException(`${id} not found`)
    }
  }

  async updateTask(id: number, newStatus: TaskStatus): Promise<Task>{
    const task = await this.getTaskById(id);
    task.status = newStatus;
    await task.save();
    return task;
  }

}
