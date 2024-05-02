import PDFDocument from 'pdfkit-table';

import CustomerSchema from '../../../customers/infrastructure/models/customers.model';
import KidsSchema from '../../../kids/infrastructure/models/kids.model';
import BooksSchema from '../../../books/infrastructure/models/books.model';
import StorySchema from '../../../story/infraestructure/models/story.model';
import { date_parser_util } from '../../../../utils/date_parser_util';

export const globalReportPDF = async (
  dataCallback: any,
  endCallback: any,
  customerId: string
) => {
  const customers = await CustomerSchema.find().countDocuments();

  const lastCustomers = await CustomerSchema.find()
    .sort({ creationDate: -1 })
    .limit(10);

  const customer = await CustomerSchema.findById(customerId);

  const kids = await KidsSchema.find({
    avatar: { $gte: ' ' },
  });

  const lastKids = await KidsSchema.find({
    avatar: { $gte: ' ' },
  })
    .sort({ creationDate: -1 })
    .limit(10);

  const books = await BooksSchema.find();

  const lastBooks = await BooksSchema.find()
    .sort({ creationDate: -1 })
    .limit(10);

  const stories = await StorySchema.find();

  const doc = new PDFDocument();

  doc.on('data', dataCallback);
  doc.on('end', endCallback);

  doc.image('assets/bumii_logo.png', 80, 15, { width: 100 });

  doc.moveDown();

  doc.text(`Reporte global de la aplicación: ${date_parser_util(Date.now())}`);

  doc.moveDown();
  doc.moveDown();
  doc.moveDown();

  doc.text(`Total usuarios a dia de hoy: ${customers}`);

  doc.moveDown();
  doc.moveDown();
  doc.moveDown();

  const storyTokens = stories.reduce(
    (acc, storie) => acc + (storie.story_tokens?.total_tokens ?? 0),
    0
  );

  const imageTokens = stories.reduce(
    (acc, storie) => acc + (storie.image_prompt_tokens?.total_tokens ?? 0),
    0
  );

  const usedTokensTable = {
    title: 'Tokens usados',
    subtitle: 'Lista story tokens y image tokens usados a dia de hoy',
    headers: ['Story Tokens', 'Image Prompt Story Tokens'],
    rows: [[storyTokens.toString(), imageTokens.toString()]],
  };
  doc.table(usedTokensTable);

  doc.text(`Total tokens: ${storyTokens + imageTokens}`);

  doc.moveDown();
  doc.moveDown();
  doc.moveDown();

  const recentCustomers = {
    title: 'Cuentas recientes',
    subtitle: 'Lista ultimas 10 cuentas creadas',
    headers: [
      'ID Usuario',
      'Nombre',
      'Correo',
      'Telefono',
      'Fecha de creación',
    ],
    rows: lastCustomers.map((customer) => {
      const id = customer._id;
      const name = customer.fistName;
      const email = customer.email;
      const cellphone = customer.cellphone;
      const creation_date = customer.creationDate;

      return [
        id.toString(),
        name ? name : 'No registra nombre',
        email ? email : 'No registra correo',
        cellphone ? cellphone : 'No registra telefono',
        creation_date ? date_parser_util(creation_date) : 'Fecha no valida',
      ];
    }),
  };
  doc.table(recentCustomers);

  doc.addPage();

  const recentKids = {
    title: 'Niños recientes',
    subtitle: 'Lista ultimos 10 niños creados',
    headers: [
      'ID Niño',
      'ID Usuario',
      'Nombre',
      'Edad',
      'Genero',
      'Fecha de creación',
    ],
    rows: lastKids.map((kid) => {
      const customerId = kid.customer_id;
      const id = kid._id;
      const name = kid.name;
      const years = kid.years;
      const gender = kid.gender;
      const creation_date = kid.creation_date;

      return [
        id.toString(),
        customerId ? customerId : 'No registra ID de usuario',
        name ? name : 'No registra nombre',
        years ? years.toString() : 'No registra edad',
        gender ? gender : 'No registra genero',
        creation_date ? date_parser_util(creation_date) : 'Fecha no valida',
      ];
    }),
  };
  doc.table(recentKids);

  doc.addPage();

  const recentBooks = {
    title: 'Libros recientes',
    subtitle: 'Lista ultimas 10 libros creados',
    headers: [
      'ID Libro',
      'ID Usuario',
      'Titulo',
      'Aprobacion',
      'Activacion',
      'Audio',
      'Fecha de creación',
    ],
    rows: lastBooks.map((book) => {
      const customerId = book.customer_id;
      const id = book._id;
      const title = book.story_title;
      const is_aproved = book.is_story_approved;
      const is_active = book.is_active;
      const audio_path = book.story_audio_path;
      const creation_date = book.creation_date;

      return [
        id.toString(),
        customerId ? customerId : 'No registra ID de usuario',
        title ? title : 'No registra titulo',
        is_aproved ? String(is_aproved) : 'No registra aprobacion',
        is_active ? String(is_active) : 'No registra activacion',
        audio_path ? audio_path : 'No registra audio',
        creation_date ? date_parser_util(creation_date) : 'Fecha no valida',
      ];
    }),
  };
  doc.table(recentBooks);

  doc.end();
};
