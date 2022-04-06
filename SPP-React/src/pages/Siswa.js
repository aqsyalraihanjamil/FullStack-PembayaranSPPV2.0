import React, { Component } from "react";
import Sidebar from "../components/Sidebar";
import { PDFDownloadLink, Document, Page, Text } from "@react-pdf/renderer";
import { Table, TableHeader, TableCell, TableBody, DataTableCell } from "@david.kucsai/react-pdf-table";
import { ReactComponent as Search } from "../assets/siswa/Search.svg";
import { ReactComponent as Detail } from "../assets/siswa/Detail.svg";
import { ReactComponent as Edit } from "../assets/siswa/Edit.svg";
import { ReactComponent as Delete } from "../assets/siswa/Delete.svg";
import { ReactComponent as Exit } from "../assets/siswa/Exit.svg";
import { ReactComponent as Plus } from "../assets/siswa/Plus.svg";
import { ReactComponent as ArrowLeft } from "../assets/siswa/ArrowLeft.svg";
import { ReactComponent as ArrowRight } from "../assets/siswa/ArrowRight.svg";
import { ReactComponent as Paper } from "../assets/siswa/Paper.svg";
import { base_url, image_url } from "../config";
import axios from "axios";
import { Link } from "react-router-dom";
export default class Siswa extends Component {
  constructor() {
    super();
    this.state = {
      showingDetail: false,
      showingEdit: false,
      token: "",
      siswa: [],
      detailSiswa: [],
      kelas: [],
      spp: [],
      action: "",
      nisn: "",
      nis: "",
      nama: "",
      id_kelas: 0,
      alamat: "",
      no_telp: "",
      id_spp: "",
      image: 0,
      angkatan: 0,
      uploadFile: true,
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

  getKelas = () => {
    let url = base_url + "/kelas";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({ kelas: response.data });
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
        this.setState({ angkatan: response.data.angkatan });
        // let test = this.state.spp.flatMap(item => item.angkatan === this.state.tunggakan ? console.log(item) : null)
        // console.log(this.state.tunggakan)
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

  getSpp = () => {
    let url = base_url + "/spp";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({ spp: response.data });
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

  getDetailSiswa = (item) => {
    let url = base_url + "/siswa/" + item.nisn;
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({ detailSiswa: response.data });
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
    //this.setState({ tunggakanCount: jml.toLocaleString('id-ID') })
    return jml.toLocaleString("id-ID");
  };

  Add = () => {
    this.setState({
      action: "insert",
      nisn: "",
      nis: "",
      nama: "",
      id_kelas: 0,
      alamat: "",
      no_telp: "",
      id_spp: "",
      image: null,
      uploadFile: true,
    });
  };

  Edit = (selectedItem) => {
    this.setState({
      action: "update",
      nisn: selectedItem.nisn,
      nis: selectedItem.nis,
      nama: selectedItem.nama,
      id_kelas: selectedItem.kelas.id_kelas,
      alamat: selectedItem.alamat,
      no_telp: selectedItem.no_telp,
      id_spp: selectedItem.id_spp,
      image: null,
      uploadFile: false,
    });
  };

  saveSiswa = (ev) => {
    ev.preventDefault();
    this.setState({ showingEdit: !this.state.showingEdit });
    let form = new FormData();
    form.append("nisn", this.state.nisn);
    form.append("nis", this.state.nis);
    form.append("nama", this.state.nama);
    form.append("kelas", this.state.kelas);
    form.append("alamat", this.state.alamat);
    form.append("no_telp", this.state.no_telp);
    form.append("id_kelas", this.state.id_kelas);
    form.append("id_spp", this.state.id_spp);

    if (this.state.uploadFile) {
      form.append("image", this.state.image);
    }
    let url = base_url + "/siswa";
    if (this.state.action === "insert") {
      axios
        .post(url, form, this.headerConfig())
        .then((response) => {
          window.alert(response.data.message);
          this.getSiswa();
        })
        .catch((error) => console.log(error));
    } else if (this.state.action === "update") {
      axios
        .put(url, form, this.headerConfig())
        .then((response) => {
          window.alert(response.data.message);
          this.getSiswa();
        })
        .catch((error) => console.log(error));
    }
  };

  dropSiswa = (selectedItem) => {
    if (window.confirm("are you sure will delete this item?")) {
      let url = base_url + "/siswa/" + selectedItem.nisn;
      axios
        .delete(url, this.headerConfig())
        .then((response) => {
          window.alert(response.data.message);
          this.getSiswa();
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
      let temp = this.state.siswa;
      console.log(searchText);
      let filter = "";
      if (!searchText) {
        this.getSiswa();
      } else {
        filter = temp.filter((item) => {
          return item.nisn === searchText || item.nis === searchText || item.kelas.nama_kelas.toLowerCase().split(" ").includes(searchText) || item.nama.toLowerCase().includes(searchText);
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
    this.getKelas();
    this.getSpp();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  render() {
    const { showingDetail, detailSiswa, showingEdit, kelas, spp, filter, page } = this.state;
    const MyDoc = () => (
      <Document>
        <Page style={{ padding: 10 }}>
          <Text style={{ textAlign: "center", paddingBottom: 10 }}>Tabel Siswa </Text>
          <Text style={{ textAlign: "left", fontSize: 14, paddingBottom: 10 }}>Siswa: {JSON.parse(localStorage.getItem('admin')).nama_petugas}</Text>
          <Text style={{ textAlign: "left", fontSize: 14, paddingBottom: 10 }}>Tanggal: {new Date(Date.now()).toLocaleString('id-ID')}</Text>
          <Table data={this.state.filter}>
            <TableHeader>
              <TableCell>NIS</TableCell>
              <TableCell>NISN</TableCell>
              <TableCell>Nama Siswa</TableCell>
              <TableCell>Kelas</TableCell>
              <TableCell>Alamat</TableCell>
              <TableCell>Nomor Telpon</TableCell>
              <TableCell>Tunggakan</TableCell>
            </TableHeader>
            <TableBody>
              <DataTableCell getContent={(r) => r.nis} />
              <DataTableCell getContent={(r) => r.nisn} />
              <DataTableCell getContent={(r) => r.nama} />
              <DataTableCell getContent={(r) => r.kelas.nama_kelas} />
              <DataTableCell getContent={(r) => r.alamat} />
              <DataTableCell getContent={(r) => r.no_telp} />
              <DataTableCell getContent={(r) => r.tunggakan} />
            </TableBody>
          </Table>
        </Page>
      </Document >
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
                  <Search className="w-1/6 md:w-1/12 xl:w-1/6 xl:h-3/5 h-2/5" />
                  <input
                    className="w-full xl:w-5/6 font-body font-medium text-sm placeholder-grey-666 opacity-80 mr-4 outline-none appearance-none xl:text-base"
                    placeholder="Search anything"
                    type="text"
                    value={this.state.search}
                    onChange={(ev) => this.setState({ search: ev.target.value })}
                    onKeyUp={this.searching}
                  />
                </div>
              </div>
              <div className="w-3/4 md:w-1/2 lg:w-1/3 flex gap-4 ml-auto mr-0 ">
                {/* Go to kelas page */}
                <Link className="h-full w-1/2" to="../kelas">
                  <div className="h-12 lg:h-14 w-full  rounded-2xl shadow-md bg-tosca border-opacity-80 flex justify-center items-center">
                    <p className="font-base text-white text-base xl:text-lg font-medium overflow-hidden">Data Kelas</p>
                  </div>
                </Link>
                {/* spp page */}
                <Link className="h-full w-1/2" to="../spp">
                  <div className="h-12 lg:h-14 w-full rounded-2xl shadow-md bg-red-base border-opacity-80">
                    <div className="flex justify-center items-center h-full w-full">
                      <p className="font-base text-white text-base xl:text-lg font-medium overflow-hidden">Data Spp</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            {/* table */}
            <div className=" h-90% mt-4 mb-2 w-full overflow-auto shadow-xl rounded-xl">
              <div className="table w-full table-auto h-full bg-white px-4 min-w-550 min-h-400 rounded-xl">
                {/* Header Table Siswa*/}
                <thead className="h-1/12 font-body font-medium  text-md md:text-xl relative">
                  <tr className="overflow-scroll">
                    <div className="table-cell align-middle lg:pr-0 pr-2">NISN</div>
                    <div className="table-cell align-middle lg:pr-0 pr-2">NIS</div>
                    <div className="table-cell align-middle lg:pr-0 pr-2">Nama</div>
                    <div className="table-cell align-middle lg:pr-0 pr-2">Kelas</div>
                    <div className="hidden lg:table-cell align-middle">Image</div>
                    <td className="table-cell align-middle">Action</td>
                  </tr>
                  <hr className="bg-grey-eee absolute bottom-0 h-0.5 w-full" />
                </thead>
                {/* Body Table Siswa */}
                <div className="table-row-group h-10/12 justify-center relative border-collapse">
                  {filter
                    ? filter.map((item, index, { length }) => (
                      <tr className="  font-body text-sm md:text-lg" key={index}>
                        <div className="table-cell align-middle border-b-2 border-solid border-grey-eee w-1/12">{item.nisn}</div>
                        <div className="table-cell align-middle border-b-2 border-solid border-grey-eee">{item.nis}</div>
                        <div className="table-cell align-middle border-b-2 border-solid border-grey-eee">{item.nama}</div>
                        <div className="table-cell align-middle border-b-2 border-solid border-grey-eee">{item.kelas.nama_kelas}</div>
                        <div className="hidden lg:table-cell align-middle border-b-2 border-solid border-grey-eee w-1/12 h-1/12 relative">
                          <img className="rounded-full h-14 w-14 absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 transform" style={{ "clip-path": "circle()" }} src={image_url + item.image} alt="Siswa" />
                        </div>
                        <div className="table-cell align-middle border-b-2 border-solid border-grey-eee  overflow-hidden">
                          <div className="flex w-full h-full items-center gap-2 lg:gap-4">
                            <button
                              className="h-10 w-10  md:h-12 bg-purple-light bg-opacity-15 md:w-12 xl:w-1/3 shadow-sm rounded-full items-center flex justify-center"
                              onClick={() => {
                                this.setState({ showingDetail: !showingDetail });
                                this.getDetailSiswa(item);
                              }}
                            >
                              <p className="w-1/2 text-center font-medium xl:inline hidden">Detail</p> <Detail className="w-full h-full p-2.5 md:p-3.5 xl:p-0 xl:h-1/2 xl:w-1/5 xl:ml-2 2xl:ml-0" />
                            </button>
                            <button
                              className="h-10 w-10  md:h-12 bg-tosca bg-opacity-15 md:w-12 xl:w-1/3 shadow-sm rounded-full items-center flex justify-center"
                              onClick={() => {
                                this.setState({ showingEdit: !showingEdit });
                                this.Edit(item);
                              }}
                            >
                              <p className="w-1/2 text-center font-medium xl:inline hidden">Edit</p> <Edit className="w-full h-full p-2.5 md:p-3.5 xl:p-0 xl:h-1/2 xl:w-1/5 xl:ml-2 2xl:ml-0" />
                            </button>
                            <button className="h-10 w-10  md:h-12 bg-red-base bg-opacity-15 md:w-12 xl:w-1/3 shadow-sm rounded-full items-center flex justify-center" onClick={() => this.dropSiswa(item)}>
                              <p className="w-1/2 text-center font-medium xl:inline hidden">Delete</p> <Delete className="w-full h-full p-2.5 md:p-3.5 xl:p-0 xl:h-1/2 xl:w-1/5 xl:ml-2 2xl:ml-0" />
                            </button>
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
                        {/* Insert Data */}
                        <button
                          className="h-12 text-white w-1/3 md:w-1/4 xl:w-1/5 rounded-2xl shadow-md bg-purple-light flex justify-center items-center md:p-2"
                          onClick={() => {
                            this.setState({ showingEdit: !showingEdit });
                            this.Add();
                          }}
                        >
                          <p className="font-base text-base font-medium  xl:w-5/6 overflow-hidden">Tambah Data</p>
                          <Plus className="h-1/3 md:h-2/3 w-1/5 ml-0" />
                        </button>
                        <div className="ml-auto mr-0 flex h-full items-center gap-2">
                          <PDFDownloadLink document={<MyDoc />} fileName="Tabel Siswa.pdf" className="flex gap-2 bg-grey-eee py-2 px-4 rounded-lg text-base">
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
              {detailSiswa
                ? detailSiswa.map((item, index) => (
                  <div className="grid grid-cols-4 lg:p-8 gap-4 h-10/12 w-full font-body">
                    <div className="col-span-2 row-span-2 flex items-center justify-center max-h-300 max-w-300">
                      <img className="p-8 rounded-full" src={image_url + item.image} alt="Siswa" />
                    </div>
                    <div className=" col-start-3 col-span-full row-span-2">
                      <div className="h-1/2">
                        <p className="text-lg lg:text-xl font-medium">NISN</p>
                        <p className="text-base lg:text-lg">{item.nisn}</p>
                      </div>
                      <div className="h-1/2">
                        <p className="text-lg lg:text-xl font-medium">Nama</p>
                        <p className="text-base lg:text-lg">{item.nama}</p>
                      </div>
                    </div>
                    <div className="row-start-3 row-span-2 col-span-full flex">
                      <div className="w-1/3 h-full">
                        <div className="h-1/2">
                          <p className="text-lg lg:text-xl font-medium">NIS</p>
                          <p className="text-base lg:text-lg">{item.nis}</p>
                        </div>
                        <div className="h-1/2">
                          <p className="text-lg lg:text-xl font-medium">Kelas</p>
                          <p className="text-base lg:text-lg">{item.kelas.nama_kelas}</p>
                        </div>
                      </div>
                      <div className="w-1/3 h-full">
                        <div className="h-1/2">
                          <p className="text-lg lg:text-xl font-medium">No Telp</p>
                          <p className="text-base lg:text-lg">{item.no_telp}</p>
                        </div>
                        <div className="h-1/2">
                          <p className="text-lg lg:text-xl font-medium">Tunggakan</p>
                          <p className="text-base lg:text-lg">Rp. {this.threeDigits(item.tunggakan)}</p>
                        </div>
                      </div>
                      <div className="w-1/3 h-full">
                        <div className="h-1/2">
                          <p className="text-lg lg:text-xl font-medium">Alamat</p>
                          <p className="text-base lg:text-lg">{item.alamat}</p>
                        </div>
                        <div className="h-1/2">
                          <p className="text-lg lg:text-xl font-medium">SPP Perbulan</p>
                          <p className="text-base lg:text-lg">Rp. {this.threeDigits(item.spp.nominal)}</p>
                        </div>
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
                <p className="font-body text-3xl font-medium text-purple-base">Edit Siswa</p>
                <Exit className="right-0 ml-auto h-10 w-10 cursor-pointer" onClick={() => this.setState({ showingEdit: !showingEdit })} />
              </div>
              <div className="h-5/6 w-full overflow-auto pr-4">
                <form onSubmit={(ev) => this.saveSiswa(ev)}>
                  <div className="space-y-4">
                    <div className="font-body space-y-2">
                      <label className="text-xl font-medium pb-2">NISN</label>
                      {this.state.action === "insert" ? (
                        <input
                          className=" block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light"
                          placeholder="NISN"
                          type="text"
                          value={this.state.nisn}
                          onChange={(ev) => this.setState({ nisn: ev.target.value })}
                          maxLength="10"
                          required
                        />
                      ) : (
                        <input
                          className=" block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light"
                          placeholder="NISN"
                          type="text"
                          value={this.state.nisn}
                          onChange={(ev) => this.setState({ nisn: ev.target.value })}
                          maxLength="8"
                          required
                          disabled
                        />
                      )}
                    </div>
                    <div className="font-body space-y-2">
                      <label className="text-xl font-medium">NIS</label>
                      <input
                        className=" block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light"
                        placeholder="NIS"
                        type="text"
                        value={this.state.nis}
                        onChange={(ev) => this.setState({ nis: ev.target.value })}
                        required
                      />
                    </div>
                    <div className="font-body space-y-2">
                      <label className="text-xl font-medium">Nama</label>
                      <input
                        className=" block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light"
                        placeholder="Nama"
                        type="text"
                        value={this.state.nama}
                        onChange={(ev) => this.setState({ nama: ev.target.value })}
                        maxLength="20"
                        required
                      />
                    </div>
                    <div className="font-body space-y-2">
                      <label className="text-xl font-medium">Kelas</label>
                      <select
                        value={this.state.id_kelas}
                        onChange={(ev) => {
                          this.setState({ id_kelas: ev.target.value }, () => {
                            this.getDetailKelas(this.state.id_kelas);
                          });
                        }}
                        onLoad={this.getDetailKelas(this.state.id_kelas)}
                        className="form-select w-full mt-1 text-gray-900 h-10 bg-gray-50  py-1 rounded-md border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 px-2"
                      >
                        {this.state.action === "insert" ? <option selected="selected">-</option> : null}
                        {kelas &&
                          kelas.map((item, index) => (
                            <option value={item.id_kelas}>
                              {item.id_kelas} - {item.nama_kelas} ( Angkatan {item.angkatan} )
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="font-body space-y-2">
                      <label className="text-xl font-medium">Alamat</label>
                      <input
                        className=" block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light"
                        placeholder="Jl. Penjara Suci"
                        type="text"
                        value={this.state.alamat}
                        onChange={(ev) => this.setState({ alamat: ev.target.value })}
                        required
                      />
                    </div>
                    <div className="font-body space-y-2">
                      <label className="text-xl font-medium">No. Telp</label>
                      <input
                        className=" block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light"
                        placeholder="+1"
                        type="text"
                        value={this.state.no_telp}
                        onChange={(ev) => this.setState({ no_telp: ev.target.value })}
                        required
                      />
                    </div>
                    <div className="font-body space-y-2">
                      <label className="text-xl font-medium">Spp Perbulan</label>
                      <select
                        value={this.state.id_spp}
                        onChange={(ev) => {
                          this.setState({ id_spp: ev.target.value });
                        }}
                        className="form-select w-full mt-1 text-gray-900 h-10 bg-gray-50  py-1 rounded-md border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 px-2"
                      >
                        {this.state.action === "insert" ? <option selected="selected">-</option> : null}
                        {/* get Id kelas to match with the same angkatan */}
                        {spp &&
                          spp.flatMap((item) =>
                            item.angkatan === this.state.angkatan ? (
                              <option value={item.id_spp}>
                                {item.id_spp} - Rp. {item.nominal} ( Angkatan {item.angkatan} )
                              </option>
                            ) : null
                          )}
                        {/* <option value={item.id_spp}>{item.id_spp} - Rp. {item.nominal} ( Angkatan {item.angkatan} )</option>  */}
                      </select>
                    </div>
                    {this.state.action === "update" && this.state.uploadFile === false ? (
                      <button className="block relative border-purple-light border-2 text-purple-light text-lg font-medium w-full p-2 rounded-xl" onClick={() => this.setState({ uploadFile: true })}>
                        Change Image
                      </button>
                    ) : (
                      <div>
                        <label className="text-xl font-medium">Image</label>
                        <input type="file" className="relative block w-full mb-1" onChange={(ev) => this.setState({ image: ev.target.files[0] })} required></input>
                      </div>
                    )}
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
