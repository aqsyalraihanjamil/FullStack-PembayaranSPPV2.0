import React, { Component } from "react";
import Sidebar from "../components/Sidebar";
import { base_url } from "../config";
import axios from "axios";
export default class Entri extends Component {
  constructor() {
    super();
    this.state = {
      token: "",
      pembayaran: [],
      siswa: [],
      petugas: [],
      tunggakan: 0,
      action: "",
      id_pembayaran: 0,
      id_petugas: 0,
      nisn: "",
      tgl_bayar: "",
      bulan_dibayar: "",
      tahun_dibayar: "",
      jumlah_bayar: 0,

    };
    if (localStorage.getItem("token")) {
      this.state.token = localStorage.getItem("token");
    } else {
      window.location = "/login";
    }
    this.headerConfig.bind(this);
  }

  headerConfig = () => {
    let header = {
      headers: { Authorization: `Bearer ${this.state.token}` },
    };
    return header;
  };

  getSiswa = () => {
    let url = base_url + "/siswa";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({ siswa: response.data });
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

  

  getDetailKelas = (id) => {
    let url = base_url + "/kelas/" + id;
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({ angkatan: response.data[0].angkatan });
        console.log(this.state.angkatan);
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

  getPetugas = () => {
    let url = base_url + "/petugas";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({ petugas: response.data });
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

  // Add = () => {
  //   this.setState({
  //     action: 'insert',
  //     id_pembayaran: 0,
  //     id_petugas: 0,
  //     nisn: '',
  //     bulan_dibayar: '',
  //     tahun_dibayar: '',
  //     jumlah_bayar: 0,
  //     tunggakan: 0
  //   })
  // }

  savePembayaran = (ev) => {
    ev.preventDefault();
    let form = {
      id_pembayaran: this.state.id_pembayaran,
      id_petugas: this.state.id_petugas,
      nisn: this.state.nisn,
      bulan_dibayar: this.state.bulan_dibayar,
      tahun_dibayar: this.state.tahun_dibayar,
      jumlah_bayar: this.state.jumlah_bayar,
    };
    let url = base_url + "/pembayaran";
    if (this.state.jumlah_bayar < this.state.tunggakan) {
      axios
        .post(url, form, this.headerConfig())
        .then((response) => {
          window.alert(response.data.message);
        })
        .catch((error) => console.log(error));
    } else {
      alert("Kamu tidak bisa membayar melebihi tunggakan");
    }
  };

  checkBayar = (num) => {
    if (num > this.state.tunggakan) {
      alert("Kamu tidak bisa membayar melebihi tunggakan");
      return false;
    }
  };



  componentDidMount() {
    this.getSiswa();
    this.getPetugas();
  }
  render() {
    const { siswa, petugas } = this.state;
    return (
      <div>
        <Sidebar />
        <div className=" xl:pl-76 h-screen xl:pt-20 pt-16 w-screen bg-grey-eee overflow-hidden ">
          <div className="p-8 h-full">
            <div className="justify-center items-center w-1/2 h-full bg-white m-auto relative shadow-2xl border-2 border-grey-eee rounded-xl px-8 py-10">
              <div className="h-1/7 flex justify-center items-center ">
                <p className="font-body text-3xl font-medium text-purple-base">Entri Pembayaran</p>
              </div>
              <div className="h-5/6 w-full overflow-auto pr-4">
                <form onSubmit={(ev) => this.savePembayaran(ev)}>
                  <div className="space-y-4">
                    <div className="font-body space-y-2">
                      <label className="text-xl font-medium">Nama Siswa</label>
                      <select
                        value={this.state.nisn}
                        onChange={(ev) => {
                          this.setState({ nisn: ev.target.value });
                          this.getDetailSiswa(ev.target.value);
                          console.log(ev.target.value);
                        }}
                        className="form-select w-full mt-1 text-gray-900 h-10 bg-gray-50  py-1 rounded-md border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 px-2"
                        required
                      >
                        <option selected="selected">-</option>
                        {siswa &&
                          siswa.map((item, index) => (
                            <option value={item.nisn}>
                              {item.nisn} - {item.nama}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="font-body space-y-2">
                      <label className="text-xl font-medium">Nama Petugas</label>
                      <select
                        value={this.state.id_petugas}
                        onChange={(ev) => {
                          this.setState({ id_petugas: ev.target.value });
                        }}
                        className="form-select w-full mt-1 text-gray-900 h-10 bg-gray-50  py-1 rounded-md border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 px-2"
                        required
                      >
                        <option selected="selected">-</option>
                        {petugas &&
                          petugas.map((item, index) => (
                            <option value={item.id_petugas}>
                              {item.id_petugas} - {item.nama_petugas}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="font-body space-y-2">
                      <label className="text-xl font-medium">Bulan Bayar</label>
                      <select
                        value={this.state.bulan_dibayar}
                        onChange={(ev) => {
                          this.setState({ bulan_dibayar: ev.target.value });
                        }}
                        className="form-select w-full mt-1 text-gray-900 h-10 bg-gray-50  py-1 rounded-md border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 px-2"
                        required
                      >
                        <option selected="selected">-</option>
                        <option value="1">Januari</option>
                        <option value="2">Februari</option>
                        <option value="3">Maret</option>
                        <option value="4">April</option>
                        <option value="5">Mei</option>
                        <option value="6">Juni</option>
                        <option value="7">Juli</option>
                        <option value="8">Agustus</option>
                        <option value="9">September</option>
                        <option value="10">Oktober</option>
                        <option value="11">November</option>
                        <option value="12">Desember</option>
                      </select>
                    </div>
                    <div className="font-body space-y-2">
                      <label className="text-xl font-medium">Tahun Bayar</label>
                      <input
                        className=" block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light"
                        placeholder="2013"
                        type="text"
                        value={this.state.tahun_dibayar}
                        onChange={(ev) => this.setState({ tahun_dibayar: ev.target.value })}
                        required
                      />
                    </div>
                    <div className="font-body space-y-2 ">
                      <div className="flex gap-4">
                        <label className="text-xl font-medium w-1/2">Jumlah Bayar</label>
                        <label className="text-xl font-medium w-1/2">Tunggakan</label>
                      </div>
                      <div className="flex gap-4">
                        <input
                          className=" block relative w-1/2 border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light"
                          placeholder="100000"
                          type="number"
                          value={this.state.jumlah_bayar}
                          onChange={(ev) => this.setState({ jumlah_bayar: ev.target.value })}
                          required
                        />
                        <input
                          className=" block relative w-1/2 border border-gray-300 bg-gray-200 text-gray-900 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light"
                          type="number"
                          value={this.state.tunggakan}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="font-body space-y-2">
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
        </div>
      </div>
    );
  }
}
