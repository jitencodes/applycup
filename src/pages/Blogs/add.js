import React from "react";
import MetaTags from "react-meta-tags";
import { Button, Card, CardBody, CardTitle, Col, Container, Label, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { post } from "../../helpers/api_helper";
import SimpleReactValidator from "simple-react-validator";
import toastr from "toastr";
import PropTypes from "prop-types";
import { ADD_BLOGS } from "../../helpers/api_url_helper";
import axios from "axios";
import accessToken from "helpers/jwt-token-access/accessToken";

class BlogAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            image: "",
            blog_date: "",
            description: "",
            author: "",
            meta_title:"",
            meta_keywords:"",
            meta_description:"",
            status: false,
            handleResponse: null,
            submit: false
        };
        this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    }

    handleImage = (e) => {
        let file = document.getElementById('image').files[0]
        if (file !== undefined)
            this.setState({ image: file });
    }

    handleInput = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };
    handleFormSubmit = (e) => {
        e.preventDefault();
        if (this.validator.allValid()) {
            const formData = new FormData()
            formData.append('title', this.state.title)
            formData.append('image', this.state.image)
            formData.append('blog_date', this.state.blog_date)
            formData.append('description', this.state.description)
            formData.append('author', this.state.author)
            formData.append('meta_title', this.state.meta_title)
            formData.append('meta_keywords', this.state.meta_keywords)
            formData.append('meta_description', this.state.meta_description)
            formData.append('status', this.state.status ? 1 : 0)
            this.setState({ submit: true });
            axios({
                method: "post", url: `${process.env.REACT_APP_APIURL}${ADD_BLOGS}`, data: formData, headers: {
                  'Content-Type': 'application/json',
                  "Authorization": accessToken,
                }
              }).then(response => {
                if (response.status) {
                    this.setState({ submit: false });
                    toastr.success("Blogs added successful.");
                    // eslint-disable-next-line react/prop-types
                    const { history } = this.props;
                    // eslint-disable-next-line react/prop-types
                    history.push("/blogs");
                }
            }).catch(err => {
                toastr.error(err?.response?.data?.message);
                this.setState({ submit: false });
            });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    };

    render() {
        const { submit } = this.state;
        return (
            <React.Fragment>
                <div className="page-content">
                    <MetaTags>
                        <title>
                            Manage Blogs | {process.env.REACT_APP_PROJECTNAME}
                        </title>
                    </MetaTags>
                    <Container fluid={true}>
                        <Breadcrumbs title="Blogs" path="/blogs" breadcrumbItem="Add" />
                        <Row>
                            <Col xl="12">
                                <Card>
                                    <CardBody>
                                        <form onSubmit={this.handleFormSubmit}>
                                            <Row>
                                                <Col md="12" className="mb-3">
                                                    <Label htmlFor="title">Blogs title*</Label>
                                                    <input name="title" placeholder="Type Blogs Title" type="text" className={"form-control"} onChange={this.handleInput} />
                                                    {this.validator.message("title", this.state.title, "required|string")}
                                                </Col>
                                                <Col md="3" className="mb-3">
                                                    <Label htmlFor="author">Blogs Author*</Label>
                                                    <input name="author" placeholder="Type Author" type="text" className={"form-control"} onChange={this.handleInput} />
                                                    {this.validator.message("author", this.state.author, "required|string")}
                                                </Col>
                                                <Col md="3" className="mb-3">
                                                    <Label htmlFor="blog_date">Blogs Date*</Label>
                                                    <input name="blog_date" placeholder="Type Blogs Date" type="date" className={"form-control"} onChange={this.handleInput} />
                                                    {this.validator.message("blog_date", this.state.blog_date, "required")}
                                                </Col>
                                                <Col md="4" className="mb-3">
                                                    <Label htmlFor="image">Blogs Image*</Label>
                                                    <input name="image" type="file" id="image" className={"form-control"} onChange={this.handleImage} />
                                                    {this.validator.message("image", this.state.image, "required")}
                                                </Col>
                                                <Col md="auto" className="mb-3 align-self-end">
                                                    <div className="form-check form-switch form-switch-lg">
                                                        <input type="checkbox" className="form-check-input" id="current_status" checked={this.state.status} onClick={() => { this.setState({ status: !this.state.status, }) }} />
                                                        <label className="form-check-label" htmlFor="current_status">Status</label>
                                                    </div>
                                                </Col>
                                                <Col md="12">
                                                    <Label htmlFor="description">Description</Label>
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        data={this.state.data}
                                                        onChange={(event, editor) => {
                                                            const data = editor.getData();
                                                            this.setState({ description: data })
                                                        }}
                                                    />
                                                    {this.validator.message("description", this.state.description, "required")}
                                                </Col>
                                                <Col md="12">
                                                    <hr/>
                                                </Col>
                                                <Col md="6" className="mb-3">
                                                    <Label htmlFor="meta_title">Meta title*</Label>
                                                    <input name="meta_title" placeholder="Type Meta Title" defaultValue={this.state.meta_title} type="text" className={"form-control"} onChange={this.handleInput} />
                                                    {this.validator.message("meta_title", this.state.meta_title, "required|string")}
                                                </Col>
                                                <Col md="6" className="mb-3">
                                                    <Label htmlFor="meta_keywords">Meta Keywords</Label>
                                                    <input name="meta_keywords" placeholder="Type Meta Keywords" defaultValue={this.state.meta_keywords} type="text" className={"form-control"} onChange={this.handleInput} />
                                                </Col>
                                                <Col md="12">
                                                    <Label htmlFor="meta_description">Meta Description*</Label>
                                                    <textarea name="meta_description" placeholder="Type Meta Description" defaultValue={this.state.meta_description} type="text" className={"form-control"} onChange={this.handleInput}></textarea>
                                                    {this.validator.message("meta_description", this.state.meta_description, "required")}
                                                </Col>
                                            </Row>

                                            <div className="d-flex flex-wrap gap-2 justify-content-end">
                                                <Button color="primary" type="submit" disabled={submit}>
                                                    {submit === true ? "Please wait..." : "Submit Data"}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

BlogAdd.propTypes = {
    location: PropTypes.object
};

export default BlogAdd;