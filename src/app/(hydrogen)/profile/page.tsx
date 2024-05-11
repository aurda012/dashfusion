import ProfileHeader from '@/app/shared/profile/profile-header';
import ProfileDetails from '@/app/shared/profile/profile-details';
import { metaObject } from '@/config/site';

export const metadata = {
  ...metaObject('Profile'),
};

export default function ProfilePage() {
  return (
    <div className="@container">
      <ProfileHeader />
      <ProfileDetails />
    </div>
  );
}
