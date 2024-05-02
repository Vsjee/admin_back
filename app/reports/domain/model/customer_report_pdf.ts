import PDFDocument from 'pdfkit-table';

import CustomerSchema from '../../../customers/infrastructure/models/customers.model';
import KidsSchema from '../../../kids/infrastructure/models/kids.model';
import BooksSchema from '../../../books/infrastructure/models/books.model';
import StorySchema from '../../../story/infraestructure/models/story.model';
import { date_parser_util } from '../../../../utils/date_parser_util';

export const customerReportPDF = async (
  dataCallback: any,
  endCallback: any,
  customerId: string
) => {
  const customer = await CustomerSchema.findById(customerId);

  const kids = await KidsSchema.find({
    avatar: { $gte: ' ' },
    customer_id: customerId,
  });

  const books = await BooksSchema.find({ customer_id: customerId });

  const stories = await StorySchema.find({ customer_id: customerId });

  const doc = new PDFDocument();

  doc.on('data', dataCallback);
  doc.on('end', endCallback);

  doc.image('assets/bumii_logo.png', 80, 15, { width: 100 });

  doc.moveDown();

  doc.text(`Reporte personal de usuario : ${date_parser_util(Date.now())}`);

  doc.moveDown();
  doc.moveDown();
  doc.moveDown();

  //   customer info
  doc.text(`ID usuario: ${customerId}`);
  doc.text(
    `Nombre: ${customer?.fistName ? customer?.fistName : 'No registra nombre'}`
  );
  doc.text(
    `Correo: ${customer?.email ? customer?.email : 'No registra correo'}`
  );
  doc.text(
    `Telefono: ${
      customer?.cellphone ? customer?.cellphone : 'No registra telefono'
    }`
  );
  doc.text(
    `Fecha creacion: ${
      customer?.creationDate
        ? date_parser_util(customer?.creationDate)
        : 'Fecha no valida'
    }`
  );
  doc.text(
    `Estado de la cuenta: ${
      customer?.isActive ? 'Cuenta Activa' : 'Cuenta Inactiva'
    }`
  );

  doc.moveDown();
  doc.moveDown();
  doc.moveDown();

  // Tokens
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
    headers: ['Story Tokens', 'Image Prompt Story Tokens'],
    rows: [[storyTokens.toString(), imageTokens.toString()]],
  };
  doc.table(usedTokensTable);

  doc.text(`Total tokens: ${storyTokens + imageTokens}`);

  doc.addPage();

  // kids
  let averageAge = 0;
  kids.forEach((kid) => {
    kid.years ? (averageAge += kid.years) : (averageAge += 0);
  });

  const customerKids = {
    title: `Niños del usuario ${kids.length}`,
    headers: [
      'ID Niño',
      'ID Usuario',
      'Nombre',
      'Edad',
      'Genero',
      'Fecha de creación',
    ],
    rows: kids.map((kid) => {
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
  doc.table(customerKids);

  doc.moveDown();

  const calculateGendersPercentage = () => {
    let maleCount = 0;
    let femaleCount = 0;

    kids.forEach((kid) =>
      kid.gender === 'male' ? maleCount++ : femaleCount++
    );

    return [
      [
        'Masculino',
        `${((maleCount / kids.length) * 100).toFixed(2)}%`,
        maleCount.toString(),
      ],
      [
        'Femenino',
        `${((femaleCount / kids.length) * 100).toFixed(2)}%`,
        femaleCount.toString(),
      ],
    ];
  };

  const kidsGenderPercentage = {
    title: 'Porcentaje de niños creados por genero',
    headers: ['Genero', 'Porcentaje', 'Total niños'],
    rows: calculateGendersPercentage(),
  };
  doc.table(kidsGenderPercentage);

  doc.moveDown();
  doc.moveDown();
  doc.moveDown();

  doc.text(`Edad promedio: ${(averageAge / kids.length).toFixed(0)}`);

  doc.addPage();

  //   books
  const customerBooks = {
    title: `Libros del usuario ${books.length}`,
    headers: [
      'ID Libro',
      'ID Usuario',
      'Titulo',
      'Aprobacion',
      'Activacion',
      'Audio',
      'Fecha de creación',
    ],
    rows: books.map((book) => {
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
  doc.table(customerBooks);

  doc.addPage();

  let storiesLangCountES = 0;
  let storiesLangCountEN = 0;
  let storiesLangCountFR = 0;
  let storiesLangCountPT = 0;

  stories.forEach((story) => {
    if (story.lang === 'es' || story.lang === 'ES') {
      storiesLangCountES++;
    } else if (story.lang === 'en' || story.lang === 'EN') {
      storiesLangCountEN++;
    } else if (story.lang === 'fr' || story.lang === 'FR') {
      storiesLangCountFR++;
    } else if (story.lang === 'pt' || story.lang === 'PT') {
      storiesLangCountPT++;
    }
  });

  const storiesLangPercentage = {
    title: 'Total libros por idioma',
    headers: ['Idioma', 'Total', 'Porcentaje'],
    rows: [
      [
        'Español',
        storiesLangCountES.toString(),
        `${((storiesLangCountES / stories.length) * 100).toFixed(2)}%`,
      ],
      [
        'Ingles',
        storiesLangCountEN.toString(),
        `${((storiesLangCountEN / stories.length) * 100).toFixed(2)}%`,
      ],
      [
        'Frances',
        storiesLangCountFR.toString(),
        `${((storiesLangCountFR / stories.length) * 100).toFixed(2)}%`,
      ],
      [
        'Portugues',
        storiesLangCountPT.toString(),
        `${((storiesLangCountPT / stories.length) * 100).toFixed(2)}%`,
      ],
    ],
  };
  doc.table(storiesLangPercentage);

  doc.end();
};
