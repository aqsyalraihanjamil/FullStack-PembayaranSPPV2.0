import React, { Component } from 'react'

export default class LoginEz extends Component {
  render() {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <form>
          <div className="flex flex-col justify-center items-center space-y-3">
            <label>Username</label>
            <input placeholder="Username" className="bg-gray-200 px-4 py-1 placeholder-indigo-300" />
            <label>Password</label>
            <input placeholder="Password" />
            <button className="bg-indigo-500 px-12 text-white py-2 rounded-md">Login</button>
          </div>
        </form>
      </div>
    )
  }
}
