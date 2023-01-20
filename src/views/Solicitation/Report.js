import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
  CardFooter,
  Button,
  Form,
  UncontrolledAlert,
  Table,
  Modal,
  ModalHeader
} from 'reactstrap';
import api from "../../components/Api";
import { toast } from 'react-toastify';
import { getSaveLocal } from "../../components/Auth";

class SolicitationReport extends Component {

  state = {
    error: "",
    success: "",
    rows: [{}],
    user_id: getSaveLocal("@id"),
    type: getSaveLocal("@type"),
    listaItens: new Array(),
    listaClients: [],
    modal: false,
    client_id: null,
    dtInicial: null,
    dtFinal: null,
  };


  componentDidMount() {
    this.toggle = this.toggle.bind(this);
    this.restShow();
  }
  toggle() {
    this.setState({
      modal: !this.state.modal
    })
  }

  restShow = async e => {
    this.setState({ error: "" });

    try {
      const response = await api.get("/report/clients");

      console.log("response_response:::", response);

      const result = response.data.data;

      console.log(result);

      this.state.listaClients = await this.BuildListClient(result);


      this.forceUpdate();

      console.log("this.state.listaClients:::", this.state.listaClients);

    } catch (err) {
      if (err.response.status == 401) {
        toast.info("Favor realizar o login novamente!");
        this.props.history.push('/login');
      } else if (err.response.status === 422) {
        toast.error(err.response.data.data);
      }
    }

  }

  handleSignIn = async e => {
    e.preventDefault();
    this.setState({ error: "" });
    const { client_id, dtInicial, dtFinal } = this.state;

    try {

      const data = {
        'client_id': client_id,
        'dtInicial': dtInicial,
        'dtFinal': dtFinal
      };

      console.log("data:::", data);
      //Faz requisição com o servidor.
      const response = await api.post("/report/solicitation", data);

      if (response.status == 200) {
        const result = response.data.data;

        if (result.length === 0) {
          toast.error("Nenhum resultado encontrado!!")
          return;
        }
        this.state.listaItens = await this.BuildList(response.data.data)
      }

      this.forceUpdate()

    } catch (err) {
      if (err.response.status == 422) {
        toast.error(err.response.data.data);
      } else {
        toast.error("Ocorreu um erro desconhecido no cadastro");
      }

      console.log(err.response);
    }
  };

  BuildList = async (data) => {
    let list = new Array();
    data.map((line) => {
      list.push(line);
    });
    return list;
  }

  BuildListClient = async (data) => {
    let list = new Array();
    data.map((line) => {
      list.push(line);
    });
    return list;
  }

  backPage = () => {
    this.props.history.push("/solicitation/list");
  }

  print() {
    var content = document.getElementById('printarea');
    var pri = document.getElementById('ifmcontentstoprint').contentWindow;
    pri.document.open();
    pri.document.write(content.innerHTML);
    pri.document.close();
    pri.focus();
    pri.print();
  }


  render() {
    return (
      <div className="animated fadeIn">

        <Row>

          <Modal
            size='lg'
            isOpen={this.state.modal}
            toggle={this.toggle}
            className='results-modal'
          >
            <ModalHeader toggle={this.toggle}> Impressão </ModalHeader>
            <iframe id="ifmcontentstoprint" style={{
              height: '0px',
              width: '0px',
              position: 'absolute'
            }}></iframe>
            <Button onClick={this.print}>Confirma Impressão</Button>

          </Modal>
          <Col xs="12" sm="12">
            <Form onSubmit={this.handleSignIn} >
              <Card>
                <CardHeader>
                  <strong>Relatório de solicitações</strong>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col xs="12">
                      {this.state.error &&
                        <UncontrolledAlert color="danger">
                          {this.state.error}
                        </UncontrolledAlert>
                      }
                      {this.state.success &&
                        <UncontrolledAlert color="success">
                          {this.state.success}
                        </UncontrolledAlert>
                      }
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6" lg="6" xs="12">
                      <FormGroup>
                        <Label htmlFor="client_id">Cliente</Label>
                        <Input type="select" name="client_id" id="client_id" required
                          defaultValue={this.state.client_id}
                          onChange={e => this.setState({ client_id: e.target.value })}>
                          <option value="" selected >Seleciona</option>
                          {this.state.listaClients.map((item, key) => (
                            <option key={key} value={item.id} >{item.name}</option>
                          ))}
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col md="3" lg="3" xs="12">
                      <FormGroup>
                        <Label htmlFor="dtInicial">Data Inicio</Label>
                        <Input type="date" id="dtInicial" placeholder="Inicio" required
                          onChange={e => this.setState({ dtInicial: e.target.value })}
                          defaultValue={this.state.dtInicial} />
                      </FormGroup>
                    </Col>
                    <Col md="3" lg="3" xs="12">
                      <FormGroup>
                        <Label htmlFor="dtFinal">Data Final</Label>
                        <Input type="date" id="dtFinal" placeholder="Inicio" required
                          onChange={e => this.setState({ dtFinal: e.target.value })}
                          defaultValue={this.state.dtFinal} />
                      </FormGroup>
                    </Col>




                  </Row>

                  <Row>
                    <Col md="2" lg="2" xs="12">
                      <FormGroup>
                        <Button type="submit" id="buscar"
                          size="sm" color="primary">
                          <i className="fa fa-dot-circle-o"></i>Buscar </Button>
                      </FormGroup>
                    </Col>

                    <Col md="2" lg="2" xs="12">
                      <FormGroup>
                        {this.state.listaItens.length != 0 &&
                          <Button size="sm" color="dark" type="button" onClick={this.toggle} > Imprimir </Button>
                        }
                      </FormGroup>
                    </Col>
                  </Row>



                  <Row id="printarea">
                    <Col md="12" lg="12" xs="12">
                      <Table responsive striped hover >
                        {this.state.listaItens.length != 0 &&
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Nome de cima</th>
                              <th>Nome de baixo</th>
                              <th>Departamento</th>
                              <th>Matricula/Codigo</th>
                              <th>Data</th>

                            </tr>
                          </thead>
                        }
                        <tbody >
                          {this.state.listaItens.map((item, key) => (
                            <tr key={key}>
                              <td>
                                {item.id}
                              </td>
                              <td>
                                {item.name}
                              </td>
                              <td>
                                {item.last_name}
                              </td>
                              <td>
                                {item.department}
                              </td>
                              <td>
                                {item.registration}
                              </td>

                              <td>
                                {item.created_at}
                              </td>

                            </tr>
                          ))}

                        </tbody>
                        {this.state.listaItens.length != 0 &&
                          <tfoot>
                           <th>
                           Total:
                           </th>
                           <th>{this.state.listaItens.length}</th>
                          </tfoot>
                        }
                      </Table>

                    </Col>
                  </Row>

                </CardBody>

              </Card>
            </Form>
          </Col>
        </Row>
      </div>
    )
  }

}




export default SolicitationReport;
