import React, { Component } from 'react'
import Slider from '../components/Slider'
import { SliderData } from '../components/SliderData'
import axios from "axios"
import { base_url } from "../config"

export default class Login extends Component {
  constructor() {
    super()
    this.state = {
      username: "",
      password: '',
      message: "",
      as: "petugas",
      logged: true,
      nisn: ""
    }
  }

  Login = event => {
    event.preventDefault();
    if (this.state.as === "petugas") {
      let sendData = {
        username: this.state.username,
        password: this.state.password
      }
      let url = base_url + "/petugas/auth"
      axios.post(url, sendData)
        .then(response => {
          this.setState({ logged: response.data.logged })
          if (this.state.logged) {
            let admin = response.data.data
            let token = response.data.token
            let level = response.data.data.level
            localStorage.setItem("admin", JSON.stringify(admin))
            localStorage.setItem("token", token)
            localStorage.setItem("level", level)
            localStorage.setItem("role", this.state.as)
            this.props.history.push("/")
          } else {
            this.setState({ message: response.data.message })
          }
        })
        .catch(error => console.log(error))
    } else if (this.state.as === "siswa") {

      let sendData = {
        nisn: this.state.nisn
      }
      let url = base_url + "/siswa/auth"
      axios.post(url, sendData)
        .then(response => {
          this.setState({ logged: response.data.logged })
          if (this.state.logged) {
            let siswa = response.data.data
            let token = response.data.token
            localStorage.setItem("siswa", JSON.stringify(siswa))
            localStorage.setItem("token", token)
            this.props.history.push("/")
          } else {
            this.setState({ message: response.data.message })
          }
        })
        .catch(error => console.log(error))
    }
  }

  render() {
    return (
      <div>
        {!this.state.logged ? (
          <div class=" border-l-4 border-orange-500 text-white font-body absolute w-full justify-center items-center flex p-4" role="alert">
            <div className='bg-purple-light w-2/3 p-4'>
              <p class="font-bold">Error</p>
              <p>{this.state.message}</p>
            </div>
          </div>
        ) : null}
        <div className="flex  justify-center items-center w-screen h-screen bg-gray-300">

          <div className="flex flex-row h-3/4 w-2/3 shadow-lg rounded-xl bg-gray-100">
            <div className=" flex flex-col items-center w-1/2">
              <div class="min-h-full w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-md w-full space-y-6">
                  <div>

                    <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" />
                    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                      Sign in to your account
                    </h2>
                    <p class="mt-2 text-center text-sm text-gray-600">
                      Or
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-800 text-base">Login Sebagai </p>
                    <div>
                      <form class="block text-left ">
                        <div>
                          <select value={this.state.as} onChange={ev => this.setState({ as: ev.target.value })} class="form-select w-full mt-1 text-gray-600 py-1 rounded-md border focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 px-2 text-sm">
                            <option value="petugas">Admin</option>
                            <option value="siswa">User</option>
                          </select>
                        </div>
                      </form>
                    </div>
                  </div>
                  {this.state.as === "petugas" ? (
                    <form class="mt-8 space-y-6" onSubmit={ev => (this.Login(ev))}>
                      {/* <input type="hidden" name="remember" value="true" /> */}
                      <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                          <label for="username-address" class="sr-only">Username</label>
                          <input value={this.state.username} onChange={ev => this.setState({ username: ev.target.value })} id="username-address" name="Username" type="text" autocomplete="username" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Username" />
                        </div>
                        <div>
                          <label for="password" class="sr-only">Password</label>
                          <input value={this.state.password} onChange={ev => this.setState({ password: ev.target.value })} autoComplete="false" id="password" name="password" type="password" autocomplete="current-password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" />
                        </div>
                      </div>
                      <div>
                        <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                            {/* <!-- Heroicon name: solid/lock-closed --> */}
                            <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                            </svg>
                          </span>
                          Sign in
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form class="mt-8 space-y-6" action="#" method="POST" onSubmit={ev => (this.Login(ev))}>
                      <input type="hidden" name="remember" value="true" />
                      <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                          <label for="nisn-address" class="sr-only">NISN</label>
                          <input value={this.state.nisn} onChange={ev => this.setState({ nisn: ev.target.value })} id="nisn-address" name="nisn" type="text" autocomplete="nisn" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="NISN" />
                        </div>
                      </div>
                      <div>
                        <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                            {/* <!-- Heroicon name: solid/lock-closed --> */}
                            <svg class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                            </svg>
                          </span>
                          Sign in
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
            <div className=" flex flex-col justify-center items-center w-1/2">
              <Slider slides={SliderData} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}