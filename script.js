
function prosesGambar(input) {
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.getElementById("kanvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const data = ctx.getImageData(img.width/2, img.height/2, 1, 1).data;
      const rgb = { r: data[0], g: data[1], b: data[2] };
      const hasil = klasifikasiTTI(rgb);

      document.getElementById("hasil").innerHTML = `
        <strong>RGB Terdeteksi:</strong> (${rgb.r}, ${rgb.g}, ${rgb.b})<br>
        <strong>Status:</strong> ${hasil.status}<br>
        <strong>Harga Produk:</strong> Rp${hasil.harga.toLocaleString()}
      `;
    }
    img.src = e.target.result;
  }
  reader.readAsDataURL(file);
}

function klasifikasiTTI(rgb) {
  const { r, g, b } = rgb;
  let status, harga;

  // Koreksi urutan warna sesuai kualitas: Merah Kecoklatan (baik) -> Kuning Kecoklatan -> Kuning Cerah (buruk)
  if (r > 140 && r < 190 && g < 100 && b < 80) {
    status = "Layak dikonsumsi";
    harga = 25000;
  } else if (r > 180 && g > 130 && g < 180 && b < 100) {
    status = "Kualitas menurun";
    harga = 10000;
  } else {
    status = "Tidak layak dikonsumsi";
    harga = 7000;
  }

  return { status, harga };
}
