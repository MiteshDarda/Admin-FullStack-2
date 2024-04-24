import { InvoiceModule } from 'src/apis/invoice/invoice.module';
import { LeadershipModule } from 'src/apis/leadership/leadership.module';
import { MessagesModule } from 'src/apis/messages/messages.module';
import { PayoutModule } from 'src/apis/payout/payout.module';
import { TasksModule } from 'src/apis/tasks/tasks.module';
import { UsersModule } from 'src/apis/users/users.module';

export const allModules = [
  UsersModule,
  TasksModule,
  MessagesModule,
  InvoiceModule,
  PayoutModule,
  LeadershipModule,
];
