import React, { Component } from 'react';
import Sidebar from "../components/Sidebar"
import { ReactComponent as Search } from "../assets/siswa/Search.svg"
import { ReactComponent as Edit } from "../assets/siswa/Edit.svg"
import { ReactComponent as Delete } from "../assets/siswa/Delete.svg"
import { ReactComponent as Exit } from "../assets/siswa/Exit.svg"
import { ReactComponent as Plus } from "../assets/siswa/Plus.svg"
import { ReactComponent as ArrowLeft } from "../assets/siswa/ArrowLeft.svg"
import { ReactComponent as ArrowRight } from "../assets/siswa/ArrowRight.svg"
import { base_url } from '../config';
import axios from 'axios';
export default class Kelas extends Component {
  constructor() {
    super()
    this.state = {
      showingDetail: false,
      showingEdit: false,
      token: "",
      kelas: [],
      detailkelas: [],
      action: '',
      id_kelas: 0,
      nama_kelas: '',
      jurusan: '',
      angkatan: 0
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

  threeDigits = (jml) => {
    //this.setState({ tunggakanCount: jml.toLocaleString('id-ID') })
    return jml.toLocaleString('id-ID')
  }

  Add = () => {
    this.setState({
      action: 'insert',
      id_kelas: 0,
      nama_kelas: '',
      jurusan: '',
      angkatan: 0
    })
  }

  Edit = (selectedItem) => {
    this.setState({
      action: 'update',
      id_kelas: selectedItem.id_kelas,
      nama_kelas: selectedItem.nama_kelas,
      jurusan: selectedItem.jurusan,
      angkatan: selectedItem.angkatan
    })
  }

  saveKelas = (ev) => {
    ev.preventDefault()
    this.setState({ showingEdit: !this.state.showingEdit })
    let form = {
      id_kelas: this.state.id_kelas,
      nama_kelas: this.state.nama_kelas,
      jurusan: this.state.jurusan,
      angkatan: this.state.angkatan
    }

    let url = base_url + "/kelas"
    if (this.state.action === "insert") {
      axios.post(url, form, this.headerConfig())
        .then(response => {
          window.alert(response.data.message)
          this.getKelas()
        })
        .catch(error => console.log(error))
    } else if (this.state.action === "update") {
      axios.put(url, form, this.headerConfig())
        .then(response => {
          window.alert(response.data.message)
          this.getKelas()
        })
        .catch(error => console.log(error))
    }

  }

  dropSiswa = (selectedItem) => {
    if (window.confirm("are you sure will delete this item?")) {
      let url = base_url + "/kelas/" + selectedItem.id_kelas
      axios.delete(url, this.headerConfig())
        .then(response => {
          window.alert(response.data.message)
          this.getKelas()
        })
        .catch(error => console.log(error))
    }
  }

  log = () => {
    console.log(this.state.id_kelas)
  }

  componentDidMount() {
    this.getKelas()
  }
  render() {
    const { showingEdit, kelas } = this.state
    return (
      <div>
        <Sidebar />
        <div>
          <div className='xl:pl-76 h-screen xl:pt-20 pt-16 w-screen bg-grey-eee overflow-hidden '>
            <div className='p-8 h-full'>
              <div className='flex gap-4'>
                <div className='h-14 bg-white xl:w-1/3  rounded-xl shadow-md border-purple-light border-2 border-opacity-80'>
                  {/* Searcher */}
                  <div className='flex justify-center items-center h-full w-full'>
                    <Search className="w-2/12 lg:w-1/12 xl:w-1/6 h-3/5" />
                    <p className='w-10/12 lg:w-11/12 xl:w-5/6 font-body text-lg text-grey-666 opacity-80'>Search any</p>
                  </div>
                </div>
            
              </div>
              {/* table */}
              <div className=' h-90% pt-8 w-full'>
                <div className="table w-full table-auto h-full bg-white rounded-xl shadow-xl px-4">
                  {/* Header Table Siswa*/}
                  <thead className="h-1/12 font-body font-medium text-xl relative">
                    <tr>
                      <td className="align-middle">ID</td>
                      <td className="align-middle">Nama</td>
                      <td className="align-middle">Angkatan</td>
                      <td className="align-middle">Jurusan</td>
                      <td className="lg:table-cell align-middle hidden">Action</td>
                    </tr>
                    <hr className='bg-grey-eee absolute bottom-0 h-0.5 w-full' />
                  </thead>
                  {/* Body Table Siswa */}
                  <tbody className="table-row-group h-10/12 justify-center relative border-collapse">
                    {kelas ? kelas.map((item, index, { length }) => (
                      <tr className=" font-body text-lg 2xl:text-xl" key={index} >
                        <div className='table-cell align-middle border-b-2 border-solid border-grey-eee w-1/12'>{item.id_kelas}</div>
                        <div className='table-cell align-middle border-b-2 border-solid border-grey-eee'>{item.nama_kelas}</div>
                        <div className='table-cell align-middle border-b-2 border-solid border-grey-eee'>{item.angkatan}</div>
                        <div className='table-cell align-middle border-b-2 border-solid border-grey-eee'>{item.jurusan}</div>
                        <div className='table-cell align-middle border-b-2 border-solid border-grey-eee  overflow-hidden'>
                          <div className='lg:flex w-full h-full items-center gap-4  hidden'>
                            <button className='h-12 bg-tosca bg-opacity-15 w-1/3 shadow-sm rounded-full items-center flex justify-center' onClick={() => { this.setState({ showingEdit: !showingEdit }); this.Edit(item) }}> <p className='w-1/2 text-center font-medium'>Edit</p> <Edit className='h-1/2 w-1/6 xl:w-1/5' /> </button>
                            <button className='h-12 bg-red-base bg-opacity-15 w-1/3 shadow-sm rounded-full items-center flex justify-center' onClick={() => this.dropSiswa(item)}> <p className='w-1/2 text-center font-medium'>Delete</p> <Delete className='h-1/2 w-1/5 ml-4 2xl:ml-0' /> </button>
                          </div>
                        </div>
                      </tr>
                    )) : null}
                  </tbody>
                  {/* Footer Table Siswa */}
                  <tfoot className="h-1/12 ">
                    <div className="table-row font-body font-medium text-xl w-full">
                      <td colSpan="5">
                        <div className='p-2 flex items-center justify-center h-full'>
                          <button className='h-14 text-white xl:w-1/6 rounded-2xl shadow-md bg-purple-light flex justify-center items-center p-2' onClick={() => { this.setState({ showingEdit: !showingEdit }); this.Add() }}>
                            <p className='font-base text-lg font-medium w-5/6 overflow-hidden'>Tambah Data</p>
                            <Plus className="h-1/2 w-1/6 ml-0" />
                          </button>
                          <div className='ml-auto mr-0 flex h-full items-center gap-2'>
                            <ArrowLeft />
                            <p className='text-2xl font-body'>1</p>
                            <ArrowRight />
                          </div>
                        </div>
                      </td>
                    </div>
                  </tfoot>
                </div>
              </div>
            </div>
          </div>
          {/*  */}
          {showingEdit && (
            <div className=' bg-white fixed z-20 w-full h-full bottom-0 backdrop-filter backdrop-blur-sm  bg-opacity-30 flex'>
              <div className='justify-center items-center w-1/3 h-3/4 bg-white m-auto relative shadow-2xl border-2 border-grey-eee rounded-xl px-8'>
                <div className='h-1/7 flex justify-center items-center '>
                  <p className='font-body text-3xl font-medium text-purple-base'>Edit Kelas</p>
                  <Exit className='right-0 ml-auto h-10 w-10 cursor-pointer' onClick={() => this.setState({ showingEdit: !showingEdit })} />
                </div>
                <div className='h-5/6 w-full overflow-auto pr-4'>
                  <form onSubmit={ev => this.saveKelas(ev)} className="h-full">
                    <div className="space-y-4 h-full">
                      {this.state.action === "update" && (
                        <div className='font-body space-y-2'>
                          <label className='text-xl font-medium pb-2'>ID</label>
                          <input className=' block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light' disabled placeholder='ID' type="text" value={this.state.id_kelas} onChange={ev => this.setState({ id_kelas: ev.target.value })} required />
                        </div>
                      )}
                      <div className='font-body space-y-2'>
                        <label className='text-xl font-medium'>Nama Kelas</label>
                        <input className=' block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light' placeholder='XII Informatika 12' type="text" value={this.state.nama_kelas} onChange={ev => this.setState({ nama_kelas: ev.target.value })} required />
                      </div>
                      <div className='font-body space-y-2'>
                        <label className='text-xl font-medium'>Angkatan</label>
                        <input className=' block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light' placeholder='31' type="number" value={this.state.angkatan} onChange={ev => this.setState({ angkatan: ev.target.value })} required />
                      </div>
                      <div className='font-body space-y-2'>
                        <label className='text-xl font-medium'>Jurusan</label>
                        <input className=' block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light' placeholder='Informatika' type="text" value={this.state.jurusan} onChange={ev => this.setState({ jurusan: ev.target.value })} required />
                      </div>
                      <div className='font-body w-full mt-auto mb-0 align-bottom'>
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
      </div>
    );
  }
}
