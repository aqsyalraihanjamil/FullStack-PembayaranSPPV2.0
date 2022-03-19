import React, { Component } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as Menu } from "../assets/menu.svg";
import { ReactComponent as Title } from "../assets/Isi.svg";
import { ReactComponent as Title2 } from "../assets/Isi_2.svg";
import { ReactComponent as Button } from "../assets/Login.svg";
import { ReactComponent as Dashboard } from "../assets/sidebar/Home.svg";
import { ReactComponent as DashboardBlack } from "../assets/sidebar/Home_black.svg";
import { ReactComponent as Siswa } from "../assets/sidebar/siswa.svg";
import { ReactComponent as SiswaBlack } from "../assets/sidebar/siswa_black.svg";
import { ReactComponent as Petugas } from "../assets/sidebar/Petugas.svg";
import { ReactComponent as PetugasBlack } from "../assets/sidebar/Petugas_black.svg";
import { ReactComponent as Pembayaran } from "../assets/sidebar/Pembayaran.svg";
import { ReactComponent as PembayaranBlack } from "../assets/sidebar/Pembayaran_black.svg";
import { ReactComponent as ArrowDown } from "../assets/sidebar/ArrowDown.svg";
import Acc from "../assets/dog.jpg";
import { image_url } from "../config";
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      path: "/",
      name: "",
      foto: "",
      modal: false,
      level: "",
      burger: false,
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  setPath = () => {
    let url = window.location.pathname;
    this.setState({
      path: url,
    });
  };

  setName = () => {
    let name = JSON.parse(localStorage.getItem("admin"));
    this.setState({ name: name.nama_petugas });
  };

  setFoto = () => {
    let getid = JSON.parse(localStorage.getItem("admin"));
    this.setState({ foto: getid.image });
  };

  setRole = () => {
    let getid = localStorage.getItem("level");
    this.setState({ level: getid });
  };

  Logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    localStorage.removeItem("level");
    localStorage.removeItem("role");
    window.location = "/login";
  };

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    this.forceUpdate()
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.setPath();
    this.setName();
    this.setFoto();
    this.setRole();

  }


  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
  render() {
    const { modal, burger } = this.state;
    return (
      <div>

        <div className="h-full overflow-hidden w-full relative" >
          {/* <CustomComponent /> */}
          {/* <h2>window size: {this.state.width}</h2> */}
          {/* Desktop Views */}
          <div className=" xl:w-76 fixed inline h-full z-20 xl:bg-white overflow-hidden">
            <div className="xl:hidden fixed bg-white grid grid-cols-3 w-full justify-center h-16 ">
              <Menu className="h-full w-8 ml-4 cursor-pointer" onClick={() => this.setState({ burger: !burger })} />
              <Title className="w-full h-full" />
              <img src={Acc} className="ml-auto mr-4 rounded-full mt-1 h-4/5 w-12" alt="pa" />
            </div>
            {(this.state.burger || this.state.width >= 1280) && (
              <div className="xl:w-full w-screen  mt-16 xl:mt-0 h-full" >
                <div className="left-60 fixed w-screen bg-gray-400 h-full  backdrop-filter backdrop-blur-sm bg-opacity-20 xl:hidden" onClick={() => this.setState({ burger: !burger })}></div>
                <div className="w-60 xl:w-full bg-white h-full p-8 pt-4">
                  <div className="items-center justify-center pb-6 hidden xl:inline">
                    <Title2 className=" w-full justify-center h-16" />
                  </div>
                  <div className="xl:mt-10 mt-6 w-full h-16 ">
                    <Link to="/login">
                      <button className="h-full w-full bg-purple-light rounded-custom drop-shadow-lg">
                        <div className="p-3 flex justify-center items-center h-full w-full mr-4">
                          <p className="xl:text-xl text-md font-medium text-white font-body w-5/6 ">Entri Transaksi</p>
                          <Button className="w-1/6 h-3/4" />
                        </div>
                      </button>
                    </Link>
                  </div>
                  <div className="xl:mt-12 xl:ml-4 mt-8">
                    <Link to="../">
                      <div className="flex items-center w-full">
                        {this.state.path === "/" ? <Dashboard className=" w-1/4 xl:h-8 h-7 mr-2" /> : <DashboardBlack className="w-1/4 xl:h-8 h-7 mr-2" />}
                        <p className={"font-body w-2/3 xl:text-xl " + (this.state.path === "/" ? "text-purple-base" : "text-grey-666")}>Dashboard</p>
                      </div>
                    </Link>
                  </div>
                  <div className="mt-10 xl:ml-4">
                    <Link to="/siswa">
                      <div className="flex items-center w-full">
                        {this.state.path === "/siswa" ? <Siswa className="w-1/4 xl:h-8 h-7 mr-2" /> : <SiswaBlack className="w-1/4 xl:h-8 h-7 mr-2" />}
                        <p className={"font-body w-2/3 xl:text-xl  " + (this.state.path === "/siswa" ? "text-purple-base" : "text-grey-666")}>Siswa</p>
                      </div>
                    </Link>
                  </div>
                  <div className="mt-10 xl:ml-4">
                    <Link to="/petugas">
                      <div className="flex items-center w-full">
                        {this.state.path === "/petugas" ? <Petugas className="w-1/4 xl:h-8 h-7 mr-2" /> : <PetugasBlack className="w-1/4 xl:h-8 h-7 mr-2" />}
                        <p className={"font-body w-2/3 xl:text-xl  " + (this.state.path === "/petugas" ? "text-purple-base" : "text-grey-666")}>Petugas</p>
                      </div>
                    </Link>
                  </div>
                  <div className="mt-10 xl:ml-4">
                    <Link to="/pembayaran">
                      <div className="flex items-center w-full">
                        {this.state.path === "/pembayaran" ? <Pembayaran className="w-1/4 xl:h-8 h-7 mr-2" /> : <PembayaranBlack className="w-1/4 xl:h-8 h-7 mr-2" />}
                        <p className={"font-body w-2/3 xl:text-xl " + (this.state.path === "/pembayaran" ? "text-purple-base" : "text-grey-666")}>Pembayaran</p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="  w-full hidden xl:inline z-10 top-0">
            <div className="xl:pl-72  h-10% flex items-center overflow-hidden w-full bg-white fixed shadow-bottom z-10">
              <div className="flex w-full items-center">
                {this.state.path === "/" ? (
                  <p className="xl:text-3xl font-body text-purple-base font-medium ml-20">Welcome, Admin!</p>
                ) : this.state.path === "/siswa" ? (
                  <p className="xl:text-3xl font-body text-purple-base font-medium ml-20">Siswa Page</p>
                ) : this.state.path === "/petugas" ? (
                  <p className="xl:text-3xl font-body text-purple-base font-medium ml-20">Petugas Page</p>
                ) : this.state.path === "/pembayaran" ? (
                  <p className="xl:text-3xl font-body text-purple-base font-medium ml-20">Pembayaran Page</p>
                ) : this.state.path === "/spp" ? (
                  <p className="xl:text-3xl font-body text-purple-base font-medium ml-20">Spp Page</p>
                ) : this.state.path === "/kelas" ? (
                  <p className="xl:text-3xl font-body text-purple-base font-medium ml-20">Kelas Page</p>
                ) : null}
                <div className="relative ml-auto h-12 w-12">
                  <img src={image_url + this.state.foto} className="h-12 w-12 absolute ml-auto rounded-full" alt="pp" />
                </div>
                <p className=" ml-1 font-body text-base">{this.state.name}</p>
                <ArrowDown className="mr-12 ml-1 relative inline-block cursor-pointer" onClick={() => this.setState({ modal: !modal })} />
                {this.state.modal && (
                  <div onClick={() => this.Logout()} className="fixed cursor-pointer h-8 w-30 z-40 top-5% right-10 bg-white border border-grey-activities border-opacity-60 px-4 p-1 items-center justify-center block">
                    <div className="relative">
                      <p className="font-base text-base ">Logout</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
