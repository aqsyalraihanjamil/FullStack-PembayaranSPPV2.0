const express = require("express")
const models = require("../models/index")
const spp = models.spp
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// const role = require("./role")
const { auth_verify, accessLimit } = require("./verify")
app.use(auth_verify)



app.get("/", accessLimit(["admin"]), async (req, res) => {
  spp.findAll()
    .then(spp => {
      res.json(
        spp
      )
      // console.log(role.role)
    })
    .catch(error => {
      res.json({
        message: error.message
      })
    })
})
app.get("/:id_spp", accessLimit(["admin"]), async (req, res) => {
  spp.findOne({ where: { id_spp: req.params.id_spp } })
    .then(spp => {
      res.json(spp)
    })
    .catch(error => {
      res.json({
        message: error.message
      })
    })
})
app.post("/", accessLimit(["admin"]), async (req, res) => {
  let data = {
    tahun: req.body.tahun,
    nominal: req.body.nominal,
    angkatan: req.body.angkatan
  }
  spp.create(data)
    .then(result => {
      res.json({
        message: "data has been inserted",
        data: result
      })
    })
    .catch(error => {
      res.json({
        error: error.message
      })
    })
})
app.put("/", accessLimit(["admin"]), async (req, res) => {
  let param = { id_spp: req.body.id_spp }
  let data = {
    tahun: req.body.tahun,
    nominal: req.body.nominal,
    angkatan: req.body.angkatan
  }
  spp.update(data, { where: param })
    .then(() => {
      spp.findOne({ where: param })
        .then((resu) => {
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
        error: error.message
      })
    })
})
app.delete("/:id_spp", accessLimit(["admin"]), async (req, res) => {
  let param = { id_spp: req.params.id_spp }
  let resu = await spp.findOne({ where: param })
  spp.destroy({ where: param })
    .then(result => {
      res.json({
        message: "data has been deleted",
        data: resu
      })
    })
    .catch(error => {
      res.json({
        error: error.message
      })
    })
})

module.exports = app