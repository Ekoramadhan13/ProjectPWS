const db = require('../config/db');

const buah = [
  'Apel', 'Jeruk', 'Mangga', 'Pisang',
  'Anggur', 'Semangka', 'Pepaya', 'Nanas'
];

const sayur = [
  'Wortel', 'Bayam', 'Brokoli', 'Tomat',
  'Kentang', 'Kubis', 'Terong', 'Buncis'
];

// FOTO REAL (BUKAN KARTUN, BUKAN RANDOM ERROR)
const fotoBuah = [
  'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg',
  'https://images.pexels.com/photos/61127/pexels-photo-61127.jpeg',
  'https://images.pexels.com/photos/209549/pexels-photo-209549.jpeg',
  'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg'
];

const fotoSayur = [
  'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg',
  'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg',
  'https://images.pexels.com/photos/4197444/pexels-photo-4197444.jpeg',
  'https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg'
];

for (let i = 1; i <= 100; i++) {
  const isBuah = Math.random() > 0.5;

  const nama = isBuah
    ? buah[Math.floor(Math.random() * buah.length)]
    : sayur[Math.floor(Math.random() * sayur.length)];

  const kategori = isBuah ? 'Buah' : 'Sayur';
  const harga = Math.floor(Math.random() * 20000) + 5000;
  const stok = Math.floor(Math.random() * 100) + 10;

  const foto = isBuah
    ? fotoBuah[Math.floor(Math.random() * fotoBuah.length)]
    : fotoSayur[Math.floor(Math.random() * fotoSayur.length)];

  db.query(
    'INSERT INTO produk (nama, kategori, harga, stok, foto) VALUES (?,?,?,?,?)',
    [nama, kategori, harga, stok, foto],
    (err) => {
      if (err) console.error(err);
    }
  );
}

console.log('✅ Seeder produk dummy berhasil (foto real)');
