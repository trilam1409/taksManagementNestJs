import {ArgumentMetadata, BadRequestException, PipeTransform} from "@nestjs/common";
import {TaskStatus} from "../task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform{
  readonly allowStatus = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE
  ];

  transform(value: any, metadata: ArgumentMetadata): any {
    value = value.toUpperCase();

    if(!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is invalid`);
    }

    return value;
  }

  private isStatusValid(status: TaskStatus){
    const index = this.allowStatus.indexOf(status);
    return index !== -1;
  }


}
