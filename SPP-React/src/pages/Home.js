import React, { Component, PureComponent } from 'react';
import { base_url } from '../config';
import { PieChart, Pie, Sector, Cell } from 'recharts';
import Sidebar from "../components/Sidebar"
import { ReactComponent as Siswa } from "../assets/home/totalsiswa.svg"
import { ReactComponent as User } from "../assets/home/User.svg"
import { ReactComponent as Tunggakan } from "../assets/home/Tunggakan.svg"
import { ReactComponent as Entri } from "../assets/home/Entri.svg"
import axios from 'axios';
export default class Home extends Component {
  constructor() {
    super()
    this.state = {
      token: "",
      adminName: 0,
      siswaCount: 0,
      petugasCount: 0,
      tunggakanCount: 0,
      entriCount: 0,
      pieData: []
    }
    if (localStorage.getItem("token")) {
      this.state.token = localStorage.getItem("token")
    } else {
      window.location = "/login"
    }
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
          pieData: [...prevPie.pieData, [{ "name": "Lunas", "value": lunas }, { "name": "Belum Lunas", "value": belumLunas }]]
        }))
        console.log(this.state.pieData)
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
        this.setState({ entriCount: response.data.length })
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
  componentDidMount() {
    this.getSiswa()
    this.getPetugas()
    this.getNominal()
    this.getEntri()
    this.getLunas()
  }
  render() {
    return (
      <div>
        <Sidebar />
        <div className='xl:pl-76 pl-60 h-screen pt-20 w-screen bg-grey-eee '>
          <div className='grid grid-cols-12 grid-rows-8 2xl:p-8 p-6 gap-6 2xl:gap-8 h-full w-full'>
            <div className='row-span-2 col-span-3 bg-white rounded-xl shadow-lg flex items-center justify-center 2xl:gap-6 gap-4'>
              <div className='bg-grey-eee h-22 w-22 rounded-full flex items-center justify-center'>
                <Siswa className=' h-12 w-10' />
              </div>
              <div className='space-y-1 mr'>
                <p className='font-semibold font-base text-2xl'>{this.state.siswaCount}</p>
                <p className='font-base text-xl font-semibold text-grey-666 hidden 2xl:inline'>Total Siswa</p>
                <p className='font-base text-lg font-semibold text-grey-666 2xl:hidden'>Siswa</p>
              </div>
            </div>
            <div className='row-span-2 col-span-3 bg-white rounded-xl shadow-lg flex items-center justify-center 2xl:gap-6 gap-4'>
              <div className='bg-grey-eee h-22 w-22 rounded-full flex items-center justify-center'>
                <User className=' h-12 w-10' />
              </div>
              <div className='space-y-1 mr'>
                <p className='font-semibold font-base text-2xl'>{this.state.petugasCount}</p>
                <p className='font-base text-xl font-semibold text-grey-666 hidden 2xl:inline'>Total Petugas</p>
                <p className='font-base text-lg font-semibold text-grey-666 2xl:hidden'>Petugas</p>
              </div>
            </div>
            <div className='row-span-2 col-span-3 bg-white rounded-xl shadow-lg flex items-center justify-center 2xl:gap-6 gap-4 overflow-auto w-full h-full'>
              <div className='bg-grey-eee h-22 w-22 rounded-full flex items-center justify-center shadow-sm ml-1 overflow-auto'>
                <Tunggakan className=' h-12 w-10' />
              </div>
              <div className='space-y-1 '>
                <p className='font-semibold font-base text-2xl hidden 2xl:inline'>Rp. {this.state.tunggakanCount}</p>
                <p className='font-semibold font-base text-xl 2xl:text-2xl 2xl:hidden'>{this.state.tunggakanCount}</p>
                <p className='font-base text-lg 2xl:text-xl font-semibold text-grey-666'>Tunggakan</p>
              </div>
            </div>
            <div className='row-span-2 col-span-3 bg-white rounded-xl shadow-lg flex items-center justify-center 2xl:gap-6 gap-4 '>
              <div className='bg-grey-eee h-22 w-22 rounded-full flex items-center justify-center'>
                <Entri className=' h-12 w-10' />
              </div>
              <div className='space-y-1 mr-'>
                <p className='font-semibold font-base text-2xl'>{this.state.entriCount}</p>
                <p className='font-base text-xl font-semibold text-grey-666 hidden 2xl:inline'>Total Entri</p>
                <p className='font-base text-lg font-semibold text-grey-666 2xl:hidden'>Entri</p>
              </div>
            </div>
            <div className='row-span-full col-span-3 row-start-3 bg-white rounded-xl shadow-lg '>
              <div className='grid grid-rows-12 h-full'>
                <div className='flex justify-center w-full items-center row-span-2'>
                  <p className='font-base text-2xl font-semibold text-center mx-4'>Data Transaksi Siswa</p>
                </div>
                <div className='flex items-center row-start-3 row-span-1'>
                  <div className='h-4 w-4  bg-purple-base rounded-full mr-2 ml-6' />
                  <p className='font-base ml-2 text-lg font-medium'>Lunas</p>
                </div>
                <div className='flex items-center row-start-4 row-span-1'>
                  <div className='h-4 w-4  bg-tosca rounded-full mr-2 ml-6' />
                  <p className='font-base ml-2 text-lg font-medium'>Belum Lunas</p>
                </div>
                <div className='w-full px-4 h-full row-span-full row-start-6 justify-center items-center'>
                  <PieChart width={300} height={300}>
                    <Pie
                      data={this.state.pieData[0]}
                      cx={120}
                      cy={200}
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                    </Pie>
                  </PieChart>
                </div>
              </div>

            </div>
            <div className='col-start-4 col-span-5 row-start-3 row-span-full bg-white rounded-xl shadow-lg'>
              <p></p>
            </div>
            <div className='col-start-9 col-span-full row-start-3 row-span-full bg-white rounded-xl shadow-lg'>

            </div>

          </div>
        </div>
      </div>
    )
  }
}
