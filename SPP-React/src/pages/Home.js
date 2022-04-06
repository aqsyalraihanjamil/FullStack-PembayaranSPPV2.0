import React, { Component } from 'react';
import { base_url } from '../config';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import Sidebar from "../components/Sidebar"
import { ReactComponent as Siswa } from "../assets/home/totalsiswa.svg"
import { ReactComponent as User } from "../assets/home/User.svg"
import { ReactComponent as Tunggakan } from "../assets/home/Tunggakan.svg"
import { ReactComponent as TunggakanGreen } from "../assets/home/TunggakanGreen.svg"
import { ReactComponent as Entri } from "../assets/home/Entri.svg"
import { ReactComponent as EntriPurple } from "../assets/home/EntriPurple.svg"
import { ReactComponent as PaperWhite } from "../assets/home/PaperWhite.svg"
import { ReactComponent as WhiteSiswa } from "../assets/home/whitesiswa.svg"
import axios from 'axios';
export default class Home extends Component {
  constructor() {
    super()
    this.state = {
      level: localStorage.getItem('level'),
      token: "",
      adminName: 0,
      siswaCount: 0,
      petugasCount: 0,
      tunggakanCount: 0,
      pembayaranCount: 0,
      entriCount: 0,
      pieData: [],
      pembayaran: [],
      petugasPembayaran: []
    }

    if (localStorage.getItem("token")) {
      this.state.token = localStorage.getItem("token")
    } else {
      window.location = "/login"
    }
    this.headerConfig.bind(this)
  }
  headerConfig = () => {
    let header = {
      headers: { Authorization: `Bearer ${this.state.token}` }
    }
    return header
  }
  getSiswa = () => {
    let url = base_url + "/siswa"
    axios.get(url, this.headerConfig())
      .then(response => {
        this.setState({ siswaCount: response.data.length })
      })
      .catch(
        error => {
          if (error.response) {
            if (error.response.status) {
              window.alert(error.response.data.message)
              this.props.history.push("/login")
            } else {
              console.log(error)
            }
          }
        })
  }

  getPetugas = () => {
    let url = base_url + "/petugas"
    axios.get(url, this.headerConfig())
      .then(response => {
        this.setState({ petugasCount: response.data.length })
      })
      .catch(
        error => {
          if (error.response) {
            if (error.response.status) {
              window.alert(error.response.data.message)
              this.props.history.push("/login")
            } else {
              console.log(error)
            }
          }
        })
  }

  getNominal = () => {
    let url = base_url + "/siswa"
    let base = 0
    axios.get(url, this.headerConfig())
      .then(response => {
        response.data.map(async (item) => {
          base += item.tunggakan
        })
        this.setState({tunggakanCount: base})
      })
      .catch(
        error => {
          if (error.response) {
            if (error.response.status) {
              window.alert(error.response.data.message)
              this.props.history.push("/login")
            } else {
              console.log(error)
            }
          }
        })
  }

  getLunas = () => {
    let url = base_url + "/siswa"
    let belumLunas = 0
    let lunas = 0
    axios.get(url, this.headerConfig())
      .then(response => {
        let length = response.data.length
        response.data.map(async (item) => {
          if (item.tunggakan > 0) {
            belumLunas += 1
          }
        })
        lunas = length - belumLunas
        this.setState(prevPie => ({
          pieData: [...prevPie.pieData, [{ name: "Lunas", value: lunas }, { name: "Belum Lunas", value: belumLunas }]]
        }))
      })
      .catch(
        error => {
          if (error.response) {
            if (error.response.status) {
              window.alert(error.response.data.message)
              this.props.history.push("/login")
            } else {
              console.log(error)
            }
          }
        })
  }

  getEntri = () => {
    let url = base_url + "/pembayaran"
    axios.get(url, this.headerConfig())
      .then(response => {
        let tempPembayaran = []
        tempPembayaran = response.data
        this.setState({ entriCount: response.data.length })
        this.sortUpdate(tempPembayaran)
        let num = tempPembayaran.length - 5
        tempPembayaran.length -= num
        this.setState({ pembayaran: tempPembayaran })
      })
      .catch(
        error => {
          if (error.response) {
            if (error.response.status) {
              window.alert(error.response.data.message)
              this.props.history.push("/login")
            } else {
              console.log(error)
            }
          }
        })
  }

