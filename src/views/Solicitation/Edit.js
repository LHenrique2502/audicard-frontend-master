/* eslint-disable no-undef */
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
  ModalBody,
  ModalHeader
} from 'reactstrap';
import api from "../../components/Api";
import { toast } from 'react-toastify';
import { getSaveLocal } from "../../components/Auth";

class SolicitationEdit extends Component {

  state = {
    type_card: 2,
    freight: 0,
    note: "",
    error: "",
    success: "",
    rows: [{}],
    protocol: null,
    user_id: getSaveLocal("@id"),
    type: getSaveLocal("@type"),
    status: 0,
    statusEdit: 0,
    listaItens: new Array(),
    modal: false,
    name: 'Carregando ...'
  };


  componentDidMount() {
    this.toggle = this.toggle.bind(this);
    this.setState({
      id: this.props.match.params.id
    })
    this.restShow().then(() => {
      console.log("teste");
    });

  }
  toggle() {
    this.setState({
      modal: !this.state.modal
    })
  }

  async restShow() {
    this.setState({ error: "" });

    try {
      const response = await api.get("/solicitation/" + this.props.match.params.id);

      console.log("response_response:::", response);

      const result = response.data.data;

      console.log(result);

      this.state.listaItens = await this.BuildList(response.data.data)


      this.forceUpdate();

      console.log(this.state);

      console.log("this.state.listaItens:::", this.state.listaItens);

      this.forceUpdate();

    } catch (err) {
      console.log(err);
      if (err.response.status != undefined) {
        if (err.response.status == 401) {
          toast.info("Favor realizar o login novamente!");
          this.props.history.push('/login');
        } else if (err.response.status === 422) {
          toast.error(err.response.data.data);
        }
      } else {
        toast.error("Ocorreu um erro desconhecido!");
        console.log(err);
      }

    }

  }

  BuildList = async (data) => {
    let list = new Array();
    data.map((line) => {
      this.setState({
        type_card: parseInt(line.type_card),
        freight: line.freight,
        note: line.note,
        status: line.status,
        statusEdit: line.status,
        protocol: line.protocol,
        name: line.name
      });

      list.push(line);
    });
    return list;
  }

  pathPhoto(photo) {

    if (photo != null) {
      let path = "http://api.audicard.net.br/" + photo.replace("public/", "storage/");

      console.log(path.toString());
      return path.toString();
    }

  }



  handleSignIn = async e => {
    e.preventDefault();
    this.setState({ error: "" });
    const { status, protocol, user_id } = this.state;

    try {

      const data = {
        'protocol': protocol,
        'status': status,
        'user_id': user_id
      };

      console.log(data);
      //Faz requisição com o servidor.
      const response = await api.put("solicitation/" + this.state.id, data);

      if (response.status == 200) {
        toast.success(response.data.data);
        this.setState({
          success: response.data.data,
          name: "",
          password: "",
          email: "",
          status: 1,
          type: 2,
          error: "",
          statusEdit: 1,
        })

        this.restShow();
      }


    } catch (err) {
      if (err.response.status == 422) {
        toast.error(err.response.data.data);
      } else {
        toast.error("Ocorreu um erro desconhecido no cadastro");
      }

      console.log(err.response);
    }
  };

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
                  <strong>Edição de solicitação</strong>
                  <small> Formulario ({this.state.name}) </small>
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
                    <Col md="4" lg="4" xs="12">
                      <FormGroup>
                        <Label htmlFor="type_card">Tipo de cartão</Label>
                        <Input type="select" name="type_card" id="type_card" required
                          disabled defaultValue={this.state.type_card}>
                          <option value=""  >Seleciona</option>
                          <option value="1" selected={this.state.type_card == 1 ? true : false} >Aproximação</option>
                          <option value="2" selected={this.state.type_card == 2 ? true : false} >Código de barras</option>
                          <option value="3" selected={this.state.type_card == 3 ? true : false} >Aproximação + Código</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col md="2" lg="2" xs="12">
                      <FormGroup>
                        <Label htmlFor="freight">Frete</Label>
                        <Input type="select" name="freight" id="freight" required
                          disabled defaultValue={this.state.freight} >
                          <option value="0" selected={this.state.freight == 0 ? true : false} >Não</option>
                          <option value="1" selected={this.state.freight == 1 ? true : false} >Sim</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    {this.state.type == 1 &&
                      <Col md="2" lg="2" xs="12">
                        <FormGroup>
                          <Label htmlFor="status">Status Solicitação</Label>
                          <Input type="select" name="status" id="status" required
                            disabled={this.state.statusEdit == 1 ? true : false} value={this.state.status} onChange={e => this.setState({ status: e.target.value })}  >
                            <option value="0">Pendente</option>
                            <option value="1">Finalizado</option>
                          </Input>
                        </FormGroup>
                      </Col>
                    }

