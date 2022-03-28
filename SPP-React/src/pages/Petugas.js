import React, { Component } from "react";
import Sidebar from "../components/Sidebar";
import { PDFDownloadLink, Document, Page } from "@react-pdf/renderer";
import { Table, TableHeader, TableCell, TableBody, DataTableCell } from "@david.kucsai/react-pdf-table";
import { ReactComponent as Search } from "../assets/siswa/Search.svg";
import { ReactComponent as Edit } from "../assets/siswa/Edit.svg";
import { ReactComponent as Delete } from "../assets/siswa/Delete.svg";
import { ReactComponent as Exit } from "../assets/siswa/Exit.svg";
import { ReactComponent as Plus } from "../assets/siswa/Plus.svg";
import { ReactComponent as ArrowLeft } from "../assets/siswa/ArrowLeft.svg";
import { ReactComponent as ArrowRight } from "../assets/siswa/ArrowRight.svg";
import { ReactComponent as Paper } from "../assets/siswa/Paper.svg";
import { base_url, image_url } from "../config";
import axios from "axios";
export default class Petugas extends Component {
  constructor() {
    super();
    this.state = {
      showingDetail: false,
      showingEdit: false,
      fillPassword: true,
      uploadFile: true,
      token: "",
      petugas: [],
      detailPetugas: [],
      action: "",
      id_petugas: 0,
      nama_petugas: "",
      username: "",
      password: "",
      level: "",
      image: "",
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

  getPetugas = () => {
    let url = base_url + "/petugas";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({ petugas: response.data });
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

  Add = () => {
    this.setState({
      action: "insert",
      id_petugas: 0,
      nama_petugas: "",
      username: "",
      password: "",
      level: "",
      image: null,
    });
  };

  Edit = (selectedItem) => {
    this.setState({
      action: "update",
      id_petugas: selectedItem.id_petugas,
      nama_petugas: selectedItem.nama_petugas,
      username: selectedItem.username,
      password: selectedItem.password,
      level: selectedItem.level,
      image: selectedItem.image,
      uploadFile: false,
      fillPassword: false,
    });
  };

  savePetugas = (ev) => {
    ev.preventDefault();
    this.setState({ showingEdit: !this.state.showingEdit });
    let form = new FormData();
    form.append("id_petugas", this.state.id_petugas);
    form.append("nama_petugas", this.state.nama_petugas);
    form.append("username", this.state.username);
    form.append("level", this.state.level);

    if (this.state.fillPassword) {
      form.append("password", this.state.password);
    }

    if (this.state.uploadFile) {
      form.append("image", this.state.image);
    }

    let url = base_url + "/petugas";
    if (this.state.action === "insert") {
      axios
        .post(url, form, this.headerConfig())
        .then((response) => {
          window.alert(response.data.message);
          this.getPetugas();
        })
        .catch((error) => console.log(error));
    } else if (this.state.action === "update") {
      axios
        .put(url, form, this.headerConfig())
        .then((response) => {
          window.alert(response.data.message);
          this.getPetugas();
        })
        .catch((error) => console.log(error));
    }
  };

  dropPetugas = (selectedItem) => {
    if (window.confirm("are you sure will delete this item?")) {
      let url = base_url + "/petugas/" + selectedItem.id_petugas;
      axios
        .delete(url, this.headerConfig())
        .then((response) => {
          window.alert(response.data.message);
          this.getPetugas();
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
      let temp = this.state.petugas;
      console.log(searchText);
      let filter = "";
      if (!searchText) {
        this.getPetugas();
      } else {
        filter = temp.filter((item) => {
          return item.level.toLowerCase().includes(searchText) || item.id_petugas === parseInt(searchText) || item.username.toLowerCase() === searchText || item.nama_petugas.toLowerCase().split(" ").includes(searchText);
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
    this.getPetugas();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }
  render() {
    const { showingEdit, filter, page } = this.state;
    const MyDoc = () => (
      <Document>
        <Page size="A5">
          <Table data={this.state.filter}>
            <TableHeader>
              <TableCell>ID</TableCell>
              <TableCell>Nama Petugas</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Role</TableCell>
            </TableHeader>
            <TableBody>
              <DataTableCell getContent={(r) => r.id_petugas} />
              <DataTableCell getContent={(r) => r.nama_petugas} />
              <DataTableCell getContent={(r) => r.username} />
              <DataTableCell getContent={(r) => r.level} />
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
                      placeholder="Search anything"
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
                      <td className=" align-middle">ID</td>
                      <td className=" align-middle">Nama</td>
                      <td className=" align-middle">Username</td>
                      <td className=" align-middle hidden md:pr-4 md:table-cell">Image</td>
                      <td className=" align-middle pl-0 ">As</td>
                      <td className="table-cell align-middle">Action</td>
                    </tr>
                    <hr className="bg-grey-eee absolute bottom-0 h-0.5 w-full" />
                  </thead>
                  {/* Body Table Siswa */}
                  <tbody className="table-row-group h-10/12 justify-center relative border-collapse">
                    {filter
                      ? filter.map((item, index, { length }) => (
                          <tr className=" font-body text-sm md:text-lg" key={index}>
                            <div className="table-cell align-middle border-b-2 border-solid border-grey-eee w-1/12">{item.id_petugas}</div>
                            <div className="table-cell align-middle border-b-2 border-solid border-grey-eee">{item.nama_petugas}</div>
                            <div className="table-cell align-middle border-b-2 border-solid border-grey-eee">{item.username}</div>
                            <div className="hidden md:table-cell align-middle border-b-2 border-solid border-grey-eee w-1/12 h-1/12 relative ">
                              <img className="rounded-full w-14 h-14 absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 transform" style={{ "clip-path": "circle()" }} src={image_url + item.image} alt="Siswa" />
                            </div>
                            <div className="table-cell align-middle border-b-2 border-solid border-grey-eee">{item.level}</div>
                            <div className="table-cell align-middle border-b-2 border-solid border-grey-eee  overflow-hidden">
                              <div className="flex w-full h-full items-center gap-2 lg:gap-4">
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
                                  <p className="w-1/2 text-center font-medium xl:inline hidden">Delete</p> <Delete className="w-full h-full p-2.5 md:p-3.5 xl:p-0 xl:h-1/2 xl:w-1/5 xl:ml-4 2xl:ml-0" />
                                </button>
                              </div>
                            </div>
                          </tr>
                        ))
                      : null}
                  </tbody>
                  {/* Footer Table Siswa */}
                  <tfoot className="h-6 lg:h-1/12 ">
                    <div className="table-row font-body font-medium text-lg w-full">
                      <td colSpan="100">
                        <div className="p-2 flex items-center justify-center h-full">
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
                            <PDFDownloadLink document={<MyDoc />} fileName="somename.pdf" className="flex gap-2 bg-grey-eee py-2 px-4 rounded-lg text-base">
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

          {/*  */}
          {showingEdit && (
            <div className=" bg-white fixed z-20 w-full h-full bottom-0 backdrop-filter backdrop-blur-sm  bg-opacity-30 flex">
              <div className="justify-center items-center w-3/4 md:w-1/2 xl:w-1/3 h-3/4 bg-white m-auto relative shadow-2xl border-2 border-grey-eee rounded-xl px-8">
                <div className="h-1/7 flex justify-center items-center ">
                  <p className="font-body text-3xl font-medium text-purple-base">Edit Petugas</p>
                  <Exit className="right-0 ml-auto h-10 w-10 cursor-pointer" onClick={() => this.setState({ showingEdit: !showingEdit })} />
                </div>
                <div className="h-5/6 w-full overflow-auto pr-4">
                  <form onSubmit={(ev) => this.savePetugas(ev)} className="h-full">
                    <div className="space-y-4 h-full">
                      {this.state.action === "update" && (
                        <div className="font-body space-y-2">
                          <label className="text-xl font-medium pb-2">ID</label>
                          <input
                            className=" block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light"
                            disabled
                            placeholder="ID"
                            type="text"
                            value={this.state.id_petugas}
                            onChange={(ev) => this.setState({ id_petugas: ev.target.value })}
                            required
                          />
                        </div>
                      )}
                      <div className="font-body space-y-2">
                        <label className="text-xl font-medium">Nama</label>
                        <input
                          className=" block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light"
                          placeholder="Nama"
                          type="text"
                          value={this.state.nama_petugas}
                          onChange={(ev) => this.setState({ nama_petugas: ev.target.value })}
                          required
                        />
                      </div>
                      <div className="font-body space-y-2">
                        <label className="text-xl font-medium">Username</label>
                        <input
                          className=" block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light"
                          placeholder="Username"
                          type="text"
                          value={this.state.username}
                          onChange={(ev) => this.setState({ username: ev.target.value })}
                          required
                        />
                      </div>
                      <div className="font-body space-y-2">
                        <label className="text-xl font-medium">Level</label>
                        <select
                          value={this.state.level}
                          onChange={(ev) => {
                            this.setState({ level: ev.target.value });
                          }}
                          className="form-select w-full mt-1 text-gray-900 h-10 bg-gray-50  py-1 rounded-md border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 px-2"
                        >
                          {this.state.action === "insert" ? <option selected="selected">-</option> : null}
                          <option value="admin">Admin</option>
                          <option value="petugas">Petugas</option>
                        </select>
                      </div>
                      {this.state.action === "update" && this.state.fillPassword === false ? (
                        <button className="bg-opacity-80 block relative border-purple-light border-2 text-purple-light text-lg font-medium w-full p-2 rounded-xl" onClick={() => this.setState({ fillPassword: true })}>
                          Change Password
                        </button>
                      ) : (
                        <div>
                          <label className="text-xl font-medium">Password</label>
                          <input
                            className=" block relative w-full border border-gray-300  bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light"
                            placeholder="Password"
                            type="password"
                            onChange={(ev) => this.setState({ password: ev.target.value })}
                            required
                          />
                        </div>
                      )}
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

                      <div className="font-body w-full mt-auto mb-0 align-bottom">
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