  getEntriPetugas = () => {
    let id = JSON.parse(localStorage.getItem("admin"))
    let url = base_url + "/pembayaran/petugas/" + id.id_petugas
    console.log(id.id_petugas)
    axios.get(url, this.headerConfig())
      .then(response => {
        let tempPembayaran = []
        tempPembayaran = response.data
        this.sortUpdate(tempPembayaran)
        if (tempPembayaran.length > 5) {
          let num = tempPembayaran.length - 5
          tempPembayaran.length -= num
        }
        console.log(tempPembayaran)
        this.setState({ petugasPembayaran: tempPembayaran })
      })
      .catch(
        error => {
          if (error.response) {
            if (error.response.status) {
              window.alert(error.response.data.message)
              this.props.history.push("/login")
            } else {
              console.log(error)
            }
          }
        })
  }


  sortUpdate = (pembayaran) => {
    pembayaran.sort(function (a, b) {
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    })
    // console.log(pembayaran)
  }

  toDate = (date) => {
    date = new Date(date)
    const weekday = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
    let monthDate = date.toLocaleString("id-ID", { month: "long" });
    let dayName = weekday[date.getDay()]
    return dayName + ', ' + date.getDate() + " " + monthDate + " " + date.getFullYear()
  }

  shortName = (name) => {
    let slice = name.split(" ")
    let get2Word = slice.slice(0, 2)
    return get2Word.join(" ")
  }

  threeDigits = (jml) => {
    return jml.toLocaleString('id-ID');
  }

  siswaTunggakan = () => {
    let getnisn = JSON.parse(localStorage.getItem("siswa"))
    let url = base_url + "/siswa/" + getnisn.nisn;
    axios.get(url, this.headerConfig())
      .then(response => {
        let base = 0
        response.data.map(async (item) => {
          base += item.tunggakan
          console.log(item)
        })
        this.setState({ tunggakanCount: base })
      })
      .catch(
        error => {
          if (error.response) {
            if (error.response.status) {
              window.alert(error.response.data.message)
              this.props.history.push("/login")
            } else {
              console.log(error)
            }
          }
        })
  }

