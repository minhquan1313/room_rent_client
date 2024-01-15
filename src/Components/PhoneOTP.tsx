import MyButton from "@/Components/MyButton";
import MyOtpInput from "@/Components/MyOtpInput";
import { resendInterval } from "@/constants/resendInterval";
import { sendOtp, verifyOtp } from "@/services/sendOtp";
import { dateFormat } from "@/utils/dateFormat";
import logger from "@/utils/logger";
import { Space, message } from "antd";
import { memo, useEffect, useMemo, useState } from "react";
import Countdown from "react-countdown";

interface Props {
  e164_format: string;
  onSuccess(): void;
}
const SIZE = 6;
const _ = ({ e164_format, onSuccess }: Props) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [otp, setOtp] = useState("");
  const [otpSubmitting, setOtpSubmitting] = useState(false);

  const [allowResend, setAllowResend] = useState(false);
  const [otpResending, setOtpResending] = useState(false);
  const [otpSentAt, setOtpSentAt] = useState<Date>();
  const [error, setError] = useState(false);

  // const [shouldRestartCountDown, setShouldRestartCountDown] = useState({});

  const date = useMemo(() => {
    const d = otpSentAt ? new Date(otpSentAt) : new Date();
    d.setSeconds(d.getSeconds() + resendInterval);
    return d;
  }, [otpSentAt]);

  const onVerify = async () => {
    setOtpSubmitting(true);
    setError(false);

    try {
      const d = await verifyOtp(e164_format, otp);
      if (d.valid) {
        onSuccess();
      } else {
        messageApi.open({
          type: "error",
          content: "Mã sai!",
          duration: 30,
        });
        setError(true);
      }
    } catch (error: any) {
      logger(`🚀 ~ onVerify ~ error:`, error);

      messageApi.open({
        type: "error",
        content:
          error.response?.data?.error?.[0]?.msg ||
          "Có lỗi khi xác thực, hãy thử lại!",
        duration: 30,
      });
    }
    setOtpSubmitting(false);
  };
  const onResendCode = async () => {
    setOtpResending(true);
    try {
      const d = await sendOtp(e164_format);

      const now = new Date();
      logger(`🚀 ~ onResendCode ~ now:`, now);

      setOtpSentAt(now);
      localStorage.setItem("otpSentAt", String(now.getTime()));

      messageApi.open({
        type: "info",
        content: "Đã gửi mã, mã sẽ tới số điện thoại của bạn trong giây lát!",
        duration: 30,
      });
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Có lỗi khi gửi lại mã!",
        duration: 30,
      });
    }
    setOtpResending(false);
  };

  useEffect(() => {
    try {
      const sent = localStorage.getItem("otpSentAt");
      logger(`🚀 ~ useEffect ~ sent:`, sent);

      if (!sent) return;

      setOtpSentAt(new Date(Number(sent)));
    } catch (error) {
      //
    }
  }, []);

  useEffect(() => {
    if (otp.length !== SIZE) return;

    onVerify();
  }, [otp]);

  return (
    <Space direction="vertical" className="w-full">
      {contextHolder}
      <MyOtpInput
        size={SIZE}
        loading={otpSubmitting}
        value={otp}
        onChange={setOtp}
      />

      <MyButton
        onClick={onVerify}
        type="primary"
        disabled={otp.length !== SIZE}
        block
        danger={error}
        loading={otpSubmitting}
      >
        Xác thực
      </MyButton>

      <MyButton
        onClick={onResendCode}
        type="text"
        disabled={!allowResend}
        block
        loading={otpResending}
      >
        <Space size={"small"}>
          Gửi lại mã xác thực
          <Countdown
            key={date.getMilliseconds()}
            date={date}
            onStart={() => setAllowResend(false)}
            onComplete={() => setAllowResend(true)}
            renderer={(props) =>
              dateFormat.duration(props.total, "milliseconds").asSeconds() || ""
            }
          />
        </Space>
      </MyButton>
    </Space>
  );
};

const PhoneOTP = memo(_);

export default PhoneOTP;
