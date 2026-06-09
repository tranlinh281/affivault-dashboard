import {
  Button,
  Card,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import {
  createLinkPost,
  deleteLinkPost,
  getPostsByLinkId,
} from '../services/linkPostService';
import type { LinkPost } from '../types/affiliate';

type Props = {
  linkId: string;
  onChanged?: () => void;
};

export default function LinkPostTracker({ linkId, onChanged }: Props) {
  const [form] = Form.useForm();
  const [posts, setPosts] = useState<LinkPost[]>([]);
  const [loading, setLoading] = useState(false);

  const loadPosts = async () => {
    setLoading(true);

    try {
      const data = await getPostsByLinkId(linkId);
      setPosts(data);
    } catch (error) {
      console.error(error);
      message.error('Cannot load post history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [linkId]);

  const handleCreate = async () => {
    try {
      const values = await form.validateFields();

      await createLinkPost({
        link_id: linkId,
        platform: values.platform,
        content: values.content || null,
      });

      message.success('Post tracked');
      form.resetFields();
      loadPosts();
      onChanged?.();
    } catch (error) {
      console.error(error);
      message.error('Cannot track post');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLinkPost(id);
      message.success('Deleted');
      loadPosts();
      onChanged?.();
    } catch (error) {
      console.error(error);
      message.error('Cannot delete post');
    }
  };

  return (
    <Card title="Post Tracking" style={{ marginTop: 16, width: '100%' }}>
      <Form form={form} layout="vertical" style={{ display: 'grid', gap: 12 }}>
        <Form.Item
          label="Posted Platform"
          name="platform"
          rules={[{ required: true, message: 'Please select platform' }]}
        >
          <Select
            placeholder="Select platform"
            options={[
              { label: 'Facebook', value: 'facebook' },
              { label: 'TikTok', value: 'tiktok' },
              { label: 'Threads', value: 'threads' },
              { label: 'YouTube', value: 'youtube' },
              { label: 'Telegram', value: 'telegram' },
              { label: 'Zalo', value: 'zalo' },
            ]}
          />
        </Form.Item>

        <Form.Item label="Content / Note" name="content">
          <Input.TextArea rows={3} placeholder="Caption, note, or post URL..." />
        </Form.Item>

        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Mark as Posted
        </Button>
      </Form>

      <Table
        style={{ marginTop: 16 }}
        rowKey="id"
        loading={loading}
        dataSource={posts}
        pagination={false}
        scroll={{ x: '100%' }}
        columns={[
          {
            title: 'Platform',
            dataIndex: 'platform',
            render: (value) => <Tag>{value}</Tag>,
          },
          {
            title: 'Content',
            dataIndex: 'content',
            render: (value) => value || '-',
          },
          {
            title: 'Posted At',
            dataIndex: 'posted_at',
          },
          {
            title: 'Action',
            render: (_, record) => (
              <Space>
                <Popconfirm
                  title="Delete this post record?"
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
  );
}