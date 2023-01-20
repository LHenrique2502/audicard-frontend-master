import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import { login, logout, saveLocal,getSaveLocal } from "../../components/Auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';

import navigationClient from '../../_nav_client';
// routes config
import routes from '../../routes';
import api from "../../components/Api";

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));


class DefaultLayout extends Component {

  constructor(props) {
    super(props);

    //this.handleSignIn()

    toast.configure({
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
    });

    this.state = {
      type: 1
    }


  }



  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  signOut(e) {
    e.preventDefault()
    logout();
    this.props.history.push('/login')
  }

  componentDidMount() {
    this.setState({ error: "" });

    try {
      api.get("/auth/me/").then((result) => {

        saveLocal("@name",result.data.name);
        saveLocal("@type",result.data.type);
        saveLocal("@email",result.data.email);
        saveLocal("@id",result.data.id);

        this.setState({
          type:  result.data.type
        })

        this.forceUpdate();


        api.get("/auth/refresh/").then((result)=>{
          console.log("/auth/refresh/::::",result);
          login(result.data.token);
        }).catch((err)=>{
          console.log("/auth/refresh/>>>>",err);
        })


      }).catch((err) => {
        console.log("err.message:::",err.message);
        if (err.message == "Request failed with status code 401") {
          toast.error("Sessão expirada\n Por favor realizar o login novamente.");
          setTimeout(() => {
            this.props.history.push("/login");
          }, 3000);
        } else {
          toast.error("Ocorreu um erro desconhecido!!\n Por favor tenta novamente!!");
        }

      });


    } catch (err) {
      console.log("err>>>", err.message);

    }
  }

  render() {
    return (
      <div className="app">


        {/* Same as */}
        <ToastContainer />
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader onLogout={e => this.signOut(e)} />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav navConfig={ this.state.type == 1 ? navigation : navigationClient} {...this.props} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} />
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        auth="teste"
                        render={props => (
                          <route.component {...props} />
                        )} />
                    ) : (null)

                  })}
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
