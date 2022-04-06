import React, { Component } from "react";
import Sidebar from "../components/Sidebar";
import { PDFDownloadLink, Document, Page, Text } from "@react-pdf/renderer";
import { Table, TableHeader, TableCell, TableBody, DataTableCell } from "@david.kucsai/react-pdf-table";
import { ReactComponent as Search } from "../assets/siswa/Search.svg";
import { ReactComponent as ArrowLeft } from "../assets/siswa/ArrowLeft.svg";
import { ReactComponent as ArrowRight } from "../assets/siswa/ArrowRight.svg";
import { ReactComponent as PaperWhite } from "../assets/siswa/PaperWhite.svg";
import { base_url } from "../config";
import axios from "axios";
export default class History extends Component {
  constructor() {
    super();
    this.state = {
      editDate: false,
      token: "",
      pembayaran: [],
      siswa: [],
      detailPembayaran: [],
      petugas: [],
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
  getHistory = () => {
    let getnisn = JSON.parse(localStorage.getItem("siswa"))
    let url = base_url + "/pembayaran/siswa/" + getnisn.nisn;
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

  threeDigits = (jml) => {
    //this.setState({ tunggakanCount: jml.toLocaleString('id-ID') })
    return jml.toLocaleString("id-ID");
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
        this.getHistory();
      } else {
        filter = temp.filter((item) => {
          return item.id_pembayaran === parseInt(searchText) || item.jumlah_bayar === parseInt(searchText) || item.bulan_dibayar.toLowerCase() === searchText || item.tahun_dibayar.toLowerCase() === searchText ||  this.toDate(item.tgl_bayar).toLowerCase().split(/[, ]+|[, ]/).includes(searchText);
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
    this.getHistory();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  toDate = (date) => {
    console.log(date);
    date = new Date(date);
    const weekday = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
    let monthDate = date.toLocaleString("id-ID", { month: "long" });
    let dayName = weekday[date.getDay()];
    return dayName + ", " + date.getDate() + " " + monthDate + " " + date.getFullYear();
  };

  render() {
    const { filter, page } = this.state;
    const MyDoc = () => (
      <Document>
        <Page style={{ padding: 10 }}>
          <Text style={{ textAlign: "center", paddingBottom: 10 }}>Tabel History Pembayaran Siswa </Text>
          <Text style={{ textAlign: "left", fontSize: 14, paddingBottom: 10 }}>Siswa: {JSON.parse(localStorage.getItem('siswa')).nama}</Text>
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
        <Sidebar />
        <div>
          <div className="xl:pl-76 h-screen xl:pt-20 pt-16 w-screen bg-grey-eee overflow-hidden ">
            <div className="p-6 md:p-8 md:pb-12 h-full">
              <div className="flex gap-4">
                <div className="h-12 lg:h-14 bg-white w-full xl:w-1/3  rounded-xl shadow-md border-purple-light border-2 border-opacity-80">
                  {/* Searcher */}
                  <div className="flex justify-center items-center h-full w-full ">
                    <Search className="w-1/12 xl:w-1/6 xl:h-3/5 h-2/5" />
                    <input
                      className="w-full xl:w-5/6 font-body font-medium text-sm placeholder-grey-666 opacity-80 mr-4 outline-none appearance-none xl:text-base"
                      placeholder="Search for ID or Angkatan"
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
                  <thead className="h-1/12 font-body font-medium  text-md md:text-xl relative">
                    <tr className="overflow-scroll">
                      <td className="align-middle pr-4">ID</td>
                      <td className="align-middle pr-4">Tanggal Bayar</td>
                      <td className="align-middle pr-4">Bulan Dibayar</td>
                      <td className="align-middle pr-4">Tahun Dibayar</td>
                      <td className="align-middle pr-4">Nominal</td>
                      <td className="align-middle pr-4">Nama Petugas</td>
                    </tr>
                    <hr className="bg-grey-eee absolute bottom-0 h-0.5 w-full" />
                  </thead>
                  {/* Body Table Siswa */}
                  <tbody className="table-row-group h-10/12 justify-center relative border-collapse">
                    {filter
                      ? filter.map((item, index, { length }) => (
                        <tr className=" font-body text-sm md:text-lg" key={index}>
                          <div className="table-cell align-middle border-b-2 border-solid border-grey-eee">{item.id_pembayaran}</div>
                          <div className="table-cell align-middle border-b-2 border-solid border-grey-eee">{this.toDate(item.tgl_bayar)}</div>
                          <div className="table-cell align-middle border-b-2 border-solid border-grey-eee">{item.bulan_dibayar}</div>
                          <div className="table-cell align-middle border-b-2 border-solid border-grey-eee">{item.tahun_dibayar}</div>
                          <div className="table-cell align-middle border-b-2 border-solid border-grey-eee">{this.threeDigits(item.jumlah_bayar)}</div>
                          <div className="table-cell align-middle border-b-2 border-solid border-grey-eee">{item.petugas.nama_petugas}</div>
                        </tr>
                      ))
                      : null}
                  </tbody>
                  {/* Footer Table Siswa */}
                  <tfoot className="h-6 lg:h-1/12 ">
                    <div className="table-row font-body font-medium text-lg w-full">
                      <td colSpan="8">
                        <div className="p-2 flex items-center justify-center h-full">
                          <PDFDownloadLink document={<MyDoc />} fileName="Tabel History Pembayaran Siswa.pdf" className="flex gap-2 py-2 px-4 rounded-lg text-lg h-12 text-purple-light w-2/5 md:w-1/4 xl:w-1/5 shadow-md border-2 border-purple-light justify-center items-center md:p-2">
                          {({ blob, url, loading, error }) =>
                            loading ? (
                              "Loading..."
                            ) : (
                              <>
                                <p>Print Page</p> <PaperWhite className="h-full fill-current" style={{color:"#6058E2"}} />
                              </>
                            )
                          }
                        </PDFDownloadLink>
                        <div className="ml-auto mr-0 flex h-full items-center gap-2">
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
        </div >
      </div >
    );
  }
}
