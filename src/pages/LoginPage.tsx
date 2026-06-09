import { Button, Card, Form, Input, Typography, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      message.success('Login successfully');
      navigate('/');
    } catch (error) {
      console.error(error);
      message.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: { email: string; password: string }) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      message.success('Register successfully. Please check your email if confirmation is enabled.');
    } catch (error) {
      console.error(error);
      message.error('Register failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#f5f5f5',
        padding: '24px',
      }}
    >
      <Card style={{ width: '100%', maxWidth: 420 }}>
        <Typography.Title level={3}>AffiVault Login</Typography.Title>

        <Form layout="vertical" onFinish={handleLogin}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Email is required' }]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Password is required' }]}
          >
            <Input.Password placeholder="Your password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={loading}>
            Login
          </Button>

          <Form.Item shouldUpdate noStyle>
            {({ getFieldsValue }) => (
              <Button
                type="link"
                block
                style={{ marginTop: 8 }}
                onClick={() => handleRegister(getFieldsValue())}
              >
                Create new account
              </Button>
            )}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}