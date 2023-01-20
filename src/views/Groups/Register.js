import React, {Component} from 'react';
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
    Alert,
    UncontrolledAlert,
} from 'reactstrap';
import api from "../../components/Api";

class GroupRegister extends Component {


    state = {
        name: "",
        active: 1,
        error: "",
        success: "",
    };



    handleSignIn = async e => {
        e.preventDefault();
        this.setState({error: ""});
        const {name, active} = this.state;
        if (!name || !active) {
            this.setState({error: "Preencha todos os campos!"});
        } else {
            try {
                //Faz requisição com o servidor.
                const response = await api.post("/group/create", {'name' : name, 'active' :  active});

                this.setState({success : "Grupo criado com sucesso"});

                this.setState({name : null});


            } catch (err) {
                console.log(err);
                this.setState({
                    error:
                        "Item já cadastrado no banco de dados!"
                });
            }
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
                                    <strong>Cadastrar Grupo</strong>
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

                                        <Col xs="6">
                                            <FormGroup>
                                                <Label htmlFor="name">Nome</Label>
                                                <Input type="text" id="name" placeholder="Nome do Grupo" required
                                                       onChange={e => this.setState({name: e.target.value})}/>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="4">
                                            <FormGroup>
                                                <Label htmlFor="active">Ativo</Label>
                                                <Input type="select" name="active" id="active" required onChange={e => this.setState({active: e.target.value})}
                                                       >
                                                    <option value="0" >Ativo</option>
                                                    <option value="1">Desativado</option>
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Salva</Button>
                                    <Button type="reset" size="sm"  color="danger"><i className="fa fa-ban"></i> Reset</Button>
                                </CardFooter>
                            </Card>
                        </Form>
                    </Col>
                </Row>
            </div>
        )
    }

}

const style = {
    color: '#ff3333',
    'margin-bottom': '5px',
    border: '1px solid #ff3333',
    padding: '10px',
    width: '100%',
    'text-align': 'center',
};

export default GroupRegister;