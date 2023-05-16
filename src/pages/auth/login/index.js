import Link from 'next/link';
// loader hook
import useLoader from '@/hooks/useLoader';
import { Form, Input, Button, Row, Col, Typography, message } from 'antd';
// icons
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { axiosInstance } from '@/api-config';
import { useAuthContext } from '@/contexts/AuthContext.jsx';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const { Title } = Typography;
export default function Login() {
  const router = useRouter();
  // ref container to the login form
  const [form] = Form.useForm();
  1;

  
  const {
    authState: { user },
    authActions: { setUser },
  } = useAuthContext();
  
  useEffect(() => {
    if (user && user.email) {
      message.warning('User already logged in');
      router.push('/')
    }
  }, [user, router])
  const [isSubmitted, setIsSubmitted] = useLoader(false);

  const onFinish = (values) => {
    // submit button loader should be triggered
    setIsSubmitted(true);
    axiosInstance.post('/api/auth/login', values)
      .then((response) => {
        setUser({
          user: response.data,
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        });
        message.success('Logged in !');
        router.push('/')
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
        <Title level={4} type='secondary'>
          Log In to Your Account
        </Title>
        <br />
        <Form name='login' onFinish={onFinish} form={form} autoComplete='off'>
          <Form.Item
            name='email'
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
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              className='login-form-button'
              loading={isSubmitted}
            >
              Log in
            </Button>
            Or <Link href='/auth/signup'>Sign Up!</Link>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}
