import React, { ReactElement, RefAttributes, useState } from 'react'
import { Button, Image, Modal } from 'react-bootstrap';

import "./style.scss";


interface Props {
    show: any,
    handleClose: any,
    onInputChange: any,
    inputData: any,
    addMovieHandler: any,
    onInputFileChange: any
}

const AddMovies = ({ show, handleClose, onInputChange, inputData, addMovieHandler, onInputFileChange }: Props): ReactElement => {

    let [category, setCategory]: any = useState([
        { name: 'English', value: "english" },
        { name: 'Bangla', value: "bangla" },
        { name: 'French', value: "french" },
        { name: 'Hidi', value: "hindi" },
        { name: 'Others', value: "others" }
    ]);


    return (
        <div className='add-movie-modal-sections'>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={true}
            >

                <Modal.Title>Modal heading</Modal.Title>

                <Modal.Body>

                    <div className='movie-modal-main-sections'>
                        <div className='add-category'>
                            <label>Category</label>
                            <select name="category"
                                onChange={onInputChange}
                            >
                                <option>Select Category</option>
                                {
                                    category?.map((category: any, index: string) =>
                                        <option value={category.value} key={index}>{category.name}</option>
                                    )
                                }
                            </select>
                        </div>

                        <div className='name'>
                            <label>Name</label>
                            <input name="name"
                                onChange={onInputChange}
                                value={inputData?.name}
                            />
                        </div>

                        <div className='title'>
                            <label>Title</label>
                            <input name="title"
                                onChange={onInputChange}
                                value={inputData?.title}
                            />
                        </div>

                        <div className='video-link'>
                            <label>Video</label>
                            <input  type="file" name="video_link" id="input" accept=".mpeg, .webm, .mp4, .mkv, .avi, .wmv, .mov" onChange={onInputFileChange} />
                        </div>

                        <div className='description'>
                            <label>Description</label>
                            <textarea name="description"
                                onChange={onInputChange}
                                value={inputData?.description}
                            />
                        </div>
                    </div>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary"
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                    <Button variant="primary" onClick={addMovieHandler}>Submit</Button>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default AddMovies