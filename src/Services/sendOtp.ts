import { fetcher } from "@/services/fetcher";

export async function sendOtp(phone: string) {
  const payload = {
    tel: phone,
  };
  const d = await fetcher.post(`/misc/make-verify-tel`, payload);
  return d;
}

export async function verifyOtp(phone: string, code: string) {
  const payload = {
    tel: phone,
    code: code,
  };
  const d = await fetcher.post<any, { valid: boolean }>(
    `/misc/verify-tel`,
    payload,
  );
  return d;
}
