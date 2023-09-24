import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { CrudService } from './services/crud/crud.service';
import { DatabaseModule } from '@app/database';
import { ActivitiesService } from './services/activities/activities.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [CrudService, ActivitiesService],
})
export class UserModule {}
