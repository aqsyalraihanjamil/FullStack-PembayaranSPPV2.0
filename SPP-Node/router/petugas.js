const express = require("express")
const models = require("../models/index")
const petugas = models.petugas
const md5 = require("md5")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//multer 
const multer = require("multer")
const path = require("path")
const fs = require("fs")

//jwt
const jwt = require("jsonwebtoken")
const SECRET_KEY = "petugasSPP"

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
    username: req.body.username,
    password: md5(req.body.password)
  }

  let result = await petugas.findOne({ where: params })
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


app.get("/", async (req, res) => {
  petugas.findAll()
    .then(result => {
      res.json(result)
    })
    .catch(error => {
      res.json({
        message: error.message
      })
    })
})
app.get("/:id_petugas", async (req, res) => {
  petugas.findOne({ where: { id_petugas: req.params.id_petugas } })
    .then(result => {
      res.json(result)
    })
    .catch(error => {
      res.json({
        message: error.message
      })
    })
})
app.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    res.json({
      message: "No uploaded file"
    })
  }
  let data = {
    username: req.body.username,
    password: md5(req.body.password),
    nama_petugas: req.body.nama_petugas,
    level: req.body.level,
    image: req.file.filename
  }
  petugas.create(data)
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
app.put("/", upload.single("image"), async (req, res) => {
  let param = { id_petugas: req.body.id_petugas }
  let data = {
    username: req.body.username,
    password: md5(req.body.username),
    nama_petugas: req.body.nama_petugas,
    level: req.body.level,
  }
  if(req.file) {
    // get data by id
    const row = await petugas.findOne({ where: param })
    let oldFileName = row.image

    // delete old file
    let dir = path.join(__dirname, "../image", oldFileName)
    fs.unlink(dir, err => console.log(err))

    // set new filename
    data.image = req.file.filename
  }

  petugas.update(data, { where: param })
    .then((result) => {
      petugas.findOne({ where: param })
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
app.delete("/:id_petugas", async (req, res) => {
  let param = { id_petugas: req.params.id_petugas }
  let resu = await petugas.findOne({ where: param })
  //deleting the image in image folder
  let oldFileName = resu.image

  // delete old file
  let dir = path.join(__dirname, "../image", oldFileName)
  fs.unlink(dir, err => console.log(err))
  petugas.destroy({ where: param })
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