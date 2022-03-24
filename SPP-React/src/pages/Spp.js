import React, { Component } from "react";
import Sidebar from "../components/Sidebar";
import { ReactComponent as Search } from "../assets/siswa/Search.svg";
import { ReactComponent as Edit } from "../assets/siswa/Edit.svg";
import { ReactComponent as Delete } from "../assets/siswa/Delete.svg";
import { ReactComponent as Exit } from "../assets/siswa/Exit.svg";
import { ReactComponent as Plus } from "../assets/siswa/Plus.svg";
import { ReactComponent as ArrowLeft } from "../assets/siswa/ArrowLeft.svg";
import { ReactComponent as ArrowRight } from "../assets/siswa/ArrowRight.svg";
import { base_url } from "../config";
import axios from "axios";
export default class Spp extends Component {
  constructor() {
    super();
    this.state = {
      showingDetail: false,
      showingEdit: false,
      token: "",
      spp: [],
      detailSpp: [],
      action: "",
      id_spp: 0,
      angkatan: 0,
      tahun: 0,
      nominal: 0,
      filterSpp: [],
      filterlength: [],
      slicedSpp: [],
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

  getSpp = () => {
    let url = base_url + "/spp";
    axios
      .get(url, this.headerConfig())
      .then((response) => {
        this.setState({ spp: response.data });
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

  pagination = (arr) => {
    const res = [];
    console.log(arr);
    let longPage = this.state.longPage;
    for (let i = 0; i < arr.length; i += longPage) {
      var sliced = arr.slice(i, i + longPage);
      res.push(sliced);
    }
    console.log(res);

    this.setState({ filterSpp: res[this.state.page - 1], slicedSpp: res });
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
    for (let i = 0; i < this.state.slicedSpp.length; i++) {
      for (let j = 0; j < this.state.slicedSpp[i].length; j++) {
        resTemp.push(this.state.slicedSpp[i][j]);
      }
    }
    for (let i = 0; i < resTemp.length; i += page) {
      var sliced = resTemp.slice(i, i + page);
      res.push(sliced);
    }
    this.setState({ filterSpp: res[this.state.page - 1], slicedSpp: res });
  };

  searching = (ev) => {
    this.setState({ page: 1 });
    if (ev.keyCode === 13) {
      let searchText = parseInt(this.state.search);
      let tempSpp = this.state.spp;
      let filter = "";
      if (!searchText) {
        this.getSpp();
      } else {
        filter = tempSpp.filter((item) => {
          return item.angkatan === searchText || item.id_spp === searchText || item.tahun === searchText;
        });
      }
      if (filter.length === 0 && !isNaN(searchText)) {
        window.alert("Item not found");
      } else {
        this.pagination(filter);
      }
    }
  };

  changePage = (page) => {
    this.setState({ filterSpp: this.state.slicedSpp[page - 1] });
  };

  threeDigits = (jml) => {
    //this.setState({ tunggakanCount: jml.toLocaleString('id-ID') })
    return jml.toLocaleString("id-ID");
  };

  Add = () => {
    this.setState({
      action: "insert",
      id_spp: 0,
      angkatan: "",
      tahun: "",
      nominal: "",
    });
  };

  Edit = (selectedItem) => {
    this.setState({
      action: "update",
      id_spp: selectedItem.id_spp,
      angkatan: selectedItem.angkatan,
      tahun: selectedItem.tahun,
      nominal: selectedItem.nominal,
    });
  };

  saveSpp = (ev) => {
    ev.preventDefault();
    this.setState({ showingEdit: !this.state.showingEdit });
    let form = {
      id_spp: this.state.id_spp,
      angkatan: this.state.angkatan,
      tahun: this.state.tahun,
      nominal: this.state.nominal,
    };

    let url = base_url + "/spp";
    if (this.state.action === "insert") {
      axios
        .post(url, form, this.headerConfig())
        .then((response) => {
          window.alert(response.data.message);
          this.getSpp();
        })
        .catch((error) => console.log(error));
    } else if (this.state.action === "update") {
      axios
        .put(url, form, this.headerConfig())
        .then((response) => {
          window.alert(response.data.message);
          this.getSpp();
        })
        .catch((error) => console.log(error));
    }
  };

  dropSiswa = (selectedItem) => {
    if (window.confirm("are you sure will delete this item?")) {
      let url = base_url + "/spp/" + selectedItem.id_spp;
      axios
        .delete(url, this.headerConfig())
        .then((response) => {
          window.alert(response.data.message);
          this.getSpp();
        })
        .catch((error) => console.log(error));
    }
  };

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions);
    this.getSpp();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  render() {
    const { showingEdit, filterSpp, page } = this.state;
    return (
      <div>
        <Sidebar />
        <div>
          <div className="xl:pl-76 h-screen xl:pt-20 pt-16 w-screen bg-grey-eee overflow-hidden ">
            <div className="p-6 md:p-8 h-full">
              <div className="flex gap-4">
                <div className="h-12 lg:h-14 bg-white w-full xl:w-1/3  rounded-xl shadow-md border-purple-light border-2 border-opacity-80">
                  {/* Searcher */}
                  <div className="flex justify-center items-center h-full w-full ">
                    <Search className="w-1/12 xl:w-1/6 xl:h-3/5 h-2/5" />
                    <input
                      className="w-full xl:w-5/6 font-body font-medium text-sm placeholder-grey-666 opacity-80 mr-4 outline-none appearance-none xl:text-base"
                      placeholder="Search for ID or Angkatan"
                      type="number"
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
                      <td className=" align-middle">Angkatan</td>
                      <td className=" align-middle">Tahun</td>
                      <td className=" align-middle">Nominal</td>
                      <td className="table-cell align-middle">Action</td>
                    </tr>
                    <hr className="bg-grey-eee absolute bottom-0 h-0.5 w-full" />
                  </thead>
                  {/* Body Table Siswa */}
                  <tbody className="table-row-group h-10/12 justify-center relative border-collapse ">
                    {filterSpp
                      ? filterSpp.map((item, index, { length }) => (
                        <tr className=" font-body text-sm md:text-lg" key={index}>
                          <div className="table-cell align-middle border-b-2 border-solid border-grey-eee w-1/12">{item.id_spp}</div>
                          <div className="table-cell align-middle border-b-2 border-solid border-grey-eee">{item.angkatan}</div>
                          <div className="table-cell align-middle border-b-2 border-solid border-grey-eee">{item.tahun}</div>
                          <div className="table-cell align-middle border-b-2 border-solid border-grey-eee">Rp. {this.threeDigits(item.nominal)}</div>
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
                      <td colSpan="5">
                        <div className="p-2 flex items-center justify-center h-full">
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
                            {this.state.page < this.state.slicedSpp.length ? (
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
                  <p className="font-body text-3xl font-medium text-purple-base">Edit Siswa</p>
                  <Exit className="right-0 ml-auto h-10 w-10 cursor-pointer" onClick={() => this.setState({ showingEdit: !showingEdit })} />
                </div>
                <div className="h-5/6 w-full overflow-auto pr-4">
                  <form onSubmit={(ev) => this.saveSpp(ev)} className="h-full">
                    <div className="space-y-4 h-full">
                      {this.state.action === "update" && (
                        <div className="font-body space-y-2">
                          <label className="text-xl font-medium pb-2">ID</label>
                          <input
                            className=" block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light"
                            disabled
                            placeholder="ID"
                            type="text"
                            value={this.state.id_spp}
                            onChange={(ev) => this.setState({ id_spp: ev.target.value })}
                            required
                          />
                        </div>
                      )}
                      <div className="font-body space-y-2">
                        <label className="text-xl font-medium">Angkatan</label>
                        <input
                          className=" block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light"
                          placeholder="Angkatan"
                          type="text"
                          value={this.state.angkatan}
                          onChange={(ev) => this.setState({ angkatan: ev.target.value })}
                          required
                        />
                      </div>
                      <div className="font-body space-y-2">
                        <label className="text-xl font-medium">Tahun</label>
                        <input
                          className=" block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light"
                          placeholder="Tahun"
                          type="text"
                          value={this.state.tahun}
                          onChange={(ev) => this.setState({ tahun: ev.target.value })}
                          required
                        />
                      </div>
                      <div className="font-body space-y-2">
                        <label className="text-xl font-medium">Nominal</label>
                        <input
                          className=" block relative w-full border border-gray-300 bg-gray-50 text-gray-900 placeholder-grey-666 p-2 h-10 rounded-md focus:outline-none focus:border-purple-light"
                          placeholder="Nominal"
                          type="text"
                          value={this.state.nominal}
                          onChange={(ev) => this.setState({ nominal: ev.target.value })}
                          required
                        />
                      </div>
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
