const token = localStorage.getItem("token");

function loadProduk() {
  fetch(`${BASE_URL}/admin/produk`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("list").innerHTML = data.map(p =>
      `<li>${p.nama} - ${p.harga}
        <button onclick="hapus(${p.id})">Hapus</button>
      </li>`
    ).join("");
  });
}

function tambahProduk() {
  fetch(`${BASE_URL}/admin/produk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      nama: nama.value,
      harga: harga.value
    })
  }).then(loadProduk);
}

function hapus(id) {
  fetch(`${BASE_URL}/admin/produk/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  }).then(loadProduk);
}

loadProduk();
