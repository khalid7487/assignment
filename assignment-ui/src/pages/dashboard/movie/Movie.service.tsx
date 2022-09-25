import {post, get, put, del, postFile, putFile, patch} from "../../../common/http";

export const gets = () => {
    return get("/movie/get-all");
};

export const getPaginate = (name:any, page: number, size: number) => {
    return get(`/api/v1/scripts/pagination?title=${name}&page=${page}&size=${size}`);
};


export const addMovie = (payload:any) => {
    return postFile(`/movie/uploads`, payload);
};


export const getMovieByIds = (id:any) => {
    return get(`/movie/get/${id}`);
};

export const getVehicleById = (id:any) => {
    return get(`/project/get/${id}`);
};

export const getProjectwiseUser =(id:any) =>{
    return get(`/enroll/get-project-wise-user/${id}`)
}

export const create = (formData: any) => {
    return post("/api/v1/scripts", formData);
};

export const update = (formData: any) => {
    return put(`/api/v1/scripts`, formData);
};

export const deleteItemById = (id:any) => {
    
    return del(`/movie/delete/${id}`);
};

export const download = (payload:any) => {
    return post(`/print`, payload);
};

export const addProject = (payload:any) => {
    return post(`/project/add`, payload);
};




export const updateMovie = ( id:any, payload:any) => {
    return putFile(`/movie/update-movie/${id}`, payload);
};

export const UpdateVehicleStatus = (id:any, payload:any) => {
    return patch(`/project/update-status/${id}`, payload);
};

export const addEnrollment = (payload:any) => {
    return post(`/enroll/add`, payload);
};