import React, { Component } from 'react';
import Sidebar from "../components/Sidebar"
import { ReactComponent as Search } from "../assets/siswa/Search.svg"
import { ReactComponent as Edit } from "../assets/siswa/Edit.svg"
import { ReactComponent as Delete } from "../assets/siswa/Delete.svg"
import { ReactComponent as Exit } from "../assets/siswa/Exit.svg"
import { ReactComponent as Plus } from "../assets/siswa/Plus.svg"
import { ReactComponent as ArrowLeft } from "../assets/siswa/ArrowLeft.svg"
import { ReactComponent as ArrowRight } from "../assets/siswa/ArrowRight.svg"
import { base_url, image_url } from '../config';
import axios from 'axios';
export default class Petugas extends Component {
  constructor() {
    super()
    this.state = {
      showingDetail: false,
      showingEdit: false,
      fillPassword: true,
      uploadFile: true,
      token: "",
      petugas: [],
      detailPetugas: [],
      action: '',
      id_petugas: 0,
      nama_petugas: '',
      username: '',
      password: '',
      level: '',
      image: '',

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


  getPetugas = () => {
    let url = base_url + "/petugas"
    axios.get(url, this.headerConfig())
      .then(response => {
        this.setState({ petugas: response.data })
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

  Add = () => {
    this.setState({
      action: 'insert',
      id_petugas: 0,
      nama_petugas: "",
      username: '',
      password: '',
      level: '',
      image: null,
    })
  }

  Edit = (selectedItem) => {
    this.setState({
      action: 'update',
      id_petugas: selectedItem.id_petugas,
      nama_petugas: selectedItem.nama_petugas,
      username: selectedItem.username,
      password: selectedItem.password,
      level: selectedItem.level,
      image: selectedItem.image,
      uploadFile: false,
      fillPassword: false,
    })
  }

  savePetugas = (ev) => {
    ev.preventDefault()
    this.setState({ showingEdit: !this.state.showingEdit })
    let form = new FormData()
    form.append('id_petugas', this.state.id_petugas)
    form.append('nama_petugas', this.state.nama_petugas)
    form.append('username', this.state.username)
    form.append('level', this.state.level)

    if (this.state.fillPassword) {
      form.append('password', this.state.password)
    }

    if (this.state.uploadFile) {
      form.append('image', this.state.image)
    }


    let url = base_url + "/petugas"
    if (this.state.action === "insert") {
      axios.post(url, form, this.headerConfig())
        .then(response => {
          window.alert(response.data.message)
          this.getPetugas()
        })
        .catch(error => console.log(error))
    } else if (this.state.action === "update") {
      axios.put(url, form, this.headerConfig())
        .then(response => {
          window.alert(response.data.message)
          this.getPetugas()
        })
        .catch(error => console.log(error))
    }

  }

  dropPetugas = (selectedItem) => {
    if (window.confirm("are you sure will delete this item?")) {
      let url = base_url + "/petugas/" + selectedItem.id_petugas
      axios.delete(url, this.headerConfig())
        .then(response => {
          window.alert(response.data.message)
          this.getPetugas()
        })
        .catch(error => console.log(error))
    }
  }

  log = () => {
    console.log(this.state.id_kelas)
  }

  componentDidMount() {
    this.getPetugas()
  }
  render() {
    const { showingEdit, petugas } = this.state
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
                    <p className='w-10/12 lg:w-11/12 xl:w-5/6 font-body text-lg text-grey-666 opacity-80'>Search for name or NISN</p>
                  </div>
                </div>
              </div>
              {/* table */}
              <div className=' h-90% pt-8 w-full'>
                <div className="table w-full table-auto h-full bg-white rounded-xl shadow-xl px-4">
                  {/* Header Table Siswa*/}
                  <thead className="h-1/12 font-body font-medium text-xl relative">
                    <tr>
                      <td className=" align-middle">No</td>
                      <td className=" align-middle">Nama</td>
                      <td className=" align-middle">Username</td>
                      <td className=" align-middle">Image</td>
                      <td className=" align-middle">As</td>
                      <td className="lg:table-cell align-middle hidden">Action</td>
                    </tr>
                    <hr className='bg-grey-eee absolute bottom-0 h-0.5 w-full' />
                  </thead>
                  {/* Body Table Siswa */}
                  <tbody className="table-row-group h-10/12 justify-center relative border-collapse">
                    {petugas ? petugas.map((item, index, { length }) => (
                      <tr className=" font-body text-lg 2xl:text-xl" key={index} >
                        <div className='table-cell align-middle border-b-2 border-solid border-grey-eee w-1/12'>{index + 1}</div>
                        <div className='table-cell align-middle border-b-2 border-solid border-grey-eee'>{item.nama_petugas}</div>
                        <div className='table-cell align-middle border-b-2 border-solid border-grey-eee'>{item.username}</div>
                        <div className='table-cell align-middle border-b-2 border-solid border-grey-eee w-1/12 h-1/12 relative'>
                          <img className='rounded-full h-14 absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 transform' style={{ 'clip-path': "circle()" }} src={image_url + item.image} alt="Siswa" />
                        </div>
                        <div className='table-cell align-middle border-b-2 border-solid border-grey-eee'>{item.level}</div>
                        <div className='table-cell align-middle border-b-2 border-solid border-grey-eee  overflow-hidden'>
                          <div className='lg:flex w-full h-full items-center gap-4  hidden'>
                            <button className='h-12 bg-tosca bg-opacity-15 w-1/3 shadow-sm rounded-full items-center flex justify-center' onClick={() => { this.setState({ showingEdit: !showingEdit }); this.Edit(item) }}> <p className='w-1/2 text-center font-medium'>Edit</p> <Edit className='h-1/2 w-1/6 xl:w-1/5' /> </button>
                            <button className='h-12 bg-red-base bg-opacity-15 w-1/3 shadow-sm rounded-full items-center flex justify-center' onClick={() => this.dropPetugas(item)}> <p className='w-1/2 text-center font-medium'>Delete</p> <Delete className='h-1/2 w-1/5 ml-4 2xl:ml-0' /> </button>
                          </div>
                        </div>
                      </tr>
                    )) : null}
                  </tbody>
                  {/* Footer Table Siswa */}
                  <tfoot className="h-1/12 ">
                    <div className="table-row font-body font-medium text-xl w-full">
                      <td colSpan="100">
                        <div className='p-2 flex items-center justify-center h-full'>
                           {/* Insert Data */}
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
                  <p className='font-body text-3xl font-medium text-purple-base'>Edit Petugas</p>
                  <Exit className='right-0 ml-auto h-10 w-10 cursor-pointer' onClick={() => this.setState({ showingEdit: !showingEdit })} />
                </div>
                <div className='h-5/6 w-full overflow-auto pr-4'>
                  <form onSubmit={ev => this.savePetugas(ev)} className="h-full">
                    <div className="space-y-4 h-full">
                      {this.state.action === "update" && (
                        <div className='font-body space-y-2'>
                          <label className='text-xl font-medium pb-2'>ID</label>
                          <input className=' block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light' disabled placeholder='ID' type="text" value={this.state.id_petugas} onChange={ev => this.setState({ id_petugas: ev.target.value })} required />
                        </div>
                      )}
                      <div className='font-body space-y-2'>
                        <label className='text-xl font-medium'>Nama</label>
                        <input className=' block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light' placeholder='Nama' type="text" value={this.state.nama_petugas} onChange={ev => this.setState({ nama_petugas: ev.target.value })} required />
                      </div>
                      <div className='font-body space-y-2'>
                        <label className='text-xl font-medium'>Username</label>
                        <input className=' block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light' placeholder='Username' type="text" value={this.state.username} onChange={ev => this.setState({ username: ev.target.value })} required />
                      </div>
                      <div className='font-body space-y-2'>
                        <label className='text-xl font-medium'>Level</label>
                        <select value={this.state.level} onChange={ev => { this.setState({ level: ev.target.value }) }} className="form-select w-full mt-1 text-gray-900 h-10 bg-gray-50  py-1 rounded-md border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 px-2">
                          {this.state.action === "insert" ? (
                            <option selected="selected">-</option>
                          ) : null}
                          <option value="admin">Admin</option>
                          <option value="petugas">Petugas</option>
                        </select>
                      </div>
                      {this.state.action === "update" && this.state.fillPassword === false ? (
                        <button className="bg-opacity-80 block relative bg-purple-light text-white text-lg font-medium w-full p-2 rounded-xl"
                          onClick={() => this.setState({ fillPassword: true })}>
                          Change Password
                        </button>
                      ) : (
                        <div>
                          <label className='text-xl font-medium'>Password</label>
                          <input className=' block relative w-full border border-gray-300  bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light' placeholder='Password' type="password" onChange={ev => this.setState({ password: ev.target.value })} required />
                        </div>
                      )}
                      {this.state.action === "update" && this.state.uploadFile === false ? (
                        <button className="block relative bg-purple-light bg-opacity-80 text-white text-lg font-medium w-full p-2 rounded-xl"
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
