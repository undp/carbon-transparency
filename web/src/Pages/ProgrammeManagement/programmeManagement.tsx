import { useNavigate } from 'react-router-dom';
import { useConnection } from '../../Context/ConnectionContext/connectionContext';
import { useTranslation } from 'react-i18next';
import { useUserContext } from '../../Context/UserInformationContext/userInformationContext';
import { ProgrammeManagementComponent, ProgrammeManagementColumns } from '@undp/carbon-library';
import { useAbilityContext } from '../../Casl/Can';

const ProgrammeManagement = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'programme']);

  const visibleColumns = [
    ProgrammeManagementColumns.title,
    ProgrammeManagementColumns.company,
    ProgrammeManagementColumns.sector,
    ProgrammeManagementColumns.currentStage,
    ProgrammeManagementColumns.certifierId,
    ProgrammeManagementColumns.emissionReductionExpected,
    ProgrammeManagementColumns.emissionReductionAchieved,
  ];

  const onNavigateToProgrammeView = (record: any) => {
    navigate(`/programmeManagement/view/${record.programmeId}`, { state: { record } });
  };

  const onClickAddProgramme = () => {
    navigate('/programmeManagement/addProgramme');
  };

  const onClickAddInvestment = () => {
    navigate('/programmeManagement/addInvestment');
  };

  return (
    <ProgrammeManagementComponent
      t={t}
      visibleColumns={visibleColumns}
      useUserContext={useUserContext}
      useConnection={useConnection}
      onNavigateToProgrammeView={onNavigateToProgrammeView}
      onClickAddProgramme={onClickAddProgramme}
      enableAddProgramme
      useAbilityContext={useAbilityContext}
    ></ProgrammeManagementComponent>
  );
};

export default ProgrammeManagement;
