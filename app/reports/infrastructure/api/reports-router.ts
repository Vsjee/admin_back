import express, { Request, Response } from 'express';
import { globalReportPDF } from '../../domain/model/global_report_pdf';

const reportsRouter = express.Router();

/**
 * [GET] global report
 */
reportsRouter.get('/global/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const stream = res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=global-report.pdf',
    });

    globalReportPDF(
      (data: any) => stream.write(data),
      () => stream.end(),
      id
    );

    res.send('Creating global report...');
  } catch (error) {}
});

export default reportsRouter;