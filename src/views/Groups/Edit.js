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
    UncontrolledAlert,
} from 'reactstrap';
import api from "../../components/Api";
import { toast } from 'react-toastify';

class GroupEdit extends Component {



    state = {
        name: "",
        active: 1,
        error: "",
        success: "",
        id: 0,
    };

    componentDidMount () {

      this.setState({
        id: this.props.match.params.id
      })
      this.restShow();

    }

    async restShow(){
      this.setState({error: ""});

      try {
                const response = await api.get("/group/show/" + this.props.match.params.id);


                const result = response.data.data;


                this.setState({name : result.name,active:result.active});

                this.forceUpdate();

      }catch (err) {
          if(err.response.status == 401){
            toast.info("Favor realizar o login novamente!");
            setTimeout(function(){
              this.props.history.push('/login');
            },2000);
          }
      }

    }

    back(){
        this.props.history.push('/group/list');
    }



    handleSignIn = async e => {
        e.preventDefault();
        this.setState({error: ""});
        const {name, active, id} = this.state;
        if (!name || !active) {
          this.setState({error: "Preencha todos os campos!"});
        } else {

            try {
                //Faz requisição com o servidor.
                const response = await api.post("/group/store", {'name' : name, 'active' :  active, 'id' : id});

                console.info(response);
                this.setState({success : "Grupo atualizado com sucesso!"});

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
                                                       onChange={e => this.setState({name: e.target.value})} value={this.state.name}/>
                                            </FormGroup>
                                        </Col>
                                        <Col xs="4">
                                            <FormGroup>
                                                <Label htmlFor="active">Ativo</Label>
                                                <Input type="select" name="active" id="active" required
                                                value={this.state.active}
                                                onChange={e => this.setState({active: e.target.value})}    >
                                                          <option value="1"  >Ativo</option>
                                                          <option value="0"  >Desativado</option>

                                                </Input>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                                <CardFooter>
                                    <Button type="submit" size="sm" color="success"><i className="fa fa-dot-circle-o"></i> Salva</Button>
                                    <Button type="button" size="sm"  color="primary" onClick={(e)=>this.back()} ><i className="fa fa-ban"></i> Volta</Button>
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

export default GroupEdit;
