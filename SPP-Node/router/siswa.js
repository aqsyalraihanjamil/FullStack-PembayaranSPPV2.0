const express = require("express")
const models = require("../models/index")
const siswa = models.siswa
const kelas = models.kelas
const spp = models.spp
// const role = require("./role")
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//jwt
const jwt = require("jsonwebtoken")
const SECRET_KEY = "siswaSPP"

//multer
const multer = require("multer")
const path = require("path")
const fs = require("fs")

//storage for image
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
    // role.role = "siswa";
  } else {
    res.json({
      logged: false,
      message: "Invalid username or password"
    })
  }
})

const { auth_verify, accessLimit } = require("./verify")
app.use(auth_verify)

app.get("/", accessLimit(["admin"]), async (req, res) => {

  let result = await siswa.findAll({
    include: [
      "kelas",
      "spp"
    ]
  })
  res.json(result)
})

app.get("/:nisn", accessLimit(["admin"]), async (req, res) => {
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

app.post("/", accessLimit(["admin"]), upload.single("image"), async (req, res) => {

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
    image: req.file.filename,
  }
  let getSPP = async (id_kelas) => {
    let angkatan = await kelas.findOne({ raw: true, where: { id_kelas: id_kelas } })
    angkatan = angkatan.angkatan

    let nominal = await spp.findOne({ raw: true, where: { angkatan: angkatan } })
    return nominal.nominal
  }
  var now = new Date();
  const oneJuly2021 = 1625072400000;
  const referenceDay = Math.floor(oneJuly2021 / 8.64e7)
  const today = Math.floor(now / 8.64e7)

  const differenceMonth = Math.floor((today - referenceDay) / 30)
  const biayaSPP = await getSPP(data.id_kelas)
  const tunggakan = differenceMonth * biayaSPP

  data.tunggakan = tunggakan

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
app.put("/", accessLimit(["admin"]), upload.single("image"), async (req, res) => {
  let param = { nisn: req.body.nisn }
  let data = {
    nis: req.body.nis,
    nama: req.body.nama,
    id_kelas: req.body.id_kelas,
    alamat: req.body.alamat,
    no_telp: req.body.no_telp,
    id_spp: req.body.id_spp,
  }
  if (req.file) {
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
app.delete("/:nisn", accessLimit(["admin"]), async (req, res) => {
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