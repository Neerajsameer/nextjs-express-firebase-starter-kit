# Firebase Admin SDK Setup

To use the server-side authentication with Next.js middleware, you need to configure Firebase Admin SDK.

## Setup Steps

1. **Generate Service Account Key**:

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Download the JSON file

2. **Add Environment Variables**:
   Create a `.env.local` file in your project root and add:

   ```env
   # Firebase Admin SDK Configuration
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
   ```

   Replace the values with the ones from your downloaded service account JSON file.

3. **Security Note**:
   - Never commit your `.env.local` file to version control
   - The `FIREBASE_PRIVATE_KEY` should be the entire private key including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` parts
   - Make sure to escape newlines with `\n`

## How It Works

1. **Client-side**: When users sign in, Firebase generates an ID token
2. **Token Sync**: The token is sent to `/api/auth/verify` and stored as an HTTP-only cookie
3. **Middleware**: On each request, the middleware checks for the token cookie
4. **Server-side**: The middleware verifies the token using Firebase Admin SDK
5. **Redirects**: Unauthenticated users are redirected to login, authenticated users to dashboard

## Benefits

- ✅ No client-side authentication delays
- ✅ Secure HTTP-only cookies
- ✅ Server-side token verification
- ✅ Automatic redirects via middleware
- ✅ Better user experience
