import React, {Component} from 'react';
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


import { toast } from 'react-toastify';

import api from "../../components/Api";
import { login } from '../../components/Auth';

class GroupList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            listaItens: new Array(),
            id : 0,
            modal: false,
            warning: false,
            isLoad: false,

        }

        this.toggleWarning = this.toggleWarning.bind(this);

    }

    componentDidMount(){
      this.handleSignIn();
    }

    toggleWarning() {
      this.setState({
        warning: !this.state.warning,
      });
    }


    handleSignIn = async e => {
        try {



            const response = await api.get("/user");
            console.log(">>>>>>>> handleSignIn" , response);
            //autentica o usuario]
            this.state.listaItens = this.BuildList(response.data.data)

            this.forceUpdate();

          } catch (e) {
            console.log(e);
            this.props.history.push('/login')
        }
    }

    BuildList(data) {
        let list = new Array();
        data.map((line) => {
            list.push(line);
        });
        return list;
    }

    onEdit = (e) => {
      let _url = '/user/edit/' + e;
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
          await api.delete("/user/" + this.state.id);
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
                                <i className="fa fa-align-justify"></i> Grupos
                            </CardHeader>
                            <CardBody>
                                <Table responsive striped hover>
                                    <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>E-mail</th>
                                        <th>Data Registro</th>
                                        <th>Tipo</th>
                                        <th>Status</th>
                                        <th>Ação</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.listaItens.map((item) => (
                                        // eslint-disable-next-line react/jsx-key
                                        <tr>
                                            <td>{item.name}</td>
                                            <td>{item.email}</td>
                                            <td>{item.created_at}</td>
                                            <td>{item.type == 1 ? 'Administrador': 'Cliente'}</td>
                                            <td>
                                                {item.active == 1 ? (
                                                    <Badge color="success">Ativado</Badge>
                                                ) : (
                                                    <Badge color="danger">Desativado</Badge>
                                                )}
                                            </td>
                                            <td>
                                            <Button type="button" size="sm" color="danger" onClick={(e) => this.onDelete(item.id)}>
                                            <i className="fa fa-trash-o"></i></Button>

                                            <Button type="button" size="sm" color="info" onClick={(e) => this.onEdit(item.uuid)}>
                                            <i className="fa fa-pencil"></i></Button>
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

export default GroupList;
