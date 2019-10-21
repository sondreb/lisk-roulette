import React from 'react';
import Prando from "prando";
import './roulette.css';
import { subscribeToBlocks, subscribeToStatus } from "../../actions/subscribe";
import { requestStatus } from "../../actions/request";
import { SocketContext } from "../../actions/socket-context";
import Button from '@material-ui/core/Button';

export class RouletteComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      state: 0,
      rolledNumber: 'roll',
      rest: false,
      reset: true,
    };
    requestStatus( props.socket,(err, status) => this.updateStatus(status));
    subscribeToStatus( props.socket, (err, status) => this.updateStatus(status));
    subscribeToBlocks( props.socket,(err, blockSignature) => this.updateBlock(blockSignature));
  }

  updateStatus(status) {
    if (this.state.state !== status) {
      if (status === 0) {
        this.setState({ rest: false, rolledNumber: 'roll', state: 0 });
      } else if (status === 1) {
        this.setState({ state: 1 });

      } else if (status === 2) {
        this.setState({ rest: true, state: 2 });
      } else if (status === 3) {
        this.setState( { rest: true, state: 3 });
      }
    }
  }

  updateBlock(blockSignature) {
    const rng = new Prando(blockSignature);
    const draw = rng.nextInt(0, 36);
    this.setState({ rolledNumber: draw, rest: false, reset: true });
    setTimeout(() => {
      this.setState({ reset: false });
    }, 15);
  }

  getState() {
    switch (this.state.state) {
      case 1:
        return "No more bets";
      case 2:
        return `Nr. ${this.state.rolledNumber}`;
      case 3:
        return "Wait for new game";
      default:
        return "Spin";
    }
  }

  componentDidMount() {
    this.setState({rolledNumber: 'roll', reset: true, rest: false, state: 0});
    setTimeout(() => {
      this.setState({ reset: false });
    }, 1);
  }

  render() {
    let ballClass = `inner inner-${this.state.rolledNumber}`;
    if (this.state.rolledNumber !== 'roll') {
      ballClass = `inner inner-${this.state.rolledNumber} `;
    }
    if (this.state.rest) {
      ballClass += 'rest';
    }
    if (this.state.reset) {
      ballClass = "inner";
    }
    return (
      <div className="main">
        <div className="plate" id="plate">
          <ul className={ballClass}>
            <li className="number"><label><input type="radio" name="pit" value="32"/><span
              className="pit">32</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="15"/><span
              className="pit">15</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="19"/><span
              className="pit">19</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="4"/><span
              className="pit">4</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="21"/><span
              className="pit">21</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="2"/><span
              className="pit">2</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="25"/><span
              className="pit">25</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="17"/><span
              className="pit">17</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="34"/><span
              className="pit">34</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="6"/><span
              className="pit">6</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="27"/><span
              className="pit">27</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="13"/><span
              className="pit">13</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="36"/><span
              className="pit">36</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="11"/><span
              className="pit">11</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="30"/><span
              className="pit">30</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="8"/><span
              className="pit">8</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="23"/><span
              className="pit">23</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="10"/><span
              className="pit">10</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="5"/><span
              className="pit">5</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="24"/><span
              className="pit">24</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="16"/><span
              className="pit">16</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="33"/><span
              className="pit">33</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="1"/><span
              className="pit">1</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="20"/><span
              className="pit">20</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="14"/><span
              className="pit">14</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="31"/><span
              className="pit">31</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="9"/><span
              className="pit">9</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="22"/><span
              className="pit">22</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="18"/><span
              className="pit">18</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="29"/><span
              className="pit">29</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="7"/><span
              className="pit">7</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="28"/><span
              className="pit">28</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="12"/><span
              className="pit">12</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="35"/><span
              className="pit">35</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="3"/><span
              className="pit">3</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="26"/><span
              className="pit">26</span></label></li>
            <li className="number"><label><input type="radio" name="pit" value="0"/><span
              className="pit">0</span></label></li>
          </ul>
          <div className="data">
            <div className="data-inner">
              <Button className="spinbttn" variant="contained" color="primary">
              <div className="mask">{this.getState()}</div>
              </Button>
              <div className="result">
                <div className="result-number">00</div>
                <div className="result-color">red</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export const Roulette = props => (
  <SocketContext.Consumer>
    {socket => <RouletteComponent {...props} socket={socket} />}
  </SocketContext.Consumer>
);

