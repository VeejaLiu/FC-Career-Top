import { Link, NavLink } from 'react-router-dom';
import { LocaleConsumer } from '@douyinfe/semi-ui';
import { careerCopy } from '../../pages/CareerPage/copy';
export function SquadNavigation() {
  return (
    <LocaleConsumer componentName="Navbar">
      {(locale: any) => (
        <nav className="squad-section-nav" aria-label={locale.PlayersList}>
          <NavLink to="/players" end>
            {locale.PlayersList}
          </NavLink>
          <NavLink to="/players-trends">{locale.PlayersTrends}</NavLink>
          <Link to="/career#career-compare">{careerCopy().compareNav}</Link>
        </nav>
      )}
    </LocaleConsumer>
  );
}
