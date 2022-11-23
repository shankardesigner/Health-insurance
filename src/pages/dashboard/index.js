import DashboardAdmin from '@containers/DashboardAdmin';

import { signIn, signOut, useSession } from 'next-auth/client';
import { useEffect, useState } from 'react';
import Router, { useRouter } from 'next/router';

export default function Dashboard() {

  return <DashboardAdmin />
}