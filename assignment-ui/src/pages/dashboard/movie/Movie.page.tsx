import React, { ReactElement, useEffect, useState } from "react";
import { Button, Card, Col, Row, Table, Pagination, Form, InputGroup, FormControl } from 'react-bootstrap';
import { addMovie, create, deleteItemById, download, getMovieByIds, gets, update, updateMovie, UpdateVehicleStatus } from "./Movie.service";
import { ToastFailedMsg, ToastSuccessMsg, ToastWarningMsg } from "../../../common/toast";
import { useHistory } from "react-router-dom";
import { getLoggedUserId, getLoggedUserRoles } from "../../../common/http";
import AddMovies from "./AddModal/AddMovies.modal";

import "./style.scss"
import UpdateMovies from "./UpdateModal/UpdateMovies.modal";

interface Props {

}

export default function ProjectPage({ }: Props): ReactElement {
    let history = useHistory();

    const [response, setResponse]: any = useState([]);
    const [updatedata, setUpdatedata]: any = useState({})

    const [show, setShow]: any = useState(false);
    const [updateShow, setUpdateShow]: any = useState(false);


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const updateHandleClose = () => {
        setUpdateShow(false);
    }

    const updateHandleShow = (item: any) => {
        setUpdatedata(item)
        setUpdateShow(true)
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

            const filterData = response.filter((el: any) => el.id !== item.id);
            setResponse(filterData);
            ToastSuccessMsg("Deleted Successfully");
        } else {
            //let error = await res.json()
            ToastFailedMsg("Failed to Delete");
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
        console.log(e, "test ")
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

        const res = await addMovie(data)
        if (res.ok) {
            handleClose()
            const data = await res.json();
            setResponse([...response, data]);
            setFromData({
                name: '',
                category: '',
                title: '',
                description: '',
                video_link: ''
            })
        }
    }

    // const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setFilterQueries({
    //         ...filterQueries,
    //         [e.target.name]: e.target.value
    //     })
    // }

    const updateHandler = async (id: any) => {

        console.log(id, "ids ")

        let data = new FormData();

        data.append('name', fromdata.name)
        data.append('category', fromdata.category)
        data.append('title', fromdata.title)
        data.append('description', fromdata.description)
        data.append('video_link', fromdata.video_link)

        let res = await updateMovie(id, data);

        if (res.status === 200 || res.status === 201) {

            loadData();
            setUpdateShow(false);
        } else {
            //let error = await res.json()
        }
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
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item?.name}</td>
                                    <td>{item?.category}</td>
                                    <td>{item?.title}</td>
                                    <td>{item?.description}</td>
                                    <td>{item?.video_link}</td>
                                    {
                                        getLoggedUserRoles()?.includes('ADMIN') &&
                                        <td>
                                            <Button className="update-btn" onClick={() => updateHandleShow(item)}>Update</Button>
                                            <Button className="delete-btn" variant="danger" onClick={() => onDeleteClick(item)} >Delete</Button>
                                        </td>
                                    }
                                </tr>
                            )
                        }



                    </tbody>
                </Table>

                <UpdateMovies
                    show={updateShow}
                    handleClose={updateHandleClose}
                    updateMovieHandler={updateHandler}
                    onInputChange={onInputChange}
                    onInputFileChange={onInputFileChange}
                    data={updatedata}
                />
            </div>


        </div>
    )
};
