import { Divider, Input } from "antd";
import OTPInput from "react-otp-input";

type Props = {
  size: number;
  value: string;
  loading?: boolean;
  onChange(e: string): void;
};

const MyOtpInput = ({ onChange, value, loading, size }: Props) => {
  // const [otp, setOtp] = useState("");

  return (
    <OTPInput
      value={value}
      onChange={onChange}
      numInputs={size}
      inputType="number"
      renderSeparator={<Divider type="vertical"></Divider>}
      renderInput={({ ref, ...props }) => (
        <Input
          {...props}
          disabled={loading}
          className="aspect-square text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          ref={(e) => ref(e?.input ?? null)}
        />
      )}
    />
  );
};

export default MyOtpInput;
