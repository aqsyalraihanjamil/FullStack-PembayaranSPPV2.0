const express = require("express")
const models = require("../models/index")
const kelas = models.kelas
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const { auth_verify, accessLimit } = require("./verify")
app.use(auth_verify)
app.get("/", accessLimit(["admin"]), async (req, res) => {
  kelas.findAll()
    .then(kelas => {
      res.json(kelas)
    })
    .catch(error => {
      res.json({
        message: error.message
      })
    })
})
app.get("/:id_kelas", accessLimit(["admin"]), async (req, res) => {
  kelas.findOne({ where: { id_kelas: req.params.id_kelas } })
    .then(kelas => {
      res.json(kelas)
    })
    .catch(error => {
      res.json({
        message: error.message
      })
    })
})
app.post("/", accessLimit(["admin"]), async (req, res) => {
  let data = {
    nama_kelas: req.body.nama_kelas,
    jurusan: req.body.jurusan,
    angkatan: req.body.angkatan

  }
  kelas.create(data)
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
app.put("/", accessLimit(["admin"]), async (req, res) => {
  let param = { id_kelas: req.body.id_kelas }
  let data = {
    nama_kelas: req.body.nama_kelas,
    jurusan: req.body.jurusan,
    angkatan: req.body.angkatan
  }
  kelas.update(data, { where: param })
    .then(() => {
      kelas.findOne({ where: param })
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
app.delete("/:id_kelas", accessLimit(["admin"]), async (req, res) => {
  let param = { id_kelas: req.params.id_kelas }
  let resu = await kelas.findOne({ where: param })
  kelas.destroy({ where: param })
    .then(result => {
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