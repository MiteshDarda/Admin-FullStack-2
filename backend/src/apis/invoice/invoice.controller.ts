import { Controller } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { AppService } from 'src/app.service';

@Controller('invoice')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly helper: AppService,
  ) {}
}
