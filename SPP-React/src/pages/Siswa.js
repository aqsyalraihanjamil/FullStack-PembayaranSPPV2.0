import React, { Component } from 'react';
import Sidebar from "../components/Sidebar"
import { ReactComponent as Search } from "../assets/siswa/Search.svg"
import { ReactComponent as Detail } from "../assets/siswa/Detail.svg"
import { ReactComponent as Edit } from "../assets/siswa/Edit.svg"
import { ReactComponent as Delete } from "../assets/siswa/Delete.svg"
import { ReactComponent as Exit } from "../assets/siswa/Exit.svg"
import { ReactComponent as Plus } from "../assets/siswa/Plus.svg"
import { base_url, image_url } from '../config';
import axios from 'axios';
import { Link } from 'react-router-dom';
export default class Siswa extends Component {
  constructor() {
    super()
    this.state = {
      showingDetail: false,
      showingEdit: false,
      token: "",
      siswa: [],
      detailSiswa: [],
      kelas: [],
      spp: [],
      action: '',
      nisn: '',
      nis: '',
      nama: '',
      id_kelas: 0,
      alamat: '',
      no_telp: '',
      id_spp: '',
      image: 0,
      uploadFile: true,
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

  getKelas = () => {
    let url = base_url + "/kelas"
    axios.get(url, this.headerConfig())
      .then(response => {
        this.setState({ kelas: response.data })
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

  getSpp = () => {
    let url = base_url + "/spp"
    axios.get(url, this.headerConfig())
      .then(response => {
        this.setState({ spp: response.data })
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

  Add = () => {
    this.setState({
      action: 'insert',
      nisn: 0,
      nis: '',
      nama: '',
      id_kelas: 0,
      alamat: '',
      no_telp: '',
      id_spp: '',
      image: null,
      uploadFile: true,
    })
  }

  Edit = (selectedItem) => {
    this.setState({
      action: 'update',
      nisn: selectedItem.nisn,
      nis: selectedItem.nis,
      nama: selectedItem.nama,
      id_kelas: selectedItem.kelas.id_kelas,
      alamat: selectedItem.alamat,
      no_telp: selectedItem.no_telp,
      id_spp: selectedItem.id_spp,
      image: null,
      uploadFile: false,
    })
  }

  saveSiswa = (ev) => {
    ev.preventDefault()
    this.setState({ showingEdit: !this.state.showingEdit })
    let form = new FormData()
    form.append('nisn', this.state.nisn)
    form.append('nis', this.state.nis)
    form.append('nama', this.state.nama)
    form.append('kelas', this.state.kelas)
    form.append('alamat', this.state.alamat)
    form.append('no_telp', this.state.no_telp)
    form.append('id_kelas', this.state.id_kelas)
    form.append('id_spp', this.state.id_spp)

    if (this.state.uploadFile) {
      form.append('image', this.state.image)
    }

    let url = base_url + "/siswa"
    if (this.state.action === "insert") {
      axios.post(url, form, this.headerConfig())
        .then(response => {
          window.alert(response.data.message)
          this.getSiswa()
        })
        .catch(error => console.log(error))
    } else if (this.state.action === "update") {
      axios.put(url, form, this.headerConfig())
        .then(response => {
          window.alert(response.data.message)
          this.getSiswa()
        })
        .catch(error => console.log(error))
    }

  }

  log = () => {
    console.log(this.state.id_kelas)
  }
  componentDidMount() {
    this.getSiswa()
    this.getKelas()
    this.getSpp()
  }
  render() {
    const { siswa, showingDetail, detailSiswa, showingEdit, kelas, spp } = this.state

    return (
      <div>
        <Sidebar />
        <div className='xl:pl-76 h-screen xl:pt-20 pt-16 w-screen bg-grey-eee overflow-hidden '>
          <div className='p-8 h-full'>
            <div className='flex gap-4'>
              <div className='h-14 bg-white xl:w-1/3  rounded-xl shadow-md border-purple-light border-2 border-opacity-80'>
                <div className='flex justify-center items-center h-full w-full'>
                  <Search className="w-2/12 lg:w-1/12 xl:w-1/6 h-3/5" />
                  <p className='w-10/12 lg:w-11/12 xl:w-5/6 font-body text-lg text-grey-666 opacity-80'>Search for name or NISN</p>
                </div>
              </div>
              <div className='w-2/4 flex gap-4 ml-auto mr-0 '>
                <button className='h-14 text-white xl:w-1/3  rounded-2xl shadow-md bg-purple-light flex justify-center items-center p-2' onClick={() => { this.setState({ showingEdit: !showingEdit }); this.Add() }}>
                  <p className='font-base text-lg font-medium w-5/6 overflow-hidden'>Tambah Data</p>
                  <Plus className="h-3/4 w-1/6 ml-0" />
                </button>
                <Link className='h-full w-1/3' to="../kelas">
                  <div className='h-14 bg-white xl:w-full  rounded-2xl shadow-md border-purple-light border-2 border-opacity-80'>
                    <div className='flex justify-center items-center h-full w-full'>
                      <button>Data SPP</button>
                    </div>
                  </div>
                </Link>
                <Link className='h-full w-1/3' to="../spp">
                  <div className='h-14 bg-white xl:w-full  rounded-2xl shadow-md border-purple-light border-2 border-opacity-80'>
                    <div className='flex justify-center items-center h-full w-full'>
                      <button>Data Kelas</button>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div className=' h-90% pt-8 w-full'>
              <div className="table w-full table-auto h-full bg-white rounded-xl shadow-xl px-4">
                {/* Header Table Siswa*/}
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
                {/* Body Table Siswa */}
                <div className="table-row-group h-10/12 justify-center relative border-collapse">
                  {siswa ? siswa.map((item, index, { length }) => (
                    <div className="table-row font-body text-lg 2xl:text-xl" key={index} >
                      <div className='table-cell align-middle border-b-2 border-solid border-grey-eee w-1/12'>{item.nisn}</div>
                      <div className='table-cell align-middle border-b-2 border-solid border-grey-eee'>{item.nis}</div>
                      <div className='table-cell align-middle border-b-2 border-solid border-grey-eee'>{item.nama}</div>
                      <div className='table-cell align-middle border-b-2 border-solid border-grey-eee'>{item.kelas.nama_kelas}</div>
                      <div className='table-cell align-middle border-b-2 border-solid border-grey-eee w-1/12 h-1/12 relative'>
                        <img className='rounded-full h-14 absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 transform' style={{ 'clip-path': "circle()" }} src={image_url + item.image} alt="Siswa" />
                      </div>
                      <div className='table-cell align-middle border-b-2 border-solid border-grey-eee  overflow-hidden'>
                        <div className='lg:flex w-full h-full items-center gap-4  hidden'>
                          <button className='h-12 bg-purple-verylight w-1/3 shadow-sm rounded-full items-center flex justify-center' onClick={() => { this.setState({ showingDetail: !showingDetail }); this.getDetailSiswa(item) }}> <p className='w-1/2 text-center font-medium'>Detail</p> <Detail className='h-1/2 w-1/6 xl:w-1/5' /> </button>
                          <button className='h-12 bg-purple-verylight w-1/3 shadow-sm rounded-full items-center flex justify-center' onClick={() => { this.setState({ showingEdit: !showingEdit }); this.Edit(item) }}> <p className='w-1/2 text-center font-medium'>Edit</p> <Edit className='h-1/2 w-1/6 xl:w-1/5' /> </button>
                          <button className='h-12 bg-purple-verylight w-1/3 shadow-sm rounded-full items-center flex justify-center'> <p className='w-1/2 text-center font-medium'>Delete</p> <Delete className='h-1/2 w-1/5 ml-4 2xl:ml-0' /> </button>
                        </div>
                      </div>
                    </div>
                  )) : null}
                </div>
                {/* Footer Table Siswa */}
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
        {showingDetail && (
          <div className=' bg-white fixed z-20 w-full h-full bottom-0 backdrop-filter backdrop-blur-sm  bg-opacity-30 flex'>
            <div className='justify-center items-center w-3/5 h-1/2 bg-white m-auto relative shadow-2xl border-2 border-grey-eee rounded-xl'>
              <div className='h-1/6 flex justify-center items-center'>
                <p className='font-body text-3xl font-medium ml-10 text-purple-base'>Detail Siswa</p>
                <Exit className='right-0 ml-auto h-10 w-10 m-4 cursor-pointer' onClick={() => this.setState({ showingDetail: !showingDetail })} />
              </div>
              {detailSiswa ? detailSiswa.map((item, index) => (
                <div className='flex p-8 gap-4 h-10/12 w-full'>
                  <div className='w-1/3 flex items-center justify-center'>
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
        {showingEdit && (
          <div className=' bg-white fixed z-20 w-full h-full bottom-0 backdrop-filter backdrop-blur-sm  bg-opacity-30 flex'>
            <div className='justify-center items-center w-1/3 h-3/4 bg-white m-auto relative shadow-2xl border-2 border-grey-eee rounded-xl px-8'>
              <div className='h-1/7 flex justify-center items-center '>
                <p className='font-body text-3xl font-medium text-purple-base'>Edit Siswa</p>
                <Exit className='right-0 ml-auto h-10 w-10 cursor-pointer' onClick={() => this.setState({ showingEdit: !showingEdit })} />
              </div>
              <div className='h-5/6 w-full overflow-auto pr-4'>
                <form onSubmit={ev => this.saveSiswa(ev)}>
                  <div className="space-y-4">
                    <div className='font-body space-y-2'>
                      <label className='text-xl font-medium pb-2'>NISN</label>
                      <input className=' block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light' placeholder='NISN' type="text" value={this.state.nisn} onChange={ev => this.setState({ nisn: ev.target.value })} required />
                    </div>
                    <div className='font-body space-y-2'>
                      <label className='text-xl font-medium'>NIS</label>
                      <input className=' block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light' placeholder='NIS' type="text" value={this.state.nis} onChange={ev => this.setState({ nis: ev.target.value })} required />
                    </div>
                    <div className='font-body space-y-2'>
                      <label className='text-xl font-medium'>Nama</label>
                      <input className=' block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light' placeholder='Nama' type="text" value={this.state.nama} onChange={ev => this.setState({ nama: ev.target.value })} required />
                    </div>
                    <div className='font-body space-y-2'>
                      <label className='text-xl font-medium'>Kelas</label>
                      <select value={this.state.id_kelas} onChange={ev => { this.setState({ id_kelas: ev.target.value }) }} className="form-select w-full mt-1 text-gray-900 h-10 bg-gray-50  py-1 rounded-md border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 px-2">
                        {this.state.action === "insert" ? (
                          <option selected="selected">-</option>
                        ) : null}
                        {kelas && kelas.map((item, index) => (
                          <option value={item.id_kelas}>{item.id_kelas} - {item.nama_kelas} - Angkatan {item.angkatan}</option>
                        ))}
                      </select>
                    </div>
                    <div className='font-body space-y-2'>
                      <label className='text-xl font-medium'>Alamat</label>
                      <input className=' block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light' placeholder='Jl. Penjara Suci' type="text" value={this.state.alamat} onChange={ev => this.setState({ alamat: ev.target.value })} required />
                    </div>
                    <div className='font-body space-y-2'>
                      <label className='text-xl font-medium'>No. Telp</label>
                      <input className=' block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light' placeholder='+1' type="text" value={this.state.no_telp} onChange={ev => this.setState({ no_telp: ev.target.value })} required />
                    </div>
                    <div className='font-body space-y-2'>
                      <label className='text-xl font-medium'>Spp Perbulan</label>
                      <select value={this.state.id_spp} onChange={ev => { this.setState({ id_spp: ev.target.value }) }} className="form-select w-full mt-1 text-gray-900 h-10 bg-gray-50  py-1 rounded-md border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 px-2">
                        {this.state.action === "insert" ? (
                          <option selected="selected">-</option>
                        ) : null}
                        {spp && spp.map((item, index) => (
                          <option value={item.id_spp}>{item.id_spp} - Rp. {item.nominal} - Angkatan {item.angkatan}</option>
                        ))}
                      </select>
                    </div>
                    {this.state.action === "update" && this.state.uploadFile === false ? (
                      <button className="block relative bg-purple-light text-white text-lg font-medium w-full p-2 rounded-xl"
                        onClick={() => this.setState({ uploadFile: true })}>
                        Change Image
                      </button>
                    ) : (
                      <div>
                        <label className='text-xl font-medium'>Image</label>
                        <input type="file" className="relative block w-full mb-1"
                          onChange={ev => this.setState({ image: ev.target.files[0] })}
                          required></input>
                      </div>
                    )}
                    <div className='font-body space-y-2 w-full'>
                      <button type="submit" className="block relative bg-purple-light text-white text-lg font-medium w-full p-2 rounded-xl">
                        Simpan
                      </button>
                    </div>

                  </div>
                </form>
                {/* <button onClick={() => this.log()}>log</button> */}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}
