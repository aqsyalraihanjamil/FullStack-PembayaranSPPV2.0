import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Siswa from "./pages/Siswa";
import Petugas from "./pages/Petugas";
import Pembayaran from "./pages/Pembayaran";
import Kelas from "./pages/Kelas";
import Spp from "./pages/Spp";
import Entri from "./pages/Entri";
import History from "./pages/History";

export default class App extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/entri" component={Entri} />
          <Route path="/login" component={Login} />
          <Route path="/siswa" component={Siswa} />
          <Route path="/petugas" component={Petugas} />
          <Route path="/kelas" component={Kelas} />
          <Route path="/spp" component={Spp} />
          <Route path="/pembayaran" component={Pembayaran} />
          <Route path="/register" component={Register} />
          <Route path="/history" component={History} />
        </Switch>
      </div>
    );
  }
}
