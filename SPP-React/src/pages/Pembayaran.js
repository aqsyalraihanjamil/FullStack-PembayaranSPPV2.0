import React, { Component } from "react";
import Sidebar from "../components/Sidebar";
import { PDFDownloadLink, Document, Page, Text } from "@react-pdf/renderer";
import { Table, TableHeader, TableCell, TableBody, DataTableCell } from "@david.kucsai/react-pdf-table";
import { ReactComponent as Search } from "../assets/siswa/Search.svg";
import { ReactComponent as Detail } from "../assets/siswa/Detail.svg";
import { ReactComponent as Edit } from "../assets/siswa/Edit.svg";
import { ReactComponent as Delete } from "../assets/siswa/Delete.svg";
import { ReactComponent as Exit } from "../assets/siswa/Exit.svg";
import { ReactComponent as ArrowLeft } from "../assets/siswa/ArrowLeft.svg";
import { ReactComponent as ArrowRight } from "../assets/siswa/ArrowRight.svg";
import { base_url } from "../config";
import { ReactComponent as Paper } from "../assets/siswa/Paper.svg";
import axios from "axios";
export default class Pembayaran extends Component {
  constructor() {
    super();
    this.state = {
      showingDetail: false,
      showingEdit: false,
      editDate: false,
      token: "",
      pembayaran: [],
      siswa: [],
      detailPembayaran: [],
      petugas: [],
      action: "",
      id_pembayaran: 0,
      id_petugas: 0,
      nisn: "",
      tgl_bayar: "",
      bulan_dibayar: "",
      tahun_dibayar: "",
      jumlah_bayar: 0,
      filter: [],
      sliced: [],
      longPage: 0,
      search: "",
      page: 1,
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

  getPembayaran = () => {
    let url = base_url + "/pembayaran";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({ pembayaran: response.data });
        this.pagination(response.data);
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

  getDetailPembayaran = (item) => {
    let url = base_url + "/pembayaran/" + item.id_pembayaran;
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({ detailPembayaran: response.data });
        // console.log(this.state.detailSiswa)
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

  threeDigits = (jml) => {
    return jml.toLocaleString("id-ID");
  };

  convertMonth = (month) => {
    switch (month) {
      case 1:
        return "Januari";
      case 2:
        return "Februari";
      case 3:
        return "Maret";
      case 4:
        return "April";
      case 5:
        return "Mei";
      case 6:
        return "Juni";
      case 7:
        return "Juli";
      case 8:
        return "Agustus";
      case 9:
        return "September";
      case 10:
        return "Oktober";
      case 11:
        return "November";
      case 12:
        return "Desember";
      default:
        return "";
    }
  };

  toDate = (date) => {
    console.log(date);
    date = new Date(date);
    const weekday = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
    let monthDate = date.toLocaleString("id-ID", { month: "long" });
    let dayName = weekday[date.getDay()];
    return dayName + ", " + date.getDate() + " " + monthDate + " " + date.getFullYear();
  };

  Edit = (selectedItem) => {
    this.setState({
      action: "update",
      id_pembayaran: selectedItem.id_pembayaran,
      id_petugas: selectedItem.id_petugas,
      nisn: selectedItem.nisn,
      tgl_bayar: selectedItem.tgl_bayar,
      bulan_dibayar: selectedItem.bulan_dibayar,
      tahun_dibayar: selectedItem.tahun_dibayar,
      jumlah_bayar: selectedItem.jumlah_bayar,
      editDate: false,
    });
  };

  savePembayaran = (ev) => {
    ev.preventDefault();
    this.setState({ showingEdit: !this.state.showingEdit });
    let form = {
      id_pembayaran: this.state.id_pembayaran,
      id_petugas: this.state.id_petugas,
      nisn: this.state.nisn,
      bulan_dibayar: this.state.bulan_dibayar,
      tahun_dibayar: this.state.tahun_dibayar,
      jumlah_bayar: this.state.jumlah_bayar,
    };
    if (this.state.editDate) {
      form.tgl_bayar = this.state.tgl_bayar;
      console.log(form.tgl_bayar);
    }
    let url = base_url + "/pembayaran";
    if (this.state.action === "insert") {
      axios
        .post(url, form, this.headerConfig())
        .then((response) => {
          window.alert(response.data.message);
          this.getPembayaran();
        })
        .catch((error) => console.log(error));
    } else if (this.state.action === "update") {
      axios
        .put(url, form, this.headerConfig())
        .then((response) => {
          window.alert(response.data.message);
          this.getPembayaran();
        })
        .catch((error) => console.log(error));
    }
  };

  dropPembayaran = (selectedItem) => {
    if (window.confirm("are you sure will delete this item?")) {
      let url = base_url + "/pembayaran/" + selectedItem.id_pembayaran;
      axios
        .delete(url, this.headerConfig())
        .then((response) => {
          window.alert(response.data.message);
          this.getPembayaran();
        })
        .catch((error) => console.log(error));
    }
  };

  pagination = (arr) => {
    const res = [];
    let longPage = this.state.longPage;
    for (let i = 0; i < arr.length; i += longPage) {
      var sliced = arr.slice(i, i + longPage);
      res.push(sliced);
    }
    this.setState({ filter: res[this.state.page - 1], sliced: res });
  };

  searching = (ev) => {
    this.setState({ page: 1 });
    if (ev.keyCode === 13) {
      let searchText = this.state.search.toLowerCase();
      let temp = this.state.pembayaran;
      console.log(searchText);
      let filter = "";
      if (!searchText) {
        this.getPembayaran();
      } else {
        filter = temp.filter((item) => {
          return item.siswa.nama.toLowerCase().split(" ").includes(searchText) || item.petugas.nama_petugas.toLowerCase().split(" ").includes(searchText) || item.id_pembayaran == searchText;
        });
      }
      if (filter.length === 0 && searchText !== "") {
        window.alert("Item not found");
      } else {
        this.pagination(filter);
      }
    }
  };

  updateDimensions = () => {
    let height = window.innerHeight;
    if (height < 640) {
      this.setState({ longPage: 4 }, () => {
        this.paginationHeight(this.state.longPage);
      });
    } else if (height < 768) {
      this.setState({ longPage: 5 }, () => {
        this.paginationHeight(this.state.longPage);
      });
    } else if (height < 1024) {
      this.setState({ longPage: 7 }, () => {
        this.paginationHeight(this.state.longPage);
      });
    } else if (height < 1920) {
      this.setState({ longPage: 7 }, () => {
        this.paginationHeight(this.state.longPage);
      });
    }
  };

  paginationHeight = (page) => {
    const res = [];
    let resTemp = [];
    for (let i = 0; i < this.state.sliced.length; i++) {
      for (let j = 0; j < this.state.sliced[i].length; j++) {
        resTemp.push(this.state.sliced[i][j]);
      }
    }
    for (let i = 0; i < resTemp.length; i += page) {
      var sliced = resTemp.slice(i, i + page);
      res.push(sliced);
    }
    this.setState({ filter: res[this.state.page - 1], sliced: res });
  };

  changePage = (page) => {
    console.log(page);
    this.setState({ filter: this.state.sliced[page - 1] });
  };

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
    this.getSiswa();
    this.getPembayaran();
    this.getPetugas();
  }
  render() {
    const { siswa, petugas, filter, page, detailPembayaran, showingEdit, showingDetail } = this.state;
    const MyDoc = () => (
      <Document>
        <Page style={{ padding: 10 }}>
          <Text style={{ textAlign: "center", paddingBottom: 10 }}>Tabel Pembayaran </Text>
          <Text style={{ textAlign: "left", fontSize: 14, paddingBottom: 10 }}>Admin: {JSON.parse(localStorage.getItem('admin')).nama_petugas}</Text>
          <Text style={{ textAlign: "left", fontSize: 14, paddingBottom: 10 }}>Tanggal: {new Date(Date.now()).toLocaleString('id-ID')}</Text>
          <Table
            data={this.state.filter}
          >
            <TableHeader>
              <TableCell>
                ID
              </TableCell>
              <TableCell>
                Tanggal Dibayar
              </TableCell>
              <TableCell>
                Tahun Bayar
              </TableCell>
              <TableCell>
                Bulan Bayar
              </TableCell>
              <TableCell>
                Nominal
              </TableCell>
              <TableCell>
                Nama Petugas
              </TableCell>
            </TableHeader>
            <TableBody>
              <DataTableCell getContent={(r) => r.id_pembayaran} />
              <DataTableCell getContent={(r) => r.tgl_bayar.split("T")[0]} />
              <DataTableCell getContent={(r) => r.tahun_dibayar} />
              <DataTableCell getContent={(r) => r.bulan_dibayar} />
              <DataTableCell getContent={(r) => r.jumlah_bayar} />
              <DataTableCell getContent={(r) => r.petugas.nama_petugas} />
            </TableBody>
          </Table>
        </Page>
      </Document>
    );
    return (
      <div>
        {/* go to sidebar.js */}
        <Sidebar />
        {/* content */}
        <div className="xl:pl-76 h-screen xl:pt-20 pt-16 w-screen bg-grey-eee overflow-hidden ">
          <div className="p-6 md:p-8 md:pb-12 h-full">
            <div className="flex gap-4">
              <div className="h-12 lg:h-14 bg-white w-full xl:w-1/3  rounded-xl shadow-md border-purple-light border-2 border-opacity-80">
                {/* Searcher */}
                <div className="flex justify-center items-center h-full w-full ">
                  <Search className="w-1/12 xl:w-1/6 xl:h-3/5 h-2/5" />
                  <input
                    className="w-full xl:w-5/6 font-body font-medium text-sm placeholder-grey-666 opacity-80 mr-4 outline-none appearance-none xl:text-base"
                    placeholder="Search..."
                    type="text"
                    value={this.state.search}
                    onChange={(ev) => this.setState({ search: ev.target.value })}
                    onKeyUp={this.searching}
                  />
                </div>
              </div>
            </div>
            {/* table */}
            <div className=" h-90% mt-4 mb-2 w-full overflow-auto shadow-xl rounded-xl">
              <div className="table w-full table-auto h-full bg-white px-4 min-w-normal min-h-400 rounded-xl">
                {/* Header Table Siswa*/}
                <thead className="h-1/12 font-body font-medium text-md md:text-xl relative">
                  <tr className="overflow-scroll">
                    <div className="table-cell align-middle">ID</div>
                    <div className="table-cell align-middle">Nama Siswa</div>
                    <div className="table-cell align-middle">Nama Petugas</div>
                    <div className="table-cell align-middle">Jumlah Bayar</div>
                    <div className="align-middle table-cell">Action</div>
                  </tr>
                  <hr className="bg-grey-eee absolute bottom-0 h-0.5 w-full" />
                </thead>
                {/* Body Table Siswa */}
                <div className="table-row-group h-10/12 justify-center relative border-collapse">
                  {filter
                    ? filter.map((item, index, { length }) => (
                      <tr className="  font-body text-sm md:text-lg" key={index}>
                        <div className="table-cell align-middle border-b-2 border-solid border-grey-eee w-1/12">{item.id_pembayaran}</div>
                        <div className="table-cell align-middle border-b-2 border-solid border-grey-eee">{item.siswa.nama}</div>
                        <div className="table-cell align-middle border-b-2 border-solid border-grey-eee">{item.petugas.nama_petugas}</div>
                        <div className="table-cell align-middle border-b-2 border-solid border-grey-eee">Rp. {this.threeDigits(item.jumlah_bayar)}</div>
                        <div className="table-cell align-middle border-b-2 border-solid border-grey-eee  overflow-hidden">
                          <div className="flex w-full h-full items-center gap-2 lg:gap-4">
                            {localStorage.getItem('level') === "admin" ? (<>
                              <button
                                className="h-10 w-10  md:h-12 bg-purple-light bg-opacity-15 md:w-12 xl:w-1/3 shadow-sm rounded-full items-center flex justify-center"
                                onClick={() => {
                                  this.setState({ showingDetail: !showingDetail });
                                  this.getDetailPembayaran(item);
                                }}
                              >
                                <p className="w-1/2 text-center font-medium xl:inline hidden">Detail</p> <Detail className="w-full h-full p-2.5 md:p-3.5 xl:p-0 xl:h-1/2 xl:w-1/5 xl:ml-2 2xl:ml-0" />                            </button>


                              <button
                                className="h-10 w-10  md:h-12 bg-tosca bg-opacity-15 md:w-12 xl:w-1/3 shadow-sm rounded-full items-center flex justify-center"
                                onClick={() => {
                                  this.setState({ showingEdit: !showingEdit });
                                  this.Edit(item);
                                }}
                              >
                                <p className="w-1/2 text-center font-medium xl:inline hidden">Edit</p> <Edit className="w-full h-full p-2.5 md:p-3.5 xl:p-0 xl:h-1/2 xl:w-1/5 xl:ml-2 2xl:ml-0" />
                              </button>
                              <button className="h-10 w-10  md:h-12 bg-red-base bg-opacity-15 md:w-12 xl:w-1/3 shadow-sm rounded-full items-center flex justify-center" onClick={() => this.dropPembayaran(item)}>
                                <p className="w-1/2 text-center font-medium xl:inline hidden">Delete</p> <Delete className="w-full h-full p-2.5 md:p-3.5 xl:p-0 xl:h-1/2 xl:w-1/5 xl:ml-2 2xl:ml-0" />
                              </button>
                            </>
                            ) : (
                              <button 
                                className="h-10 w-10  md:h-12 bg-purple-light bg-opacity-15 md:w-12 xl:w-3/4 shadow-sm rounded-full items-center flex justify-center"
                                onClick={() => {
                                  this.setState({ showingDetail: !showingDetail });
                                  this.getDetailPembayaran(item);
                                }}
                              >
                                <p className="w-1/2 text-center font-medium xl:inline hidden">Detail</p> <Detail className="w-full h-full p-2.5 md:p-3.5 xl:p-0 xl:h-1/2 xl:w-1/5 xl:ml-2 2xl:ml-0" />                            </button>
                            )}

                          </div>
                        </div>
                      </tr>
                    ))
                    : null}
                </div>
                {/* Footer Table Siswa */}
                <tfoot className="h-6 lg:h-1/12 ">
                  <div className="table-row font-body font-medium text-lg w-full">
                    <td colSpan="8">
                      <div className="p-2 flex items-center justify-center h-full w-full">
                        <div className="ml-auto mr-0 flex h-full items-center gap-2">
                        {localStorage.getItem('level') === "admin" ? (
                          <PDFDownloadLink document={<MyDoc />} fileName="Tabel Pembayaran.pdf" className="flex gap-2 bg-grey-eee py-2 px-4 rounded-lg text-base">
                            {({ blob, url, loading, error }) =>
                              loading ? (
                                "Loading..."
                              ) : (
                                <>
                                  <p>Print Page</p> <Paper className="mb-0.5" />
                                </>
                              )
                            }
                          </PDFDownloadLink>
                        ):null}
                          {this.state.page > 1 ? (
                            <button
                              className="cursor-pointer"
                              onClick={() => {
                                this.setState({ page: page - 1 }, () => {
                                  this.changePage(this.state.page);
                                });
                              }}
                            >
                              <ArrowLeft />
                            </button>
                          ) : (
                            <button disabled className="cursor-default">
                              <ArrowLeft />
                            </button>
                          )}
                          <p className="text-2xl font-body">{this.state.page}</p>
                          {this.state.page < this.state.sliced.length ? (
                            <button
                              className="cursor-pointer"
                              onClick={() => {
                                this.setState({ page: page + 1 }, () => {
                                  this.changePage(this.state.page);
                                });
                              }}
                            >
                              <ArrowRight />
                            </button>
                          ) : (
                            <button disabled className="cursor-default">
                              <ArrowRight />
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </div>
                </tfoot>
              </div>
            </div>
          </div>
        </div>
        {/* Detail function */}
        {showingDetail && (
          <div className=" bg-white fixed z-20 w-full h-full bottom-0 backdrop-filter backdrop-blur-sm  bg-opacity-30 flex overflow-scroll">
            <div className="justify-center items-center w-3/4 md:w-3/4 xl:w-1/2  h-3/4 bg-white m-auto relative shadow-2xl border-2 border-grey-eee rounded-xl px-8 min-h-300 min-w-normal ">
              <div className="h-1/7 flex justify-center items-center">
                <p className="font-body text-3xl font-medium ml-0 lg:ml-10 text-purple-base">Detail Siswa</p>
                <Exit className="right-0 ml-auto h-10 w-10 m-4 cursor-pointer" onClick={() => this.setState({ showingDetail: !showingDetail })} />
              </div>
              {detailPembayaran
                ? detailPembayaran.map((item, index) => (
                  <div className="flex p-8 gap-4 h-10/12 w-full">
                    <div className="w-1/2 font-body h-full">
                      <div className="h-1/4">
                        <p className="text-xl font-medium">ID</p>
                        <p className="text-lg">{item.id_pembayaran}</p>
                      </div>
                      <div className="h-1/4">
                        <p className="text-xl font-medium">Nama Siswa</p>
                        <p className="text-lg">{item.siswa.nama}</p>
                      </div>
                      <div className="h-1/4">
                        <p className="text-xl font-medium">Tahun Dibayar</p>
                        <p className="text-lg">{item.tahun_dibayar}</p>
                      </div>
                      <div className="h-1/4">
                        <p className="text-xl font-medium">Jumlah Bayar</p>
                        <p className="text-lg">Rp. {this.threeDigits(item.jumlah_bayar)}</p>
                      </div>
                    </div>
                    <div className="w-1/2 font-body h-full">
                      <div className="h-1/4">
                        <p className="text-xl font-medium">Tanggal Bayar</p>
                        <p className="text-lg">{this.toDate(item.tgl_bayar)}</p>
                      </div>
                      <div className="h-1/4">
                        <p className="text-xl font-medium">Nama Petugas</p>
                        <p className="text-lg">{item.petugas.nama_petugas}</p>
                      </div>
                      <div className="h-1/4">
                        <p className="text-xl font-medium">Bulan Dibayar</p>
                        <p className="text-lg">{this.convertMonth(parseInt(item.bulan_dibayar))}</p>
                      </div>
                      <div className="h-1/4">
                        <p className="text-xl font-medium">Sisa Tunggakan Siswa</p>
                        <p className="text-lg">Rp. {this.threeDigits(item.siswa.tunggakan)}</p>
                      </div>
                    </div>
                  </div>
                ))
                : null}
            </div>
          </div>
        )}
        {/*  */}
        {showingEdit && (
          <div className=" bg-white fixed z-20 w-full h-full bottom-0 backdrop-filter backdrop-blur-sm  bg-opacity-30 flex">
            <div className="justify-center items-center w-3/4 md:w-1/2 xl:w-1/3 h-3/4 bg-white m-auto relative shadow-2xl border-2 border-grey-eee rounded-xl px-8">
              <div className="h-1/7 flex justify-center items-center ">
                <p className="font-body text-3xl font-medium text-purple-base">Edit Pembayaran</p>
                <Exit className="right-0 ml-auto h-10 w-10 cursor-pointer" onClick={() => this.setState({ showingEdit: !showingEdit })} />
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
                        }}
                        className="form-select w-full mt-1 text-gray-900 h-10 bg-gray-50  py-1 rounded-md border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 px-2"
                        required
                      >
                        {this.state.action === "insert" ? <option selected="selected">-</option> : null}
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
                        {this.state.action === "insert" ? <option selected="selected">-</option> : null}
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
                        {this.state.action === "insert" ? <option selected="selected">-</option> : null}
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
                    <div className="font-body space-y-2">
                      <label className="text-xl font-medium">Jumlah Bayar</label>
                      <input
                        className=" block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light"
                        placeholder="100000"
                        type="number"
                        value={this.state.jumlah_bayar}
                        onChange={(ev) => this.setState({ jumlah_bayar: ev.target.value })}
                        required
                      />
                    </div>
                    <div className="font-body space-y-2">
                      <label className="text-xl font-medium">Tanggal Bayar</label>
                      <input
                        className=" block relative w-full border border-gray-300 bg-gray-200 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light"
                        placeholder=""
                        type="date"
                        value={this.state.tgl_bayar.split("T")[0]}
                        onChange={(ev) => this.setState({ tgl_bayar: ev.target.value })}
                        disabled
                      />
                    </div>
                    <div className="font-body space-y-2 w-full">
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
    );
  }
}
