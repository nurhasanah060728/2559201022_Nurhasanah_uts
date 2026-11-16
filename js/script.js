// Tandai bahwa JavaScript aktif. CSS memakai kelas ini untuk fitur hamburger.
document.documentElement.classList.add("js");

/* ========== 1. Menu hamburger (bonus 3 poin) ========== */
const tombolMenu = document.getElementById("tombolMenu");
const daftarNav = document.querySelector(".daftar-nav");

if (tombolMenu && daftarNav) {
  tombolMenu.hidden = false;
  tombolMenu.addEventListener("click", function () {
    const terbuka = daftarNav.classList.toggle("terbuka");
    tombolMenu.setAttribute("aria-expanded", terbuka);
  });
}

/* ========== 2. Validasi formulir kontak (bonus 3 poin) ========== */
const form = document.getElementById("formKontak");

if (form) {
  form.setAttribute("novalidate", ""); // matikan balon bawaan browser, pakai pesan sendiri
  const pesanSukses = document.getElementById("pesanSukses");

  function ambilPesan(kolom) {
    const v = kolom.validity;
    if (v.valueMissing) return "Kolom ini wajib diisi.";
    if (v.typeMismatch) return "Format email belum benar, contoh: nama@email.com.";
    if (v.patternMismatch) return "Nomor HP harus 10 sampai 13 angka, tanpa spasi atau tanda.";
    if (v.tooShort) return "Pesan minimal " + kolom.minLength + " karakter.";
    if (v.tooLong) return "Pesan maksimal " + kolom.maxLength + " karakter.";
    return "";
  }

  function periksa(kolom) {
    const tempatPesan = kolom.parentElement.querySelector(".pesan-error");
    const pesan = kolom.checkValidity() ? "" : ambilPesan(kolom);
    tempatPesan.textContent = pesan;
    kolom.classList.toggle("salah", pesan !== "");
    return pesan === "";
  }

  const semuaKolom = form.querySelectorAll("input, select, textarea");

  semuaKolom.forEach(function (kolom) {
    kolom.addEventListener("blur", function () { periksa(kolom); });
    kolom.addEventListener("input", function () {
      if (kolom.classList.contains("salah")) periksa(kolom);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let semuaValid = true;
    semuaKolom.forEach(function (kolom) {
      if (!periksa(kolom)) semuaValid = false;
    });

    if (semuaValid) {
      pesanSukses.hidden = false;
      form.reset();
    } else {
      pesanSukses.hidden = true;
      form.querySelector(".salah").focus();
    }
  });
}

/* ========== 3. Katalog dinamis: cari, filter, urut (bonus 4 poin) ========== */
const daftarKatalog = document.getElementById("daftarKatalog");

if (daftarKatalog) {
  // Data berupa array objek
  const menu = [
    { gambar: "nasi-ayam", nama: "Nasi Ayam Goreng", deskripsi: "Ayam goreng bumbu kuning, lalapan, sambal terasi.", kategori: "makanan", harga: 18000, alt: "Nasi ayam goreng dengan sambal terasi" },
    { gambar: "soto", nama: "Soto Ayam", deskripsi: "Soto kuning dengan suwiran ayam dan perkedel.", kategori: "makanan", harga: 15000, alt: "Semangkuk soto ayam berkuah kuning" },
    { gambar: "gado-gado", nama: "Gado-Gado", deskripsi: "Sayur rebus dengan bumbu kacang dan kerupuk.", kategori: "makanan", harga: 14000, alt: "Gado-gado sayuran dengan bumbu kacang" },
    { gambar: "mie-goreng", nama: "Mie Goreng Telur", deskripsi: "Mie goreng bumbu kecap dengan telur dan sayur.", kategori: "makanan", harga: 15000, alt: "Sepiring mie goreng dengan telur" },
    { gambar: "es-teh", nama: "Es Teh Manis", deskripsi: "Teh seduh segar dengan gula secukupnya.", kategori: "minuman", harga: 4000, alt: "Segelas es teh manis" },
    { gambar: "es-jeruk", nama: "Es Jeruk Peras", deskripsi: "Jeruk peras asli, tanpa sirup.", kategori: "minuman", harga: 6000, alt: "Segelas es jeruk peras" }
  ];

  const kontrol = document.getElementById("kontrolKatalog");
  const inputCari = document.getElementById("cari");
  const pilihFilter = document.getElementById("filter");
  const pilihUrut = document.getElementById("urut");
  const pesanKosong = document.getElementById("kosong");

  kontrol.hidden = false;

  function formatRupiah(angka) {
    return "Rp" + angka.toLocaleString("id-ID");
  }

  function buatKartu(item) {
    const kartu = document.createElement("article");
    kartu.className = "kartu";

    const gambar = document.createElement("img");
    gambar.src = "img/" + item.gambar + ".svg";
    gambar.alt = item.alt;
    gambar.width = 800;
    gambar.height = 600;

    const isi = document.createElement("div");
    isi.className = "kartu-isi";

    const label = document.createElement("span");
    label.className = "label";
    label.textContent = item.kategori.charAt(0).toUpperCase() + item.kategori.slice(1);

    const judul = document.createElement("h3");
    judul.textContent = item.nama;

    const deskripsi = document.createElement("p");
    deskripsi.textContent = item.deskripsi;

    const harga = document.createElement("p");
    harga.className = "harga";
    harga.textContent = formatRupiah(item.harga);

    isi.append(label, judul, deskripsi, harga);
    kartu.append(gambar, isi);
    return kartu;
  }

  function tampilkan() {
    const kataKunci = inputCari.value.trim().toLowerCase();
    const kategori = pilihFilter.value;
    const urutan = pilihUrut.value;

    let hasil = menu.filter(function (item) {
      const cocokNama = item.nama.toLowerCase().includes(kataKunci);
      const cocokKategori = kategori === "semua" || item.kategori === kategori;
      return cocokNama && cocokKategori;
    });

    if (urutan === "murah") hasil.sort(function (a, b) { return a.harga - b.harga; });
    if (urutan === "mahal") hasil.sort(function (a, b) { return b.harga - a.harga; });

    daftarKatalog.replaceChildren(...hasil.map(buatKartu));
    pesanKosong.hidden = hasil.length > 0;
  }

  inputCari.addEventListener("input", tampilkan);
  pilihFilter.addEventListener("change", tampilkan);
  pilihUrut.addEventListener("change", tampilkan);

  tampilkan();
}