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
} from 'reactstrap';
import api from "../../components/Api";
import { toast } from 'react-toastify';

class SolicitationRead extends Component {


  state = {
    name: "",
    password: "",
    email: "",
    type: 1,
    status: 1,
    error: "",
    success: "",
  };

  componentDidMount() {

    this.setState({
      id: this.props.match.params.id
    })
    this.restShow();

  }

  async restShow() {
    this.setState({ error: "" });

    try {
      const response = await api.get("/user/" + this.props.match.params.id);


      const result = response.data.data;

      console.log(result);
      this.setState({
        name: result.name,
        status: result.status,
        email: result.email,
        type: result.type,
      });

      this.forceUpdate();

    } catch (err) {
      if (err.response.status == 401) {
        toast.info("Favor realizar o login novamente!");
        this.props.history.push('/login');
      }
    }

  }


  handleSignIn = async e => {
    e.preventDefault();
    this.setState({ error: "" });
    const { name,
      status,
      password,
      type,email } = this.state;

    try {

      const data = {
        'name': name,
        'status': status,
        'password': password,
        'email': email,
        'type': type,
      };

      console.log(data);
      //Faz requisição com o servidor.
      const response = await api.put("user/" + this.state.id , data);

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
        })

        this.restShow();
      }


    } catch (err) {
      toast.error("Ocorreu um erro desconhecido no cadastro");
      console.log(err.response);
    }
  };



  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" sm="12">
            <Form onSubmit={this.handleSignIn} >
              <Card>
                <CardHeader>
                  <strong>Cadastrar Usuario</strong>
                  <small> Formulario</small>
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
                        <Label htmlFor="name">Nome</Label>
                        <Input type="text" id="name" placeholder="Nome" required
                          onChange={e => this.setState({ name: e.target.value })}
                          value={this.state.name} />
                      </FormGroup>
                    </Col>

                    <Col md="6" lg="6" xs="12">
                      <FormGroup>
                        <Label htmlFor="email">E-mail</Label>
                        <Input type="text" id="email" placeholder="E-mail" required
                          onChange={e => this.setState({ email: e.target.value })}
                          value={this.state.email} />
                      </FormGroup>
                    </Col>


                  </Row>
                  <Row>
                    <Col md="4" lg="4" xs="12">
                      <FormGroup>
                        <Label htmlFor="password">Senha</Label>
                        <Input type="password" id="password" placeholder="password"
                          onChange={e => this.setState({ password: e.target.value })} />
                      </FormGroup>
                    </Col>

                    <Col md="4" lg="4" xs="12">
                      <FormGroup>
                        <Label htmlFor="status">Ativo</Label>
                        <Input type="select" name="status" id="status" required
                          onChange={e => this.setState({ status: e.target.value })}>
                          <option value="1" >Ativo</option>
                          <option value="0">Desativado</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col md="4" lg="4" xs="12">
                      <FormGroup>
                        <Label htmlFor="type">Tipo de acesso</Label>
                        <Input type="select" name="type" id="type" required
                          onChange={e => this.setState({ type: e.target.value })}>
                          <option value="2">Cliente</option>
                          <option value="1" >Administrador</option>
                        </Input>
                      </FormGroup>
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


export default SolicitationRead;
