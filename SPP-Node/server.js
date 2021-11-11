const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors())

const spp = require("./router/spp")
const siswa = require("./router/siswa")
const kelas = require("./router/kelas")
const petugas = require("./router/petugas")
const pembayaran = require("./router/pembayaran")


app.use("/api/v1/spp", spp)
app.use("/api/v1/siswa", siswa)
app.use("/api/v1/kelas", kelas)
app.use("/api/v1/petugas", petugas)
app.use("/api/v1/pembayaran", pembayaran)

app.use(express.static(__dirname))

app.listen(8000, () => {
  console.log("Running on port 8000")
})