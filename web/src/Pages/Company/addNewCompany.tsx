import { useConnection } from '../../Context/ConnectionContext/connectionContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserContext } from '../../Context/UserInformationContext/userInformationContext';
import { AddNewCompanyComponent } from '@undp/carbon-library';

const AddNewCompany = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['addCompany']);

  const maximumImageSize = process.env.REACT_APP_MAXIMUM_FILE_SIZE
    ? parseInt(process.env.REACT_APP_MAXIMUM_FILE_SIZE)
    : 5000000;

  const onNavigateToCompanyManagement = () => {
    navigate('/companyManagement/viewAll', { replace: true });
  };

  return (
    <AddNewCompanyComponent
      t={t}
      onNavigateToCompanyManagement={onNavigateToCompanyManagement}
      maximumImageSize={maximumImageSize}
      useConnection={useConnection}
      useUserContext={useUserContext}
      useLocation={useLocation}
      regionField
    ></AddNewCompanyComponent>
  );
};

export default AddNewCompany;