  getEntriSiswa = () => {
    let getnisn = JSON.parse(localStorage.getItem("siswa"))
    let url = base_url + "/pembayaran/siswa/" + getnisn.nisn;
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        let base = 0
        this.setState({ pembayaran: response.data });
        response.data.map(async(item) => {
          base += item.jumlah_bayar
        })
        this.setState({pembayaranCount: base})
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status) {
            window.alert(error.response.data.message);
            this.props.history.push("/login");
          } else {
            console.log(error);
          }
        }
      });
  };

  componentDidMount() {
    if (this.state.level === "admin" || this.state.level === "petugas") {
      this.getSiswa()
      this.getPetugas()
      this.getNominal()
      this.getEntri()
      this.getLunas()
      this.getEntriPetugas()
    } else {
      this.siswaTunggakan()
      this.getEntriSiswa()
    }
  }
  render() {
    const COLOR = ["#423DDB", "#24B1C5"]
    const { pieData, pembayaran, petugasPembayaran } = this.state
    return (
      <div >
        <Sidebar />
        <div className='xl:pl-76 h-screen xl:pt-20 pt-16 w-screen bg-grey-eee '>
          <div className='grid grid-cols-12 grid-rows-8 2xl:p-8 p-6 gap-6 2xl:gap-8 h-full w-full '>
            {this.state.level === "admin" || this.state.level === "petugas" ? (
              <>
                {/* Total Siswa */}
                <div className='row-span-2 col-span-5 md:col-span-3 bg-white rounded-xl shadow-lg flex items-center justify-center 2xl:gap-6 gap-4 min-w-card'>
                  <div className='bg-grey-eee h-16 w-16 lg:h-22 lg:w-22 rounded-full flex items-center justify-center'>
                    <Siswa className='h-10 w-8 lg:h-12 lg:w-10' />
                  </div>
                  <div className='space-y-1 mr'>
                    <p className='font-semibold font-base text-xl lg:text-2xl'>{this.state.siswaCount}</p>
                    <p className='font-base text-lg lg:text-xl font-semibold text-grey-666 hidden 2xl:inline'>Total Siswa</p>
                    <p className='font-base text-base lg:text-lg font-semibold text-grey-666 2xl:hidden'>Siswa</p>
                  </div>
                </div>
                {/* Total Petugas */}
                <div className='row-span-2 col-span-5 md:col-span-3 bg-white rounded-xl shadow-lg flex items-center justify-center 2xl:gap-6 gap-4 min-w-card'>
                  <div className='bg-grey-eee  h-16 w-16 lg:h-22 lg:w-22  rounded-full flex items-center justify-center'>
                    <User className='h-10 w-8 lg:h-12 lg:w-10' />
                  </div>
                  <div className='space-y-1 mr'>
                    <p className='font-semibold font-base text-xl lg:text-2xl'>{this.state.petugasCount}</p>
                    <p className='font-base text-lg lg:text-xl font-semibold text-grey-666 hidden 2xl:inline'>Total Petugas</p>
                    <p className='font-base text-base lg:text-lg font-semibold text-grey-666 2xl:hidden'>Petugas</p>
                  </div>
                </div>
                {/* Total Tunggakan */}
                <div className='row-span-2 col-span-5 md:col-span-3 bg-white rounded-xl shadow-lg flex items-center justify-center 2xl:gap-6 gap-4  w-full h-full min-w-card'>
                  <div className='bg-grey-eee  h-16 w-16 lg:h-22 lg:w-22  rounded-full flex items-center justify-center shadow-sm ml-1 '>
                    <Tunggakan className='h-10 w-8 lg:h-12 lg:w-10' />
                  </div>
                  <div className='space-y-1 '>
                    <p className='font-semibold font-base text-lg lg:text-xl hidden 2xl:inline'>Rp. {this.threeDigits(this.state.tunggakanCount)}</p>
                    <p className='font-semibold font-base text-base lg:text-xl 2xl:text-2xl 2xl:hidden'>{this.threeDigits(this.state.tunggakanCount)}</p>
                    <p className='font-base text-base lg:text-lg 2xl:text-xl font-semibold text-grey-666'>Tunggakan</p>
                  </div>
                </div>
                {/* Total Entri */}
                <div className='row-span-2 col-span-5 md:col-span-3 bg-white rounded-xl shadow-lg flex items-center justify-center 2xl:gap-6 gap-4  min-w-card'>
                  <div className='bg-grey-eee  h-16 w-16 lg:h-22 lg:w-22  rounded-full flex items-center justify-center'>
                    <Entri className='h-10 w-8 lg:h-12 lg:w-10' />
                  </div>
                  <div className='space-y-1 mr-'>
                    <p className='font-semibold font-base text-xl lg:text-2xl'>{this.state.entriCount}</p>
                    <p className='font-base text-lg lg:text-xl font-medium lg:font-semibold text-grey-666 hidden 2xl:inline'>Total Entri</p>
                    <p className='font-base text-lg font-semibold text-grey-666 2xl:hidden'>Entri</p>
                  </div>
                </div>
                {/* Chart */}
                <div className='row-span-full w-full h-full col-span-5 2xl:col-span-3 row-start-3 bg-white rounded-xl shadow-lg hidden md:inline'>
                  <div className='flex justify-center w-full items-center h-1/6'>
                    <p className='font-base text-2xl font-semibold text-center mx-4 pt-4 2xl:pt-0'>Data Transaksi Siswa</p>
                  </div>
                  <div className='xl:ml-2 h-1/6'>
                    <div className='flex items-center row-start-2 row-span-1  pt-4'>
                      <div className='h-4 w-4  bg-purple-base rounded-full mr-2 ml-6' />
                      <p className='font-base ml-2 text-lg font-medium'>Lunas</p>
                    </div>
                    <div className='flex items-center row-start-3 row-span-1 pt-4'>
                      <div className='h-4 w-4  bg-tosca rounded-full mr-2 ml-6' />
                      <p className='font-base ml-2 text-lg font-medium'>Belum Lunas</p>
                    </div>
                  </div>
                  <div className='h-4/6 w-full relative'>
                    <div className='absolute w-full h-full flex justify-center items-center'>
                      <WhiteSiswa />
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={this.state.pieData[0]}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={100}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label
                        >
                          {pieData.length ? pieData[0].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLOR[index % COLOR.length]} />
                          )) : <span>Loading...</span>}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                {/* Activities */}
                <div className='hidden md:inline col-start-6  md:col-span-7 2xl:col-start-4 col-span-full 2xl:col-span-5 md:row-start-3 row-span-full bg-white rounded-xl shadow-lg '>
                  <div className='flex items-center justify-center h-1/6'>
                    <p className='font-base text-2xl font-semibold'>Aktivitas</p>
                  </div>
                  <div className='overflow-y-auto overflow-x-hidden h-5/6'>
                    <table className="table-fixed h-full w-full ">
                      <tbody className=''>
                        {pembayaran ? pembayaran.map((item, index, { length }) => (
                          (index % 2 === 0 ?
                            <tr key={index} className="bg-tosca-light font-base overflow-hidden">
                              {length - 1 === index ?
                                <td className='rounded-b-xl '>
                                  <div className='mx-4 '>
                                    <p className='font-semibold text-lg'>{this.toDate(item.updatedAt)}</p>
                                    <div className='flex pt-4 text-base overflow-hidden text-grey-activities'>
                                      <p className=' font-medium'>Petugas:</p>
                                      <p className='font-semibold ml-1'>{this.shortName(item.petugas.nama_petugas)}</p>
                                      <p className='ml-3 font-medium'>Siswa:</p>
                                      <p className='font-semibold ml-1'>{this.shortName(item.siswa.nama)}</p>
                                      <div className='flex'>
                                        <p className='ml-3 font-medium '>Nominal:</p>
                                        <p className='font-semibold ml-1'>{item.jumlah_bayar}</p>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                :
                                <td className='relative'>
                                  <div className='mx-4 '>
                                    <p className='font-semibold text-xl'>{this.toDate(item.updatedAt)}</p>
                                    <div className='flex pt-4 text-base overflow-auto text-grey-activities'>
                                      <p className=' font-medium'>Petugas:</p>
                                      <p className='font-semibold ml-1'>{this.shortName(item.petugas.nama_petugas)}</p>
                                      <p className='ml-3 font-medium'>Siswa:</p>
                                      <p className='font-semibold ml-1'>{this.shortName(item.siswa.nama)}</p>
                                      <div className='flex'>
                                        <p className='ml-3 font-medium '>Nominal:</p>
                                        <p className='font-semibold ml-1'>{item.jumlah_bayar}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <hr className='bg-grey-eee absolute bottom-0 h-0.5 w-full' />
                                </td>
                              }
                            </tr>
                            :
                            <tr key={index} className="bg-white font-base overflow-hidden ">
                              <td className='relative'>
                                <div className='mx-4 '>
                                  <p className='font-semibold text-xl'>{this.toDate(item.updatedAt)}</p>
                                  <div className='flex pt-4 text-base overflow-auto text-grey-666'>
                                    <p className=' font-medium'>Petugas:</p>
                                    <p className='font-semibold ml-1'>{this.shortName(item.petugas.nama_petugas)}</p>
                                    <p className='ml-3 font-medium'>Siswa:</p>
                                    <p className='font-semibold ml-1'>{this.shortName(item.siswa.nama)}</p>
                                    <div className='flex'>
                                      <p className='ml-3 font-medium '>Nominal:</p>
                                      <p className='font-semibold ml-1'>{item.jumlah_bayar}</p>
                                    </div>
                                  </div>
                                </div>
                                <hr className='bg-grey-eee absolute bottom-0 h-0.5 w-full' />
                              </td>
                            </tr>
                          )
                        )) : <p>Moro iki</p>}
                      </tbody>
                    </table>
                  </div>

                </div>
                {/* History */}
                <div className='col-start-9 col-span-full row-start-3 row-span-full bg-white rounded-xl shadow-lg hidden 2xl:inline'>
                  <div className='flex items-center justify-center h-1/6'>
                    <p className='font-base text-2xl font-semibold'>History</p>
                  </div>
                  <table className="table-fixed h-5/6 w-full ">
                    <tbody className=''>
                      {petugasPembayaran ? petugasPembayaran.map((item, index, { length }) => (
                        (index % 2 === 0 ?
                          <tr key={index} className="bg-purple-verylight font-base overflow-hidden">
                            {length - 1 === index ?
                              <td className='rounded-b-xl '>
                                <div className='mx-4 '>
                                  <p className='font-semibold text-xl'>{this.toDate(item.updatedAt)}</p>
                                  <div className='flex pt-4 text-base overflow-auto text-grey-activities'>
                                    <p className=' font-medium'>Siswa:</p>
                                    <p className='font-semibold ml-1'>{this.shortName(item.siswa.nama)}</p>
                                    <div className='flex'>
                                      <p className='ml-3 font-medium '>Nominal:</p>
                                      <p className='font-semibold ml-1'>{item.jumlah_bayar}</p>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              :
                              <td className='relative'>
                                <div className='mx-4 '>
                                  <p className='font-semibold text-xl'>{this.toDate(item.updatedAt)}</p>
                                  <div className='flex pt-4 text-base overflow-auto text-grey-activities'>
                                    <p className=' font-medium'>Siswa:</p>
                                    <p className='font-semibold ml-1'>{this.shortName(item.siswa.nama)}</p>
                                    <div className='flex'>
                                      <p className='ml-3 font-medium '>Nominal:</p>
                                      <p className='font-semibold ml-1'>{item.jumlah_bayar}</p>
                                    </div>
                                  </div>
                                </div>
                                <hr className='bg-grey-eee absolute bottom-0 h-0.5 w-full' />
                              </td>
                            }
                          </tr>
                          :
                          <tr key={index} className="bg-white font-base overflow-hidden ">
                            <td className='relative'>
                              <div className='mx-4 '>
                                <p className='font-semibold text-xl'>{this.toDate(item.updatedAt)}</p>
                                <div className='flex pt-4 text-base overflow-auto text-grey-666'>
                                  <p className=' font-medium'>Siswa:</p>
                                  <p className='font-semibold ml-1'>{this.shortName(item.siswa.nama)}</p>
                                  <div className='flex'>
                                    <p className='ml-3 font-medium '>Nominal:</p>
                                    <p className='font-semibold ml-1'>{item.jumlah_bayar}</p>
                                  </div>
                                </div>
                              </div>
                              <hr className='bg-grey-eee absolute bottom-0 h-0.5 w-full' />
                            </td>
                          </tr>
                        )
                      )) : <p>Moro iki</p>}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <>
                <div className='row-span-2 col-span-5 md:col-span-4 bg-white rounded-xl shadow-lg flex items-center justify-center 2xl:gap-6 gap-4 min-w-card'>
                  <div className='bg-grey-eee h-16 w-16 lg:h-22 lg:w-22 rounded-full flex items-center justify-center'>
                    <TunggakanGreen className='h-10 w-8 lg:h-12 lg:w-10' />
                  </div>
                  <div className='space-y-1 mr'>
                    <p className='font-semibold font-base text-xl lg:text-2xl'>Rp. {this.threeDigits(this.state.tunggakanCount)}</p>
                    <p className='font-base text-lg lg:text-xl font-semibold text-grey-666 hidden 2xl:inline'>Total Tunggakan</p>
                    <p className='font-base text-base lg:text-lg font-semibold text-grey-666 2xl:hidden'>Tunggakan</p>
                  </div>
                </div>
                <div className='row-span-2 col-span-5 md:col-span-4 bg-white rounded-xl shadow-lg flex items-center justify-center 2xl:gap-6 gap-4 min-w-card'>
                  <div className='bg-grey-eee h-16 w-16 lg:h-22 lg:w-22 rounded-full flex items-center justify-center'>
                    <EntriPurple className='h-10 w-8 lg:h-12 lg:w-10' />
                  </div>
                  <div className='space-y-1 mr'>
                    <p className='font-semibold font-base text-xl lg:text-2xl'>{pembayaran.length}</p>
                    <p className='font-base text-lg lg:text-xl font-semibold text-grey-666 hidden 2xl:inline'>Jumlah Pembayaran</p>
                    <p className='font-base text-base lg:text-lg font-semibold text-grey-666 2xl:hidden'>Jumlah</p>
                  </div>
                </div>
                <div className='row-span-2 col-span-5 md:col-span-4 bg-white rounded-xl shadow-lg flex items-center justify-center 2xl:gap-6 gap-4 min-w-card'>
                  <div className='bg-grey-eee h-16 w-16 lg:h-22 lg:w-22 rounded-full flex items-center justify-center'>
                    <PaperWhite className='h-10 w-8 lg:h-12 lg:w-10 fill-current' style={{ color: 'FCA765' }} />
                  </div>
                  <div className='space-y-1 mr'>
                    <p className='font-semibold font-base text-xl lg:text-2xl'>Rp. {this.threeDigits(this.state.pembayaranCount)}</p>
                    <p className='font-base text-lg lg:text-xl font-semibold text-grey-666 hidden 2xl:inline'>Total Bayar</p>
                    <p className='font-base text-base lg:text-lg font-semibold text-grey-666 2xl:hidden'>Bayar</p>
                  </div>
                </div>

              </>
            )}
          </div>
        </div>
      </div>
    )
  }
}
