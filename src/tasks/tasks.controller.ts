import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UsePipes, ValidationPipe, Patch, Query} from '@nestjs/common';
import {TasksService} from "./tasks.service";
import {CreateTaskDto} from "./dto/create-task.dto";
import {Task} from "./task.entity";
import {TaskStatus} from "./task-status.enum";
import {TaskStatusValidationPipe} from './pipes/task-status-validation.pipe';
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {

  }

  @Get()
  getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto): Promise<Task[]>  {
    return this.tasksService.getTasks(filterDto);
  }

  @Get(':id')
  getTaskId(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tasksService.deleteTask(id);
  }

  @Patch(':id/status')
  updateStatusTask(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus): Promise<Task> {
    return this.tasksService.updateTask(id, status);
  }
}

