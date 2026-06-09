import {
  Button,
  Card,
  Form,
  Input,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import {
  createCategory,
  deleteCategory,
  getCategories,
} from '../services/categoryService';
import type { Category } from '../types/affiliate';

export default function CategoriesPage() {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
      message.error('Cannot load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();
      await createCategory(values.name, values.color);
      message.success('Category created');
      form.resetFields();
      loadCategories();
    } catch (error) {
      console.error(error);
      message.error('Cannot create category');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      message.success('Deleted');
      loadCategories();
    } catch (error) {
      console.error(error);
      message.error('Cannot delete category');
    }
  };

  return (
    <div>
      <Typography.Title level={3}>Categories</Typography.Title>

      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="inline">
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Category name is required' }]}
          >
            <Input placeholder="Category name" />
          </Form.Item>

          <Form.Item name="color">
            <Input placeholder="Color e.g. blue, red" />
          </Form.Item>

          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Add Category
          </Button>
        </Form>
      </Card>

      <Card>
        <Table
          loading={loading}
          rowKey="id"
          dataSource={categories}
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
              render: (value, record) => (
                <Space>
                  <Tag color={record.color || 'default'}>{value}</Tag>
                </Space>
              ),
            },
            {
              title: 'Created At',
              dataIndex: 'created_at',
            },
            {
              title: 'Action',
              render: (_, record) => (
                <Popconfirm
                  title="Delete this category?"
                  onConfirm={() => handleDelete(record.id)}
                >
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}