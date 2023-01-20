/* eslint-disable prop-types */
import React, { Component } from 'react';
import { Alert } from 'reactstrap';
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap';

import { toast } from 'react-toastify';

import api from '../../../components/Api'
import { login, saveLocal } from '../../../components/Auth'

class Login extends Component {


  state = {
    email: "",
    password: "",
    error: "",
    success: "",
    warn: ""
  };


  handleSignIn = async e => {
    e.preventDefault();
    this.setState({ error: "" });
    const { email, password } = this.state;
    if (!email || !password) {
      this.setState({ error: "Preencha e-mail e senha para continuar!" });
    } else {
      try {
        this.setState({
          warn: "Estamos processando sua solicitação!"
        })
        //toast.warn("Estamos processando sua solicitação!");
        //Faz requisição com o servidor.
        const response = await api.post("/auth/login", { email, password })
          .then((response) => {
            console.log("response.data :::",response.data);
            //autentica o usuario
           login(response.data.token);

            api.get("/auth/me").then((result) => {

              saveLocal("@name", result.data.name);
              saveLocal("@type", result.data.type);
              saveLocal("@email", result.data.email);
              saveLocal("@id", result.data.id);

              this.setState({
                type: result.data.type
              })

              this.forceUpdate();


              toast.dismiss();


              this.setState({
                warn: null,
                success: "Usuario autenticado com sucesso! Redirecionando..."
              })

              //toast.success("Usuario autenticado com sucesso!\\n Redirecionando...");

              setTimeout(() => {
                this.props.history.push("/");
              }, 3200);

            });


          });


        //Redirecionamento do usuario


      } catch (err) {
        console.log("err.login:::", err);
        this.setState({
          warn: null,
          error:
            "Houve um problema com o login, verifique suas credenciais. T.T"
        });
      }
    }
  };

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row >
            <Col md="12">
              <CardGroup>
                <Card className="p-md-5" style={{ width: '100%' }}>
                  <CardBody>
                    <Form onSubmit={this.handleSignIn} >
                      <h1>Acesso ao sistema Audicard</h1>
                      <p className="text-muted">Login</p>
                      {this.state.error &&
                        <Alert color="danger">
                          {this.state.error}
                        </Alert>
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

                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="email"
                          placeholder="Endereço de e-mail"
                          onChange={e => this.setState({ email: e.target.value })} />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input type="password"
                          placeholder="Senha"
                          onChange={e => this.setState({ password: e.target.value })} />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button color="primary" className="px-4"
                            type="submit">Acessar</Button>
                        </Col>

                      </Row>
                    </Form>
                  </CardBody>
                </Card>

              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}


export default Login;
