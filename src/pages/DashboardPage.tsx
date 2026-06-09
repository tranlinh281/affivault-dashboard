import { Card, Col, Row, Statistic, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { getCategories } from '../services/categoryService';
import { getAffiliateLinks } from '../services/linkService';
import type { AffiliateLink, Category } from '../types/affiliate';

export default function DashboardPage() {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [linkData, categoryData] = await Promise.all([
          getAffiliateLinks(),
          getCategories(),
        ]);

        setLinks(linkData);
        setCategories(categoryData);
      } catch (error) {
        console.error(error);
        message.error('Cannot load dashboard');
      }
    }

    loadData();
  }, []);

  const shopeeCount = useMemo(
    () => links.filter((item) => item.platform === 'shopee').length,
    [links],
  );

  const lazadaCount = useMemo(
    () => links.filter((item) => item.platform === 'lazada').length,
    [links],
  );

  const tiktokCount = useMemo(
    () => links.filter((item) => item.platform === 'tiktok_shop').length,
    [links],
  );

  return (
    <div>
      <Typography.Title level={3}>Dashboard</Typography.Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={12} lg={6}>
          <Card>
            <Statistic title="Total Links" value={links.length} />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6}>
          <Card>
            <Statistic title="Shopee Links" value={shopeeCount} />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6}>
          <Card>
            <Statistic title="Lazada Links" value={lazadaCount} />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6}>
          <Card>
            <Statistic title="TikTok Shop Links" value={tiktokCount} />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={12} lg={6}>
          <Card>
            <Statistic title="Categories" value={categories.length} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}