import Breadcrumbs from '../components/Breadcrumbs';
import { pageMetadata } from '@/lib/seo';
import UserStatistics from './UserStatistics';

export const metadata = pageMetadata(
  'Public User Statistics',
  'View FC Career Top total account registrations and daily new accounts over the last 90 days.',
  '/user-statistics',
  false
);

export default function UserStatisticsPage() {
  return (
    <div className="container max-w-5xl mx-auto px-2 sm:px-4 py-8">
      <Breadcrumbs title="User statistics" path="/user-statistics" />
      <h1 className="text-3xl sm:text-4xl font-bold">
        FC Career Top user statistics
      </h1>
      <p className="mt-4 mb-6">
        Public account registration counts. These figures describe
        registrations, rather than active players.
      </p>
      <UserStatistics />
    </div>
  );
}
