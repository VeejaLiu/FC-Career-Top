import { LocaleConsumer } from '@douyinfe/semi-ui';
import ChangePasswordComponent from './ChangePassword';
import './SettingsPage.css';

export default function ChangePasswordPage() {
  return (
    <LocaleConsumer componentName="SettingsPage">
      {(localeData: any) => (
        <div className="page-container password-page">
          <ChangePasswordComponent localeData={localeData} />
        </div>
      )}
    </LocaleConsumer>
  );
}
