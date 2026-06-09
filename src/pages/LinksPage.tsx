import {
  Button,
  Card,
  Descriptions,
  Drawer,
  Input,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from 'antd';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';

import AddLinkModal from '../components/AddLinkModal';
import { getCategories } from '../services/categoryService';
import {
  deleteAffiliateLink,
  getAffiliateLinks,
} from '../services/linkService';
import type { AffiliateLink, Category } from '../types/affiliate';
import LinkPostTracker from '../components/LinkPostTracker';

export default function LinksPage() {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState<string>();
  const [categoryId, setCategoryId] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [addOpen, setAddOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<AffiliateLink | null>(null);
  const [selectedLink, setSelectedLink] = useState<AffiliateLink | null>(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);

    try {
      const [linkData, categoryData] = await Promise.all([
        getAffiliateLinks(),
        getCategories(),
      ]);

      setLinks(linkData);
      setCategories(categoryData);
    } catch (error) {
      console.error(error);
      message.error('Cannot load links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredLinks = useMemo(() => {
    return links.filter((item) => {
      const keyword = search.toLowerCase();

      const matchSearch =
        item.product_name?.toLowerCase().includes(keyword) ||
        item.original_url?.toLowerCase().includes(keyword) ||
        item.affiliate_url?.toLowerCase().includes(keyword) ||
        item.shop_name?.toLowerCase().includes(keyword) ||
        item.tags?.some((tag) => tag.toLowerCase().includes(keyword));

      const matchPlatform = platform ? item.platform === platform : true;
      const matchCategory = categoryId ? item.category_id === categoryId : true;
      const matchStatus = status ? item.status === status : true;
      return matchSearch && matchPlatform && matchCategory && matchStatus;
    });
  }, [links, search, platform, categoryId, status]);

  const getCategoryName = (id?: string | null) => {
    return categories.find((item) => item.id === id)?.name || '-';
  };

  const handleCopy = async (url?: string | null) => {
    if (!url) {
      message.warning('No URL to copy');
      return;
    }

    await navigator.clipboard.writeText(url);
    message.success('Copied');
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAffiliateLink(id);
      message.success('Deleted');
      loadData();
    } catch (error) {
      console.error(error);
      message.error('Cannot delete link');
    }
  };

  const openAddModal = () => {
    setEditingLink(null);
    setAddOpen(true);
  };

  const openEditModal = (record: AffiliateLink) => {
    setEditingLink(record);
    setAddOpen(true);
  };

  const openDetail = (record: AffiliateLink) => {
    setSelectedLink(record);
    setDetailOpen(true);
  };

  return (
    <div>
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Typography.Title level={3}>Affiliate Links</Typography.Title>

        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Add Link
        </Button>
      </Space>

      <Card>
        <Space style={{ marginBottom: 16, flexWrap: 'wrap' }}>
          <Input.Search
            placeholder="Search product, shop, link, tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 320 }}
          />

          <Select
            allowClear
            placeholder="Filter platform"
            style={{ width: 180 }}
            value={platform}
            onChange={setPlatform}
            options={[
              { label: 'Shopee', value: 'shopee' },
              { label: 'Lazada', value: 'lazada' },
              { label: 'TikTok Shop', value: 'tiktok_shop' },
              { label: 'Tiki', value: 'tiki' },
              { label: 'Unknown', value: 'unknown' },
            ]}
          />
          <Select
            allowClear
            placeholder="Filter status"
            style={{ width: 160 }}
            value={status}
            onChange={setStatus}
            options={[
              { label: 'Draft', value: 'draft' },
              { label: 'Saved', value: 'saved' },
              { label: 'Posted', value: 'posted' },
              { label: 'Archived', value: 'archived' },
            ]}
          />

          <Select
            allowClear
            placeholder="Filter category"
            style={{ width: 200 }}
            value={categoryId}
            onChange={setCategoryId}
            options={categories.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        </Space>

        <Table
          loading={loading}
          rowKey="id"
          dataSource={filteredLinks}
          columns={[
            {
              title: 'Image',
              dataIndex: 'product_image',
              width: 90,
              render: (value) =>
                value ? (
                  <img
                    src={value}
                    alt="product"
                    style={{
                      width: 56,
                      height: 56,
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                ) : (
                  '-'
                ),
            },
            {
              title: 'Product',
              dataIndex: 'product_name',
              render: (value) => value || 'Unknown product',
            },
            {
              title: 'Platform',
              dataIndex: 'platform',
              render: (value) => <Tag>{value}</Tag>,
            },
            {
              title: 'Status',
              dataIndex: 'status',
              render: (value) => {
                const colorMap: Record<string, string> = {
                  draft: 'default',
                  saved: 'blue',
                  posted: 'green',
                  archived: 'red',
                };

                return <Tag color={colorMap[value] || 'default'}>{value || 'draft'}</Tag>;
              },
            },
            {
              title: 'Price',
              dataIndex: 'price',
              render: (value) => value || '-',
            },
            {
              title: 'Shop',
              dataIndex: 'shop_name',
              render: (value) => value || '-',
            },
            {
              title: 'Commission',
              render: (_, record) =>
                record.commission_rate || record.commission_amount ? (
                  <span>
                    {record.commission_rate || '-'} /{' '}
                    {record.commission_amount || '-'}
                  </span>
                ) : (
                  '-'
                ),
            },
            {
              title: 'Category',
              dataIndex: 'category_id',
              render: (value) => getCategoryName(value),
            },
            {
              title: 'Affiliate URL',
              dataIndex: 'affiliate_url',
              render: (value, record) => {
                const url = value || record.original_url;

                return (
                  <Space>
                    <a href={url} target="_blank" rel="noreferrer">
                      Open
                    </a>

                    <Tooltip title="Copy affiliate link">
                      <Button
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={() => handleCopy(url)}
                      />
                    </Tooltip>
                  </Space>
                );
              },
            },
            {
              title: 'Action',
              render: (_, record) => (
                <Space>
                  <Tooltip title="View detail">
                    <Button
                      icon={<EyeOutlined />}
                      onClick={() => openDetail(record)}
                    />
                  </Tooltip>

                  <Tooltip title="Edit">
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => openEditModal(record)}
                    />
                  </Tooltip>

                  <Popconfirm
                    title="Delete this link?"
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

      <AddLinkModal
        open={addOpen}
        categories={categories}
        editingLink={editingLink}
        onClose={() => {
          setAddOpen(false);
          setEditingLink(null);
        }}
        onSuccess={loadData}
      />

      <Drawer
        title="Link Detail"
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        width={560}
      >
        {selectedLink && (
          <>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Image">
                {selectedLink.product_image ? (
                  <img
                    src={selectedLink.product_image}
                    alt="product"
                    style={{
                      width: 160,
                      height: 160,
                      objectFit: 'cover',
                      borderRadius: 12,
                    }}
                  />
                ) : (
                  '-'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Product">
                {selectedLink.product_name || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Platform">
                <Tag>{selectedLink.platform}</Tag>
              </Descriptions.Item>

              <Descriptions.Item label="Shop">
                {selectedLink.shop_name || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Price">
                {selectedLink.price || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Sold">
                {selectedLink.sold || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Commission">
                {selectedLink.commission_rate || '-'} /{' '}
                {selectedLink.commission_amount || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Category">
                {getCategoryName(selectedLink.category_id)}
              </Descriptions.Item>

              <Descriptions.Item label="Tags">
                {selectedLink.tags?.length
                  ? selectedLink.tags.map((tag) => <Tag key={tag}>{tag}</Tag>)
                  : '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Product URL">
                {selectedLink.product_url || selectedLink.original_url ? (
                  <Space direction="vertical">
                    <a
                      href={selectedLink.product_url || selectedLink.original_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open product URL
                    </a>

                    <Button
                      icon={<CopyOutlined />}
                      onClick={() =>
                        handleCopy(selectedLink.product_url || selectedLink.original_url)
                      }
                    >
                      Copy Product URL
                    </Button>
                  </Space>
                ) : (
                  '-'
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Affiliate URL">
                {selectedLink.affiliate_url ? (
                  <Space direction="vertical">
                    <a
                      href={selectedLink.affiliate_url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open affiliate URL
                    </a>

                    <Button
                      icon={<CopyOutlined />}
                      onClick={() => handleCopy(selectedLink.affiliate_url)}
                    >
                      Copy Affiliate URL
                    </Button>
                  </Space>
                ) : (
                  '-'
                )}
              </Descriptions.Item>

              <Descriptions.Item label="Note">
                {selectedLink.note || '-'}
              </Descriptions.Item>

              <Descriptions.Item label="Created At">
                {selectedLink.created_at}
              </Descriptions.Item>
            </Descriptions>
            <LinkPostTracker
              linkId={selectedLink.id}
              onChanged={loadData}
            />
          </>
        )}
      </Drawer>
    </div>
  );
}