import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Table,
  Row,
  CardFooter,
  Button,
  Form,
  UncontrolledAlert,
  Alert,
} from 'reactstrap';
import api from "../../components/Api";
import { getSaveLocal } from "../../components/Auth";
import { toast } from 'react-toastify';

class SolicitationRegister extends Component {


  state = {
    type_card: 2,
    freight: 0,
    note: "",
    error: "",
    success: "",
    rows: [{}],
    name: getSaveLocal('@name')
  };





  handleRegister = async e => {
    e.preventDefault();
    this.setState({ error: "" });

    if (this.state.rows.length == 0) {
      toast.error("Impossivel enviar uma solicitação sem cadastro de impressão!");
      return;
    }

    this.setState({ warn: "Enviando informações para o servidor, aguarde!!" });


    const data = new FormData();
    data.append('type_card', this.state.type_card);
    data.append('freight', this.state.freight);
    data.append('note', this.state.note);
    data.append('client_id', getSaveLocal("@id"));
    data.append('protocol', this.state.protocol);
    this.state.rows.map((item, i) => {
      data.append('name[' + i + ']', item.name);
      data.append('last_name[' + i + ']', item.last_name);
      data.append('department[' + i + ']', item.department == undefined ? null : item.department );
      data.append('registration[' + i + ']', (item.registration == undefined ? null : item.registration));
      data.append('photo[' + i + ']', item.photo == undefined ? null : item.photo);
    })


    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    console.log(data);
    const body = data;

    const response = await api.post("/solicitation", body, config).then((response)=>{
      console.log("await api.post:::",response);
      toast.success(response.data.data);
      setTimeout(() => {
        this.props.history.push("/");
      }, 3200);
    }).catch((erro)=>{
      console.error(erro);
    });

  };

  handleFreight = (value) => {
    console.log(value);
    this.setState({
      freight: value
    });
    if (value == 1) {
      toast.error("Será adicionado o valor de R$ 10,00 pedido!!");
    } else {
      toast.dismiss();
    }
  }

  handleChange = idx => e => {
    const { name, value } = e.target;
    const rows = [...this.state.rows];
    const types = ['image/png', 'image/jpeg']

    if (name == "photo") {
      const file = e.target.files[0];
      const errs = [];

      if (types.every(type => file.type !== type)) {
        errs.push(`'${file.type}' não é um formato suportado`)
      }

      if (file.size > 5000000) {
        errs.push(`'${file.name}' é muito grande, por favor, escolha um arquivo menor`)
      }

      if (errs.length) {
        rows[idx].photoDs = ""
        this.forceUpdate()
        return errs.forEach(err => toast.error(err))
      }

      rows[idx] = {
        ...rows[idx],
        [name]: e.target.files[0],
        photoDs: value
      };

    } else {
      rows[idx] = {
        ...rows[idx],
        [name]: value
      };
    }


    this.setState({
      rows
    });

  };

  handleAddRow = () => {
    const item = {
      name: "",
      last_name: "",
      department: "",
      registration: "",
      photo: "",
    };
    this.setState({
      rows: [...this.state.rows, item]
    });
  };
  handleRemoveRow = () => {
    this.setState({
      rows: this.state.rows.slice(0, -1)
    });
  };
  handleRemoveSpecificRow = (idx) => () => {
    const rows = [...this.state.rows]
    rows.splice(idx, 1)
    this.setState({ rows })
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <Form onSubmit={this.handleRegister} >
              <Card>
                <CardHeader>
                  <strong>Cadastrar solicitação</strong>
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
                      {this.state.success &&
                        <Alert color="success">
                          {this.state.success}
                        </Alert>
                      }

                      {this.state.warn &&
                        <Alert color="warning">
                          <img src="https://media.giphy.com/media/sSgvbe1m3n93G/giphy.gif"
                            width="30px" height="30px" ></img>
                          {this.state.warn}
                        </Alert>
                      }


                    </Col>
                  </Row>

                  <Row>
                    <Col md="4" lg="4" xs="12">
                      <FormGroup>
                        <Label htmlFor="type_card">Tipo de cartão</Label>
                        <Input type="select" name="type_card" id="type_card" required
                          onChange={e => this.setState({ type_card: e.target.value })}>
                          <option value="" >Seleciona</option>
                          <option value="1" >Aproximação</option>
                          <option value="2">Código de barras</option>
                          <option value="3">Aproximação + Código</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col md="2" lg="2" xs="12">
                      <FormGroup>
                        <Label htmlFor="freight">Frete</Label>
                        <Input type="select" name="freight" id="freight" required
                          onChange={e => this.handleFreight(e.target.value)}>
                          <option value="0">Não</option>
                          <option value="1">Sim</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col md="4" lg="4" xs="12">
                        <FormGroup>
                          <Label htmlFor="protocol">Nome solicitante</Label>
                          <Input type="text" id="protocol" placeholder="Solicitante" required
                            onChange={e => this.setState({ protocol: e.target.value })}
                            value={this.state.protocol} />
                        </FormGroup>
                      </Col>


                  </Row>

                  <Row>
                    <Col xs="12" md="12" lg="12">
                      <FormGroup >
                        <Label htmlFor="textarea-input">Observação</Label>

                        <Input type="textarea" name="note" id="note" rows="3"
                          placeholder="Content..."  onChange={e => this.setState({ note: e.target.value })} />
                      </FormGroup>
                    </Col>

                  </Row>


                  <Row>
                    <Col md="12" lg="12" xs="12">
                      <Table responsive striped hover>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Nome/Primeiro nome</th>
                            <th>Sobrenome/Segundo nome</th>
                            <th>Departamento</th>
                            <th>Matricula/Codigo</th>
                            <th>Photo(Tam max. 5MB)</th>
                            <th>Ação</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.rows.map((item, idx) => (
                            <tr id="addr0" key={idx}>
                              <td>{idx}</td>
                              <td>
                                <Input type="text" name="name" placeholder="Nome de cima" required
                                  value={this.state.rows[idx].name}
                                  onChange={this.handleChange(idx)} />
                              </td>
                              <td>
                                <Input type="text" name="last_name" placeholder="Nome de baixo" required
                                  value={this.state.rows[idx].last_name}
                                  onChange={this.handleChange(idx)} />

                              </td>
                              <td>
                                <Input type="text" name="department" placeholder="Departamento"
                                  value={this.state.rows[idx].department}
                                  onChange={this.handleChange(idx)} />

                              </td>
                              <td>
                                <Input type="text" name="registration" placeholder="Matricula/Codigo"
                                  value={this.state.rows[idx].registration}
                                  onChange={this.handleChange(idx)} />

                              </td>
                              <td>
                                <Input type="file" name="photo" placeholder="Photo"
                                  value={this.state.rows[idx].photoDs}
                                  onChange={this.handleChange(idx)} />

                              </td>
                              <td>
                                <Button type="button" size="sm" color="danger" onClick={this.handleRemoveSpecificRow(idx)}>
                                  <i className="fa fa-trash-o"></i></Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>

                    </Col>
                  </Row>
                  <Row>
                    <Col md="12" lg="12" xs="12">
                      <Button type="button" size="sm" color="primary" onClick={this.handleAddRow}>
                        <i className="fa fa-plus"></i>Adiciona</Button>
                    </Col>
                  </Row>

                </CardBody>
                <CardFooter>
                  <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Salva</Button>
                  <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
                </CardFooter>
              </Card>
            </Form>
          </Col>
        </Row>
      </div>
    )
  }

}


export default SolicitationRegister;
