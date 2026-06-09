import {
  Button,
  Card,
  Input,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from 'antd';
import { useMemo, useState } from 'react';

import { parseAffiliateLine } from '../lib/importParser';
import { createAffiliateLink } from '../services/linkService';
import type { ImportedAffiliateItem } from '../lib/importParser';

export default function ImportPage() {
  const [text, setText] = useState('');
  const [importing, setImporting] = useState(false);

  const parsedItems = useMemo(() => {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => parseAffiliateLine(line))
      .filter((item): item is ImportedAffiliateItem => Boolean(item));
  }, [text]);

  const handleImport = async () => {
    if (parsedItems.length === 0) {
      message.warning('No valid data to import');
      return;
    }

    setImporting(true);

    try {
      for (const parsed of parsedItems) {
        await createAffiliateLink({
          original_url: parsed.productUrl,
          affiliate_url: parsed.affiliateUrl,
          product_name: parsed.productName,
          platform: parsed.platform,

          product_url: parsed.productUrl,
          shop_name: parsed.shopName,
          price: parsed.price,
          sold: parsed.sold,
          commission_rate: parsed.commissionRate,
          commission_amount: parsed.commissionAmount,

          status: 'draft',
        });
      }

      message.success(`Imported ${parsedItems.length} links`);
      setText('');
    } catch (error) {
      console.error(error);
      message.error('Import failed');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <Typography.Title level={3}>Import Affiliate Context</Typography.Title>

      <Card style={{ marginBottom: 16 }}>
        <Typography.Text>
          Paste Shopee affiliate context here. Each line is one product.
        </Typography.Text>

        <Input.TextArea
          rows={8}
          style={{ width: '100%', marginTop: 12 }}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Example: 29550655116,"Bàn Phím Cơ Bluetooth AULA F99 PRO","1,3tr",3k+,Flash Titan,6%,₫77.400,https://shopee.vn/product/232780266/29550655116,https://s.shopee.vn/AKY3qhH87J'
        />

        <Space wrap style={{ marginTop: 12 }}>
          <Button type="primary" loading={importing} onClick={handleImport}>
            Import {parsedItems.length > 0 ? `(${parsedItems.length})` : ''}
          </Button>

          <Button onClick={() => setText('')}>Clear</Button>
        </Space>
      </Card>

      <Card title="Preview">
        <Table
          rowKey={(record) => record.affiliateUrl || record.productUrl}
          dataSource={parsedItems}
          scroll={{ x: '100%' }}
          columns={[
            {
              title: 'Product',
              dataIndex: 'productName',
            },
            {
              title: 'Platform',
              dataIndex: 'platform',
              render: (value) => <Tag>{value}</Tag>,
            },
            {
              title: 'Price',
              dataIndex: 'price',
            },
            {
              title: 'Sold',
              dataIndex: 'sold',
            },
            {
              title: 'Shop',
              dataIndex: 'shopName',
            },
            {
              title: 'Commission',
              render: (_, record) => (
                <span>
                  {record.commissionRate} - {record.commissionAmount}
                </span>
              ),
            },
            {
              title: 'Product URL',
              dataIndex: 'productUrl',
              render: (value) =>
                value ? (
                  <a href={value} target="_blank" rel="noreferrer">
                    Open
                  </a>
                ) : (
                  '-'
                ),
            },
            {
              title: 'Affiliate URL',
              dataIndex: 'affiliateUrl',
              render: (value) =>
                value ? (
                  <a href={value} target="_blank" rel="noreferrer">
                    Open
                  </a>
                ) : (
                  '-'
                ),
            },
          ]}
        />
      </Card>
    </div>
  );
}