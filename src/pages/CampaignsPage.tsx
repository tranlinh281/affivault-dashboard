import {
  Button,
  Card,
  Form,
  Input,
  Popconfirm,
  Space,
  Table,
  Typography,
  message,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import {
  createCampaign,
  deleteCampaign,
  getCampaigns,
} from '../services/campaignService';
import type { Campaign } from '../types/affiliate';

export default function CampaignsPage() {
  const [form] = Form.useForm();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCampaigns = async () => {
    setLoading(true);

    try {
      const data = await getCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error(error);
      message.error('Cannot load campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();

      await createCampaign({
        name: values.name,
        description: values.description || null,
      });

      message.success('Campaign created');
      form.resetFields();
      loadCampaigns();
    } catch (error) {
      console.error(error);
      message.error('Cannot create campaign');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCampaign(id);
      message.success('Deleted');
      loadCampaigns();
    } catch (error) {
      console.error(error);
      message.error('Cannot delete campaign');
    }
  };

  return (
    <div>
      <Typography.Title level={3}>Campaigns</Typography.Title>

      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical">
          <Form.Item
            label="Campaign Name"
            name="name"
            rules={[{ required: true, message: 'Campaign name is required' }]}
          >
            <Input placeholder="Example: Flash Sale 6.6" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} placeholder="Campaign note..." />
          </Form.Item>

          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Create Campaign
          </Button>
        </Form>
      </Card>

      <Card>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={campaigns}
          columns={[
            {
              title: 'Name',
              dataIndex: 'name',
            },
            {
              title: 'Description',
              dataIndex: 'description',
              render: (value) => value || '-',
            },
            {
              title: 'Created At',
              dataIndex: 'created_at',
            },
            {
              title: 'Action',
              render: (_, record) => (
                <Space>
                  <Popconfirm
                    title="Delete this campaign?"
                    onConfirm={() => handleDelete(record.id)}
                  >
                    <Button danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}