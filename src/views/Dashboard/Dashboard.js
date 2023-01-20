import React, { Component } from 'react';
import {
  Card,
  CardBody,
  Col,
  Row,
} from 'reactstrap';

import api from '../../components/Api'
import { getSaveLocal } from '../../components/Auth'

import { toast } from 'react-toastify';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      finalizado: 0,
      pendente: 0,
      cliente: 0,
      type: getSaveLocal('@type')
    };
  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected,
    });
  }

  componentDidMount = async () => {
    try {
      const result = await api.get('/solicitation/count').then((result) => {
        console.log(result);
        this.setState({
          finalizado: result.data.data.finalizado,
          pendente: result.data.data.pendente,
          cliente: result.data.data.cliente,
          type: getSaveLocal('@type')
        })

        this.forceUpdate();
      });



    } catch (error) {

      toast.error("Ocorreu um erro desochecido!!");

    }
  }


  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="6" lg="3">
            <a href="/#/solicitation/list/pendente">
              <Card className="text-white bg-danger">
                <CardBody className="pb-0">
                  <div className="text-value">{this.state.pendente}</div>
                  <div>Solicitações pendentes</div>
                </CardBody>
              </Card>
            </a>
          </Col>

          {this.state.type == 1 &&
            <Col xs="12" sm="6" lg="3">
              <a href="/#/user/list">
                <Card className="text-white bg-primary">
                  <CardBody className="pb-0">
                    <div className="text-value">{this.state.cliente}</div>
                    <div>Clientes cadastrados</div>
                  </CardBody>
                </Card>
              </a>
            </Col>
          }

          <Col xs="12" sm="6" lg="3">
            <a href="/#/solicitation/list/finalizada">
              <Card className="text-white bg-success">
                <CardBody className="pb-0">
                  <div className="text-value">{this.state.finalizado}</div>
                  <div>Solicitações finalizadas</div>
                </CardBody>
              </Card>
            </a>
          </Col>


        </Row>
      </div>
    );
  }
}

export default Dashboard;
