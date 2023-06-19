import { useNavigate } from 'react-router-dom';
import { useConnection } from '../../Context/ConnectionContext/connectionContext';
import { useTranslation } from 'react-i18next';
import { useUserContext } from '../../Context/UserInformationContext/userInformationContext';
import { ProgrammeManagementComponent, ProgrammeManagementColumns } from '@undp/carbon-library';
import './programmeManagement.scss';

const ProgrammeManagement = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'programme']);

  const visibleColumns = [
    ProgrammeManagementColumns.title,
    ProgrammeManagementColumns.company,
    ProgrammeManagementColumns.sector,
    ProgrammeManagementColumns.currentStage,
    ProgrammeManagementColumns.certifierId,
    ProgrammeManagementColumns.emissionsReductionExpected,
    ProgrammeManagementColumns.emissionsReductionAchieved,
  ];

  const onNavigateToProgrammeView = (record: any) => {
    navigate('/programmeManagement/view', { state: { record } });
  };

  const onClickAddProgramme = () => {
    navigate('/programmeManagement/addProgramme');
  };

  return (
    <ProgrammeManagementComponent
      t={t}
      visibleColumns={visibleColumns}
      useUserContext={useUserContext}
      useConnection={useConnection}
      onNavigateToProgrammeView={onNavigateToProgrammeView}
      onClickAddProgramme={onClickAddProgramme}
    ></ProgrammeManagementComponent>
  );
};

export default ProgrammeManagement;
