import React, { Component } from 'react';
import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from 'reactstrap';

import { Redirect } from 'react-router-dom'

import { toast } from 'react-toastify';

import api from "../../components/Api";
import { login, getSaveLocal } from '../../components/Auth';

class SolicitationList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      listaItens: new Array(),
      id: 0,
      modal: false,
      warning: false,
      isLoad: false,
      authTipy: getSaveLocal("@type"),
      status: this.props.match.params.status != "all" ? this.props.match.params.status : null
    }

    this.toggleWarning = this.toggleWarning.bind(this);

  }

  componentDidMount() {
    this.handleSignIn();

    this.forceUpdate();



  }

  componentWillReceiveProps(){
    this.setState({
      status: this.props.match.params.status != "all" ? this.props.match.params.status : null
    })

    console.log("this.props.match.params.status",this.props.match.params.status)
    console.log("this.state::",this.state)

    this.handleSignIn();

    this.forceUpdate();

  }


  toggleWarning() {
    this.setState({
      warning: !this.state.warning,
    });
  }


  handleSignIn = async e => {
    try {



      const response = await api.get("/solicitation");
      console.log(">>>>>>>> handleSignIn", response);
      //autentica o usuario]
      this.state.listaItens = this.BuildList(response.data.data)

      this.forceUpdate();

    } catch (e) {
      console.log(e);
      //this.props.history.push('/login')
    }
  }

  BuildList(data) {
    let list = new Array();
    data.map((line) => {
      if (this.state.status == "pendente") {
        if (line.status == 0) {
          list.push(line);
        }
      } else if (this.state.status == "finalizada") {
        if (line.status == 1) {
          list.push(line);
        }
      } else {
        list.push(line);
      }
    });
    return list;
  }

  onEdit = (e) => {
    let _url = '/solicitation/edit/' + e;
    this.props.history.push(_url)
  }

  onDelete = (e) => {

    this.setState({
      id: e,
    });

    this.toggleWarning();

  }

  delete = async () => {
    console.log(this.state.id);
    try {
      await api.delete("/solicitation/" + this.state.id);
      //autentica o usuario
      this.handleSignIn();
      toast.success('Registro excluido com sucesso!');
      this.toggleWarning();
    } catch (e) {
      toast.error('Ocorreu um erro desconhecido no sistema, \n ' + e.response);
      this.toggleWarning();
      console.log(e);
    }
  }



  render() {
    console.log(this.state.listaItens);
    const type = this.state.authTipy;
    return (

      <div className="animated fadeIn">
        <Row>

          <Modal isOpen={this.state.warning} toggle={this.toggleWarning}
            className={'modal-warning ' + this.props.className}>
            <ModalHeader toggle={this.toggleWarning}>Confirmação exclusão</ModalHeader>
            <ModalBody>
              Deseja realmente excluir o item em questão?
                  </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={this.delete} >Excluir</Button>{' '}
              <Button color="secondary" onClick={this.toggleWarning}>Cancelar</Button>
            </ModalFooter>
          </Modal>

          <Col xs="12" lg="12" md="12">
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Listagem de solicitações
                            </CardHeader>
              <CardBody>
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Cliente</th>
                      <th>Tipo cartão</th>
                      <th>Frete</th>
                      <th>Solicitante</th>
                      <th>Status</th>
                      <th>Data criação</th>
                      <th>Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.listaItens.map((item,i) => (
                      // eslint-disable-next-line react/jsx-key
                      <tr key={i} >
                        <td> <a href="javascritp:;" onClick={(e) => this.onEdit(item.uuid)} > {item.id}</a></td>
                        <td>{item.name}</td>
                        <td>{item.type_card == 1 ? 'Aproximação' : item.type_card == 2 ? 'Codigo de barra' : 'Aproximação e codigo'}</td>
                        <td>{item.freight == 0 ? 'Não' : 'Sim'}</td>
                        <td>{item.protocol == '' ? 'Não finalizado' : item.protocol}</td>
                        <td>
                          {item.status == 0 ? (
                            <Badge color="danger">Pendente</Badge>
                          ) : (
                              <Badge color="success">Finalizado</Badge>
                            )}
                        </td>
                        <td>{item.created_at}</td>
                        <td>
                          {item.status == 0 &&
                            <Button type="button" size="sm" color="danger" onClick={(e) => this.onDelete(item.id)}>
                              <i className="fa fa-trash-o"></i></Button>
                          }

                          {item.status == 0 && type == 1 &&

                            <Button type="button" size="sm" color="info" onClick={(e) => this.onEdit(item.uuid)}>
                              <i className="fa fa-pencil"></i></Button>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {/*<Pagination>
                                    <PaginationItem>
                                        <PaginationLink previous tag="button"></PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem active>
                                        <PaginationLink tag="button">1</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink tag="button">2</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink tag="button">3</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink tag="button">4</PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink next tag="button"></PaginationLink>
                                    </PaginationItem>
                                </Pagination>*/}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default SolicitationList;
