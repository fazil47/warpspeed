import Image from "next/image";

import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { GoogleAuthProvider, EmailAuthProvider, Auth } from "firebase/auth";

export default function Auth() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1 className="text-4xl font-bold">Auth</h1>
      </div>
    </main>
  );
}
