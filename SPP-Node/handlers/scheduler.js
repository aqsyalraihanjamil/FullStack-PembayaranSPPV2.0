const schedule = require('node-schedule');
const models = require("../models/index")

let getSPP = async (id_kelas) => {
  try{
    let angkatan = await models.kelas.findOne({ raw: true, where: { id_kelas: id_kelas } })
    angkatan = angkatan.angkatan
  
    let nominal = await models.spp.findOne({ raw: true, where: { angkatan: angkatan } })
    return nominal.nominal
  }
  catch{
    console.log(err)
  }
}

const perbulan = '0 0 1 * *';
var sch = schedule.scheduleJob(perbulan, async () => {
  const data = await models.siswa.findAll({raw: true});

  data.map(async (item) => {
    const biayaSPP = await getSPP(item.id_kelas);
    const tunggakan_baru = biayaSPP + item.sisa_tunggakan;
    models.siswa.update({sisa_tunggakan: tunggakan_baru}, {where: {nisn: item.nisn}});
  })

}); 
module.exports = sch