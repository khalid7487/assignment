import React, { ReactElement, useEffect, useState } from "react";
import { Button, Card, Col, Row, Table, Pagination, Form, InputGroup, FormControl } from 'react-bootstrap';
import { addMovie, create, deleteItemById, download, gets, update, UpdateVehicleStatus } from "./Movie.service";
import { ToastFailedMsg, ToastSuccessMsg, ToastWarningMsg } from "../../../common/toast";
import { useHistory } from "react-router-dom";
import { getLoggedUserId, getLoggedUserRoles } from "../../../common/http";
import AddMovies from "./AddModal/AddMovies.modal";

import "./style.scss"

interface Props {

}

export default function ProjectPage({ }: Props): ReactElement {
    let history = useHistory();

    let [response, setResponse]: any = useState([]);

    const [show, setShow] = useState(false);
    const [updateShow, setUpdateShow] = useState(false);
    const [ids, setIds] = useState('')


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const updateHandleClose = () => {
        setIds('');
        setUpdateShow(false);
    }

    const updateHandleShow = (id: any) => {
        setIds(id)
        setShow(true)
    }

    const [fromdata, setFromData] = useState({

        name: '',
        category: '',
        title: '',
        description: '',
        video_link: ''
    })


    const [filterQueries, setFilterQueries] = useState({
        page: 0,
        limit: '',
        id: '',
        userId: getLoggedUserId(),
        project_status: ''
    });

    const onDeleteClick = async (item: any) => {
        let res = await deleteItemById(item.id)
        if (res.status === 200 || res.status === 201) {
            let data = await res.json()
            ToastSuccessMsg("Deleted Successfully");
        } else {
            //let error = await res.json()
            ToastFailedMsg("Failed to Delete");
        }
    }

    const onOpenClick = async (item: any) => {
        history.push(`/me/project/${item.id}`)
    }

    const onAddtripClick = async (item: any) => {
        history.push(`/me/get-project-wise-user/${item.id}`)
    }


    const approveStatus = async (item: any) => {

        let data = {
            project_status: "COMPLETE"
        }

        let res = await UpdateVehicleStatus(item.id, data)
        if (res.status === 200 || res.status === 201) {
            let data = await res.json()
            ToastSuccessMsg("Trip Approved Successfully");
        } else {
            //let error = await res.json()
            ToastFailedMsg("Trip Approved faield ");
        }
    }



    useEffect(() => {
        let unmount = false;
        if (!unmount) {
            loadData();
        }

        return () => {
            unmount = true;
        }
    }, [])


    const loadData = async () => {
        let res = await gets()

        if (res.status === 200 || res.status === 201) {
            let data = await res.json()

            console.log('msg', data);
            // if (isMounted) setResponse(data)
            setResponse(data?.data)
        } else {
            //let error = await res.json()
        }
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFromData({
            ...fromdata,
            [e.target.name]: e.target.value
        })
    }

    const onInputFileChange = (e: any) => {
        setFromData({
            ...fromdata,
            [e.target.name]: e.target.files[0]
        })
    }

    const addMovieHandler = async () => {
        let data = new FormData();

        data.append('name', fromdata.name)
        data.append('category', fromdata.category)
        data.append('title', fromdata.title)
        data.append('description', fromdata.description)
        data.append('video_link', fromdata.video_link)

        console.log(data, "form data ");

        const res = await addMovie(data)
        if (res.ok) {
            handleClose()
        }
    }

    // const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setFilterQueries({
    //         ...filterQueries,
    //         [e.target.name]: e.target.value
    //     })
    // }

    const updateHandler = (id: any) => {
    }


    return (
        <div className="movie-sections">


            {

                getLoggedUserRoles()?.includes('ADMIN') &&
                <div className="add-movie-section">

                    <Button onClick={handleShow}>Add</Button>

                    <AddMovies
                        show={show}
                        handleClose={handleClose}
                        onInputChange={onInputChange}
                        inputData={fromdata}
                        addMovieHandler={addMovieHandler}
                        onInputFileChange={onInputFileChange}
                    />
                </div>
            }



            <div className="movie-list-sections">

                <Table striped bordered hover>

                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Moive Name</th>
                            <th>Category</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Link</th>
                            {
                                getLoggedUserRoles()?.includes('ADMIN') &&
                                <th>Actions</th>
                            }
                        </tr>
                    </thead>
                    <tbody>


                        {

                            response?.map((item: any, index: any) =>
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{item?.name}</td>
                                    <td>{item?.category}</td>
                                    <td>{item?.title}</td>
                                    <td>{item?.description}</td>
                                    <td>{item?.video_link}</td>
                                    {
                                        getLoggedUserRoles()?.includes('ADMIN') &&
                                        <td>
                                            <Button className="update-btn" onClick={() => updateHandler(item?.id)}>Update</Button>
                                            <Button className="delete-btn" variant="danger" >Delete</Button>
                                        </td>
                                    }
                                </tr>
                            )
                        }



                    </tbody>
                </Table>

            </div>

            {/* 
            <Card>
                <Card.Header>
                    <Row>
                        <Col>PRoject Panel</Col>
                    </Row>
                </Card.Header>

                <Card.Body>

                    <Form >
                        <Row>

                            <Col lg={6}>
                                <Form.Label  > Project Status </Form.Label>
                                <InputGroup size="sm" className="mb-3">
                                    <FormControl as="select" className="shadow-none" type="text" name="project_status" aria-label="Small"
                                        aria-describedby="inputGroup-sizing-sm"
                                        onChange={onInputChange}>
                                        <option>Select Status Type</option>
                                        {projectStatus?.map((projectStatus: any, index: number) =>
                                            <option value={projectStatus.value} key={index}>{projectStatus.name}</option>
                                        )}
                                    </FormControl>
                                </InputGroup>

                              
                                <Button type="button" className="float-right m-1 shadow-none"
                                    onClick={e => loadData({
                                        id: filterQueries?.id,
                                        userId: filterQueries?.userId,
                                        project_status: filterQueries?.project_status
                                    })}

                                    size="sm"> Search </Button>
                            </Col>

                        </Row>
                    </Form>

                </Card.Body>
            </Card> */}

            {/* <Row>
                {response.data?.map((item: any, index: number) => (
                    <Col key={index} className="mt-3" sm="12">
                        <Card className="shadow-lg bg-white  rounded" role="button">
                            <Card.Body>

                                <Row>
                                    <Col>
                                        <Row className="text-capitalize mt-1">
                                            <Col lg={4} sm={12} ><strong>Project Name:</strong> {item?.project_name}</Col>
                                            <Col lg={4} sm={12} ><strong>Status: {item?.project_status}</strong>
                                            </Col>
                                            <Col lg={4} sm={12} ><strong>Project Title:</strong> {item?.project_title}</Col>
                                        </Row>
                                        <Row className="text-capitalize mt-1">
                                            <Col lg={4} sm={12}><strong>Project Description:</strong> {item?.project_description}</Col>
                                            <Col lg={4} sm={12}><strong>Total Project Members:</strong> {item?.total_project_members}</Col>
                                            <Col lg={4} sm={12}><strong>Enroll Status:</strong> {item?.enroll_status ? "TRUE" : "FALSE"}</Col>
                                        </Row>

                                        <Row className="text-capitalize mt-3">

                                            <Col className="d-flex justify-content-between">
                                                <Button className="shadow-none" size="sm" variant="danger" onClick={(event => onDeleteClick(item))}> Delete </Button> {' '}
                                                {
                                                    item?.project_status == "PROGRESS" ?
                                                        <Button className="shadow-none" size="sm" variant="primary"
                                                            onClick={(event => approveStatus(item))}> Complete Project </Button> : ""
                                                }

                                                <Button className="shadow-none" size="sm" variant="primary" onClick={(event => onOpenClick(item))}> Edit </Button> {' '}
                                                <Button className="shadow-none" size="sm" variant="primary" onClick={(event => onAddtripClick(item))}>Enrolled Members</Button>
                                            </Col>

                                        </Row>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row> */}


            {/* <div className="d-flex justify-content-between mt-3">
                <div>Items: {response?.limit}</div>
                <div>
                    <Pagination size="sm">
                        <Pagination.Prev onClick={e => loadData({
                            page: response.page - 1,
                            id: filterQueries?.id,
                            userId: filterQueries?.userId,
                            project_status: filterQueries?.project_status
                        })} />
                        <Pagination.Item> Pages: {response?.page}/{response?.totalPage} </Pagination.Item>
                        <Pagination.Next onClick={e => loadData({
                            page: response.page + 1,
                            id: filterQueries?.id,
                            userId: filterQueries?.userId,
                            project_status: filterQueries?.project_status
                        })} />
                    </Pagination>
                </div>

                <div>Total: {response?.count}</div>
            </div> */}

        </div>
    )
};
