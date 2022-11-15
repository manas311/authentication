import React from "react";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';

const Register = () => {
    const navigate = useNavigate();
    
    const formik = useFormik({
        enableReinitialize : true,
        initialValues : {
            firstname : '',
            lastname : '',
            email : '',
            country : '',
            password : '',
            confPassword: ''
        },
        onSubmit: async({firstname,lastname,email,country,password,confPassword}) => {
            if(password!==confPassword){
                toast.error('Passwords do not match!');
            }else{
                await axios.post('http://localhost:8000/auth/register', {
                    firstname:firstname,
                    lastname:lastname,
                    email:email,
                    country:country,
                    password:password
                }).then((response)=>{
                    console.log(response.data)
                    if(response.data.status===402){

                        toast.error(response.data.message);
                    
                    }else if(response.data.status===200){

                        toast.success(response.data.message);
                        setTimeout(()=>{
                        navigate('/login');
                    },1500)

                    }   
                }).catch((err)=>{
                    alert(err);
                })
            }  
        }
    });

    return (
        <>
            <form onSubmit={formik.handleSubmit}>
            </form>
        </>
    )
}

export default Register;