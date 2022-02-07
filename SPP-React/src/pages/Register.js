import React, { Component } from 'react'
import Slider from '../components/Slider'
import { SliderData } from '../components/SliderData'
import axios from "axios"
import { base_url } from "../config"

export default class Register extends Component {
  constructor() {
    super()
    this.state = {
      message: "",
      logged: true,
      nisn: "",
      nis: "",
      nama: "",
      alamat: "",
      no: "",
      image: ""
    }
  }
  render() {
    return (
      <div>
        <div className="flex  justify-center items-center w-screen h-screen bg-gray-300 ">
          <div className="flex flex-row h-3/4 w-2/3 shadow-lg rounded-xl bg-gray-100">
            <div className=" flex flex-col items-center w-1/2">
              <div class="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div class="max-w-md w-full space-y-6">
                  <div>
                    <img class="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" />
                    <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                      Register your account below!
                    </h2>
                  </div>
                  <div className="items-center justify-center mx-8">
                  <form class="mt-8 space-y-3" method="POST" onSubmit={ev => (this.Register(ev))}>
                  <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                          <label for="username-address" class="sr-only">Username</label>
                          <input value={this.state.username} onChange={ev => this.setState({username: ev.target.value})} name="Username" type="text" autocomplete="username" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Username" />
                        </div>
                        <div>
                          <label for="password" class="sr-only">Password</label>
                          <input value={this.state.password} onChange={ev => this.setState({password: ev.target.value})}id="password" name="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Password" />
                        </div>
                      </div>
                    <div>
                      <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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
                  </div>
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

