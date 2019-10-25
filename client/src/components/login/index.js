import React from 'react';
import { Mnemonic } from '@liskhq/lisk-passphrase';
import { getAddressAndPublicKeyFromPassphrase } from '@liskhq/lisk-cryptography';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './login.css';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { Address } from "../address";
import countingChips from '../../assets/audio/countingchips.wav';
import { hasUsername } from '../../actions/request';
import { SocketContext } from "../../actions/socket-context";

export class LoginComponent extends React.Component {
  constructor(props) {
    super(props);
    const passphrase = Mnemonic.generateMnemonic();
    const address = getAddressAndPublicKeyFromPassphrase(passphrase);
    this.state = {
      login: false,
      username: "",
      duplicate: false,
      publicKey: address.publicKey,
      address: address.address,
      passphrase: passphrase,
      tokenText: "Get Tokens",
      countingChips: new Audio(countingChips),
    };
    this.state.countingChips.volume = 0.4;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.loggedIn && this.props.account.balance.eq(-1)) {
      this.countingChips();
    }

    if (this.props.account.balance.gte(10)) {
      this.state.countingChips.pause();
    }

    if (!prevProps.drawer && this.props.drawer) {
      this.toggleDrawer('login', true);
    }
  }

  login() {
    this.props.login(this.state.passphrase, this.state.username);
    this.setState({login: false});
  }

  getNewPassphrase() {
    const passphrase = Mnemonic.generateMnemonic();
    this.updatePassphrase(passphrase);
  }

  updatePassphrase(passphrase) {
    const address = getAddressAndPublicKeyFromPassphrase(passphrase);
    this.setState({
      passphrase: passphrase,
      publicKey: address.publicKey,
      address: address.address,
      username: new Address({ Readonly: true, address: address.address }).state.username.substr(0, 20),
    });
  }

  updateUsername(username) {
    // check duplicate
    hasUsername(username, this.props.socket, (err, res) => this.setState({duplicate: res}));
    this.setState({
      username: username.substr(0, 20)
    });
  }

  toggleDrawer(side, open) {
    if (side === 'login') {
      this.getNewPassphrase();
      this.setState({login: open});
    }
  }

  getTokens() {
    this.props.requestTokens();
    this.countingChips();
    if (this.state.tokenText === "Get Tokens") {
      this.setState({tokenText: "Counting your bucks!"});
    } else {
      this.setState({tokenText: "I'm counting chill!!"});
    }
    setTimeout(() => {
      this.setState({tokenText: "Get Tokens"});
    }, 10000);
  }

  countingChips() {
    this.state.countingChips.pause();
    this.state.countingChips.play();
  }

  render() {
    return (
      <div className="top-header" >
        <div className="Login-container">
          {!this.props.loggedIn &&
          <Button variant="contained" color="primary" onClick={this.toggleDrawer.bind(this, 'login', true)}>
            Login
          </Button>}
          {this.props.loggedIn && <Button variant="contained" color="primary" onClick={this.props.logout.bind(this)}>
            Logout
          </Button>}
          {this.props.loggedIn && this.props.account.balance.lt(10) && !this.props.account.balance.eq(-1) &&
          <Button variant="contained" color="primary" onClick={this.getTokens.bind(this)}>
            {this.state.tokenText}
          </Button>}
          {/*<Button variant="contained" color="primary">*/}
          {/*  See Transactions*/}
          {/*</Button>*/}
        </div>
        <SwipeableDrawer
          anchor="top"
          open={this.state.login}
          onClose={this.toggleDrawer.bind(this, 'login', false)}
          onOpen={this.toggleDrawer.bind(this, 'login', true)}
        >
          <div className="Login-drawer">
            <div className="Login-flex">
              <Button variant="contained" color="primary" onClick={this.getNewPassphrase.bind(this)}>
                New passpharse
              </Button>
              <TextField
                id="standard-name"
                label="Passphrase"
                className="Login-field"
                value={this.state.passphrase}
                margin="normal"
                onChange={(input) => this.updatePassphrase(input.target.value)}
              />
              <CopyToClipboard text={this.state.passphrase}>
                <Button variant="contained" color="primary">
                  Copy passphrase
                </Button>
              </CopyToClipboard>
            </div>
            <div className="Login-address">
              Address: {this.state.address} <br/>
              <TextField
                id="standard-name"
                label="Playername"
                className="Login-field"
                value={this.state.username}
                margin="normal"
                onChange={(input) => this.updateUsername(input.target.value)}
              /><br/>
              <Button variant="contained" color="primary" onClick={this.login.bind(this)}>
                Login
              </Button>
            </div>
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

export const Login = props => (
  <SocketContext.Consumer>
    {socket => <LoginComponent {...props} socket={socket} />}
  </SocketContext.Consumer>
);
