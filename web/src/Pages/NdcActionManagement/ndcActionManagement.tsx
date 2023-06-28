import { Checkbox, Col, Empty, Input, PaginationProps, Row, Table, Tooltip, message } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NdcActionStatus } from '../../Casl/enums/ndcAction.status';
import { ProfileIcon, addSpaces, getCompanyBgColor } from '@undp/carbon-library';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { useConnection } from '../../Context/ConnectionContext/connectionContext';
import { DateTime } from 'luxon';
import { TooltipColor } from '../Common/role.color.constants';
import { useNavigate } from 'react-router';
import './ndcActionManagement.scss';
import { useUserContext } from '../../Context/UserInformationContext/userInformationContext';

const NdcActionManagement = () => {
  const { t } = useTranslation(['ndcAction']);
  const [checkAll, setCheckAll] = useState(true);
  const [tableData, setTableData] = useState<any[]>([]);
  const [totalProgramme, setTotalProgramme] = useState<number>();
  const [statusFilter, setStatusFilter] = useState<any>();
  const [search, setSearch] = useState<string>();
  const [searchText, setSearchText] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortOrder, setSortOrder] = useState<string>();
  const [sortField, setSortField] = useState<string>();
  const [dataFilter, setDataFilter] = useState<any>();

  const { Search } = Input;
  const { post } = useConnection();
  const navigate = useNavigate();
  const { userInfoState } = useUserContext();

  const statusOptions = Object.keys(NdcActionStatus).map((k, index) => ({
    label: addSpaces(Object.values(NdcActionStatus)[index]),
    value: Object.values(NdcActionStatus)[index],
  }));

  const [selectedStatus, setSelectedStatus] = useState<any>(statusOptions.map((e) => e.value));

  const columns: any = [
    {
      title: t('ndcAction:ndcColumnsActionId'),
      dataIndex: 'id',
      key: 'id',
      align: 'left' as const,
      sorter: true,
      render: (item: any) => {
        return <span className="clickable">{item}</span>;
      },
      onCell: (record: any, rowIndex: any) => {
        return {
          onClick: (ev: any) => {
            navigate('/ndcManagement/view', { state: { record } });
          },
        };
      },
    },
    {
      title: t('ndcAction:ndcColumnsDate'),
      key: 'createdTime',
      sorter: true,
      align: 'left' as const,
      render: (item: any, itemObj: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {DateTime.fromMillis(parseInt(itemObj.createdTime)).toFormat('dd LLLL yyyy')}
          </div>
        );
      },
    },
    {
      title: t('ndcAction:ndcColumnsNdcAction'),
      dataIndex: 'action',
      key: 'action',
      sorter: true,
      align: 'left' as const,
    },
    {
      title: t('ndcAction:ndcColumnsProgrammeName'),
      dataIndex: 'programmeName',
      key: 'programmeName',
      sorter: true,
      align: 'left' as const,
      render: (item: any) => {
        return <span className="clickable">{item}</span>;
      },
      onCell: (record: any, rowIndex: any) => {
        return {
          onClick: (ev: any) => {
            navigate('/programmeManagement/view', { state: { id: record.programmeId } });
          },
        };
      },
    },
    {
      title: t('ndcAction:ndcColumnsSector'),
      dataIndex: 'sector',
      key: 'sector',
      align: 'left' as const,
      sorter: true,
    },
    {
      title: t('ndcAction:ndcColumnsOwners'),
      key: 'programmeId',
      sorter: true,
      align: 'left' as const,
      render: (item: any, itemObj: any) => {
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {itemObj.company &&
              itemObj.company.map((v: any, i: any) => {
                return (
                  <Tooltip title={v.name} color={TooltipColor} key={TooltipColor}>
                    <div>
                      <ProfileIcon
                        icon={v.logo}
                        bg={getCompanyBgColor(v.companyRole)}
                        name={v.name}
                      />
                    </div>
                  </Tooltip>
                );
              })}
          </div>
        );
      },
    },
    {
      title: t('ndcAction:ndcColumnsStatus'),
      dataIndex: 'status',
      align: 'left' as const,
      key: 'status',
      sorter: true,
    },
  ];

  const getNdcActionData = async () => {
    setLoading(true);
    const filter: any[] = [];
    if (statusFilter) {
      filter.push(statusFilter);
    }

    if (dataFilter) {
      filter.push(dataFilter);
    }

    if (search && search !== '') {
      const interFilterOr = [
        {
          key: 'programmeName',
          operation: 'like',
          value: `${search}%`,
        },
      ];
      if (!isNaN(Number(search))) {
        interFilterOr.push({
          key: 'id',
          operation: 'like',
          value: `${search}`,
        });
      }
      filter.push({
        value: {
          page: currentPage,
          size: pageSize,
          filterOr: interFilterOr,
        },
      });
    }

    let sort: any;
    if (sortOrder && sortField) {
      sort = {
        key: sortField,
        order: sortOrder,
        nullFirst: false,
      };
    } else {
      sort = {
        key: 'txTime',
        order: 'DESC',
      };
    }

    try {
      const response: any = await post('national/programme/queryNdcActions', {
        page: currentPage,
        size: pageSize,
        filterAnd: filter,
        sort: sort,
      });

      setTableData(response.data);
      setTotalProgramme(response.response.data.total);
      setLoading(false);
    } catch (error: any) {
      console.log('Error in getting ndc actions', error);
      message.open({
        type: 'error',
        content: error.message,
        duration: 3,
        style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      getNdcActionData();
    }
  }, [statusFilter, dataFilter]);

  useEffect(() => {
    getNdcActionData();
  }, [currentPage, pageSize, sortField, sortOrder, search]);

  const onStatusQuery = async (checkedValues: CheckboxValueType[]) => {
    if (checkedValues !== selectedStatus) {
      setSelectedStatus(checkedValues);
    }

    if (checkedValues.length === 0) {
      setTableData([]);
      setTotalProgramme(0);
      return;
    }
    setStatusFilter({
      key: 'status',
      operation: 'in',
      value: checkedValues,
    });
  };

  const onCheckAllChange = (e: any) => {
    const nw = e.target.checked ? statusOptions.map((el) => el.value) : [];
    setSelectedStatus(nw);
    setCheckAll(e.target.checked);
    onStatusQuery(nw);
  };

  const onSearch = async () => {
    setSearch(searchText);
  };

  const onChange: PaginationProps['onChange'] = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleTableChange = (page: any, sorter: any) => {
    setSortOrder(
      sorter.order === 'ascend' ? 'ASC' : sorter.order === 'descend' ? 'DESC' : undefined
    );
    setSortField(sorter.columnKey);
  };

  return (
    <div className="ndc-management content-container">
      <div className="title-bar">
        <Row justify="space-between" align="middle">
          <Col span={20}>
            <div className="body-title">{t('ndcAction:NdcTitle')}</div>
            <div className="body-sub-title">{t('ndcAction:NdcSubTitle')}</div>
          </Col>
        </Row>
      </div>
      <div className="content-card">
        <Row>
          <Col lg={{ span: 16 }} md={{ span: 16 }}>
            <div className="action-bar">
              <Checkbox
                className="all-check"
                onChange={onCheckAllChange}
                checked={checkAll}
                defaultChecked={true}
              >
                All
              </Checkbox>
              <Checkbox.Group
                options={statusOptions}
                defaultValue={statusOptions.map((e) => e.value)}
                value={selectedStatus}
                onChange={onStatusQuery}
              />
            </div>
          </Col>
          <Col lg={{ span: 8 }} md={{ span: 8 }}>
            <div className="filter-section">
              {/* <div className="search-filter">
                <Checkbox
                  className="label"
                  onChange={(v) =>
                    setDataFilter(
                      v.target.checked
                        ? {
                            key: 'companyId',
                            operation: 'ANY',
                            value: userInfoState?.companyId,
                          }
                        : undefined
                    )
                  }
                >
                  {t('ndcAction:seeMine')}
                </Checkbox>
              </div> */}
              <div className="search-bar">
                <Search
                  onPressEnter={onSearch}
                  placeholder={`${t('ndcAction:searchByProgrammeName')}`}
                  allowClear
                  onChange={(e) =>
                    e.target.value === ''
                      ? setSearch(e.target.value)
                      : setSearchText(e.target.value)
                  }
                  onSearch={setSearch}
                  style={{ width: 265 }}
                />
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className="programmeManagement-table-container">
              <Table
                dataSource={tableData}
                columns={columns}
                className="common-table-class"
                loading={loading}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: totalProgramme,
                  showQuickJumper: true,
                  showSizeChanger: true,
                  onChange: onChange,
                }}
                onChange={(val: any, filter: any, sorter: any) => handleTableChange(val, sorter)}
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={tableData.length === 0 ? t('ndcAction:noNdcActions') : null}
                    />
                  ),
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default NdcActionManagement;
