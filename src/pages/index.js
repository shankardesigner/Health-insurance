import { signIn, signOut, useSession } from 'next-auth/client';
import React, { useEffect } from "react";
import Router from 'next/router';
import constants from '@constants/index'

export default function Index() {
  const { ROUTES } = constants;
  useEffect(() => {
    Router.push(ROUTES.LANDING_ROUTE)
    
  });

  return (
    <div></div>
  );
}