                    {this.state.type == 1 &&
                      <Col md="4" lg="4" xs="12">
                        <FormGroup>
                          <Label htmlFor="protocol">Solicitante</Label>
                          <Input type="text" id="protocol" placeholder="Protocolo" required
                            disabled onChange={e => this.setState({ protocol: e.target.value })}
                            value={this.state.protocol} />
                        </FormGroup>
                      </Col>
                    }


                  </Row>

                  <Row>
                    <Col xs="12" md="12" lg="12">
                      <FormGroup >
                        <Label htmlFor="textarea-input">Observação</Label>

                        <Input type="textarea" name="note" id="note" rows="3" disabled value={this.state.note} />
                      </FormGroup>
                    </Col>

                  </Row>



                  <Row id="printarea">
                    <Col md="12" lg="12" xs="12">
                      <Table responsive striped hover >
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Nome de cima</th>
                            <th>Nome de baixo</th>
                            <th>Departamento</th>
                            <th>Matricula/Codigo</th>
                            <style>
                              {`@media print {#th-photos{display: none;}}`}
                            </style>
                            <th id="th-photos">Photo</th>
                          </tr>
                        </thead>
                        <tbody >
                          {this.state.listaItens.map((item, key) => (
                            <tr key={key}>
                              <td>
                                {item.id}
                              </td>
                              <td>
                                <Input type="text" name="name" placeholder="Nome de cima" required
                                  value={item.detail_solicitationsName} disabled />
                              </td>
                              <td>
                                <Input type="text" name="last_name" placeholder="Nome de cima" required
                                  value={item.last_name} disabled />
                              </td>
                              <td>
                                <Input type="text" name="department" placeholder="Nome de cima" required
                                  value={item.department} disabled />
                              </td>
                              <td>
                                <Input type="text" name="registration" placeholder=""
                                  value={item.registration} disabled />
                              </td>

                              <style>
                                {`@media print {#td-photos{display: none;}}`}
                              </style>
                              {item.photo != null &&
                                <td id="td-photos" >
                                  <a href={this.pathPhoto(item.photo)} target="_target"
                                    download={this.pathPhoto(item.photo)}>
                                    <img width="90px" height="90px"
                                      src={this.pathPhoto(item.photo)} className="img-avatar" />
                                  </a>
                                </td>
                              }
                            </tr>
                          ))}

                        </tbody>
                      </Table>

                    </Col>
                  </Row>

                </CardBody>
                <CardFooter>

                  <Button type={this.state.statusEdit == 0 ? "submit" : "button"}
                    onClick={this.state.statusEdit == 1 ? this.backPage : ""}
                    size="sm" color={this.state.statusEdit == 1 ? "warning" : "primary"}>
                    <i className="fa fa-dot-circle-o"></i>{this.state.statusEdit == 1 ? "Voltar" : "Salva"}
                  </Button>
                  {this.state.statusEdit == 0 &&
                    <Button size="sm" color="dark" type="button" onClick={this.toggle} > Imprimir </Button>
                  }
                </CardFooter>
              </Card>
            </Form>
          </Col>
        </Row>
      </div>
    )
  }

}




export default SolicitationEdit;
