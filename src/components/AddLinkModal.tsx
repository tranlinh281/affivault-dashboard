import { Form, Input, Modal, Select, message } from 'antd';
import { useEffect } from 'react';

import { detectPlatform } from '../lib/linkDetector';
import {
  createAffiliateLink,
  updateAffiliateLink,
} from '../services/linkService';
import type { AffiliateLink, Category } from '../types/affiliate';

type Props = {
  open: boolean;
  categories: Category[];
  editingLink?: AffiliateLink | null;
  onClose: () => void;
  onSuccess: () => void;
};

export default function AddLinkModal({
  open,
  categories,
  editingLink,
  onClose,
  onSuccess,
}: Props) {
  const [form] = Form.useForm();

  const isEdit = Boolean(editingLink);

  useEffect(() => {
    if (!open) {
      form.resetFields();
      return;
    }

    if (editingLink) {
      form.setFieldsValue({
        original_url: editingLink.original_url,
        affiliate_url: editingLink.affiliate_url,
        product_name: editingLink.product_name,
        platform: editingLink.platform,
        category_id: editingLink.category_id,
        tags: editingLink.tags || [],
        note: editingLink.note,
      });
    }
  }, [open, editingLink, form]);

  const handleUrlChange = (url: string) => {
    const platform = detectPlatform(url);
    form.setFieldValue('platform', platform);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        original_url: values.original_url,
        affiliate_url: values.affiliate_url || null,
        product_name: values.product_name || null,
        platform: values.platform || detectPlatform(values.original_url),
        category_id: values.category_id || null,
        tags: values.tags || [],
        note: values.note || null,
      };

      if (editingLink) {
        await updateAffiliateLink(editingLink.id, payload);
        message.success('Link updated');
      } else {
        await createAffiliateLink(payload);
        message.success('Link created');
      }

      form.resetFields();
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      message.error(isEdit ? 'Cannot update link' : 'Cannot create link');
    }
  };

  return (
    <Modal
      title={isEdit ? 'Edit Link' : 'Add Link Manually'}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      okText={isEdit ? 'Update' : 'Create'}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Product URL / Original URL"
          name="original_url"
          rules={[{ required: true, message: 'Please paste product URL' }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Paste product URL..."
            onChange={(e) => handleUrlChange(e.target.value)}
          />
        </Form.Item>

        <Form.Item label="Affiliate URL" name="affiliate_url">
          <Input.TextArea rows={2} placeholder="Paste affiliate URL if you have one..." />
        </Form.Item>

        <Form.Item label="Platform" name="platform" initialValue="unknown">
          <Select
            options={[
              { label: 'Shopee', value: 'shopee' },
              { label: 'Lazada', value: 'lazada' },
              { label: 'TikTok Shop', value: 'tiktok_shop' },
              { label: 'Tiki', value: 'tiki' },
              { label: 'Unknown', value: 'unknown' },
            ]}
          />
        </Form.Item>

        <Form.Item label="Product Name" name="product_name">
          <Input placeholder="Example: Bàn phím cơ AULA F99" />
        </Form.Item>

        <Form.Item label="Category" name="category_id">
          <Select
            allowClear
            placeholder="Select category"
            options={categories.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        </Form.Item>

        <Form.Item label="Tags" name="tags">
          <Select mode="tags" placeholder="Example: keyboard, shopee, gaming" />
        </Form.Item>

        <Form.Item label="Note" name="note">
          <Input.TextArea rows={3} placeholder="Note..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}