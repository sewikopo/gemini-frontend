import { Button, Form, Input, message } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlerSubmit = async (value) => {
    //console.log(value);
    try {
      dispatch({
        type: "SHOW_LOADING",
      });
      await axios.post('https://gemini-mern.herokuapp.com/api/users/login', value).then((res) => {
        localStorage.setItem("auth", res.data.data.accessToken);
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        message.success(res.data.message);

        navigate("/");
      }).catch((err) => {
        message.error(err.response.data.message)
      });

      dispatch({
        type: "HIDE_LOADING",
      });

    } catch(error) {
      dispatch({
        type: "HIDE_LOADING",
      });
      message.error("Error!")
      console.log(error);
    }
  }

  useEffect(() => {
    if(localStorage.getItem("auth")) {
      localStorage.getItem("auth");
      navigate("/");
    }
    
  }, [navigate]);

  return (
    <div className='form'>
        <h2>GM POS</h2>
        <p>Login</p>
        <div className="form-group">
          <Form layout='vertical' onFinish={handlerSubmit}>
            <FormItem name="userId" label="User ID">
              <Input/>
            </FormItem>
            <FormItem name="password" label="Password">
              <Input type="password"/>
            </FormItem>
            <div className="form-btn-add">
              <Button htmlType='submit' className='add-new'>Login</Button>
              <Link className='form-other' to="/register">Register Here!</Link>
            </div>
          </Form>
        </div>
    </div>
  )
}

export default Login
