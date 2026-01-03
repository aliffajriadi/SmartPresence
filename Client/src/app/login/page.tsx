import { Suspense } from "react";
import LoginClient from "./component/LoginClient";
import Loading from "@/components/Loading";

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginClient />
    </Suspense>
  );
}
