import {EntityRepository, Repository} from "typeorm";
import {Task} from "./task.entity";
import {CreateTaskDto} from "./dto/create-task.dto";
import {TaskStatus} from "./task-status.enum";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";
import {User} from "../auth/user.entity";
import {InternalServerErrorException, Logger} from "@nestjs/common";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    private logger = new Logger('TaskRepository');

    async getTask(taskDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const {status, search} = taskDto;

        const query = this.createQueryBuilder('task');

        query.where('task.userId = :userId', {userId: user.id});

        if (status) {
            query.andWhere('task.status = :status', {status});
        }

        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', {search: `%${search}%`});
        }

        try {
            const tasks = query.getMany();
            return tasks;
        } catch (e) {
            this.logger.error(`Fail to get user ${user.username}`, e.stack);
            throw new InternalServerErrorException();
        }

    }

    async createTask(
        createTaskDto: CreateTaskDto,
        user: User
    ): Promise<Task> {
        const {title, description} = createTaskDto;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;

        await task.save();

        delete task.user;
        return task;
    }
}
