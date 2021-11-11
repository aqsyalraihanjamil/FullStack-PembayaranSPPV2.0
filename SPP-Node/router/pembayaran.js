const express = require("express")
const models = require("../models/index")
const pembayaran = models.pembayaran
const siswa = models.siswa
const spp = models.spp
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", async (req, res) => {
  let result = await pembayaran.findAll({
    include: [
      "petugas",
      "siswa",
      {
        model: siswa,
        as: "siswa",
        include: ["spp"]
      }
    ]
  })
  res.json(result)
})
app.get("/:id_pembayaran", async (req, res) => {
  let param = { id_pembayaran: req.params.id_pembayaran }
  let result = await pembayaran.findAll({
    where: param,
    include: [
      "petugas",
      "siswa",
      {
        model: siswa,
        as: "siswa",
        include: ["spp"]
      }
    ]
  })
  res.json(result)
})
// app.get("/:nisn", async (req,res) => {
//   let param = {nisn: req.params.nisn}
//   let result = await pembayaran.findAll({
//       where: param,
//       include: [
//           "petugas",
//           "siswa",
//           {
//               model: siswa,
//               as: "siswa",
//               include: ["spp"]
//           }
//       ]
//   })
//   res.json(result)
// })
app.post("/", async (req, res) => {
  let current = (new Date()).toISOString().split('T')[0]
  let data = {
    id_petugas: req.body.id_petugas,
    nisn: req.body.nisn,
    tgl_bayar: current,
    bulan_dibayar: req.body.bulan_dibayar,
    tahun_dibayar: req.body.tahun_dibayar,
    id_spp: req.body.id_spp,
    jumlah_bayar: req.body.jumlah_bayar,
  }
  pembayaran.create(data)
    .then(result => {
      res.json({
        message: "data has been inserted",
        data: result
      })
    })
    .catch(error => {
      res.json({
        message: error.message
      })
    })
})
app.put("/", async (req, res) => {
  let param = { id_pembayaran: req.body.id_pembayaran }
  let data = {
    id_petugas: req.body.id_petugas,
    nisn: req.body.nisn,
    bulan_dibayar: req.body.bulan_dibayar,
    tahun_dibayar: req.body.tahun_dibayar,
    id_spp: req.body.id_spp,
    jumlah_bayar: req.body.jumlah_bayar,
  }
  pembayaran.update(data, { where: param })
    .then(() => {
      pembayaran.findOne({ where: param })
        .then(resu => {
          res.json({
            message: "data has been updated",
            data: resu
          })
        })
        .catch(error => {
          res.json({
            message: error.message
          })
        })
    })
    .catch(error => {
      res.json({
        message: error.message
      })
    })
})
app.delete("/:id_pembayaran", async (req, res) => {
  let param = { id_pembayaran: req.params.id_pembayaran }
  let resu = await pembayaran.findOne({ where: param })

  pembayaran.destroy({ where: param })
    .then(resa => {
      res.json({
        message: "data has been deleted",
        data: resu
      })
    })
    .catch(error => {
      res.json({
        message: error.message
      })
    })
})

module.exports = app