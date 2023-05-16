import Link from 'next/link';
import useLoader from '@/hooks/useLoader';
import { Form, Input, Button, Row, Col, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { axiosInstance } from '@/api-config';
import { useAuthContext } from '@/contexts/AuthContext.jsx';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const { Title } = Typography;
export default function Signup() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [isSubmitted, setIsSubmitted] = useLoader(false);

  const {
    authState: { user },
  } = useAuthContext();
  
  useEffect(() => {
    if (user && user.email) {
      message.warning('User already logged in');
      router.back();
    }
  }, [user])

  const onFinish = (values) => {
    // submit button loader should be triggered
    setIsSubmitted(true);
    axiosInstance.post('/api/auth/signup', values)
      .then(() => {
        message.success('Success !');
      })
      .catch((err) => {
        message.error(err?.response?.data?.error || 'something went wrong');
      })
    setIsSubmitted(false);
    form.resetFields();
  };

  return (
    <Row className='flex-container'>
      <Col md={20} lg={10}>
        <Title level={3} type='secondary'>
          Create Account
        </Title>
        <br />
        <Form
          name='register'
          onFinish={onFinish}
          form={form}
          autoComplete='off'
        >
          <Form.Item
            name='full_name'
            label='Full Name'
            rules={[{ required: true, message: 'Please input your Name!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder='Type your Name here'
            />
          </Form.Item>
          <Form.Item
            name='email'
            label='Email'
            tooltip='Email should be unique'
            rules={[
              {
                required: true,
                message: 'Please input your Email!',
                type: 'email',
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder='Email' />
          </Form.Item>
          <Form.Item
            name='password'
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder='Password' />
          </Form.Item>
          <Form.Item
            name='confirm'
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'The two passwords that you entered do not match!'
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder='Confirm Password'
            />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className='login-form-button'
              loading={isSubmitted}
            >
              Sign Up
            </Button>
            Or Already have an account ? <Link href='/auth/login'>Login here</Link>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};
