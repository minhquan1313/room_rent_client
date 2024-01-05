import { fetcher } from "@/services/fetcher";

export async function sendEmailVerify(email: string) {
  const payload = {
    email,
  };
  const d = await fetcher.post(`/misc/make-verify-email`, payload);
  return d;
}
export async function emailVerify(token: string) {
  const payload = {
    token,
  };
  const d = await fetcher.post(`/misc/verify-email`, payload);
  return d;
}
