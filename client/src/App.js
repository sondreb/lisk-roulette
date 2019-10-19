import React from 'react';
import openSocket from 'socket.io-client';
import { SocketContext } from './actions/socket-context';
import { Login } from './components/login';
import { Table } from './components/table';
import { Zoom } from './components/zoom';
import { Transactions } from './components/transactions';
import { LastNumbers } from './components/lastnumbers';
import './App.css';
import { getAddressAndPublicKeyFromPassphrase } from "@liskhq/lisk-cryptography";
import { doFaucetTransaction } from './transactions/101_faucet';
import { TransmitTransactions } from './actions/transmit-transactions';
import { requestAddress } from "./actions/request";

const BigNum = require('bignumber.js');

const socket = openSocket('http://185.27.32.30:7171');

export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loaded: true,
      login: false,
      account: {
        passphrase: "",
        publicKey: "",
        address: "",
        balance: new BigNum(-1),
      },
      TransmitTransactions: new TransmitTransactions(),
    };
  }

  subscribeToSever() {
  }

  async login(passphrase) {
    // sub to address balance + request
    // doFaucetTransaction if no account found
    const address = getAddressAndPublicKeyFromPassphrase(passphrase);
    this.setState({
      account: {
        passphrase: passphrase,
        publicKey: address.publicKey,
        address: address.address,
        balance: new BigNum(-1),
      },
      login: true,
      currentView: -1,
    });
    requestAddress(address.address, socket, (err, account) => this.checkAccount(account));
  }

  checkAccount(account) {
    if (account === null || new BigNum(account.balance).lt(1000000000)) {
      this.state.TransmitTransactions.send(doFaucetTransaction(this.state.account.address, this.state.account.publicKey, this.state.account.passphrase))
    }
    if (account !== null) {
      this.setState({account: {...this.state.account, balance: new BigNum(account.balance).div(100000000)}});
    }
  }

  doBet(transaction) {
    this.state.TransmitTransactions.send(transaction);
  }

  requestTokens() {
    socket.emit('address', this.state.account.address);
  }

  lowerBalance(amount) {
    this.setState({account: {...this.state.account, balance: new BigNum(this.state.account.balance).minus(amount)}});
  }

  logout() {
    this.setState({
      account: {
        passphrase: "",
        publicKey: "",
        address: "",
        balance: new BigNum(-1),
      },
      login: false,
    })
  }

  updateLoaded() {
    if (!this.state.loaded) {
      this.setState({loaded: true});
    }
  }

  render() {
    return (
      <SocketContext.Provider value={socket}>
        <div className="App">
          {this.state.loaded &&
          <div className="Loaded-app">
            <Login requestTokens={this.requestTokens.bind(this)} account={this.state.account}
                   login={this.login.bind(this)} loggedIn={this.state.login} logout={this.logout.bind(this)}/>
            <Table lowerBalance={this.lowerBalance.bind(this)} doBet={this.doBet.bind(this)} loggedIn={this.state.login}
                   account={this.state.account}/>
            <LastNumbers selected={this.state.currentView}/>
            <Transactions view={this.state.currentView}/>
            <Zoom/>
          </div>}
        </div>
      </SocketContext.Provider>
    );
  }
}
