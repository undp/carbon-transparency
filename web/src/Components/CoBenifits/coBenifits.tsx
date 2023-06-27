import React, { useEffect, useState } from 'react';
import './coBenifits.scss';
import { Button, Row, Tabs } from 'antd';
import { useTranslation } from 'react-i18next';
import GenderParity from './genderParity';
import Assessment from './assessment';
import SdgGoals from './sdgGoals';
import Safeguards from './safeguards';
import Environmental from './environmental';
import Economic from './economic';
import Social from './social';

export interface CoBenefitProps {
  onClickedBackBtn?: any;
  onFormSubmit?: any;
  coBenefitsDetails?: any;
  submitButtonText?: any;
  viewOnly?: boolean;
  coBenifitsViewDetails?: any;
}

const CoBenifitsComponent = (props: CoBenefitProps) => {
  const {
    onClickedBackBtn,
    onFormSubmit,
    coBenefitsDetails,
    submitButtonText,
    viewOnly,
    coBenifitsViewDetails,
  } = props;
  const { t } = useTranslation(['coBenifits']);
  const [coBenefitDetails, setCoBenefitDetails] = useState();

  const onSdgGoalsFormSubmit = (sdgGoalsDetails: any) => {
    setCoBenefitDetails((pre: any) => ({ ...pre, sdgGoals: sdgGoalsDetails }));
  };

  const onGenderParityFormSubmit = (genderParityDetails: any) => {
    setCoBenefitDetails((pre: any) => ({ ...pre, genderPariy: genderParityDetails }));
  };

  const onEnvironmentalFormSubmit = (environmentalsDetails: any) => {
    setCoBenefitDetails((pre: any) => ({ ...pre, environmental: environmentalsDetails }));
  };

  const onEconomicFormSubmit = (economicDetails: any) => {
    setCoBenefitDetails((pre: any) => ({ ...pre, economic: economicDetails }));
  };

  const onAssessmentFormSubmit = (coBenefitsAssessmentDetails: any) => {
    setCoBenefitDetails((pre: any) => ({ ...pre, assessmentDetails: coBenefitsAssessmentDetails }));
  };

  const onSafeguardFormSubmit = (safeguardDetails: any) => {
    setCoBenefitDetails((pre: any) => ({ ...pre, safeguardDetails: safeguardDetails }));
  };

  const onSocialFormSubmit = (socialValueDetails: any) => {
    setCoBenefitDetails((pre: any) => ({ ...pre, socialValueDetails: socialValueDetails }));
  };

  const tabItems = [
    {
      label: t('coBenifits:sdgGoals'),
      key: '1',
      children: (
        <SdgGoals
          onFormSubmit={onSdgGoalsFormSubmit}
          sdgGoalsViewData={
            viewOnly
              ? coBenifitsViewDetails?.sdgGoals
                ? coBenifitsViewDetails?.sdgGoals
                : []
              : undefined
          }
          viewOnly={viewOnly || false}
        />
      ),
    },
    {
      label: t('coBenifits:genderPart'),
      key: '2',
      children: (
        <GenderParity
          onFormSubmit={onGenderParityFormSubmit}
          genderParityViewData={viewOnly && coBenifitsViewDetails?.genderPariy}
          viewOnly={viewOnly || false}
        />
      ),
    },
    {
      label: t('coBenifits:safeguards'),
      key: '3',
      children: <Safeguards onFormSubmit={onSafeguardFormSubmit} />,
    },
    {
      label: t('coBenifits:environmental'),
      key: '4',
      children: (
        <Environmental
          onFormSubmit={onEnvironmentalFormSubmit}
          environmentalViewData={
            viewOnly
              ? coBenifitsViewDetails?.environmental
                ? coBenifitsViewDetails?.environmental
                : {}
              : undefined
          }
          viewOnly={viewOnly || false}
        />
      ),
    },
    {
      label: t('coBenifits:social'),
      key: '5',
      children: <Social onFormSubmit={onSocialFormSubmit} />,
    },
    {
      label: t('coBenifits:economic'),
      key: '6',
      children: (
        <Economic
          onFormSubmit={onEconomicFormSubmit}
          economicViewData={
            viewOnly
              ? coBenifitsViewDetails?.economic
                ? coBenifitsViewDetails?.economic
                : {}
              : undefined
          }
          viewOnly={viewOnly || false}
        />
      ),
    },
    {
      label: t('coBenifits:assessment'),
      key: '7',
      children: <Assessment onFormSubmit={onAssessmentFormSubmit} />,
    },
  ];

  return (
    <div className="co-benifits-container">
      <div>
        <Tabs className="benifits-tabs" defaultActiveKey="1" centered items={tabItems} />
      </div>
      {!viewOnly && (
        <div className="steps-actions">
          <Row>
            <Button onClick={onClickedBackBtn}>{t('back')}</Button>
            <Button
              className="mg-left-1"
              type="primary"
              onClick={() => onFormSubmit(coBenefitDetails)}
            >
              {submitButtonText ? submitButtonText : t('submit')}
            </Button>
          </Row>
        </div>
      )}
    </div>
  );
};

export default CoBenifitsComponent;
