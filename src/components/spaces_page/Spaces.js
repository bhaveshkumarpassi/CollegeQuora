import React, {Component} from 'react';
import { Card, Button, Form, FormGroup, Label, Input,
    CardTitle, Breadcrumb, BreadcrumbItem, CardBody, CardSubtitle} from 'reactstrap';
import {Link} from 'react-router-dom';
import Loading from '../loading';
import { baseUrl } from '../../shared/baseUrl'
import './Spaces.css'

    function RenderMenuItem ({space, onClick}) {
        return ( 
            <Card className='space'>
            <CardBody>
                <CardTitle tag="h6">{space.name}</CardTitle>
            </CardBody>
                <img className='space-img' src={ baseUrl + space.image} alt={space.name} />
            <CardBody>
                <CardSubtitle tag="h6" className="mb-4 text-muted"><span className='fa fa-question-circle fa-lg question-icon'/>    {space.questions} Questions</CardSubtitle>
                <CardSubtitle tag="h6" className="mb-2 text-muted"><span className='fa fa-users fa-lg follower-icon'/>    {space.followers} followers</CardSubtitle>
                <Link to={`/spaces/${space.id}`}>view</Link>
            </CardBody>
          </Card>
        );
    }

    class Spaces extends Component {

        constructor(props) {

            super(props);

            this.handleSearch = this.handleSearch.bind(this);
            this.state = {
                data: []
            }

            this.arrayHolder = [];
        }

        handleSearch(event) {

            this.searchFilterFunction(this.searchSpace.value)
            event.preventDefault();
        }

        componentDidMount() {
            this.setState({
                data: this.props.spaces.spaces
            });

            this.arrayHolder = this.props.spaces.spaces
        }

        searchFilterFunction = text => {
        
            const newData = this.arrayHolder.filter(item => {
              const itemData = `${item.name.toUpperCase()}`;
              const textData = text.toUpperCase();
        
              return itemData.indexOf(textData) > -1;
            });
    
            this.setState({
              data: newData,
            });
        };

        render() {
            const menu = this.state.data.map((space) => {  
                return (
                    <div className="col-12 col-lg-3 col-md-4 col-sm-6 mt-1 mb-4"  key={space.id}>
                        <RenderMenuItem space={space} onClick={this.props.onClick} />
                    </div>
                );
            });

            if (this.props.spaces.isLoading) {
                return(
                    <Loading type='spokes' color='grey' />
                );
            }
            else if (this.props.spaces.errMess) {
                return(
                    <div className="container spaces">
                        <div className="row"> 
                            <div className="col-12">
                                <h4>{this.props.spaces.errMess}</h4>
                            </div>
                        </div>
                    </div>
                );
            }
            else 
            {return (
                <div className="container spaces">
                    <div className="row">
                        <Breadcrumb className='mt-3 ml-3'>
                            <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                            <BreadcrumbItem active>Spaces</BreadcrumbItem>
                        </Breadcrumb>
                        <div className="col-12">
                            <div className='row'>
                                <h3 className='col-12 col-md-4 mb-2 mt-2 space-heading'>Spaces</h3>
                                <Form className='col-12 col-md-8' inline onSubmit={this.handleSearch}>
                                <FormGroup className='row m-1'>
                                    <Label htmlFor="searchSpace" hidden>Search</Label>
                                    <Button className='col-2 searchbtn' type="submit" value="submit"><span className='fa fa-search'></span></Button>
                                    <Input className='col-8' type="text" name="searchSpace" id="searchSpace"  placeholder="Search Spaces ... " 
                                        innerRef={(input) => this.searchSpace = input}
                                    />
                                    <Button className='col-2 cancelbtn' type='reset' value='reset' color='danger' onClick={() => this.setState({ data : this.props.spaces.spaces })}><span className='fa fa-times'></span></Button>
                                </FormGroup>
                                </Form>
                            </div>
                            <hr style={{marginBottom: 25, marginTop: 25}} />
                        </div>  
                                      
                    </div>
                    <div className="row justify-content-center">
                        {menu}
                    </div>
                </div>
            );}            
        }
    }

export default Spaces;