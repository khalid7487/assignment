import React, { ReactElement, useEffect, useState } from "react";
import { Row } from 'react-bootstrap';


import Movie from "../pages/dashboard/movie/Movie.page"



interface Props {

}

export default function DefaultHome({ }: Props): ReactElement {


    return (
        <div>

            <Row style={{ marginRight: "-10px" }}>

                <div className="movie-list-main-sections">

                    <Movie />

                </div>


            </Row>


        </div>
    )
};
