const express = require("express")
const models = require("../models/index")
const siswa = models.siswa
const spp = models.spp
const kelas = models.kelas

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//multer 
const multer = require("multer")
const path = require("path")
const fs = require("fs")

//jwt
const jwt = require("jsonwebtoken")
const SECRET_KEY = "siswaSPP"

// config storage image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./image")
  },
  filename: (req, file, cb) => {
    cb(null, "img-" + Date.now() + path.extname(file.originalname))
  }
})
let upload = multer({ storage: storage })

//x-www-form-urlencoded
app.post("/auth", async (req, res) => {
  let params = {
    nisn: req.body.nisn
  }

  let result = await siswa.findOne({ where: params })
  if (result) {
    let payload = JSON.stringify(result)
    // generate token
    let token = jwt.sign(payload, SECRET_KEY)
    res.json({
      logged: true,
      data: result,
      token: token
    })
  } else {
    res.json({
      logged: false,
      message: "Invalid username or password"
    })
  }
})

const verify = require("./verify")
app.use(verify)

app.get("/",   async (req, res) => {

  let result = await siswa.findAll({
    include: [
      "kelas",
      "spp"
    ]
  })
  res.json(result)
})

app.get("/:nisn",   async (req, res) => {
  let param = { nisn: req.params.nisn }
  let result = await siswa.findAll({
    where: param,
    include: [
      "kelas",
      "spp"
    ]
  })
  res.json(result)
})
app.post("/",upload.single("image"), async (req, res) => {
  if (!req.file) {
    res.json({
      message: "No uploaded file"
    })
  }
  let data = {
    nisn: req.body.nisn,
    nis: req.body.nis,
    nama: req.body.nama,
    id_kelas: req.body.id_kelas,
    alamat: req.body.alamat,
    no_telp: req.body.no_telp,
    id_spp: req.body.id_spp,
    image: req.file.filename
  }
  siswa.create(data)
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
app.put("/",upload.single("image"), async (req, res) => {
  let param = { nisn: req.body.nisn }
  let data = {
    nis: req.body.nis,
    nama: req.body.nama,
    id_kelas: req.body.id_kelas,
    alamat: req.body.alamat,
    no_telp: req.body.no_telp,
    id_spp: req.body.id_spp,
  }
  if(req.file) {
    // get data by id
    const row = await siswa.findOne({ where: param })
    let oldFileName = row.image

    // delete old file
    let dir = path.join(__dirname, "../image", oldFileName)
    fs.unlink(dir, err => console.log(err))

    // set new filename
    data.image = req.file.filename
  }
  siswa.update(data, { where: param })
    .then(() => {
      siswa.findOne({ where: param })
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
        message: error.message
      })
    })
})
app.delete("/:nisn", async (req, res) => {
  let param = { nisn: req.params.nisn }
  let result = await siswa.findOne({ where: param })
  //deleting the image in image folder
  let oldFileName = result.image

  // delete old file
  let dir = path.join(__dirname, "../image", oldFileName)
  fs.unlink(dir, err => console.log(err))
  siswa.destroy({ where: param })
    .then(resu => {
      res.json({
        message: "data has been deleted",
        data: result
      })
    })
    .catch(error => {
      res.json({
        message: error.message
      })
    })
})



module.exports = app