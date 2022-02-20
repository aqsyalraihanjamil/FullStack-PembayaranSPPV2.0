import React, { Component } from 'react';
import Sidebar from "../components/Sidebar"
import { ReactComponent as Search } from "../assets/siswa/Search.svg"
import { ReactComponent as Detail } from "../assets/siswa/Detail.svg"
import { ReactComponent as Edit } from "../assets/siswa/Edit.svg"
import { ReactComponent as Delete } from "../assets/siswa/Delete.svg"
import { ReactComponent as Exit } from "../assets/siswa/Exit.svg"
import { base_url, image_url } from '../config';
import axios from 'axios';
export default class Siswa extends Component {
  constructor() {
    super()
    this.state = {
      showing: false,
      token: "",
      siswa: [],
      detailSiswa: [],
      action: '',
      nisn: '',
      nis: '',
      nama: '',
      id_kelas: 0,
      alamat: '',
      no_telp: '',
      id_spp: '',
      image: ''
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
        this.setState({ siswa: response.data })
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

  getDetailSiswa = (item) => {
    let url = base_url + '/siswa/' + item.nisn
    axios.get(url, this.headerConfig())
      .then(response => {
        this.setState({ detailSiswa: response.data })
        // console.log(this.state.detailSiswa)
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
  threeDigits = (jml) => {
    //this.setState({ tunggakanCount: jml.toLocaleString('id-ID') })
    return jml.toLocaleString('id-ID')
  }
  componentDidMount() {
    this.getSiswa()
  }
  render() {
    const { siswa, showing, detailSiswa } = this.state

    return (
      <div>
        <Sidebar />

        <div className='xl:pl-76 h-screen xl:pt-20 pt-16 w-screen bg-grey-eee overflow-hidden '>
          <div className='p-8 h-full'>
            <div className='h-14 bg-white xl:w-1/3  rounded-xl shadow-md border-purple-light border-2 border-opacity-80'>
              <div className='flex justify-center items-center h-full w-full'>
                <Search className="w-2/12 lg:w-1/12 xl:w-1/6 h-3/5" />
                <p className='w-10/12 lg:w-11/12 xl:w-5/6 font-body text-lg text-grey-666 opacity-80'>Search for name or NISN</p>
              </div>
            </div>
            <div className=' h-90% pt-8 w-full'>
              <div className="table w-full table-auto h-full bg-white rounded-xl shadow-xl px-4">
                <div className="table-header-group h-1/12 font-body font-medium text-xl relative">
                  <div className="table-row ">
                    <div className="table-cell align-middle">NISN</div>
                    <div className="table-cell align-middle">NIS</div>
                    <div className="table-cell align-middle">Nama</div>
                    <div className="table-cell align-middle">Kelas</div>
                    <div className="table-cell align-middle">Image</div>
                    <div className="lg:table-cell align-middle hidden">Action</div>
                  </div>
                  <hr className='bg-grey-eee absolute bottom-0 h-0.5 w-full' />
                </div>
                <div className="table-row-group h-10/12 justify-center relative border-collapse">
                  {siswa ? siswa.map((item, index, { length }) => (
                    <div className="table-row font-body text-lg 2xl:text-xl" key={index} >
                      <div className='table-cell align-middle border-b-2 border-solid border-grey-eee w-1/8'>{item.nisn}</div>
                      <div className='table-cell align-middle border-b-2 border-solid border-grey-eee'>{item.nis}</div>
                      <div className='table-cell align-middle border-b-2 border-solid border-grey-eee'>{item.nama}</div>
                      <div className='table-cell align-middle border-b-2 border-solid border-grey-eee'>{item.kelas.nama_kelas}</div>
                      <div className='table-cell align-middle border-b-2 border-solid border-grey-eee'><img className='h-14 rounded-full' src={image_url + item.image} alt="Siswa" /></div>
                      <div className='table-cell align-middle border-b-2 border-solid border-grey-eee  overflow-hidden'>
                        <div className='lg:flex w-full h-full items-center gap-4  hidden'>
                          <button className='  h-1/4 bg-purple-verylight w-1/3 shadow-sm rounded-full items-center flex justify-center' onClick={() => { this.setState({ showing: !showing }); this.getDetailSiswa(item) }}> <p className='w-1/2 text-center font-medium'>Detail</p> <Detail className='h-1/2 w-1/6 xl:w-1/5' /> </button>
                          <button className='h-1/4 bg-purple-verylight w-1/3 shadow-sm rounded-full items-center flex justify-center'> <p className='w-1/2 text-center font-medium'>Edit</p> <Edit className='h-1/2 w-1/6 xl:w-1/5' /> </button>
                          <button className='h-1/4 bg-purple-verylight w-1/3 shadow-sm rounded-full items-center flex justify-center'> <p className='w-1/2 text-center font-medium'>Delete</p> <Delete className='h-1/2 w-1/5 ml-4 2xl:ml-0' /> </button>
                        </div>
                      </div>
                    </div>
                  )) : null}
                </div>
                <div className="table-footer-group h-1/12 font-body font-medium text-xl ">
                  <div className='flex'>
                    <div>asda</div>
                    <div>asda</div>
                    <div>asda</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showing && (
          <div className=' bg-white fixed z-20 w-full h-full bottom-0 backdrop-filter backdrop-blur-sm  bg-opacity-30 flex'>
            <div className='justify-center items-center w-3/5 h-1/2 bg-white m-auto relative shadow-2xl border-2 border-grey-eee rounded-xl'>
              <div className='h-1/6 flex justify-center items-center '>
                <p className='font-body text-2xl font-medium ml-10'>Detail Siswa</p>
                <Exit className='right-0 ml-auto h-10 w-10 m-4 cursor-pointer' onClick={() => this.setState({ showing: !showing })} />
              </div>
              {detailSiswa ? detailSiswa.map((item, index) => (
                <div className='flex p-8 gap-4 h-10/12 w-full'>
                  <div className='w-1/3 flex items-center'>
                    <img className='h-auto w-auto rounded-full p-8' style={{ 'clip-path': "circle()" }} src={image_url + item.image} alt="Siswa" />
                  </div>
                  <div className='w-1/3 font-body h-full'>
                    <div className='h-1/4'>
                      <p className='text-xl font-medium'>NISN</p>
                      <p className='text-lg'>{item.nisn}</p>
                    </div>
                    <div className='h-1/4'>
                      <p className='text-xl font-medium'>Nama</p>
                      <p className='text-lg'>{item.nama}</p>
                    </div>
                    <div className='h-1/4'>
                      <p className='text-xl font-medium'>Alamat</p>
                      <p className='text-lg'>{item.alamat}</p>
                    </div>
                    <div className='h-1/4'>
                      <p className='text-xl font-medium'>SPP Perbulan</p>
                      <p className='text-lg'>Rp. {this.threeDigits(item.spp.nominal)}</p>
                    </div>
                  </div>
                  <div className='w-1/3 font-body h-full'>
                    <div className='h-1/4'>
                      <p className='text-xl font-medium'>NIS</p>
                      <p className='text-lg'>{item.nis}</p>
                    </div>
                    <div className='h-1/4'>
                      <p className='text-xl font-medium'>Kelas</p>
                      <p className='text-lg'>{item.kelas.nama_kelas}</p>
                    </div>
                    <div className='h-1/4'>
                      <p className='text-xl font-medium'>No Telp</p>
                      <p className='text-lg'>{item.no_telp}</p>
                    </div>
                    <div className='h-1/4'>
                      <p className='text-xl font-medium'>Tunggakan</p>
                      <p className='text-lg'>Rp. {this.threeDigits(item.tunggakan)}</p>
                    </div>
                  </div>
                </div>
              )) : null}

            </div>
          </div>
        )}
      </div>
    )
  }
}
