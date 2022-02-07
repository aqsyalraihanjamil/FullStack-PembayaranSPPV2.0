import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as Menu } from "../assets/menu.svg"
import { ReactComponent as Title } from "../assets/Isi.svg"
import { ReactComponent as Title2 } from "../assets/Isi_2.svg"
import { ReactComponent as Button } from "../assets/Login.svg"
import { ReactComponent as Dashboard } from "../assets/sidebar/Home.svg"
import { ReactComponent as DashboardBlack } from "../assets/sidebar/Home_black.svg"
import { ReactComponent as Siswa } from "../assets/sidebar/siswa.svg"
import { ReactComponent as SiswaBlack } from "../assets/sidebar/siswa_black.svg"
import { ReactComponent as Petugas } from "../assets/sidebar/Petugas.svg"
import { ReactComponent as PetugasBlack } from "../assets/sidebar/Petugas_black.svg"
import { ReactComponent as Pembayaran } from "../assets/sidebar/Pembayaran.svg"
import { ReactComponent as PembayaranBlack } from "../assets/sidebar/Pembayaran_black.svg"
import { ReactComponent as ArrowDown } from "../assets/sidebar/ArrowDown.svg"
import Acc from "../assets/dog.jpg"
export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      path: "/"
    }
  }

  setPath = () => {
    let url = window.location.pathname
    this.setState({
      path: url
    })
  }

  componentDidMount() {
    this.setPath()
  }
  render() {
    return (
      <div>
        <div className='h-full overflow-hidden w-full'>
          {/* Mobile Views */}
          <div>
            <div className='lg:hidden grid grid-cols-3 w-full justify-center h-16 '>
              <Menu className='h-full w-8 ml-4' />
              <Title className='w-full h-full' />
              <img src={Acc} className='ml-auto mr-4 rounded-full mt-1 h-4/5 w-12' />
            </div>
            <div className='lg:hidden grid grid-cols-12 grid-rows-12 w-full h-full gap-4'>
              <div className='row-start-1'>
                <p>asdasdad</p>
              </div>
            </div>
          </div>

          {/* Desktop Views */}
          <div className='p-8 pt-4 xl:w-76 w-64 fixed hidden lg:inline h-full z-10 bg-white'>
            <div className='items-center justify-center pb-6'>
              <Title2 className='h-full w-full justify-center' />
            </div>
            <div className='xl:mt-10 mt-6 w-full h-16 '>
              <Link to="/login">
                <button className='h-full w-full bg-purple-light rounded-custom drop-shadow-lg'>
                  <div className='p-3 flex justify-center items-center h-full w-full mr-4'>
                    <p className='xl:text-xl text-md font-medium text-white font-body w-5/6 '>Entri Transaksi</p>
                    <Button className='w-1/6 h-3/4' />
                  </div>
                </button>
              </Link>
            </div>
            <div className='xl:mt-12 ml-4 mt-8'>
              <Link to='../'>
                <div className='flex items-center w-full'>
                  {this.state.path == "/" ? (
                    <Dashboard className=' w-1/4 xl:h-8 h-7 mr-2' />
                  ) : (
                    <DashboardBlack className='w-1/4 xl:h-8 h-7 mr-2' />
                  )}
                  <p className={'font-body w-2/3 xl:text-xl lg:text-lg ' + (this.state.path == "/" ? "text-purple-base" : "text-grey-666")}>Dashboard</p>
                </div>
              </Link>
            </div>
            <div className='xl:mt-10 mt-8 ml-4'>
              <Link to='/siswa'>
                <div className='flex items-center w-full'>
                  {this.state.path == "/siswa" ? (
                    <Siswa className='w-1/4 xl:h-8 h-7 mr-2' />
                  ) : (
                    <SiswaBlack className='w-1/4 xl:h-8 h-7 mr-2' />
                  )}
                  <p className={'font-body w-2/3 xl:text-xl lg:text-lg ' + (this.state.path == "/siswa" ? "text-purple-base" : "text-grey-666")}>Siswa</p>
                </div>
              </Link>
            </div>
            <div className='mt-10 ml-4'>
              <Link to='/petugas'>
                <div className='flex items-center w-full'>
                  {this.state.path == "/petugas" ? (
                    <Petugas className='w-1/4 xl:h-8 h-7 mr-2' />
                  ) : (
                    <PetugasBlack className='w-1/4 xl:h-8 h-7 mr-2' />
                  )}
                  <p className={'font-body w-2/3 xl:text-xl lg:text-lg ' + (this.state.path == "/petugas" ? "text-purple-base" : "text-grey-666")}>Petugas</p>
                </div>
              </Link>
            </div>
            <div className='mt-10 ml-4'>
              <Link to='/pembayaran'>
                <div className='flex items-center w-full'>
                  {this.state.path == "/pembayaran" ? (
                    <Pembayaran className='w-1/4 xl:h-8 h-7 mr-2' />
                  ) : (
                    <PembayaranBlack className='w-1/4 xl:h-8 h-7 mr-2' />
                  )}
                  <p className={'font-body w-2/3 xl:text-xl lg:text-lg ' + (this.state.path == "/pembayaran" ? "text-purple-base" : "text-grey-666")}>Pembayaran</p>
                </div>
              </Link>
            </div>
          </div>
          <div className='xl:pl-72 pl-64 w-full'>
            <div className=' h-10% flex items-center overflow-hidden w-full bg-white fixed shadow-bottom '>
              <div className='flex w-full mr-72 items-center'>
                <p className='xl:text-3xl lg:text-2xl font-body text-purple-base font-medium ml-20'>Welcome, Admin!</p>
                <img src={Acc} className='h-12 ml-auto rounded-full ' />
                <p className=' ml-1 font-body text-base'>Aqsyal Raihan Jamil</p>
                <ArrowDown className='mr-12 ml-1' />
              </div>

            </div>
          </div>

        </div>

      </div>

    )
  }
}




