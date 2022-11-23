import { getCsrfToken } from 'next-auth/client';
import { useRouter } from 'next/router';

export default function SignIn({ csrfToken }) {
  const router = useRouter();
  const { error } = router.query;
  return (
    <div>
      {
      (error === 'CredentialsSignin') && "Login Failed"
      }
    <form method='post' action='/api/auth/callback/credentials'>
      <input name='csrfToken' type='hidden' defaultValue={csrfToken}/>
      <label>
        Username
        <input name='username' type='text'/>
      </label>
      <label>
        Password
        <input name='password' type='password'/>
      </label>
      <button type='submit'>Sign in</button>
    </form>
    </div>
  )
}

// // This is the recommended way for Next.js 9.3 or newer
// export async function getServerSideProps(context) {
//   return {
//     props: {
//       csrfToken: await getCsrfToken(context)
//     }
//   }
// }

/*
// If older than Next.js 9.3
SignIn.getInitialProps = async (context) => {
  return {
    csrfToken: await getCsrfToken(context)
  }
}
*/