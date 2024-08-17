const { nanoid } = require('nanoid');
const notes = require('./notes');

//* Menyimpan catatan yang ditambahkan dari aplikasi client
const addNoteHandler = (request, h) => {
  //* Gunakan properti request.payload untuk mendapatkan body request di Hapi
  const { title, tags, body } = request.payload;

  const id = nanoid(16); //* Parameter number(16) adalah ukuran string-nya
  /*
  Properti createdAt dan updatedAt bernilai sama,
  Karena kasus sekarang adalah menambahkan catatan baru
  */
  const createdAt = new Date().toISOString();
  const updateAt = createdAt;

  const newNote = {
    title, tags, body, id, createdAt, updateAt,
  };

  //* Masukan nilai-nilai dari var newNote ke dalam array notes menggunakan method push()
  notes.push(newNote);


  /*
  Untuk menentukan apakah newNote sudah masuk ke dalam array notes yaitu
  dengan memanfaatkan method filter() berdasarkan id catatan untuk mengetahuinya.
  */
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  // True
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  // False
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal ditambahkan',
  });
  response.code(500);
  return response;
};


//* Menampilkan Semua Daftar Catatan
// tidak perlu menuliskan parameter request dan h karena ia tidak digunakan pada method GET
const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});


//* Menampilkan Detail Catatan Secara Spesifik
const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  /*
  Untuk mencari dan mengambil catatan pertama yang memiliki id yang sama dengan id yang diberikan dari array notes.
  Jika ditemukan, catatan tersebut akan disimpan dalam variabel note.
  Jika tidak ditemukan, note akan menjadi undefined.
  */
  const note = notes.filter((note) => note.id === id)[0];

  /*
  Menggunakan return lebih sesuai untuk mengembalikan respon sukses yang sederhana tanpa penyesuaian tambahan,
  sedangkan h.response digunakan ketika perlu mengubah status HTTP,
  atau menambahkan metadata tambahan ke dalam respon.
  */
  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Catatan tidak ditemukan',
  });
  response.code(404);
  return response;
};


//* Mengubah catatan yang disimpan, baik perubahan pada title, tags, atau body
const editNoteByIdHandler = (request, h) => {
  /*
  Catatan yang diubah akan diterapkan sesuai dengan id yang digunakan pada route parameter.
  Jadi, perlu mendapatkan nilai id-nya terlebih dahulu.
  */
  const { id } = request.params;

  // Mendapatkan data notes terbaru yang dikirimkan oleh client melalui body request
  const { title, tags, body } = request.payload;
  // Perbarui juga nilai dari properti updatedAt
  const updatedAt = new Date().toISOString();

  /*
  Kemudian ubah catatan lama dengan data terbaru dengan memanfaatkan indexing array.
  Pertama, dapatkan dulu index array pada objek catatan sesuai id yang ditentukan,
  untuk melakukannya menggunakan method array findIndex().
  */
  const index = notes.findIndex((note) => note.id === id);

  // Memeriksa apakah catatan dengan id yang diberikan ditemukan dalam array notes
  if (index !== -1) {
    notes[index] = {
      ...notes[index], // spread operator (membuat salinan dari catatan yang ada pada indeks tersebut)
      /*
      Dengan cara ini, properti title, tags, body, dan updatedAt dari catatan diperbarui,
      dengan nilai baru yang diberikan dalam permintaan (request.payload),
      sementara properti atau id lainnya tetap tidak berubah.
      */
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }

  // Bila tidak ditemukan (else atau index === -1)
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};


//* Menghapus Catatan
const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  // Memeriksa apakah catatan dengan id yang diberikan ditemukan dalam array notes
  if (index !== -1) {
    // Hapus data pada array berdasarkan index, menggunakan method array splice()
    notes.splice(index, 1);

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  // Bila tidak ditemukan (else atau index === -1)
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

//* Use object literals to make it easy to export more than one value in one JavaScript file
module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler
};