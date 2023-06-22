import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NdcAction } from '../../Definitions/InterfacesAndType/ndcAction.definitions';
import { useTranslation } from 'react-i18next';
import { Col, Row, Card, message, Skeleton } from 'antd';
import InfoView from '../../Components/InfoView/info.view';
import './ndcActionView.scss';
import { useConnection } from '../../Context/ConnectionContext/connectionContext';
import { CheckCircleOutlined, FileAddOutlined } from '@ant-design/icons';
import { DocumentStatus } from '../../Casl/enums/document.status';
import { MitigationTypes } from '../../Definitions/mitigationTypes.enum';
import { NdcActionTypes } from '../../Definitions/ndcActionTypes.enum';
import * as Icon from 'react-bootstrap-icons';

const NdcActionView = () => {
  const { t } = useTranslation(['ndcAction']);
  const { post } = useConnection();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [ndcActionReportDetails, setNdcActionReportDetails] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [ndcActionDetails, setNdcActionDetails] = useState<NdcAction>();

  const getProjectReportActions = (reportData: any) => {
    return (
      <div className="icon">
        {reportData?.status === DocumentStatus.ACCEPTED && (
          <CheckCircleOutlined className="common-progress-icon" style={{ color: '#5DC380' }} />
        )}
      </div>
    );
  };

  const getProjectReports = async () => {
    setIsLoading(true);
    const reportDetails: any = {
      [t('ndcAction:viewMoniteringReport')]: <FileAddOutlined />,
      [t('ndcAction:viewVerificationReport')]: <FileAddOutlined />,
    };
    try {
      const response: any = await post('national/programme/queryDocs', {
        page: 1,
        size: 100,
        filterAnd: [
          {
            key: 'actionId',
            operation: '=',
            value: ndcActionDetails?.id,
          },
        ],
      });
      if (response?.data?.length > 0) {
        response.data.map((item: any) => {
          if (item?.url?.includes('MONITORING_REPORT')) {
            reportDetails[t('ndcAction:viewMoniteringReport')] = getProjectReportActions(item);
          } else if (item?.url?.includes('VERIFICATION_REPORT')) {
            reportDetails[t('ndcAction:viewVerificationReport')] = getProjectReportActions(item);
          }
        });
      }
    } catch (exception: any) {
      message.open({
        type: 'error',
        content: exception.message,
        duration: 3,
        style: { textAlign: 'right', marginRight: 15, marginTop: 10 },
      });
    } finally {
      setNdcActionReportDetails(reportDetails);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (ndcActionDetails?.id) {
      getProjectReports();
    }
  }, [ndcActionDetails?.id]);

  useEffect(() => {
    if (!state) {
      navigate('/ndcManagement/viewAll', { replace: true });
    } else {
      if (!state.record && state.id) {
        //Get Ndc action details using sction id
      } else if (state.record) {
        setNdcActionDetails(state.record);
      }
    }
  });

  const ndcActionBasicDetails = {
    [t('ndcAction:viewProgramme')]: ndcActionDetails?.programmeName,
    [t('ndcAction:viewNdcAction')]: ndcActionDetails?.action,
    [t('ndcAction:viewCurrentStatus')]: ndcActionDetails?.status,
    [t('ndcAction:viewMethodology')]: ndcActionDetails?.methodology,
  };

  const getNdcActionMitigationDetails = () => {
    const mitigationDetails: any = {};
    mitigationDetails[t('ndcAction:viewMitigationType')] = ndcActionDetails?.typeOfMitigation;
    if (
      ndcActionDetails?.typeOfMitigation === MitigationTypes.AGRICULTURE &&
      ndcActionDetails?.agricultureProperties
    ) {
      mitigationDetails[t('ndcAction:viewMitigationLandArea')] =
        ndcActionDetails?.agricultureProperties?.landArea +
        ndcActionDetails?.agricultureProperties?.landAreaUnit;
    }
    if (
      ndcActionDetails?.typeOfMitigation === MitigationTypes.SOLAR &&
      ndcActionDetails?.solarProperties
    ) {
      mitigationDetails[t('ndcAction:viewMitigationEnergyGeneration')] =
        ndcActionDetails?.solarProperties?.energyGeneration +
        ndcActionDetails?.solarProperties?.energyGenerationUnit;
      mitigationDetails[t('ndcAction:viewMitigationConsumerGroup')] =
        ndcActionDetails?.solarProperties?.consumerGroup;
    }
    if (ndcActionDetails?.ndcFinancing) {
      mitigationDetails[t('ndcAction:viewMitigationUserEstimatedCredits')] =
        ndcActionDetails.ndcFinancing.userEstimatedCredits;
      mitigationDetails[t('ndcAction:viewMitigationSysEstimatedCredits')] =
        ndcActionDetails.ndcFinancing.systemEstimatedCredits;
    }
    return mitigationDetails;
  };

  const getNdcActionAdaptationDetails = () => {
    const adaptationDetails: any = {};

    if (ndcActionDetails?.adaptationProperties) {
      adaptationDetails[t('ndcAction:viewAdaptationImplementingAgency')] =
        ndcActionDetails.adaptationProperties.implementingAgency;
      adaptationDetails[t('ndcAction:viewAdaptationNationalPlanObjectives')] =
        ndcActionDetails.adaptationProperties.nationalPlanObjectives;
      adaptationDetails[t('ndcAction:viewAdaptationNationalPlanCoverage')] =
        ndcActionDetails.adaptationProperties.nationalPlanCoverage;
    }
    return adaptationDetails;
  };

  const getNdcActionNameTitle = (action: NdcActionTypes) => {
    switch (action) {
      case NdcActionTypes.Adaptation:
        return t('ndcAction:adaptation');
      case NdcActionTypes.Mitigation:
        return t('ndcAction:mitigation');
      case NdcActionTypes.CrossCutting:
        return t('ndcAction:crossCutting');
      case NdcActionTypes.Enablement:
        return t('ndcAction:enablement');
      default:
        return '';
    }
  };

  return (
    <div className="ndc-details-view content-container">
      <div className="title-bar">
        <div>
          <div className="body-title">
            {t('ndcAction:NdcDetailsViewTitle')}{' '}
            {getNdcActionNameTitle(ndcActionDetails?.action as NdcActionTypes)}
          </div>
          <div className="body-sub-title">{t('ndcAction:NdcDetailsViewSubTitle')}</div>
        </div>
      </div>
      <div className="content-body">
        <Row gutter={16}>
          <Col lg={6} md={24}>
            <Card className="card-container fix-height"></Card>
          </Col>
          <Col lg={8} md={24}>
            <Card className="card-container">
              <div>
                <InfoView
                  data={ndcActionBasicDetails}
                  title={t('ndcAction:viewGeneralTitle')}
                  icon={<Icon.Lightbulb />}
                />
              </div>
            </Card>
          </Col>
          <Col lg={8} md={24}>
            <Skeleton loading={isLoading} active>
              <Card className="card-container fix-height">
                <div>
                  <InfoView
                    data={ndcActionReportDetails}
                    title={t('ndcAction:viewReportsTitle')}
                    icon={<Icon.FileEarmarkText />}
                  />
                </div>
              </Card>
            </Skeleton>
          </Col>
        </Row>
        {(ndcActionDetails?.action === NdcActionTypes.Mitigation ||
          ndcActionDetails?.action === NdcActionTypes.CrossCutting) && (
          <Row>
            <Col lg={24} className="gutter-row">
              <Card className="card-container">
                <div>
                  <InfoView
                    data={getNdcActionMitigationDetails()}
                    title={t('ndcAction:viewMitigationTitle')}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        )}
        {(ndcActionDetails?.action === NdcActionTypes.Adaptation ||
          ndcActionDetails?.action === NdcActionTypes.CrossCutting) && (
          <Row>
            <Col lg={24}>
              <Card className="card-container">
                <div>
                  <InfoView
                    data={getNdcActionAdaptationDetails()}
                    title={t('ndcAction:viewAdaptationTitle')}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        )}
      </div>
    </div>
  );
};

export default NdcActionView;